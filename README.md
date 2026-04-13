# SheetSite

Static site generator that uses Google Sheets as a content backend. Built with Astro 5.x and Tailwind CSS — no CMS, no database, no login required.

Non-technical teams edit a spreadsheet; the site rebuilds from CSV at build time.

## How It Works

```
Google Sheet (public CSV) → Astro build → Static HTML
```

A public Google Sheet acts as the data source. Each sheet tab maps to a specific concern:

| Tab | Purpose |
|-----|---------|
| `_config` | Site name, description, footer text |
| `_nav` | Navigation links and ordering |
| `_pages` | Page registry — slug, title, meta description, template type |
| `{slug}` | Page content — one tab per page with section definitions |

Pages are composed of **sections** defined by `section_order`, `section_type`, and key/value props. The `SectionRenderer` dispatches each section type to its corresponding component.

### Available Section Types

- **hero** — Full-width banner with title, subtitle, CTA, and optional background image
- **features** — Grid of feature cards (`item_N_title`, `item_N_desc`)
- **testimonials** — Quote cards (`item_N_quote`, `item_N_author`, `item_N_role`)
- **text_block** — Title + rich text content
- **image_text** — Side-by-side image and text with configurable position
- **cta_banner** — Call-to-action strip with button
- **form** — Dynamic form generated from `field_N_*` props, submits to a webhook
- **directory_header** / **directory_item** — Filterable card directory (team pages, listings, etc.)

### Page Templates

- **landing** — Renders sections sequentially
- **directory** — Hero + filterable grid of directory items

## Quick Start

### 1. Create the Google Sheet

Run the included Apps Script to scaffold a demo spreadsheet with sample data:

1. Go to [script.google.com](https://script.google.com) and create a new project
2. Paste the contents of `setup-sheet.gs`
3. Run `setupSheetSite` and authorize when prompted
4. Copy the logged Spreadsheet ID
5. Share the spreadsheet: **Anyone with the link → Viewer**

### 2. Configure and Run

```bash
cp .env.example .env
# Paste your Spreadsheet ID into .env

npm install
npm run dev       # Dev server at localhost:4321
```

### 3. Build for Production

```bash
npm run build     # Static output in dist/
npm run preview   # Preview the build locally
```

## Project Structure

```
src/
├── data/
│   ├── sheets.ts          # CSV fetch, parse, validate
│   └── types.ts           # TypeScript interfaces
├── components/
│   ├── sections/          # Hero, Features, Form, etc.
│   ├── directory/         # DirectoryGrid, DirectoryCard, DirectoryFilter
│   ├── SectionRenderer.astro
│   ├── Navigation.astro
│   ├── Footer.astro
│   └── SkipLink.astro
├── layouts/
│   └── Layout.astro       # HTML shell
├── pages/
│   ├── [...slug].astro    # Dynamic routes from _pages tab
│   └── thank-you.astro    # Form success page
└── styles/
    └── global.css
```

## Stack

- [Astro 5.x](https://astro.build) — Static site generator
- [Tailwind CSS 3.x](https://tailwindcss.com) — Utility-first CSS
- TypeScript (strict mode)
- Vanilla JS for client-side interactivity (form handling, directory filtering)

## Adding a New Page

1. Add a row to the `_pages` tab: `slug | title | meta_description | template`
2. Create a new tab named after the slug
3. Add rows with `section_order | section_type | prop_key | prop_value`
4. Rebuild the site

## Adding a New Section Type

1. Create a component in `src/components/sections/`
2. Add the type to `VALID_SECTION_TYPES` and `REQUIRED_PROPS` in `src/data/sheets.ts`
3. Add the mapping in `src/components/SectionRenderer.astro`

## Environment

| Variable | Description |
|----------|-------------|
| `SPREADSHEET_ID` | Public Google Sheet ID (see `.env.example`) |

## License

MIT
