# PR: localStorage Rendering Security Hardening — data-id Escaping

## Status

Committed and pushed to existing branch/PR. Ready for review.

## Pull Request Scope

- Escape `photo.id` before interpolating it into the gallery card's `data-id` attribute in `createCardHTML()` (`app.js`).
- Defense-in-depth: `photo.id` is already regex-restricted by `normalizePhoto()`, so this closes the one remaining inconsistently-escaped identifier field.
- No behavior change for valid data; no server.js changes.

## Source and Target

- Source branch: `omoferacho/image-url-escape-hardening`
- Target branch: `main`
- Reuses existing open PR #2 (`Harden gallery card img src against XSS/attribute-breakout`), which already targets this branch/base.

## Audit Scope Reviewed

Photo ids, titles, authors, descriptions, tags, comments, collection names, image URLs, and download links loaded from `localStorage` (`lumina_photos`, `lumina_collections`, `lumina_recently_viewed`). All fields other than the card `data-id` were already correctly escaped or allowlist-validated.

## Fleet Activity

| Agent | Verdict | Notes |
| --- | --- | --- |
| `gallery-security-reviewer` (pre-fix) | Finding | Identified the unescaped `data-id` interpolation as the one remaining gap; not currently exploitable since ids are regex-restricted, but inconsistent with other escaped fields. |
| `gallery-security-reviewer` (post-fix) | PASS | Confirmed the fix closes the gap and introduces no new issues. |
| `gallery-state-reviewer` | PASS | Confirmed no regression to persistence, event binding, or rendering for valid data. |

## Validation

- [x] `npm test` (`node --test`): 5/5 tests passed in `test/image-url-allowlist.test.js`, 0 failed.
- [x] Security review (before fix): finding identified.
- [x] Security review (after fix): PASS, no regressions.
- [x] State review: PASS, no regressions.

## Residual / Known Limitation (informational, not remediated by this PR)

Private-photo protection is enforced client-side only: the lock password is stored in plaintext in `localStorage`. This is not an injection vector and is unrelated to the escaping fix above, but it means private photos are not confidential against anyone with access to the browser profile or DevTools on the same origin. Real confidentiality requires server-side authentication/authorization and protected image delivery.
