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

function makePrivatePhoto(overrides = {}) {
  return {
    id: "private-1",
    title: "Secret Falls",
    author: "Lumina",
    category: "Nature",
    imageUrl: "data:image/png;base64,REALSECRETIMAGEDATA==",
    isPrivate: true,
    password: "correct-horse",
    tags: [],
    comments: [],
    likes: 0,
    likedByMe: false,
    views: 0,
    ...overrides
  };
}

function makePublicPhoto(overrides = {}) {
  return {
    id: "public-1",
    title: "Open Meadow",
    author: "Lumina",
    category: "Nature",
    imageUrl: "data:image/png;base64,PUBLICDATA==",
    isPrivate: false,
    password: null,
    tags: [],
    comments: [],
    likes: 0,
    likedByMe: false,
    views: 0,
    ...overrides
  };
}

// Builds a bare GalleryApp instance without touching the DOM/constructor.
// Heavy DOM-driven methods are stubbed on the instance, matching the
// pattern used in test/share-collection.test.js.
function createGallery(photos) {
  const gallery = Object.create(GalleryApp.prototype);
  gallery.photos = photos;
  gallery.recentlyViewed = [];
  gallery.collections = [];
  gallery.selectedPhotoId = null;
  gallery.pendingUnlockPhotoId = null;
  gallery.pendingUnlockAction = null;
  gallery.unlockPasswordInput = { value: "" };
  gallery.unlockErrorMsg = { classList: { add() {}, remove() {}, contains: () => false } };

  gallery.showModal = () => {};
  gallery.hideModal = () => {};
  gallery.renderGallery = () => {};
  gallery.updateDetailModalContent = () => {};
  gallery.saveRecentlyViewed = () => {};

  return gallery;
}

function submitUnlock(gallery, password) {
  gallery.unlockPasswordInput.value = password;
  gallery.handleUnlockSubmit({ preventDefault() {} });
}

test.beforeEach(() => {
  global.localStorage.clear();
});

test("opening a private photo always requires a fresh password prompt, even after a prior successful unlock", () => {
  const photo = makePrivatePhoto();
  const gallery = createGallery([photo]);

  gallery.openDetailModal(photo.id);
  assert.equal(gallery.pendingUnlockPhotoId, photo.id);
  assert.equal(gallery.pendingUnlockAction, "open");

  submitUnlock(gallery, "correct-horse");
  assert.equal(gallery.pendingUnlockPhotoId, null);
  assert.equal(gallery.pendingUnlockAction, null);
  assert.equal(gallery.selectedPhotoId, photo.id);

  // Second attempt to open the same photo must prompt again, not reuse a stale unlock.
  gallery.selectedPhotoId = null;
  gallery.openDetailModal(photo.id);
  assert.equal(gallery.pendingUnlockPhotoId, photo.id);
  assert.equal(gallery.pendingUnlockAction, "open");
  assert.equal(gallery.selectedPhotoId, null, "detail modal must not open without re-entering the password");

  assert.equal(gallery.unlockedPhotoIds, undefined, "there must be no bypass Set granting repeat access");
});

test("unlocking to open a private photo does not authorize a later download of the same photo", () => {
  const photo = makePrivatePhoto();
  const gallery = createGallery([photo]);

  gallery.openDetailModal(photo.id);
  submitUnlock(gallery, "correct-horse");
  assert.equal(gallery.pendingUnlockPhotoId, null);

  gallery.downloadPhoto(photo.id);
  assert.equal(gallery.pendingUnlockPhotoId, photo.id);
  assert.equal(gallery.pendingUnlockAction, "download");
});

test("unlocking to download a private photo does not authorize a later open of the same photo", () => {
  const photo = makePrivatePhoto();
  const gallery = createGallery([photo]);
  gallery.performDownload = () => {};

  gallery.downloadPhoto(photo.id);
  submitUnlock(gallery, "correct-horse");
  assert.equal(gallery.pendingUnlockPhotoId, null);

  gallery.openDetailModal(photo.id);
  assert.equal(gallery.pendingUnlockPhotoId, photo.id);
  assert.equal(gallery.pendingUnlockAction, "open");
});

