---
description: "Accessibility (a11y) standards for generating HTML UI components"
applyTo: "**/*.html"
---

# Accessibility (a11y) Standards

When generating or modifying HTML markup in this workspace, follow these accessibility rules:

1. **Semantic Interactive Controls**: Always use proper `<button>` or `<a>` elements for clickable items rather than `<div>` or `<span>` with click listeners.
2. **Icon-Only Buttons**: Any button containing only an icon (e.g. FontAwesome icon) MUST include a descriptive `aria-label` attribute (e.g. `aria-label="Close modal"` or `aria-label="Bookmark photo"`).
3. **Image Alt Text**: Every `<img>` tag must include a descriptive `alt` attribute. Never leave `alt` unassigned.
4. **Modal Dialogue Accessibility**: Modal windows must include `role="dialog"`, `aria-modal="true"`, and an `aria-labelledby` reference matching the modal title heading ID.
