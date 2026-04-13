# SheetSite

POC: Astro 5.x + Google Sheets as CMS-free content pipeline.

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # Static build to dist/
npm run preview   # Preview built site
```

## Stack

Astro 5.x, Tailwind CSS 3.x (NOT v4), TypeScript strict, Vanilla JS (ES2015+).

## Architecture

- `src/data/sheets.ts` — CSV fetch + parse + validate from Google Sheets
- `src/data/types.ts` — All TypeScript interfaces
- `src/components/sections/` — Landing page section components
- `src/components/directory/` — Directory template components
- `src/components/` — Layout-level components (Navigation, Footer, SkipLink, SectionRenderer)
- `src/layouts/Layout.astro` — HTML shell
- `src/pages/[...slug].astro` — Dynamic routes from `_pages` sheet tab

## Key Patterns

- Data flows from Google Sheets public CSV → sheets.ts → page components
- SectionRenderer.astro dispatches `section_type` to the correct component
- Forms are generated dynamically from `field_N_*` props in sheet data
- Build-time validation logs warnings but never breaks the build

## Design Tokens (TW v3)

primary: #173e38, accent: #e9bc50, charcoal: #262626, cream: #f8f5f2
Fonts: EB Garamond (headings), Open Sans (body)

## Accessibility

WCAG 2.2 AA target. Semantic HTML, skip link, visible focus, aria attributes on forms/nav.
Target audience: older demographics — max browser compat, large readable fonts, clear contrast.

## Browser Compatibility

Safari 14+, Chrome 80+, Firefox 78+, Edge 80+.
No optional chaining in client-side JS. Use `var` and `function` declarations.

## Environment

`SPREADSHEET_ID` in `.env` — public Google Sheet ID.
