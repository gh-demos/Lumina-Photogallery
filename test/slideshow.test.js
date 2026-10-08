const test = require("node:test");
const assert = require("node:assert/strict");
const { GalleryApp } = require("../app.js");

class Element {
  constructor() {
    this.hidden = true;
    this.attributes = {};
    this.listeners = {};
    this.classList = {
      contains: name => name === "hidden" && this.hidden,
      add: () => { this.hidden = true; },
      remove: () => { this.hidden = false; }
    };
  }

  addEventListener(name, listener) { this.listeners[name] = listener; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
  querySelectorAll() { return []; }
  closest() { return null; }
  focus() { this.focused = true; }
}

function setup(t, photos) {
  const elements = new Map();
  const document = new Element();
  Object.assign(document, {
    hidden: false,
    body: { style: {} },
    activeElement: new Element(),
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new Element());
      return elements.get(id);
    }
  });
  const originalDocument = global.document;
  const originalHTMLElement = global.HTMLElement;
  global.document = document;
  global.HTMLElement = Element;
  t.after(() => {
    global.document = originalDocument;
    global.HTMLElement = originalHTMLElement;
  });
  t.mock.timers.enable({ apis: ["setInterval"] });
  const gallery = Object.create(GalleryApp.prototype);
  Object.assign(gallery, {
    photos,
    collections: [],
    recentlyViewed: [],
    unlockedPhotoIds: new Set(),
    currentCategory: "all",
    currentCity: "all",
    currentTag: null,
    currentCollectionId: "all",
    currentSort: "newest",
    searchQuery: "",
    slideshowPhotoIds: [],
    slideshowIndex: 0,
    slideshowTimer: null
  });
  gallery.initDOMElements();
  gallery.bindEvents();
  t.after(() => gallery.pauseSlideshow());
  return { gallery, document };
}

function photo(id, overrides = {}) {
  return {
    id, title: `Photo ${id}`, author: "Avery", category: "Nature",
    city: "Banff", tags: ["mountains"], imageUrl: `https://images.unsplash.com/${id}`,
    createdAt: "2026-01-01T00:00:00.000Z", ...overrides
  };
}

function key(document, key, target = new Element(), extra = {}) {
  const event = { key, target, preventDefault() { this.prevented = true; }, ...extra };
  document.listeners.keydown(event);
  return event;
}

test("launch uses composed current filters and sort, skipping locked but including unlocked photos", t => {
  const { gallery } = setup(t, [
    photo("older"),
    photo("newer", { createdAt: "2026-02-01T00:00:00.000Z" }),
    photo("locked", { isPrivate: true }),
    photo("unlocked", { isPrivate: true }),
    photo("other-city", { city: "Seattle" }),
    photo("other-category", { category: "Travel" }),
    photo("other-tag", { tags: ["beach"] }),
    photo("other-search", { title: "Sunrise" }),
    photo("other-collection")
  ]);
  Object.assign(gallery, {
    currentCategory: "Nature", currentCity: "Banff", currentTag: "mountains",
    searchQuery: "photo", currentCollectionId: "chosen",
    collections: [{ id: "chosen", photoIds: gallery.photos.map(item => item.id).filter(id => id !== "other-collection") }]
  });
  gallery.unlockedPhotoIds.add("unlocked");
  gallery.openSlideshowBtn.listeners.click();
  assert.deepEqual(gallery.slideshowPhotoIds, ["newer", "older", "unlocked"]);
  assert.equal(gallery.slideshowImg.src, gallery.photos[1].imageUrl);
  assert.equal(gallery.slideshowImg.alt, "Photo newer");
  assert.equal(gallery.slideshowCaption.textContent, "1 of 3: Photo newer by Avery");
  assert.equal(gallery.slideshowTimer, null);
  gallery.currentCategory = "Travel";
  gallery.slideshowNextBtn.listeners.click();
  assert.equal(gallery.slideshowImg.alt, "Photo older", "playlist stays stable during the session");
});

