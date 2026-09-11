---
description: "Scaffold a new photo gallery publishing feature such as photo tags, EXIF viewer, album collections, or image filters"
argumentHint: "Describe the feature you want to add (e.g., 'EXIF metadata viewer' or 'Photo albums')"
---

# Add Photo Gallery Feature Prompt

You are tasked with adding a new feature to the Lumina Photo Gallery publishing platform.

## Feature Goal
${input:featureDescription:What gallery feature would you like to build?}

## Instructions
1. **Analyze Requirements**: Check `index.html`, `styles.css`, and `app.js` to determine where state, UI components, and event handlers belong.
2. **Update Data Schema**: If the feature requires new photo attributes (e.g., EXIF data, album ID, ratings), update the photo object structure in `app.js`.
3. **Update HTML Markup**: Add necessary modal elements, buttons, or input controls to `index.html`.
4. **Style the Components**: Add modern CSS styles in `styles.css` using existing CSS custom properties.
5. **Implement Logic**: Add event listeners and methods inside `GalleryApp` in `app.js`, ensuring `savePhotos()` is called when state changes.
6. **Verify Security & Accessibility**: Sanitize inputs with `escapeHTML` and verify responsive layouts.
