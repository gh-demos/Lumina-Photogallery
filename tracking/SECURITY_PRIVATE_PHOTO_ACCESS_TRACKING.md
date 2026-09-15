# Security: Private Photo Access Tracking

## Status

Completed and validated. This document records delivery readiness only; no pull request, commit, push, or branch change was performed.

## Scope

Removed a persistent, cross-action "unlock" cache for private photos and replaced it with per-action password gating. Opening the detail/lightbox view, downloading the full-resolution image, and liking a private photo now each require their own fresh password entry, with no residual state that could silently authorize a later action. Also stopped the real full-resolution `imageUrl` from ever being placed into the gallery grid's DOM for private photos, and disclosed to users that the password is a soft, client-side organizational lock rather than real access control.

## Changed Files

- `app.js`: unlock/gating logic — constructor (removed `unlockedPhotoIds`, added `pendingUnlockPhotoId`/`pendingUnlockAction`), `promptUnlock(photoId, action)`, `handleUnlockSubmit`, `toggleLike`/`performToggleLike`, `downloadPhoto`/`performDownload`, `openDetailModal`/`performOpenDetailModal`, `createCardHTML`, `hideModal`, new `dismissUnlockModal()`, `bindEvents` dismiss wiring (close button, cancel button, Escape key, backdrop click).
- `index.html`: unlock modal disclosure copy and `aria-describedby` wiring on the password field.
- `test/private-photo-unlock.test.js`: new file, 9 tests covering re-prompt-per-action, no cross-action bypass (an "open" unlock does not authorize download or like, and vice versa), thumbnail never leaking the real `imageUrl` for private photos before or after unlock, non-private zero-friction behavior, and dismiss clearing pending unlock state.

## Review Outcomes

| Review | Outcome |
| --- | --- |
| Security review (gallery-security-reviewer) | PASS — confirmed no full-resolution `imageUrl` leaks into the DOM before a fresh authorization, no persistent unlock cache, no new injection/XSS risk, and disclosure copy present. Flagged two low-severity residual issues (stale pending-unlock fields on modal dismiss; `detailImg.src` lingering after modal close) — both fixed in a follow-up pass and re-verified. |
| State review (gallery-state-reviewer) | PASS with one medium finding (stale pending-unlock fields on cancel/Escape/backdrop-click were not cleared) — fixed via new `dismissUnlockModal()`, re-verified. |
| Accessibility review (gallery-accessibility-reviewer) | PASS — no regressions from the copy change; suggested wiring the description into `aria-describedby`, which was applied. |
| Test engineer (gallery-test-engineer) | Added 9 new tests; full suite 24/24 passing, no bugs found. |
| Final quality review (gallery-quality-reviewer) | PASS, no blocking issues. Noted as non-blocking: `performToggleLike`'s conditional call to `updateDetailModalContent` relies on an implicit invariant that `selectedPhotoId` can only reference an already-unlocked private photo; server-side enforcement remains out of scope/a known limitation. |

## Validation Evidence

- [x] `npm test`: 24 passed, 0 failed (15 pre-existing across `image-url-allowlist.test.js` and `share-collection.test.js`, plus 9 new in `private-photo-unlock.test.js`).
- [x] `node --check app.js`: completed successfully (checked at each implementation step).
- [x] Manual/code-path review confirming no remaining reference to `unlockedPhotoIds` or `openOrPromptUnlock` anywhere in `app.js`.
- [x] Clean diagnostics for changed files.

## Known Limitation

Carries forward the same limitation noted in `tracking/SECURITY_IMAGE_URLS_TRACKING.md`: this is a client-side, UI-level soft lock only. The password is stored and compared in plain JavaScript/`localStorage` and is visible or bypassable to anyone with DevTools or same-origin script access. It is not real access control or encryption, and this is now explicitly disclosed to users in the unlock modal copy. Production-grade private-photo confidentiality would require server-side authentication/authorization and protected image delivery.

## Proposed Pull Request Description

### Summary

Previously, a single in-memory `unlockedPhotoIds` flag permanently authorized a private photo for the rest of the browser session after one correct password entry, silently gating three independent actions (open, download, like) with a single check, and the same flag drove thumbnail rendering — meaning an unlocked private photo's real full-resolution `imageUrl` was embedded in the gallery grid's `<img src>` on every subsequent render, well outside the detail modal. Replace this with per-action gating: `promptUnlock(photoId, action)` re-prompts for the password independently for `"open"`, `"download"`, and `"like"`, with no cross-action bypass and no persistent unlock cache. The gallery grid thumbnail check is now unconditionally based on `photo.isPrivate`, so the real image data is never placed in grid DOM for private photos. The detail modal's image `src` is cleared on close, and pending unlock state is cleared on dismiss (close button, cancel, Escape, backdrop click). The unlock modal copy now discloses that this is a soft, client-side organizational lock, not real access control or encryption.

### Validation

- `npm test` (24 passed, 0 failed)
- `node --check app.js`
- Manual review confirming no remaining references to `unlockedPhotoIds` or `openOrPromptUnlock`
- Clean diagnostics for changed files

### Risks or Follow-up

Private-photo protection remains client-side only; the password is visible/bypassable via DevTools or same-origin script access. Server-side authentication/authorization and protected image delivery are required for production-grade confidentiality.
