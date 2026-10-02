# Red Team vs. Repair Team: Malicious localStorage Payload Demo

## Status

Completed and validated. This document records delivery readiness only; no pull request, commit, push, or branch change was performed.

## Scenario

Constructed a single malicious `lumina_photos` photo record plus a malicious `lumina_collections` record combining five distinct attack vectors, then verified `app.js`'s existing ingestion pipeline (`loadPhotos` → `normalizePhoto` → `normalizeComment`, `loadCollections`) against them.

## Payload Used

Malicious photo record (targets: attribute-breaking id, script-tag title, `javascript:` image URL, malformed comments):

```json
{
  "id": "photo-1\"><img src=x onerror=alert(1)>",
  "title": "<script>alert('xss-title')</script>",
  "author": "Eve",
  "category": "Nature",
  "imageUrl": "javascript:alert(document.cookie)",
  "comments": [
    { "author": "Mallory" },
    { "text": "no author" },
    "not-an-object",
    null,
    42,
    { "author": "Real User", "text": "This one is legitimate" }
  ]
}
```

Malicious collection record (targets: invalid/nonexistent photo id references, including the malicious photo's own broken id):

```json
{
  "id": "collection-evil",
  "name": "Evil Collection",
  "photoIds": ["photo-1\"><img src=x onerror=alert(1)>", "does-not-exist", "photo-1"],
  "coverPhotoId": "does-not-exist"
}
```

## Security Findings (per element, verified against real app.js source)

| # | Payload element | Verdict | Mechanism / citation |
| --- | --- | --- | --- |
| 1 | `id` breaks out of an HTML attribute (`"`, `>`) | Already blocked | `normalizePhoto` (app.js) requires `/^[A-Za-z0-9_-]+$/.test(id)`; any other character causes the entire record to be dropped (returns `null`), and `loadPhotos` filters out nulls via `.filter(Boolean)`. |
| 2 | `title` contains a raw `<script>` tag | Already blocked | The title is stored as-is, but every place it reaches the DOM either passes through `escapeHTML(photo.title)` (`createCardHTML`) or is assigned via `.textContent` (`updateDetailModalContent`'s `detailTitle`), neither of which parses HTML. |
| 3 | `imageUrl` uses the `javascript:` scheme | Already blocked | `isSafeImageUrl` only accepts a strict raster `data:image/...;base64,...` regex or `https://images.unsplash.com` with no credentials/port; `javascript:` satisfies neither branch, so `normalizePhoto` returns `null` and the whole photo is dropped. |
| 4 | Malformed `comments` entries (partial objects, a string, `null`, a number) | Already blocked | `normalizeComment` rejects non-object comments and requires non-empty `author` and `text`; `normalizePhoto` maps every comment through `normalizeComment` and `.filter(Boolean)`s out the nulls, so only the one well-formed comment survives. |
| 5 | `collection.photoIds` / `coverPhotoId` reference invalid or nonexistent photo ids | Already blocked | `loadCollections` builds a `Set` of real photo ids from `this.photos`, filters `collection.photoIds` down to ids present in that set, dedupes via `Set`, and only accepts `coverPhotoId` if it survived that same filter (otherwise falling back to the first valid id or `null`). |

**Conclusion**: All 5 payload elements were already fully neutralized by prior hardening work (see `tracking/SECURITY_IMAGE_URLS_TRACKING.md`, `tracking/SECURITY_LOCAL_STORAGE_RENDERING_TRACKING.md`, `tracking/SECURITY_COMMENTS_RATINGS_HARDENING_TRACKING.md`, `tracking/SECURITY_PRIVATE_PHOTO_ACCESS_TRACKING.md`). No exploitable gap existed in the ingestion path.

## Fix Applied (defense-in-depth, not a gap closure)

A security review pass additionally flagged that `createCardHTML`'s `<article class="photo-card" data-id="${photo.id}">` interpolated `photo.id` without `escapeHTML`, unlike every other field in the same template. This was **not currently exploitable** — `normalizePhoto`'s id regex guarantees only `[A-Za-z0-9_-]+` ever reaches `this.photos` — but it removed an implicit reliance on that upstream invariant.

**Change**: `app.js`, inside `createCardHTML(photo)`:

```diff
-      <article class="photo-card" data-id="${photo.id}">
+      <article class="photo-card" data-id="${this.escapeHTML(photo.id)}">
```

No other lines, files, UI, or existing behavior were changed. `escapeHTML` only affects `& < > " '`, none of which can appear in a regex-validated id, so this is a no-op for all legitimate photos and is fully backward compatible.

## Post-Fix / Post-Confirmation Application Behavior

Verified via `loadPhotos()` / `normalizePhoto()` / `loadCollections()` in `test/red-team-repair-team-demo.test.js`:

- The malicious photo record (any id-breaking or `javascript:`-URL variant) is dropped entirely; it never enters `this.photos`.
- Malformed comment entries are filtered out of a photo's `comments` array; only well-formed `{author, text}` entries survive.
- The malicious collection's `photoIds` is filtered down to only ids that exist among loaded photos, `coverPhotoId` falls back safely, and no exception is thrown during load or render.
- `createCardHTML` output for a photo with a script-tag title contains the escaped form (`&lt;script&gt;`) and never the raw `<script>` tag.

## Fleet: Agents Invoked and Contributions

| Agent | Contribution |
| --- | --- |
| `gallery-agent` | Created `test/red-team-repair-team-demo.test.js` reproducing the combined payload against `loadPhotos`/`normalizePhoto`/`normalizeComment`/`loadCollections`/`createCardHTML`; applied the one-line `escapeHTML(photo.id)` defense-in-depth fix in `createCardHTML`; ran `npm test` and `node --check app.js` after each change. |
| `gallery-security-reviewer` | Independently re-verified all 5 payload elements against the real `app.js` source, confirmed the new test file's assertions match actual code behavior (no false sense of security), and flagged the unescaped `data-id` attribute as a defense-in-depth gap. |
| `gallery-quality-reviewer` | Performed a final read-only review of the one-line fix and the new test file, confirmed no regression risk (verified `card.dataset.id` reads are unaffected since escaping is a no-op for valid ids), confirmed no scope creep or unrelated file changes, and approved with one minor non-blocking observation about test assertion redundancy. |

## Validation Evidence

- [x] `npm test`: 30 passed, 0 failed (24 pre-existing + 6 new red-team tests), both before and after the `escapeHTML(photo.id)` fix.
- [x] `node --check app.js`: completed successfully (exit code 0) after the fix.
- [x] New test file: `test/red-team-repair-team-demo.test.js`.
- [x] Changed file: `app.js` (one line in `createCardHTML`).
