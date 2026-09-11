# Lumina Photo Gallery

Lumina is a demo photo gallery publishing application built with vanilla HTML, CSS, and JavaScript. It demonstrates interactive gallery features alongside a custom GitHub Copilot agent fleet for implementation, review, testing, security hardening, and release preparation.

## Features

- Browse a responsive gallery of sample photos.
- Upload images from the file picker or by drag and drop.
- Validate uploads as image files no larger than 10 MB.
- Preview uploads safely before publishing.
- Like, bookmark, rate, comment on, and download photos.
- Create, rename, delete, and filter photo collections.
- Add, remove, normalize, and filter photo tags.
- Search by photo title, photographer, category, city, and tag.
- Filter by category, city, tag, collection, saved photos, and Recently Viewed.
- Track up to 20 recently viewed photos in most-recent-first order.
- Mark photos as private and prompt for a password before normal in-app viewing or downloading.
- Persist photos, collections, and recently viewed history in browser local storage.

## Run Locally

Prerequisites: Node.js 18 or later.

```bash
npm install
npm start
```

Open `http://localhost:8080` in a browser. If port `8080` is already in use, the server retries on the next port.

For development with automatic server restart:

```bash
npm run dev
```

## Project Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Semantic page structure and gallery dialogs. |
| `styles.css` | Responsive gallery styling, interaction states, and modal layouts. |
| `app.js` | Gallery state, local storage persistence, filtering, uploads, comments, tags, collections, and interactions. |
| `server.js` | Minimal Express server for static assets. |
| `.github/agents/` | Custom Copilot agents for the Lumina delivery fleet. |
| `.github/instructions/` | Repository instructions for accessibility, gallery UI, and JavaScript state. |
| `*_TRACKING.md` | Delivery, defect, upload, recently viewed, and security tracking evidence. |

## Demo Workflows

### Upload Validation

1. Select or drag an image smaller than 10 MB.
2. Confirm its preview appears, add metadata, then publish it.
3. Try a non-image or a file over 10 MB to see the accessible error message.

### Tags and Collections

1. Open a photo detail dialog.
2. Add tags as a comma-separated list or remove an existing tag.
3. Create a collection from the Collections dialog.
4. Add the photo to the collection, then filter the gallery by that collection.

### Recently Viewed

1. Open a few photo detail dialogs.
2. Select Recently Viewed from the category filter bar.
3. Confirm photos are ordered by the time they were opened.
4. Refresh the page to confirm viewing history is retained.

## Local Storage

Lumina stores client-side state under these keys:

| Key | Data |
| --- | --- |
| `lumina_photos` | Published photos, likes, comments, ratings, bookmarks, tags, and upload metadata. |
| `lumina_collections` | Collection names, descriptions, cover-photo IDs, and photo membership. |
| `lumina_recently_viewed` | Up to 20 unique photo IDs with viewing timestamps. |

Stored data is normalized before use. The application validates photo identifiers and image URLs, ignores malformed persisted records, and escapes user-controlled text before dynamic HTML rendering.

## Copilot Agent Fleet

The project includes a focused custom-agent fleet in `.github/agents/`.

| Agent | Responsibility |
| --- | --- |
| `gallery-orchestrator` | Coordinates feature delivery and specialist reviews. |
| `gallery-agent` | Implements gallery features and approved fixes. |
| `gallery-state-reviewer` | Reviews persistence, event handling, state cleanup, and dynamic rendering safety. |
| `gallery-accessibility-reviewer` | Reviews semantic controls, dialogs, focus, keyboard access, and responsive usability. |
| `gallery-quality-reviewer` | Performs final regression, requirements, and scope review. |
| `gallery-test-engineer` | Adds focused regression and workflow coverage. |
| `gallery-e2e-tester` | Validates complete browser workflows. |
| `gallery-security-reviewer` | Reviews local storage, XSS, upload, URL, and private-photo risks. |
| `gallery-performance-reviewer` | Assesses rendering, search, filters, and image-loading performance. |
| `gallery-data-migration-agent` | Safely evolves local storage schemas. |
| `gallery-ux-reviewer` | Reviews workflow discoverability, feedback, and recovery. |
| `gallery-documentation-agent` | Produces demo guides, checklists, and tracking artifacts. |
| `gallery-release-manager` | Consolidates evidence into a release decision. |
| `gallery-pr-agent` | Prepares and opens review-ready pull requests. |

Example prompt:

```text
Use gallery-orchestrator to add a Featured Photos filter to Lumina.

Requirements:
- Users can feature and unfeature a photo.
- Featured state persists in localStorage.
- The new filter composes with search, tags, collections, and sorting.
- Delegate state, accessibility, test, and final-quality reviews.
- Create FEATURE_FEATURED_PHOTOS_TRACKING.md.
```

## Validation

The current project provides these lightweight checks:

```bash
node --check app.js
npm start
```

The tracking documents include focused manual verification checklists. Automated browser tests are not currently configured.

## Security Note

Lumina's private-photo feature is designed for a workshop/demo user experience. It is not production access control: private image data and passwords stored in browser local storage can be read or altered by someone with browser-profile or same-origin access.

Production private photos require server-side authentication and authorization, password verification outside the browser, and protected image delivery.

## License

MIT. See `package.json`.
