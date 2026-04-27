# CAP Certificate Generator

A lightweight web app for creating **Civil Air Patrol cadet achievement certificates**. The tool provides a guided form, a live visual preview, and one-click PDF export based on the project certificate template.

## Features

- Achievement selector with auto-filled:
  - Achievement title
  - Cadet rank
  - Rank insignia image
- Live certificate preview that updates as fields change
- Automatic date formatting with ordinal day output (for example, `10th Day of January 2026`)
- PDF generation in-browser using [`pdf-lib`](https://pdf-lib.js.org/)
- Downloadable certificate file named from the cadet's name

## Project Structure

```text
.
├── index.html             # App UI structure and form fields
├── styles.css             # App styling and certificate preview layout
├── script.js              # Form sync, live preview, and PDF generation logic
├── template.pdf           # Base PDF template used for export
├── template-preview.png   # Background image used in live preview
├── ranks/                 # Rank insignia images keyed by achievement
└── images/                # Supporting image assets (if used)
```

## Requirements

- Modern browser (Chrome, Edge, Firefox, Safari)
- No build tools or package install required
- Internet access for loading `pdf-lib` from CDN in `index.html`

## Run Locally

Because this project fetches local assets (`template.pdf`, rank images), run it from a local web server.

### Option 1: Python

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Option 2: VS Code Live Server

- Open the repository in VS Code
- Use **"Open with Live Server"** on `index.html`

## How to Use

1. Select the achievement.
2. Verify auto-filled achievement title and cadet rank.
3. Enter or update cadet details:
   - Cadet name
   - Promotion date
   - Unit line
   - Signature names and titles
4. Review the live preview.
5. Click **Download PDF**.

The output file name is generated from the cadet name (for example, `jane-doe-certificate.pdf`).

## Implementation Notes

- `script.js` controls all form-to-preview synchronization.
- Promotion date defaults to the current date if no value is set.
- PDF text placement is based on percentage-driven coordinates to align with the template.
- Rank insignia images are mapped by achievement in `RANK_IMAGE_MAP`.

## Customization

You can adapt this tool for different units or certificate styles by editing:

- `index.html` for default values and form options
- `script.js` for mapping, text behavior, and PDF placement
- `styles.css` for visual styling and preview layout
- `template.pdf` and `template-preview.png` for certificate design changes

## Maintenance Checklist

When updating achievements or templates:

- Verify each achievement option has the correct `data-title` and `data-rank`
- Confirm each achievement key maps to the intended rank image file
- Test the live preview for alignment and spacing
- Export sample PDFs and visually verify layout accuracy

## License / Usage

This repository currently does not declare a formal license. Add a `LICENSE` file if redistribution or external contribution terms are needed.
