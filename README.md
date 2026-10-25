# Mara Voss portfolio (Vue 3 + Vite)

A single-artist portfolio: a filterable, year-grouped gallery driven by a spreadsheet,
plus About and Contact pages. A small Vue 3 app with hash routing, so it drops onto any
static host with no rewrite rules.

## Requirements

Node 18+ and pnpm (npm and yarn work too — swap the command).

## Run

```sh
pnpm install
pnpm dev        # local preview
pnpm build      # outputs dist/, host it anywhere (hash routing, relative paths)
pnpm preview    # serve the built dist/ locally
```

## Your catalog

Edit** **`public/catalog.xlsx` (or replace it with** **`public/catalog.csv`). One row per work:


| column          | notes                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| `file`          | file name (looked up in`public/images/`) or a path / URL                             |
| `title`         | also accepts`name`                                                                   |
| `year`, `month` | month optional, number or name. A single`date` column also works                     |
| `medium`        | free text. Filter groups come from keywords in`src/lib/catalog.js` (`MEDIUM_GROUPS`) |
| `size`          | free text, or use`width`, `height`, `unit`                                           |
| `thumb`         | optional smaller image for the grid                                                  |
|                 |                                                                                      |



The loader accepts** **`.xlsx`,** **`.xls` and** **`.csv`, reads the first sheet, and expects a header
row. It looks for** **`public/catalog.xlsx` first, then** **`public/catalog.csv`; if neither exists
the site falls back to the sample works in** **`src/lib/catalog.js`.

## Images

* Put full-size images in** **`public/images/`.** **`file` in the sheet can be a bare filename
  (`held-light.jpg` →** **`/images/held-light.jpg`), a path (`images/paintings/x.jpg`) or a full
  URL. Paths and URLs are used as-is.
* `thumb` is optional. If omitted, the grid reuses the full image; a separate thumbnail
  keeps the grid light and lets you crop to a consistent shape.
* To make a printable template, open the Catalog panel and use** ****Download CSV**.

## Previewing a catalog privately

The** ****Catalog** button in the header opens an import panel. A sheet and matching images
selected there replace the published catalog** ***in that browser only* (saved under the
`art-catalog-import` localStorage key, images re-derived from the** **`file` column on reload).
**Back to published catalog** clears it. Nothing imported here changes the live site.

## Customising

* `src/content/site.js` — name, location, timezone, email, availability, About copy,
  enquiry types.** **`contactEndpoint` is empty by default: while empty the contact form opens
  the visitor's mail app; set it to a Formspree / Netlify / own endpoint to POST directly.
* `src/lib/catalog.js` —** **`MEDIUM_GROUPS` (keyword → filter bucket),** **`SAMPLE_ROWS`,
  `TEMPLATE_CSV`.
* `src/style.css` — colour, type, spacing tokens (`--paper`,** **`--ink`,** **`--gap`, …). Component
  styles live in each** **`.vue` file.

## Accessibility notes

* Skip link focuses** **`<main>`.
* The lightbox and Catalog dialogs trap Tab, restore focus to the opener, and lock
  background scroll.
* Filters are** **`aria-pressed` buttons with live result counts.
* `prefers-reduced-motion` disables transitions and smooth scrolling.

## Deployment

`pnpm build` produces** **`dist/` with hashed asset names. Routing uses hash history, so
serving** **`index.html` for every path is not required. Image and catalog URLs go through
`import.meta.env.BASE_URL`; if the site lives in a subfolder, set** **`base` in
`vite.config.js` to match and rebuild.

## Where things live

* `src/content/site.js`: name, email, About copy, contact settings
* `src/lib/catalog.js`: sheet parsing,** **`resolveSrc`, medium groups, samples, template
* `src/composables/`:** **`useCatalog` (one shared catalog store),** **`useColumns` (responsive grid)
* `src/components/gallery/`: intro, filters, year groups, cards, index, lightbox
* `src/components/`: header, footer, catalog import panel
* `src/views/`: Gallery, About, Contact pages
* `src/style.css`: colour, type and spacing tokens

## Provenance and credits

The layout is built on a Tooplate template; the sample rows in** **`src/lib/catalog.js` still
reference the** **`tooplate-exhibit-*.jpg` /** **`thumb-exhibit-*.jpg` image set.

Everything else in** **`src/content/site.js` — the name "Mara Voss", the studio, the statement,
the About and approach copy — is placeholder content written while assembling this site. It
is not a real person and did not come from the Tooplate template or from any reference
photos. Replace it with the artist's real details before publishing. The sample catalog
rows are likewise fictional.
