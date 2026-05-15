# CAP Certificate Generator

A browser-based certificate builder for Civil Air Patrol units that supports **promotion certificates, annual/recognition awards, and activity certificates** with live preview, drag/scale positioning controls, and export options for PDF, PNG, and batch ZIP workflows.

## Highlights

- Supports three certificate modes:
  - **Cadet Promotion**
  - **Of the Year Awards**
  - **Activities**
- Live WYSIWYG-style preview with:
  - Form-driven text updates
  - Achievement-specific rank insignia and ribbon graphics (promotion mode)
  - Draggable preview elements for layout tuning
  - Per-element preview scaling
- Multiple export formats:
  - Single certificate as **PDF**
  - Single certificate as **PNG**
  - **Bulk generation** from CSV (ZIP output)
- Built-in content safeguards:
  - CAP usage disclaimer modal
  - Blocked-term profanity filter before export
- Smart defaults and convenience behavior:
  - Auto-populated fields
  - Date defaults to today
  - Auto-mapped achievement title/rank fields

## Current Feature Set

### 1) Certificate Type Workflows

The `Certificate Type` selector changes both form inputs and preview behavior.

- **Promotion**
  - Achievement selector (Achievement 2–16)
  - Auto-fills achievement title and cadet rank from selected option metadata
  - Uses mapped rank insignia image (`ranks/`) and ribbon image (`images/`)

- **Award**
  - Large curated list of “Of the Year” award categories
  - Recipient and subtitle fields tailored for recognition certificates

- **Activities**
  - Activity name, recipient, and subtitle inputs
  - Same output pipeline as awards with activity-specific wording

### 2) Preview System

- Preview content updates as users edit the form.
- Preview includes achievement/title/name/rank/unit/date/signers and visual assets.
- Core preview nodes are configurable via internal mapping (`PREVIEW_MAP`).
- A set of draggable/scalable nodes (`PREVIEW_DRAGGABLE_IDS`) can be moved and resized for visual alignment.

### 3) Export Options

- **PDF Export**
  - Uses `pdf-lib` and `template.pdf`
  - Renders text and placement from current form values and adjusted offsets

- **PNG Export**
  - Uses `html2canvas` to capture rendered preview

- **Bulk ZIP Export**
  - Uses `JSZip`
  - CSV-driven generation for promotion and activities field sets

### 4) Data Validation & Safety

- Blocked-term list is compiled into `BLOCKED_TERMS_REGEX` and checked prior to output.
- Includes a guidance checklist that updates by certificate type.
- Includes a disclaimer flow for correct CAP usage context.

## Tech Stack

- **HTML/CSS/Vanilla JavaScript** (no framework/build pipeline)
- External browser libraries loaded via CDN in `index.html`:
  - [`pdf-lib`](https://pdf-lib.js.org/) for PDF generation
  - [`JSZip`](https://stuk.github.io/jszip/) for ZIP packaging
  - [`html2canvas`](https://html2canvas.hertzen.com/) for PNG capture

## Repository Layout

```text
.
├── index.html             # App structure, form controls, preview shell, modals
├── styles.css             # UI layout, form styles, preview styling, modal styling
├── script.js              # App logic, field sync, preview controls, validation, exports
├── template.pdf           # Source certificate PDF used for PDF generation
├── template-preview.png   # Preview background artwork
├── favicon.png            # Browser favicon
├── ranks/                 # Rank insignia images (A2-A16)
└── images/                # Ribbon/supporting images for achievements
```

## Getting Started

Because this app loads local PDF/image assets, use a local web server instead of opening `index.html` with `file://`.

### Option A: Python HTTP Server

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### Option B: VS Code Live Server

1. Open this folder in VS Code.
2. Right-click `index.html`.
3. Choose **Open with Live Server**.

## Usage

1. Pick a **Certificate Type**.
2. Fill in the displayed form fields.
3. Confirm date/unit/signature lines.
4. Adjust preview element positions/scales if needed.
5. Select export format.
6. Download a single file or run a bulk workflow (CSV → ZIP).

## Configuration Notes for Maintainers

- Default field seeds are in `DEFAULTS`.
- Export default is controlled by `DEFAULT_EXPORT_FORMAT`.
- Promotion imagery:
  - Rank insignia paths live in `RANK_IMAGE_MAP`.
  - Ribbon paths live in `RIBBON_IMAGE_MAP`.
- CSV import field whitelists are in `CSV_FIELDS`.
- Draggable preview IDs are listed in `PREVIEW_DRAGGABLE_IDS`.
- Preview text node bindings are defined in `PREVIEW_MAP`.
- Blocked terms live in `BLOCKED_TERMS` and compile to `BLOCKED_TERMS_REGEX`.

## Troubleshooting

- **Images/PDF not loading:** run from a local server (`http://localhost`) rather than `file://`.
- **PDF export fails:** check browser console/network tab for missing assets or CDN failures.
- **No ZIP output in bulk mode:** verify CSV headers match required `CSV_FIELDS` keys for selected type.
- **Wrong rank/ribbon image:** verify achievement key strings match map keys exactly.

## License

No formal license is currently declared in this repository. Add a `LICENSE` file before redistribution or external contribution.
