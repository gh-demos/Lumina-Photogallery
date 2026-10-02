const test = require("node:test");
const assert = require("node:assert/strict");
const { GalleryApp, MAX_COMMENT_LENGTH } = require("../app.js");

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

function makePhoto(overrides = {}) {
  return {
    id: "photo-1",
    title: "Test Photo",
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
    ...overrides
  };
}

// Builds a bare GalleryApp instance without touching the DOM/constructor,
// matching the pattern used in test/private-photo-unlock.test.js.
function createGallery(photos) {
  const gallery = Object.create(GalleryApp.prototype);
  gallery.photos = photos;
  gallery.selectedPhotoId = photos[0] ? photos[0].id : null;
  gallery.commentAuthorInput = { value: "" };
  gallery.commentTextInput = { value: "" };

  gallery.savePhotos = () => {};
  gallery.renderGallery = () => {};
  gallery.updateDetailModalContent = () => {};

  return gallery;
}

test.beforeEach(() => {
  global.localStorage.clear();
});

function submitComment(gallery, author, text) {
  gallery.commentAuthorInput.value = author;
  gallery.commentTextInput.value = text;
  gallery.handleCommentSubmit({ preventDefault() {} });
}

test("rejects an empty or whitespace-only comment", () => {
  const photo = makePhoto();
  const gallery = createGallery([photo]);

  submitComment(gallery, "Alice", "   ");
  submitComment(gallery, "   ", "Great shot!");

  assert.equal(photo.comments.length, 0);
});

test("rejects a comment longer than the maximum length", () => {
  const photo = makePhoto();
  const gallery = createGallery([photo]);

  submitComment(gallery, "Alice", "x".repeat(MAX_COMMENT_LENGTH + 1));

  assert.equal(photo.comments.length, 0);
});

test("accepts a comment at exactly the maximum length", () => {
  const photo = makePhoto();
  const gallery = createGallery([photo]);

  submitComment(gallery, "Alice", "x".repeat(MAX_COMMENT_LENGTH));

  assert.equal(photo.comments.length, 1);
  assert.equal(photo.comments[0].text.length, MAX_COMMENT_LENGTH);
});

test("normalizeComment drops malformed, empty, or whitespace-only legacy comments", () => {
  const gallery = createGallery([makePhoto()]);

  assert.equal(gallery.normalizeComment(null), null);
  assert.equal(gallery.normalizeComment("not-an-object"), null);
  assert.equal(gallery.normalizeComment({ author: "", text: "hi" }), null);
  assert.equal(gallery.normalizeComment({ author: "Alice", text: "   " }), null);
});

test("normalizeComment truncates an overlong legacy comment instead of crashing", () => {
  const gallery = createGallery([makePhoto()]);

  const normalized = gallery.normalizeComment({
    author: "Alice",
    text: "y".repeat(MAX_COMMENT_LENGTH + 250),
    createdAt: "2024-01-01T00:00:00.000Z"
  });

  assert.notEqual(normalized, null);
  assert.equal(normalized.text.length, MAX_COMMENT_LENGTH);
});

test("normalizePhoto filters malformed comment entries out of the loaded array", () => {
  const gallery = createGallery([makePhoto()]);

  const normalized = gallery.normalizePhoto(makePhoto({
    comments: [
      { author: "Alice", text: "Nice!" },
      { author: "", text: "orphaned" },
      "not-an-object",
      null
    ]
  }));

  assert.notEqual(normalized, null);
  assert.equal(normalized.comments.length, 1);
  assert.equal(normalized.comments[0].author, "Alice");
});

test("loadPhotos removes malformed stored comments and preserves valid comments", () => {
  const storedPhoto = makePhoto({
    comments: [
      null,
      42,
      "not-an-object",
      { author: ["Alice"], text: "wrong author type" },
      { author: "Alice", text: { value: "wrong text type" } },
      { author: "   ", text: "missing author" },
      { author: "No text" },
      { author: "Alice", text: "   " },
      { author: "Alice", text: "A valid comment", createdAt: "2024-01-01T00:00:00.000Z" },
      { author: "Bob", text: "z".repeat(MAX_COMMENT_LENGTH + 1) }
    ]
  });
  global.localStorage.setItem("lumina_photos", JSON.stringify([storedPhoto]));

  const gallery = createGallery([]);
  const [loadedPhoto] = gallery.loadPhotos();

  assert.ok(loadedPhoto, "the photo containing malformed comments should remain usable");
  assert.deepEqual(
    loadedPhoto.comments.map(({ author, text }) => ({ author, text })),
    [
      { author: "Alice", text: "A valid comment" },
      { author: "Bob", text: "z".repeat(MAX_COMMENT_LENGTH) }
    ]
  );
  const persistedPhoto = JSON.parse(global.localStorage.getItem("lumina_photos"))[0];
  assert.equal(persistedPhoto.comments.length, 2, "sanitized comments should be persisted");
});

