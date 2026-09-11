---
description: "Guidelines for state management, events, and LocalStorage persistence in JavaScript files"
applyTo: "**/*.js"
---

# JavaScript State & Event Management Instructions

When adding or updating JavaScript functionality in `app.js` or `server.js`:

1. **State Persistence**:
   - Any modification to photo metadata, comments, likes, or uploads must trigger `this.savePhotos()` to persist state to `localStorage`.
   - Always ensure fallback handling if `localStorage` is empty or corrupted.

2. **Security & Input Sanitization**:
   - ALWAYS sanitize dynamic content using `this.escapeHTML()` before rendering into innerHTML strings.
   - Validate image MIME types before rendering client-side previews (`file.type.startsWith('image/')`).

3. **Event Delegation**:
   - Delegate card-level click events at the grid level (`#galleryGrid`) rather than attaching individual listeners to every card.
