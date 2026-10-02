const test = require("node:test");
const assert = require("node:assert/strict");

class MemoryStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

global.localStorage = new MemoryStorage();
global.window = { location: { origin: "https://lumina.test", pathname: "/gallery", search: "" } };

const { GalleryApp } = require("../app.js");

function createGallery() {
  return Object.create(GalleryApp.prototype);
}

// The combined red-team payload: every field of this single photo record
// tries to exploit a different rendering path at once.
const MALICIOUS_PHOTO = {
  id: 'photo-1"><img src=x onerror=alert(1)>',
  title: "<script>alert('xss-title')</script>",
  author: "Eve",
  category: "Nature",
  imageUrl: "javascript:alert(document.cookie)",
  tags: [],
  city: "",
  likes: 0,
  likedByMe: false,
  views: 0,
  comments: [
    { author: "Mallory" },
    { text: "no author" },
    "not-an-object",
    null,
    42,
    { author: "Real User", text: "This one is legitimate" }
  ]
};

const MALICIOUS_COLLECTION = {
  id: "collection-evil",
  name: "Evil Collection",
  photoIds: [MALICIOUS_PHOTO.id, "does-not-exist", "photo-1"],
  coverPhotoId: "does-not-exist"
};

test("loadPhotos drops a photo record whose id breaks out of an HTML attribute", () => {
  localStorage.clear();
  localStorage.setItem("lumina_photos", JSON.stringify([MALICIOUS_PHOTO]));

  const gallery = createGallery();
  const photos = gallery.loadPhotos();

  assert.equal(photos.length, 0);
});

test("loadPhotos drops a photo record using a javascript: image URL even with a valid id", () => {
  localStorage.clear();
  const photo = { ...MALICIOUS_PHOTO, id: "photo-1" };
  localStorage.setItem("lumina_photos", JSON.stringify([photo]));

  const gallery = createGallery();
  const photos = gallery.loadPhotos();

  assert.equal(photos.length, 0);
});

test("normalizePhoto escapes a script-tag title when rendered instead of executing it", () => {
  const gallery = createGallery();
  const safePhoto = gallery.normalizePhoto({
    id: "photo-safe",
    title: "<script>alert('xss-title')</script>",
    author: "Eve",
    category: "Nature",
    imageUrl: "data:image/png;base64,iVBORw0KGgo="
  });

  assert.notEqual(safePhoto, null);
  const html = gallery.createCardHTML(safePhoto);
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});

test("normalizePhoto filters malformed comment entries out of the malicious payload", () => {
  const gallery = createGallery();
  const normalized = gallery.normalizePhoto({
    id: "photo-comments",
    title: "Comment Test",
    author: "Eve",
    category: "Nature",
    imageUrl: "data:image/png;base64,iVBORw0KGgo=",
    comments: MALICIOUS_PHOTO.comments
  });

  assert.notEqual(normalized, null);
  assert.equal(normalized.comments.length, 1);
  assert.equal(normalized.comments[0].author, "Real User");
});

test("loadCollections drops invalid photo ids, including a dropped malicious photo's id, without crashing", () => {
  localStorage.clear();
  localStorage.setItem("lumina_photos", JSON.stringify([
    { id: "photo-1", title: "Ok Photo", author: "Eve", category: "Nature", imageUrl: "data:image/png;base64,iVBORw0KGgo=" }
  ]));
  localStorage.setItem("lumina_collections", JSON.stringify([MALICIOUS_COLLECTION]));

  const gallery = createGallery();
  gallery.photos = gallery.loadPhotos();

  const collections = gallery.loadCollections();

  assert.equal(collections.length, 1);
  assert.deepEqual(collections[0].photoIds, ["photo-1"]);
  assert.equal(collections[0].coverPhotoId, "photo-1");
});

test("full malicious payload round-trip: photo dropped, comments filtered, collection safe, no crash", () => {
  localStorage.clear();
  localStorage.setItem("lumina_photos", JSON.stringify([
    MALICIOUS_PHOTO,
    { id: "photo-1", title: "Legit Photo", author: "Eve", category: "Nature", imageUrl: "data:image/png;base64,iVBORw0KGgo=" }
  ]));
  localStorage.setItem("lumina_collections", JSON.stringify([MALICIOUS_COLLECTION]));

  const gallery = createGallery();
  assert.doesNotThrow(() => {
    gallery.photos = gallery.loadPhotos();
    gallery.collections = gallery.loadCollections();
  });

  assert.equal(gallery.photos.length, 1);
  assert.equal(gallery.photos[0].id, "photo-1");
  assert.deepEqual(gallery.collections[0].photoIds, ["photo-1"]);

  const html = gallery.createCardHTML(gallery.photos[0]);
  assert.ok(!html.includes("javascript:"));
});
