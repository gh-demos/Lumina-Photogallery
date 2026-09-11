---
name: photo-gallery-optimizer
description: "Optimize photo gallery performance, image loading, responsive layouts, search filtering, and LocalStorage caching. Use when asking to improve gallery performance, optimize image loading, speed up photo grid, or optimize gallery rendering."
---

# Photo Gallery Optimizer Skill

This skill provides step-by-step guidance for optimizing performance, memory usage, and user experience in photo gallery publishing web applications.

## Optimization Areas

### 1. Image Performance & Lazy Loading
- Ensure all gallery image cards use `loading="lazy"` attribute.
- Convert uploaded heavy canvas/data URLs into compressed WEBP blobs where appropriate.
- Set explicit `aspect-ratio` in CSS (`aspect-ratio: 4/3`) on image containers to prevent Cumulative Layout Shift (CLS).

### 2. Gallery Search & Filtering
- Debounce search input handlers (e.g. 150-200ms) to avoid excessive re-renders during fast typing.
- Use `DocumentFragment` or array mapping for batch DOM insertions when rendering large photo grids.

### 3. LocalStorage Caching
- Compress photo storage objects if data URLs exceed `localStorage` size limits (~5MB).
- Provide clean fallback mechanisms if storage quota is exceeded.

## Execution Checklist
1. Inspect `app.js` render loop (`renderGallery`).
2. Audit CSS layout rules in `styles.css` for grid layout performance.
3. Test layout shift on mobile and desktop viewports.