test("liking a private photo requires its own password prompt, unrelated to a prior open/download unlock", () => {
  const photo = makePrivatePhoto();
  const gallery = createGallery([photo]);

  gallery.openDetailModal(photo.id);
  submitUnlock(gallery, "correct-horse");
  assert.equal(gallery.pendingUnlockPhotoId, null);

  gallery.toggleLike(photo.id);
  assert.equal(gallery.pendingUnlockPhotoId, photo.id);
  assert.equal(gallery.pendingUnlockAction, "like");
  assert.equal(photo.likedByMe, false, "like must not be applied before password entry");

  submitUnlock(gallery, "correct-horse");
  assert.equal(photo.likedByMe, true);
  assert.equal(gallery.pendingUnlockPhotoId, null);
  assert.equal(gallery.pendingUnlockAction, null);
});

test("handleUnlockSubmit dispatches to exactly one pending action and clears pending state", () => {
  const photo = makePrivatePhoto();
  const gallery = createGallery([photo]);

  let opens = 0, downloads = 0, likes = 0;
  gallery.performOpenDetailModal = () => { opens += 1; };
  gallery.performDownload = () => { downloads += 1; };
  gallery.performToggleLike = () => { likes += 1; };

  gallery.promptUnlock(photo.id, "download");
  submitUnlock(gallery, "correct-horse");

  assert.equal(downloads, 1);
  assert.equal(opens, 0);
  assert.equal(likes, 0);
  assert.equal(gallery.pendingUnlockPhotoId, null);
  assert.equal(gallery.pendingUnlockAction, null);

  // No residual state should let a later unrelated submit re-run anything.
  submitUnlock(gallery, "correct-horse");
  assert.equal(downloads, 1);
});

test("handleUnlockSubmit with an incorrect password does not dispatch and keeps pending state", () => {
  const photo = makePrivatePhoto();
  const gallery = createGallery([photo]);
  gallery.performOpenDetailModal = () => { throw new Error("must not be called"); };

  gallery.promptUnlock(photo.id, "open");
  submitUnlock(gallery, "wrong-password");

  assert.equal(gallery.pendingUnlockPhotoId, photo.id);
  assert.equal(gallery.pendingUnlockAction, "open");
});

test("createCardHTML never leaks a private photo's real imageUrl", () => {
  const photo = makePrivatePhoto();
  const gallery = createGallery([photo]);

  const htmlBeforeUnlock = gallery.createCardHTML(photo);
  assert.equal(htmlBeforeUnlock.includes(photo.imageUrl), false);

  gallery.openDetailModal(photo.id);
  submitUnlock(gallery, "correct-horse");

  const htmlAfterUnlock = gallery.createCardHTML(photo);
  assert.equal(htmlAfterUnlock.includes(photo.imageUrl), false, "unlocking must not change what the thumbnail exposes");
});

test("non-private photos open, download, and like without any password prompt", () => {
  const photo = makePublicPhoto();
  const gallery = createGallery([photo]);
  let opened = false, downloaded = false;
  gallery.performOpenDetailModal = () => { opened = true; };
  gallery.performDownload = () => { downloaded = true; };

  gallery.openDetailModal(photo.id);
  assert.equal(opened, true);
  assert.equal(gallery.pendingUnlockPhotoId, null);

  gallery.downloadPhoto(photo.id);
  assert.equal(downloaded, true);
  assert.equal(gallery.pendingUnlockPhotoId, null);

  gallery.toggleLike(photo.id);
  assert.equal(photo.likedByMe, true);
  assert.equal(gallery.pendingUnlockPhotoId, null);
});

test("dismissUnlockModal clears pending unlock state so a later submit cannot run a stale action", () => {
  const photo = makePrivatePhoto();
  const gallery = createGallery([photo]);
  gallery.performOpenDetailModal = () => { throw new Error("must not be called after dismiss"); };

  gallery.promptUnlock(photo.id, "open");
  assert.equal(gallery.pendingUnlockPhotoId, photo.id);

  gallery.dismissUnlockModal();
  assert.equal(gallery.pendingUnlockPhotoId, null);
  assert.equal(gallery.pendingUnlockAction, null);

  // A submit after dismissal has nothing pending and must be a no-op.
  submitUnlock(gallery, "correct-horse");
  assert.equal(gallery.pendingUnlockPhotoId, null);
  assert.equal(gallery.pendingUnlockAction, null);
});
