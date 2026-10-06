# Search Performance Tracking

## Scope

Investigated search/filter responsiveness on a large photo library and made one focused optimization to date-based ordering in `GalleryApp.getFilteredPhotos()` (`app.js`). Search field matching and the order/composition of category, city, tag, collection, and search filters are unchanged.

## Bottleneck identified

The broad-search path filters photos and then sorts matching results by newest or recently viewed. Before the change, each sort comparator constructed two `Date` objects per comparison, repeatedly parsing timestamps for the same photos. On a 30,000-photo library where all photos matched `mount`, instrumentation counted 637,410 timestamp parses for the newest sort. This repeated work—not the text matching itself—was the measured hot path.

## Focused change

Precompute one timestamp per already-filtered photo before sorting. Both newest and recently-viewed ordering retain the same descending timestamp order; recently viewed retains its ID tie-breaker. Since timestamps are computed only for the filtered results, existing filter composition and query matches are preserved.

## Before/after evidence

Synthetic benchmark: 30,000 photos with the same generated titles, authors, categories, cities, tags, and varied valid timestamps; broad query `mount` matches all photos. Measurements use the search/filter/sort method and exclude DOM rendering.

| Measure | Before | After |
|---|---:|---:|
| Timestamp parses for one newest-order search | 637,410 | 30,000 |
| Median elapsed time, six broad-search sort runs | 177.9 ms | 41.3 ms |

The median comparison used the previous repeated-parse comparator and the optimized `getFilteredPhotos()` path over the same in-memory data in one Node process. It reduced the measured elapsed time by about 77% and timestamp parses by about 95%. Timing is synthetic and should be treated as directional, not a browser-rendering benchmark.

## Regression coverage

`test/search-performance.test.js` verifies:

- Search still matches title, author, category, city, and tag text.
- Category, city, tag, collection, and text-search filters compose before newest ordering.
- Newest and recently-viewed ordering parse one timestamp per result, rather than once per sort comparison.

Validation: `npm test` and `node --check app.js`.
