# PR: Security Image URL Hardening

## Status

Ready to open as a draft pull request. Browser-level security validation remains manual.

## Pull Request Scope

- Enforce an image URL allowlist for both localStorage-loaded records and new uploads.
- Add focused tests for approved and rejected URL forms.
- Record the security hardening evidence and the draft PR delivery details.
- Update the Lumina PR agent policy to require a username-scoped feature branch, commit, push, and validation before opening a PR.

## Source and Target

- Source branch: `omoferacho/harden-image-urls`
- Target branch: `main`
- PR type: Draft

## Image URL Policy

Accepted:

- Strict base64 `data:image/png`, `data:image/jpeg`, `data:image/webp`, and `data:image/gif` URLs.
- Credential-free, default-port HTTPS URLs hosted at `images.unsplash.com`.

Rejected:

- `javascript:`, `file:`, and `blob:` URLs.
- HTTP URLs, untrusted hosts, URL credentials, and non-default HTTPS ports.
- SVG, non-image, and malformed base64 data URLs.

## Changed Files

| File | Change |
| --- | --- |
| `app.js` | Enforces the shared URL normalization boundary for persisted and newly uploaded photo records. |
| `package.json` | Adds the Node built-in test command. |
| `test/image-url-allowlist.test.js` | Adds allowlist and normalization coverage for approved and rejected URLs. |
| `tracking/SECURITY_IMAGE_URLS_TRACKING.md` | Records the security review, remediation, and known limitation. |
| `.github/agents/gallery-pr-agent.agent.md` | Requires a username-scoped feature branch, commit, remote push, and passed validation before PR creation. |
| `tracking/PR_SECURITY_IMAGE_URLS_TRACKING.md` | Records delivery and draft PR evidence. |

## Fleet Activity

| Agent | Outcome |
| --- | --- |
| `gallery-security-reviewer` | Identified URL policy coverage and the separate browser-only private-photo limitation. Final re-review found no client-side image URL findings. |
| `gallery-test-engineer` | Selected Node's built-in test runner and defined the focused URL test matrix. |
| `gallery-agent` | Hardened URL validation and routed newly uploaded records through `normalizePhoto()` before state mutation or persistence. |
| `gallery-quality-reviewer` | Found no regression in the scoped URL change. |
| `gallery-pr-agent` | Prepared the tracking artifact and PR delivery requirements. |

## Validation

- [x] `npm test`: 5 passed, 0 failed.
- [x] `node --check app.js`.
- [x] `git diff --check`.
- [x] Local application returned HTTP `200` from `http://localhost:8080`.
- [x] Editor diagnostics are clear for changed code and tests.

## Known Limitation

Private-photo image data and passwords remain stored in browser localStorage. This demo-only client-side mechanism does not provide real confidentiality or access control. Production protection requires server-side authentication, authorization, and protected image delivery.

## Proposed PR Description

### Summary

- Hardened image URLs loaded from localStorage and created through the upload workflow.
- Allowed only strict raster image data URLs and credential-free default-port Unsplash HTTPS URLs.
- Added focused regression coverage for accepted and rejected image URL forms.

### Validation

- `npm test`
- `node --check app.js`
- `git diff --check`
- Local application HTTP response check
- Security and quality reviews

### Risks or Follow-Up

- Browser-level validation remains manual, so this pull request is a draft.
- Private-photo localStorage protection remains demo-only and needs server-side authorization for production use.
