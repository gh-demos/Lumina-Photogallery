# Security: Image URL Hardening Tracking

## Status

Completed and validated. This document records delivery readiness only; no pull request, commit, push, or branch change was performed.

## Scope

Hardened image URL validation before photo records enter gallery state, including persisted records and newly uploaded photos. The work narrows browser image and download targets to a deliberate allowlist.

### Accepted URL Policy

- Strictly valid base64 data URLs with raster MIME types: `image/png`, `image/jpeg`, `image/webp`, and `image/gif`.
- HTTPS URLs whose hostname is exactly `images.unsplash.com`, using the default HTTPS port and no username or password.

### Rejected URL Policy

- Non-image data URLs, SVG data URLs, malformed base64 payloads, and unsupported image MIME types.
- `javascript:`, `file:`, `blob:`, HTTP, and all other protocols.
- Non-Unsplash hosts, hostname lookalikes, URLs carrying credentials, and URLs with an explicit port.

## Changed Files

- `app.js`: validates image URLs with the stricter allowlist, rejects an unsafe normalized upload before it reaches application state, and exposes `GalleryApp` for Node-based tests without running browser initialization.
- `package.json`: adds the `npm test` script using the Node test runner.
- `test/image-url-allowlist.test.js`: adds focused allowlist and normalization tests.

## Review Outcomes

| Review | Outcome |
| --- | --- |
| Security review | Confirmed that unsafe, malformed, credential-bearing, non-default-port, and non-allowlisted image URLs are rejected. |
| Implementation review | Confirmed new uploads and persisted photo normalization share the same image URL policy. |
| Quality review | Confirmed the changes are narrowly scoped, testable with Node's built-in runner, and do not alter `server.js`. |
| Final security review | No remaining client-side image URL allowlist findings. |

## Validation Evidence

- [x] `npm test`: 5 passed, 0 failed.
- [x] `node --check app.js`: completed successfully.
- [x] Local server: `http://localhost:8080` returned HTTP `200`.
- [x] Clean diagnostics for the changed code.

## Known Limitation

Browser `localStorage` does not provide private-photo confidentiality. Image data and private-photo passwords remain accessible or mutable to someone with browser-profile, DevTools, or same-origin script access. Production confidentiality requires server-side authentication and authorization plus protected image delivery.

## Proposed Pull Request Description

### Summary

Harden image URL handling by allowing only strict raster-image base64 data URLs and credential-free, default-port HTTPS URLs from `images.unsplash.com`. Apply the same validation to persisted records and newly uploaded photos, and add focused Node tests for accepted and rejected URL forms.

### Validation

- `npm test` (5 passed, 0 failed)
- `node --check app.js`
- Local server HTTP `200` at `http://localhost:8080`
- Clean diagnostics

### Risks or Follow-up

Private photos remain browser-local data; `localStorage` is not a confidentiality boundary. Server-side access control is required for production private-photo protection.
