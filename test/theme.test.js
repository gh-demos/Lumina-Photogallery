const test = require("node:test");
const assert = require("node:assert/strict");
const { GalleryApp } = require("../app.js");

function createGallery(storedTheme = null) {
  const storage = new Map();
  if (storedTheme !== null) storage.set("lumina_theme", storedTheme);
  global.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value))
  };
  global.document = { documentElement: { dataset: {} } };
  const attributes = {};
  const label = { textContent: "" };
  const icon = { className: "" };
  const gallery = Object.create(GalleryApp.prototype);
  gallery.themeToggleBtn = {
    setAttribute: (key, value) => { attributes[key] = value; },
    querySelector: selector => selector === "span" ? label : icon
  };
  return { gallery, storage, attributes, label, icon };
}

test("theme defaults to dark and ignores invalid stored preferences", () => {
  for (const preference of [null, "invalid", "dark"]) {
    const { gallery } = createGallery(preference);
    assert.equal(gallery.loadTheme(), "dark");
  }
});

test("a saved light preference restores the document and accessible toggle state", () => {
  const { gallery, attributes, label, icon } = createGallery("light");
  gallery.applyTheme(gallery.loadTheme());
  assert.equal(document.documentElement.dataset.theme, "light");
  assert.equal(attributes["aria-pressed"], "true");
  assert.equal(label.textContent, "Dark mode");
  assert.equal(icon.className, "fa-solid fa-moon");
});

test("toggle switches both ways and persists the chosen theme", () => {
  const { gallery, storage, attributes, label } = createGallery();
  gallery.applyTheme(gallery.loadTheme());
  gallery.toggleTheme();
  assert.equal(storage.get("lumina_theme"), "light");
  assert.equal(document.documentElement.dataset.theme, "light");
  gallery.toggleTheme();
  assert.equal(storage.get("lumina_theme"), "dark");
  assert.equal(document.documentElement.dataset.theme, "dark");
  assert.equal(attributes["aria-pressed"], "false");
  assert.equal(label.textContent, "Light mode");
});

test("a storage write failure reports that the theme preference was not saved", (context) => {
  const { gallery } = createGallery();
  gallery.applyTheme("dark");
  let message;
  const originalError = console.error;
  console.error = () => {};
  global.alert = value => { message = value; };
  context.after(() => {
    console.error = originalError;
    delete global.alert;
  });
  localStorage.setItem = () => { throw new Error("Storage unavailable"); };
  gallery.toggleTheme();
  assert.equal(document.documentElement.dataset.theme, "light");
  assert.match(message, /could not be saved/);
});
