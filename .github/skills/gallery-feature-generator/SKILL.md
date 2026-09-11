---
name: gallery-feature-generator
description: "Generate and extend interactive features for the photo publishing gallery including likes, comments, downloads, tags, and photo filtering. Use when asked to generate photo gallery features, extend gallery publishing capabilities, or build new photo interactions."
---

# Gallery Feature Generator Skill

This skill provides step-by-step instructions for extending the Lumina Photo Gallery with new interactive capabilities.

## Workflow Strategy

### 1. Data Model Extension
In `app.js`, locate `DEFAULT_PHOTOS` and `GalleryApp` data structures:
- Add necessary fields to photo objects (e.g. `views`, `bookmarks`, `exif`, `location`).
- Update `savePhotos()` and `loadPhotos()` methods to handle new attributes.

### 2. UI Component Integration
In `index.html`:
- Add corresponding modal windows, action buttons, or filter chips.
- Use FontAwesome icons for visual consistency.

### 3. Styling & Animations
In `styles.css`:
- Define button states, badge colors, and hover transitions.
- Reuse color variables (`--primary`, `--accent-like`, `--card-bg`).

### 4. Interactive Logic & Event Handling
In `app.js`:
- Add handler methods in `GalleryApp` (e.g., `toggleBookmark()`, `incrementViews()`).
- Attach event listeners in `bindEvents()`.
- Ensure all user input strings are escaped using `escapeHTML()`.