test("ignores a duplicate consecutive rating of the same score", () => {
  const photo = makePhoto({ ratingSum: 4, ratingCount: 1, myRating: 4 });
  const gallery = createGallery([photo]);

  gallery.ratePhoto(photo.id, 4);

  assert.equal(photo.ratingSum, 4);
  assert.equal(photo.ratingCount, 1);
  assert.equal(gallery.getAverageRating(photo), 4);
});

test("allows changing to a different rating after a duplicate submission is ignored", () => {
  const photo = makePhoto({ ratingSum: 4, ratingCount: 1, myRating: 4 });
  const gallery = createGallery([photo]);

  gallery.ratePhoto(photo.id, 4);
  gallery.ratePhoto(photo.id, 2);

  assert.equal(photo.ratingSum, 2);
  assert.equal(photo.ratingCount, 1);
  assert.equal(gallery.getAverageRating(photo), 2);
});

test("normalizePhoto clamps an impossible rating sum so the average cannot exceed the star scale", () => {
  const gallery = createGallery([makePhoto()]);

  const normalized = gallery.normalizePhoto(makePhoto({ ratingSum: 999999, ratingCount: 2 }));

  assert.notEqual(normalized, null);
  assert.equal(normalized.ratingSum, 10);
  assert.equal(gallery.getAverageRating(normalized), 5);
});

test("normalizePhoto treats a non-numeric rating count as zero without crashing", () => {
  const gallery = createGallery([makePhoto()]);

  const normalized = gallery.normalizePhoto(makePhoto({ ratingSum: "oops", ratingCount: "oops", myRating: "oops" }));

  assert.notEqual(normalized, null);
  assert.equal(normalized.ratingCount, 0);
  assert.equal(normalized.ratingSum, 0);
  assert.equal(gallery.getAverageRating(normalized), 0);
});

test("loadPhotos sanitizes malformed persisted ratings while preserving valid rating aggregates", () => {
  const storedPhotos = [
    makePhoto({ id: "bad-values", ratingSum: "Infinity", ratingCount: "not-a-number", myRating: "NaN" }),
    makePhoto({ id: "negative-values", ratingSum: -9, ratingCount: -2, myRating: -4 }),
    makePhoto({ id: "impossible-sum", ratingSum: 999, ratingCount: 2, myRating: 99 }),
    makePhoto({ id: "valid-rating", ratingSum: 7, ratingCount: 2, myRating: 3 })
  ];
  global.localStorage.setItem("lumina_photos", JSON.stringify(storedPhotos));

  const gallery = createGallery([]);
  const loadedPhotos = gallery.loadPhotos();
  const ratingsById = new Map(loadedPhotos.map(photo => [photo.id, photo]));

  assert.deepEqual(
    ["ratingSum", "ratingCount", "myRating"].map(key => ratingsById.get("bad-values")[key]),
    [0, 0, 0]
  );
  assert.deepEqual(
    ["ratingSum", "ratingCount", "myRating"].map(key => ratingsById.get("negative-values")[key]),
    [0, 0, 0]
  );
  assert.deepEqual(
    ["ratingSum", "ratingCount", "myRating"].map(key => ratingsById.get("impossible-sum")[key]),
    [10, 2, 5]
  );
  assert.deepEqual(
    ["ratingSum", "ratingCount", "myRating"].map(key => ratingsById.get("valid-rating")[key]),
    [7, 2, 3]
  );
  assert.equal(gallery.getAverageRating(ratingsById.get("impossible-sum")), 5);
  assert.equal(gallery.getAverageRating(ratingsById.get("valid-rating")), 3.5);
  assert.ok(loadedPhotos.every(photo => gallery.getAverageRating(photo) <= 5));
});
