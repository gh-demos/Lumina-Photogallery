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

global.localStorage = new MemoryStorage();

function makePhoto(id, title = id) {
  return {
    id,
    title,
    author: "Lumina",
    category: "Nature",
    imageUrl: "data:image/png;base64,iVBORw0KGgo=",
    tags: [],
    city: "",
    likes: 0,
    likedByMe: false,
    views: 0,
    ratingSum: 0,
    ratingCount: 0,
    myRating: 0,
    comments: [],
    createdAt: "2026-01-01T00:00:00.000Z"
  };
}

function createGallery(photos = []) {
  const gallery = Object.create(GalleryApp.prototype);
  gallery.photos = photos;
  gallery.collections = [];
  gallery.recentlyViewed = [];
  gallery.currentCategory = "all";
  gallery.currentCity = "all";
  gallery.currentTag = null;
  gallery.currentCollectionId = "all";
  gallery.searchQuery = "";
  gallery.currentSort = "newest";
  gallery.selectedPhotoId = null;
  gallery.collectionNameInput = { value: "" };
  gallery.collectionDescriptionInput = { value: "" };
  gallery.collectionStatus = { textContent: "", };
  gallery.collectionForm = { reset() {} };
  gallery.collectionsList = { innerHTML: "" };
  gallery.collectionFilterContainer = { innerHTML: "" };
  gallery.renderGallery = () => {};
  gallery.updateDetailModalContent = () => {};
  return gallery;
}

test.beforeEach(() => {
  global.localStorage.clear();
});

test("creating a collection trims its fields and persists it", () => {
  const gallery = createGallery();
  gallery.collectionNameInput.value = "  Favorites  ";
  gallery.collectionDescriptionInput.value = "  Photos to revisit  ";

  gallery.createCollection({ preventDefault() {} });

  assert.equal(gallery.collections.length, 1);
  assert.equal(gallery.collections[0].name, "Favorites");
  assert.equal(gallery.collections[0].description, "Photos to revisit");
  assert.deepEqual(gallery.collections[0].photoIds, []);
  assert.deepEqual(JSON.parse(localStorage.getItem("lumina_collections")), gallery.collections);
});

test("collection ids remain unique when collections are created in the same millisecond", (context) => {
  const originalNow = Date.now;
  Date.now = () => 1234;
  context.after(() => {
    Date.now = originalNow;
  });

  const gallery = createGallery();
  for (const name of ["First", "Second"]) {
    gallery.collectionNameInput.value = name;
    gallery.collectionDescriptionInput.value = "";
    gallery.createCollection({ preventDefault() {} });
  }

  assert.deepEqual(gallery.collections.map(collection => collection.id), ["collection-1234-1", "collection-1234"]);
});

test("adding and removing a photo updates collection membership, cover, and storage", () => {
  const gallery = createGallery([makePhoto("photo-1"), makePhoto("photo-2")]);
  gallery.collections = [{
    id: "collection-favorites",
    name: "Favorites",
    description: "",
    coverPhotoId: null,
    photoIds: [],
    createdAt: "2026-01-01T00:00:00.000Z"
  }];

  gallery.togglePhotoCollection("photo-1", "collection-favorites", true);
  gallery.togglePhotoCollection("photo-2", "collection-favorites", true);
  assert.deepEqual(gallery.collections[0].photoIds, ["photo-1", "photo-2"]);
  assert.equal(gallery.collections[0].coverPhotoId, "photo-1");

  gallery.togglePhotoCollection("photo-1", "collection-favorites", false);
  assert.deepEqual(gallery.collections[0].photoIds, ["photo-2"]);
  assert.equal(gallery.collections[0].coverPhotoId, "photo-2");
  assert.deepEqual(JSON.parse(localStorage.getItem("lumina_collections")), gallery.collections);
});

test("collection filtering shows only member photos and composes with search", () => {
  const gallery = createGallery([
    makePhoto("photo-1", "Mountain"),
    makePhoto("photo-2", "Forest"),
    makePhoto("photo-3", "Mountain Lake")
  ]);
  gallery.collections = [{
    id: "collection-nature",
    name: "Nature",
    description: "",
    coverPhotoId: "photo-1",
    photoIds: ["photo-1", "photo-3"],
    createdAt: "2026-01-01T00:00:00.000Z"
  }];
  gallery.currentCollectionId = "collection-nature";

  assert.deepEqual(gallery.getFilteredPhotos().map(photo => photo.id), ["photo-1", "photo-3"]);

  gallery.searchQuery = "lake";
  assert.deepEqual(gallery.getFilteredPhotos().map(photo => photo.id), ["photo-3"]);
});

test("rendered collection filter labels are escaped and pressed state matches selection", () => {
  const gallery = createGallery();
  gallery.collections = [{
    id: "collection-unsafe",
    name: '<img src=x onerror="alert(1)">',
    description: "",
    coverPhotoId: null,
    photoIds: [],
    createdAt: "2026-01-01T00:00:00.000Z"
  }];
  gallery.currentCollectionId = "collection-unsafe";

  gallery.renderCollectionFilters();

  assert.ok(gallery.collectionFilterContainer.innerHTML.includes("&lt;img"));
  assert.ok(gallery.collectionFilterContainer.innerHTML.includes('aria-pressed="true"'));
  assert.ok(!gallery.collectionFilterContainer.innerHTML.includes("<img"));
});
