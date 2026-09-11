---
description: "Add one or multiple new photo category filter chips, dropdown options, and sample photo dataset entries"
argumentHint: "Category names, comma-separated (e.g., 'Wildlife, Street, Drone')"
---

# Add Photo Category Prompt

You are tasked with adding one or multiple new category filters to the Lumina Photo Gallery publishing platform.

## Target Categories
${input:categoryNames:What category name(s) would you like to add? (Comma-separated for multiple)}

## Instructions
1. **Parse Input**: Parse `${input:categoryNames}` into a list of categories (splitting by comma if multiple are provided).
2. **HTML Filter Chips**: In `index.html`, for each new category, add a `<button class="category-chip" data-category="CategoryName">CategoryName</button>` inside `#categoryContainer`.
3. **Modal Dropdown**: In `index.html`, add an `<option value="CategoryName">CategoryName</option>` for each category inside the `#photoCategory` select element in the upload modal.
4. **Data & Schema**: In `app.js`, add sample photo objects under `DEFAULT_PHOTOS` for each new category with relevant Unsplash image URLs and tags.
5. **Validation**: Verify that `app.js` category filtering and sorting work smoothly for all new categories.
