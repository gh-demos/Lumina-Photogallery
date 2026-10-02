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

const storage = new MemoryStorage();
global.localStorage = storage;

function makePhoto(overrides = {}) {
  return {
    id: "stored-photo",
    title: "Stored Photo",
    author: "Lumina",
    category: "Nature",
    imageUrl: "data:image/png;base64,iVBORw0KGgo=",
    createdAt: "2026-08-20T10:30:00.000Z",
    ratingSum: 0,
    ratingCount: 0,
    myRating: 0,
    comments: [],
    ...overrides
  };
}

function loadStoredPhotos(photos) {
  storage.setItem("lumina_photos", JSON.stringify(photos));
  return Object.create(GalleryApp.prototype).loadPhotos();
}

test.beforeEach(() => {
  storage.clear();
});

test("loadPhotos removes malformed stored comments and persists normalized valid comments", () => {
  const validComment = {
    id: "comment-valid",
    author: "  Alex  ",
    text: "  Nice photo!  ",
    createdAt: "2026-08-21T14:15:00.000Z"
  };
  const overlongComment = {
    id: "comment-long",
    author: "Sam",
    text: "x".repeat(MAX_COMMENT_LENGTH + 20),
    createdAt: "2026-08-21T14:15:00.000Z"
  };
  const photo = makePhoto({
    comments: [
      null,
      42,
      "not a comment",
      {},
      { author: 7, text: "Invalid author" },
      { author: "Alex", text: 7 },
      { author: "  ", text: "Blank author" },
      { author: "Alex", text: "  " },
      validComment,
      overlongComment
    ]
  });

  const [normalizedPhoto] = loadStoredPhotos([photo]);

  assert.deepEqual(normalizedPhoto.comments, [
    { ...validComment, author: "Alex", text: "Nice photo!" },
    { ...overlongComment, text: "x".repeat(MAX_COMMENT_LENGTH) }
  ]);
  assert.deepEqual(JSON.parse(storage.getItem("lumina_photos")), [normalizedPhoto]);
});

test("handleCommentSubmit rejects overlong comments and accepts the maximum length", () => {
  const photo = makePhoto();
  const gallery = Object.create(GalleryApp.prototype);
  gallery.photos = [photo];
  gallery.selectedPhotoId = photo.id;
  gallery.commentAuthorInput = { value: "Alex" };
  gallery.commentTextInput = { value: "x".repeat(MAX_COMMENT_LENGTH + 1) };
  gallery.renderGallery = () => {};
  gallery.updateDetailModalContent = () => {};

  gallery.handleCommentSubmit({ preventDefault() {} });
  assert.deepEqual(photo.comments, []);
  assert.equal(storage.getItem("lumina_photos"), null);

  gallery.commentTextInput.value = "x".repeat(MAX_COMMENT_LENGTH);
  gallery.handleCommentSubmit({ preventDefault() {} });

  assert.equal(photo.comments.length, 1);
  assert.equal(photo.comments[0].text.length, MAX_COMMENT_LENGTH);
  assert.deepEqual(JSON.parse(storage.getItem("lumina_photos")), [photo]);
});

test("loadPhotos sanitizes malformed rating aggregates and preserves valid ratings", () => {
  const photos = loadStoredPhotos([
    makePhoto({ id: "invalid-numbers", ratingSum: "not-a-number", ratingCount: "invalid", myRating: "bad" }),
    makePhoto({ id: "negative-numbers", ratingSum: -4, ratingCount: -2, myRating: -1 }),
    makePhoto({ id: "impossible-aggregate", ratingSum: 999, ratingCount: 2, myRating: 99 }),
    makePhoto({ id: "valid-aggregate", ratingSum: 7, ratingCount: 2, myRating: 3 })
  ]);

  assert.deepEqual(
    photos.map(({ ratingSum, ratingCount, myRating }) => [ratingSum, ratingCount, myRating]),
    [
      [0, 0, 0],
      [0, 0, 0],
      [10, 2, 5],
      [7, 2, 3]
    ]
  );
  assert.equal(Object.create(GalleryApp.prototype).getAverageRating(photos[3]), 3.5);
  assert.ok(photos.every(photo => Object.create(GalleryApp.prototype).getAverageRating(photo) <= 5));
  assert.deepEqual(JSON.parse(storage.getItem("lumina_photos")), photos);
});
