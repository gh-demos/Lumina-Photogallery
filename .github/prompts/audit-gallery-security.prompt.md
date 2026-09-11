---
description: "Audit security vulnerabilities including XSS in comments/titles, client-side file upload handling, and LocalStorage data integrity"
---

# Audit Gallery Security Prompt

Conduct a security audit of the Lumina Photo Gallery publishing platform code (`index.html`, `styles.css`, `app.js`, `server.js`).

## Checkpoints
1. **XSS Prevention**: Check that all user-supplied strings (comments, titles, photographer names, tags) are sanitized with `escapeHTML` before rendering into HTML templates.
2. **File Upload Safety**: Check that `FileReader` and file inputs validate MIME types (`image/*`) and file size limits before processing data URLs.
3. **Data Integrity**: Verify that `localStorage` parsing handles syntax errors gracefully and fallback default data is safely restored.
4. **Download Safety**: Verify that image download links use proper filename sanitization and local blob/data URL handling.
