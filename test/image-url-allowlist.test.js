const test = require("node:test");
const assert = require("node:assert/strict");
const { GalleryApp } = require("../app.js");

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
  clear() {
    this.store.clear();
  }
}

const storage = new MemoryStorage();
global.localStorage = storage;
const gallery = Object.create(GalleryApp.prototype);

function makePhoto(id, imageUrl) {
  return {
    id,
    title: "Stored Photo",
    author: "Lumina",
    category: "Nature",
    imageUrl,
    comments: []
  };
}

test.beforeEach(() => {
  storage.clear();
});

test("allows strict raster image data URLs", () => {
  [
    "data:image/png;base64,iVBORw0KGgo=",
    "data:image/jpeg;base64,/9j/4AAQ",
    "data:image/webp;base64,UklGRg==",
    "data:image/gif;base64,R0lGODlh"
  ].forEach(imageUrl => assert.equal(gallery.isSafeImageUrl(imageUrl), true, imageUrl));
});

test("allows Unsplash HTTPS URLs on the default port", () => {
  assert.equal(
    gallery.isSafeImageUrl("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format"),
    true
  );
});

test("rejects unsafe and malformed image URLs", () => {
  [
    "javascript:alert(1)",
    "file:///private/photo.png",
    "blob:https://images.unsplash.com/abc",
    "data:text/html;base64,PHNjcmlwdD4=",
    "data:image/svg+xml;base64,PHN2Zz4=",
    "data:image/png;base64,a=",
    "data:image/png;base64,abc",
    "http://images.unsplash.com/photo.jpg",
    "https://example.com/photo.jpg",
    "https://user@images.unsplash.com/photo.jpg",
    "https://user:password@images.unsplash.com/photo.jpg",
    "https://images.unsplash.com:8443/photo.jpg"
  ].forEach(imageUrl => assert.equal(gallery.isSafeImageUrl(imageUrl), false, imageUrl));
});

test("normalizePhoto rejects unsafe persisted image URLs", () => {
  const photo = {
    id: "stored-photo",
    title: "Stored Photo",
    author: "Lumina",
    category: "Nature",
    imageUrl: "javascript:alert(1)"
  };

  assert.equal(gallery.normalizePhoto(photo), null);
});

test("normalizePhoto accepts allowlisted Unsplash and PNG data URLs", () => {
  [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format",
    "data:image/png;base64,iVBORw0KGgo="
  ].forEach(imageUrl => {
    const normalizedPhoto = gallery.normalizePhoto({
      id: "valid-photo",
      title: "Valid Photo",
      author: "Lumina",
      category: "Nature",
      imageUrl
    });

    assert.notEqual(normalizedPhoto, null, imageUrl);
    assert.equal(normalizedPhoto.imageUrl, imageUrl, imageUrl);
  });
});

test("loadPhotos drops malformed and unsafe stored image URLs and persists valid records", () => {
  const photos = [
    makePhoto("unsafe-scheme", "javascript:alert(1)"),
    makePhoto("host-suffix", "https://images.unsplash.com.evil.example/photo.jpg"),
    makePhoto("host-credentials", "https://images.unsplash.com@evil.example/photo.jpg"),
    makePhoto("invalid-data", "data:image/png;base64,not-base64"),
    makePhoto("non-string-url", 42),
    makePhoto("valid-unsplash", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format"),
    makePhoto("valid-data", "data:image/png;base64,iVBORw0KGgo=")
  ];
  storage.setItem("lumina_photos", JSON.stringify(photos));

  const loadedPhotos = gallery.loadPhotos();

  assert.deepEqual(loadedPhotos.map(photo => photo.id), ["valid-unsplash", "valid-data"]);
  assert.deepEqual(JSON.parse(storage.getItem("lumina_photos")), loadedPhotos);
});