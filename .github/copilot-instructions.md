# Lumina Photo Gallery Publishing Site - Copilot Instructions

## Workspace Overview
This workspace contains **Lumina**, a modern photo gallery publishing platform built with vanilla HTML5, CSS3 (CSS Custom Properties & Flexbox/Grid), and ES6+ JavaScript. The platform enables users to publish photos, like photos, add comments, filter/search content, and download full-resolution images.

## Architecture & Code Standards

### 1. File Responsibilities
- `index.html`: Semantic HTML structure, modal dialogues (upload & lightbox detail), navigation, search bar, and dynamic gallery container.
- `styles.css`: CSS variables for dark theme, flex/grid layouts, responsive breakpoints, glassmorphism UI, modal overlays, and button states.
- `app.js`: ES6 `GalleryApp` class orchestrating state persistence (via `localStorage`), DOM manipulation, file reading (`FileReader`), like toggling, comment posting, search filtering, and browser downloads.
- `server.js`: Lightweight Express server for serving static assets.

### 2. JavaScript Guidelines
- Always use ES6 class structures or modular functions.
- ALWAYS sanitize user input (comments, titles, photographer names) using HTML escaping functions (`escapeHTML`) before injecting into the DOM to prevent XSS vulnerabilities.
- State changes MUST be synchronized with `localStorage` via `savePhotos()` so photo uploads, likes, and comments persist across browser refreshes.
- Keep event handlers organized inside `bindEvents()` in `GalleryApp`.

### 3. Styling & UI Conventions
- Use defined CSS custom properties (`var(--primary)`, `var(--card-bg)`, `var(--text-main)`, etc.).
- Ensure all interactive elements have hover and focus states for optimal user experience and accessibility.
- Maintain responsive grid layout using `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));`.
- Use FontAwesome classes (`fa-solid`, `fa-regular`) for UI icons.

### 4. Photo Gallery Specific Features
- **Uploads**: Support client-side image preview using `FileReader.readAsDataURL()`.
- **Likes**: Toggle `likedByMe` status and update like count atomically.
- **Comments**: Include timestamp, author name, and comment text.
- **Downloads**: Generate dynamic programmatic anchor tags for downloading images without page redirects.

### 5. Tracking Documents
- Store every tracking artifact in the repository `tracking/` folder; do not create tracking Markdown files at the repository root.
- Use descriptive uppercase filenames ending in `_TRACKING.md`, such as `tracking/FEATURE_FEATURED_PHOTOS_TRACKING.md`.
