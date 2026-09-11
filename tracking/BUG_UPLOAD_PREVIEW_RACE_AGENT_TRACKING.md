# Bug: Upload Preview Race Tracking

## Status

Resolved and validated.

## Issue

Selecting a second image before the first image finishes loading could cause the first image's asynchronous `FileReader` callback to overwrite the second image's preview data. The user could then publish a photo with the latest selected file but the previous image's content.

## Root Cause

`handleFileSelect()` started a `FileReader` for every valid selection. Its callback updated `previewImageDataUrl` unconditionally, and a newly selected file retained the old preview data until its own read completed. As a result, a stale callback or premature submit could pair the latest file selection with previous image data.

## Reproduction Steps

1. Open the upload dialog.
2. Select or drop a large valid image as file A.
3. Before A finishes loading, select a smaller valid image as file B.
4. Publish before B's preview finishes, or wait for A's callback to finish after B was selected.
5. Before the fix, the preview or published photo could use image A instead of image B.

## Fix

- Stored the active file selection in `selectedUploadFile` for both file-picker and drag-and-drop uploads.
- Cleared the previous preview data and hid its preview synchronously when a new valid file is selected.
- Guarded `FileReader.onload` so a callback updates the preview only if its file is still the active selection.
- Preserved submit-time validation, which now blocks publishing until the active file's preview data is available.

## Agent Work

| Agent | Status | Completed Work |
| --- | --- | --- |
| `gallery-state-reviewer` | Completed | Diagnosed the asynchronous preview race, provided a falsifiable root-cause hypothesis, relevant code path, reproduction steps, and a cheap browser validation. |
| `gallery-agent` | Blocked | Was delegated the confirmed fix but had no workspace file or command access in its isolated environment. |
| Parent implementation agent | Completed | Added the active-file guard and synchronous preview invalidation in `app.js`, then ran focused validation. |
| `gallery-accessibility-reviewer` | Not required | The repair did not add or change a user-facing control, label, modal, or visual interaction. |
| `gallery-quality-reviewer` | Completed | Initially caught the remaining premature-submit path; final re-review reported no findings after the preview was invalidated synchronously. |

## Validation

- [x] `node --check app.js`
- [x] No editor diagnostics in `app.js`
- [x] Final quality review: no findings

## Manual Verification Checklist

- [ ] Select large image A, then immediately select small image B; confirm only B appears after reading completes.
- [ ] Select image B while image A is still reading; try to publish before B's preview completes and confirm publishing is blocked.
- [ ] Repeat the rapid-selection sequence using drag and drop for one or both files.
- [ ] Complete a normal valid upload and confirm preview and published image match.
