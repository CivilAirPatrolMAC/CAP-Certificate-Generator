# CAP Certificate Generator

A lightweight browser app for creating **Civil Air Patrol cadet achievement certificates** with a guided form, live certificate preview, and one-click PDF export.

## What This App Does

- Lets you select a cadet achievement and auto-fills:
  - Achievement title
  - Cadet rank
  - Rank insignia image
- Updates the on-screen certificate preview as you type
- Formats dates with ordinal day text (example: `10th Day of January 2026`)
- Exports a finished certificate PDF directly in the browser using [`pdf-lib`](https://pdf-lib.js.org/)
- Names the downloaded file from the cadet name (example: `jane-doe-certificate.pdf`)

## Tech Stack

- Plain HTML, CSS, and JavaScript (no build pipeline)
- [`pdf-lib`](https://pdf-lib.js.org/) loaded from CDN in `index.html`
- Static certificate assets (`template.pdf`, `template-preview.png`, rank images)

## Repository Layout

```text
.
├── index.html             # App UI and form fields
├── styles.css             # Layout, form styling, and preview styling
├── script.js              # Form sync, date formatting, and PDF generation
├── template.pdf           # Base PDF template used for export
├── template-preview.png   # Background image used in live preview
├── ranks/                 # Rank insignia images mapped by achievement
└── images/                # Supporting image assets
```

## Requirements

- A modern browser (Chrome, Edge, Firefox, Safari)
- A local web server (recommended; see below)
- Internet access (for CDN-hosted `pdf-lib`)

## Quick Start

Because the app loads local files (PDF and image assets), run it with a local server.

### Option 1: Python HTTP Server

```bash
python3 -m http.server 8000
```

Open: <http://localhost:8000>

### Option 2: VS Code Live Server

1. Open the repository in VS Code.
2. Right-click `index.html`.
3. Select **Open with Live Server**.

## Usage Flow

1. Select an achievement.
2. Confirm auto-filled achievement title and cadet rank.
3. Enter/edit certificate details:
   - Cadet name
   - Promotion date
   - Unit line
   - Signature names and signature titles
4. Review live preview content and spacing.
5. Click **Download PDF**.

## Development Notes

- All form-to-preview and export logic lives in `script.js`.
- If a promotion date is not set, today’s date is used by default.
- PDF text and image placement are controlled with percentage-based coordinates.
- Rank insignia mapping is maintained in `RANK_IMAGE_MAP`.

## Customization Guide

To adapt this for another unit or certificate style:

- **`index.html`**: change defaults, labels, and selectable achievements
- **`script.js`**: update field behavior, mapping, and PDF placement
- **`styles.css`**: adjust UI and preview styling
- **`template.pdf` / `template-preview.png`**: replace certificate artwork

## Update Checklist

When changing achievements or assets:

- Verify each achievement option has the correct `data-title` and `data-rank`.
- Confirm each achievement key points to the intended rank image.
- Test preview alignment and text wrapping with long names/titles.
- Export several sample PDFs and verify visual placement in a PDF viewer.

## Troubleshooting

- **Blank or missing preview images:** ensure you are running from a local server, not opening `index.html` directly via `file://`.
- **PDF export does not start:** check browser console for asset loading errors.
- **Wrong rank image appears:** verify the achievement key in the selector matches `RANK_IMAGE_MAP` in `script.js`.

## License

No formal license is currently declared. Add a `LICENSE` file before redistribution or external contribution.