test("previous and next wrap; playback advances at five seconds and pause stops it", t => {
  const { gallery } = setup(t, [photo("one"), photo("two")]);
  gallery.openSlideshow();
  gallery.slideshowPreviousBtn.listeners.click();
  assert.equal(gallery.slideshowIndex, 1);
  gallery.slideshowNextBtn.listeners.click();
  assert.equal(gallery.slideshowIndex, 0);
  gallery.slideshowPlayPauseBtn.listeners.click();
  assert.equal(gallery.slideshowPlayPauseBtn.attributes["aria-label"], "Pause slideshow");
  assert.equal(gallery.slideshowPlayPauseLabel.textContent, "Pause");
  assert.equal(gallery.slideshowCaption.attributes["aria-live"], "off");
  t.mock.timers.tick(4999);
  assert.equal(gallery.slideshowIndex, 0);
  t.mock.timers.tick(1);
  assert.equal(gallery.slideshowIndex, 1);
  gallery.slideshowPlayPauseBtn.listeners.click();
  t.mock.timers.tick(10000);
  assert.equal(gallery.slideshowIndex, 1);
  assert.equal(gallery.slideshowPlayPauseBtn.attributes["aria-label"], "Play slideshow");
  assert.equal(gallery.slideshowCaption.attributes["aria-live"], "polite");
});

test("keyboard navigation pauses playback, respects native controls, and Escape cleans up and restores focus", t => {
  const { gallery, document } = setup(t, [photo("one"), photo("two")]);
  const launcher = document.activeElement;
  gallery.openSlideshow();
  assert.equal(key(document, " ").prevented, true);
  assert.notEqual(gallery.slideshowTimer, null);
  assert.equal(key(document, "ArrowRight").prevented, true);
  assert.equal(gallery.slideshowIndex, 1);
  assert.equal(gallery.slideshowTimer, null);
  key(document, "ArrowLeft");
  assert.equal(gallery.slideshowIndex, 0);
  const nativeControl = new Element();
  nativeControl.closest = () => nativeControl;
  assert.equal(key(document, " ", nativeControl).prevented, undefined);
  assert.equal(key(document, "ArrowRight", nativeControl).prevented, undefined);
  key(document, " ", new Element(), { repeat: true });
  assert.equal(gallery.slideshowTimer, null);
  key(document, " ");
  key(document, "Escape");
  t.mock.timers.tick(10000);
  assert.equal(gallery.slideshowModal.hidden, true);
  assert.equal(gallery.slideshowTimer, null);
  assert.deepEqual(gallery.slideshowPhotoIds, []);
  assert.equal(document.body.style.overflow, "");
  assert.equal(launcher.focused, true);
  assert.equal(key(document, "ArrowRight").prevented, undefined);
});

test("tab hiding pauses without restarting; close button and backdrop also stop playback", t => {
  const { gallery, document } = setup(t, [photo("one"), photo("two")]);
  gallery.openSlideshow();
  gallery.toggleSlideshowPlayback();
  document.hidden = true;
  document.listeners.visibilitychange();
  assert.equal(gallery.slideshowTimer, null);
  gallery.toggleSlideshowPlayback();
  assert.equal(gallery.slideshowTimer, null);
  document.hidden = false;
  document.listeners.visibilitychange();
  assert.equal(gallery.slideshowTimer, null);
  for (const close of [
    () => gallery.closeSlideshowBtn.listeners.click(),
    () => gallery.slideshowModal.listeners.click({ target: gallery.slideshowModal })
  ]) {
    gallery.openSlideshow();
    gallery.toggleSlideshowPlayback();
    close();
    assert.equal(gallery.slideshowTimer, null);
    assert.equal(gallery.slideshowModal.hidden, true);
  }
});

test("empty or locked-only results do not open; a single photo has no playback or navigation", t => {
  const { gallery } = setup(t, [photo("locked", { isPrivate: true })]);
  gallery.openSlideshow();
  assert.equal(gallery.slideshowModal.hidden, true);
  gallery.photos = [];
  gallery.openSlideshow();
  assert.equal(gallery.slideshowModal.hidden, true);
  gallery.photos = [photo("one", { title: "<img onerror=alert(1)>" })];
  gallery.openSlideshow();
  assert.equal(gallery.slideshowCaption.textContent, "1 of 1: <img onerror=alert(1)> by Avery");
  assert.equal(gallery.slideshowPreviousBtn.disabled, true);
  assert.equal(gallery.slideshowNextBtn.disabled, true);
  assert.equal(gallery.slideshowPlayPauseBtn.disabled, true);
  gallery.toggleSlideshowPlayback();
  gallery.moveSlideshow(1);
  assert.equal(gallery.slideshowTimer, null);
  assert.equal(gallery.slideshowIndex, 0);
});
