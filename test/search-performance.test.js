const test = require("node:test");
const assert = require("node:assert/strict");
const { GalleryApp } = require("../app.js");

function createGallery(photos) {
  const gallery = Object.create(GalleryApp.prototype);
  Object.assign(gallery, {
    photos,
    collections: [{ id: "collection-1", photoIds: ["photo-a", "photo-b", "photo-c"] }],
    recentlyViewed: [],
    currentCategory: "all",
    currentCity: "all",
    currentTag: null,
    currentCollectionId: "all",
    currentSort: "newest",
    searchQuery: ""
  });
  return gallery;
}

function createPhoto(id, overrides = {}) {
  return {
    id,
    title: `Photo ${id}`,
    author: "Avery",
    category: "Nature",
    city: "Banff",
    tags: ["mountains"],
    createdAt: "2026-01-01T00:00:00.000Z",
    likes: 0,
    comments: [],
    ratingSum: 0,
    ratingCount: 0,
    ...overrides
  };
}

test("search still matches title, author, category, city, and tags", () => {
  const gallery = createGallery([
    createPhoto("title", { title: "Golden sunrise" }),
    createPhoto("author", { author: "Jordan Lee" }),
    createPhoto("category", { category: "Architecture" }),
    createPhoto("city", { city: "Seattle" }),
    createPhoto("tag", { tags: ["wildflowers"] })
  ]);

  for (const [query, expectedId] of [
    ["golden", "title"],
    ["jordan", "author"],
    ["architecture", "category"],
    ["seattle", "city"],
    ["wildflowers", "tag"]
  ]) {
    gallery.searchQuery = query;
    assert.deepEqual(gallery.getFilteredPhotos().map(photo => photo.id), [expectedId], query);
  }
});

test("newest search sorts only composed filter results and parses each date once", () => {
  const gallery = createGallery([
    createPhoto("photo-a", { title: "Mountain dawn", createdAt: "2026-01-01T00:00:00.000Z" }),
    createPhoto("photo-b", { title: "Mountain dusk", createdAt: "2026-03-01T00:00:00.000Z" }),
    createPhoto("photo-c", { title: "Mountain lake", city: "Seattle", createdAt: "2026-04-01T00:00:00.000Z" }),
    createPhoto("photo-d", { title: "Mountain peaks", createdAt: "2026-05-01T00:00:00.000Z" })
  ]);
  Object.assign(gallery, {
    currentCategory: "Nature",
    currentCity: "Banff",
    currentTag: "mountains",
    currentCollectionId: "collection-1",
    searchQuery: "mountain"
  });

  const NativeDate = global.Date;
  let dateParseCount = 0;
  global.Date = new Proxy(NativeDate, {
    construct(target, args, newTarget) {
      if (args.length) dateParseCount++;
      return Reflect.construct(target, args, newTarget);
    }
  });

  let results;
  try {
    results = gallery.getFilteredPhotos();
  } finally {
    global.Date = NativeDate;
  }

  assert.deepEqual(results.map(photo => photo.id), ["photo-b", "photo-a"]);
  assert.equal(dateParseCount, results.length);
});

test("recently viewed search orders filtered results with one timestamp parse each", () => {
  const gallery = createGallery([
    createPhoto("photo-a", { title: "Mountain dawn" }),
    createPhoto("photo-b", { title: "Mountain dusk" }),
    createPhoto("photo-c", { title: "Mountain lake" })
  ]);
  Object.assign(gallery, {
    currentCategory: "recently-viewed",
    currentCity: "Banff",
    currentTag: "mountains",
    searchQuery: "mountain",
    recentlyViewed: [
      { photoId: "photo-a", viewedAt: "2026-02-01T00:00:00.000Z" },
      { photoId: "photo-b", viewedAt: "2026-03-01T00:00:00.000Z" },
      { photoId: "photo-c", viewedAt: "2026-04-01T00:00:00.000Z" }
    ]
  });

  const NativeDate = global.Date;
  let dateParseCount = 0;
  global.Date = new Proxy(NativeDate, {
    construct(target, args, newTarget) {
      if (args.length) dateParseCount++;
      return Reflect.construct(target, args, newTarget);
    }
  });

  let results;
  try {
    results = gallery.getFilteredPhotos();
  } finally {
    global.Date = NativeDate;
  }

  assert.deepEqual(results.map(photo => photo.id), ["photo-c", "photo-b", "photo-a"]);
  assert.equal(dateParseCount, results.length);
});
