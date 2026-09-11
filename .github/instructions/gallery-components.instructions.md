---
description: "Guidelines for modifying photo gallery UI components, HTML structure, and CSS styles"
applyTo: "**/*.{html,css}"
---

# UI & Styling Instructions for Gallery Components

When editing HTML markup in `index.html` or CSS styles in `styles.css`:

1. **Accessibility & Semantics**:
   - Ensure all `<img>` tags include meaningful `alt` attributes.
   - Use semantic elements (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
   - Modal elements must include ARIA role attributes and keyboard-accessible close buttons.

2. **Styling Standards**:
   - Always reuse existing CSS variables from `:root` in `styles.css`.
   - Maintain mobile-first responsive breakpoints (`@media (max-width: 868px)`).
   - Use smooth CSS transitions (`transition: all 0.2s ease`) for interactive buttons and hover states.
