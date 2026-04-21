const { PDFDocument, StandardFonts, rgb } = PDFLib;

function getValue(id, fallback = "") {
  const el = document.getElementById(id);
  return el ? el.value.trim() : fallback;
}

function formatPreviewDate(value) {
  if (!value) return "10th Day of January 2026";

  const d = new Date(`${value}T00:00:00`);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const year = d.getFullYear();

  return `${ordinal(day)} Day of ${month} ${year}`;
}

function formatPdfDate(value) {
  if (!value) return "10th Day of January 2026";

  const d = new Date(`${value}T00:00:00`);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const year = d.getFullYear();

  return `${ordinal(day)} Day of ${month} ${year}`;
}

function ordinal(n) {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function updatePreview() {
  const achievementNumber = getValue("achievementNumber", "ACHIEVEMENT 7");
  const achievementTitle = getValue("achievementTitle", "Dr. Robert Goddard");
  const cadetName = getValue("cadetName", "Hanniah Beacham");
  const cadetRank = getValue("cadetRank", "CADET CHIEF MASTER SERGEANT");
  const promotionDate = getValue("promotionDate");
  const unitLine = getValue("unitLine", "Fort Worth Composite Squadron, Fort Worth, Texas");
  const leftSignerName = getValue("leftSignerName", "Roman Vitanza");
  const leftSignerTitle = getValue("leftSignerTitle", "Squadron Commander");
  const rightSignerName = getValue("rightSignerName", "Joshua Bouldin");
  const rightSignerTitle = getValue("rightSignerTitle", "Deputy Commander for Cadets");

  document.getElementById("previewAchievementNumber").textContent = achievementNumber;
  document.getElementById("previewAchievementTitle").textContent = achievementTitle;
  document.getElementById("previewCadetName").textContent = cadetName;
  document.getElementById("previewCadetRank").textContent = cadetRank;
  document.getElementById("previewPresentedLine").textContent =
    `Proudly Presented on this ${formatPreviewDate(promotionDate)}`;
  document.getElementById("previewUnitLine").textContent = unitLine;
  document.getElementById("previewLeftSignerName").textContent = leftSignerName;
  document.getElementById("previewLeftSignerTitle").textContent = leftSignerTitle;
  document.getElementById("previewRightSignerName").textContent = rightSignerName;
  document.getElementById("previewRightSignerTitle").textContent = rightSignerTitle;
}

function drawCentered(page, text, y, size, font, color) {
  const { width } = page.getSize();
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: (width - textWidth) / 2,
    y,
    size,
    font,
    color
  });
}

async function generatePDF() {
  const achievementNumber = getValue("achievementNumber", "ACHIEVEMENT 7");
  const achievementTitle = getValue("achievementTitle", "Dr. Robert Goddard");
  const cadetName = getValue("cadetName", "Hanniah Beacham");
  const cadetRank = getValue("cadetRank", "CADET CHIEF MASTER SERGEANT");
  const promotionDate = getValue("promotionDate");
  const unitLine = getValue("unitLine", "Fort Worth Composite Squadron, Fort Worth, Texas");
  const leftSignerName = getValue("leftSignerName", "Roman Vitanza");
  const leftSignerTitle = getValue("leftSignerTitle", "Squadron Commander");
  const rightSignerName = getValue("rightSignerName", "Joshua Bouldin");
  const rightSignerTitle = getValue("rightSignerTitle", "Deputy Commander for Cadets");

  const existingPdfBytes = await fetch("template.pdf").then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const serifFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const blue = rgb(0.05, 0.18, 0.52);
  const black = rgb(0.08, 0.08, 0.08);

  // These positions are tuned for your uploaded template and will likely need small nudges.
  drawCentered(page, achievementNumber, 600, 26, boldFont, blue);
  drawCentered(page, achievementTitle, 548, 21, boldFont, blue);
  drawCentered(page, cadetName, 474, 28, serifFont, black);
  drawCentered(page, cadetRank, 410, 18, boldFont, blue);
  drawCentered(page, `Proudly Presented on this ${formatPdfDate(promotionDate)}`, 348, 12, boldFont, black);
  drawCentered(page, unitLine, 324, 12, boldFont, black);

  page.drawText(leftSignerName, {
    x: 160,
    y: 120,
    size: 13,
    font: regularFont,
    color: black
  });

  page.drawText(leftSignerTitle, {
    x: 145,
    y: 101,
    size: 11,
    font: regularFont,
    color: black
  });

  page.drawText(rightSignerName, {
    x: 535,
    y: 120,
    size: 13,
    font: regularFont,
    color: black
  });

  page.drawText(rightSignerTitle, {
    x: 495,
    y: 101,
    size: 11,
    font: regularFont,
    color: black
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${cadetName.replace(/\s+/g, "-").toLowerCase()}-certificate.pdf`;
  a.click();

  URL.revokeObjectURL(url);
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", updatePreview);
  input.addEventListener("change", updatePreview);
});

document.getElementById("downloadBtn").addEventListener("click", generatePDF);

if (!document.getElementById("promotionDate").value) {
  document.getElementById("promotionDate").value = new Date().toISOString().slice(0, 10);
}

updatePreview();
