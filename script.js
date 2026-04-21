const { PDFDocument, StandardFonts, rgb } = PDFLib;

/* ------------------ HELPERS ------------------ */

function getValue(id, fallback = "") {
  const el = document.getElementById(id);
  return el ? el.value.trim() : fallback;
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

function formatDate(value) {
  if (!value) return "10th Day of January 2026";

  const d = new Date(`${value}T00:00:00`);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const year = d.getFullYear();

  return `${ordinal(day)} Day of ${month} ${year}`;
}

/* ------------------ PREVIEW ------------------ */

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
    `Proudly Presented on this ${formatDate(promotionDate)}`;
  document.getElementById("previewUnitLine").textContent = unitLine;
  document.getElementById("previewLeftSignerName").textContent = leftSignerName;
  document.getElementById("previewLeftSignerTitle").textContent = leftSignerTitle;
  document.getElementById("previewRightSignerName").textContent = rightSignerName;
  document.getElementById("previewRightSignerTitle").textContent = rightSignerTitle;
}

/* ------------------ PDF ------------------ */

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

  const pdfBytes = await fetch("template.pdf").then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];

  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const blue = rgb(0.05, 0.18, 0.52);
  const black = rgb(0.1, 0.1, 0.1);

  function yPercent(percent) {
    return height * (1 - percent);
  }

  function centerX(text, size, fontUsed) {
    return (width - fontUsed.widthOfTextAtSize(text, size)) / 2;
  }

  function drawCentered(text, percentY, size, fontUsed, color) {
    page.drawText(text, {
      x: centerX(text, size, fontUsed),
      y: yPercent(percentY),
      size,
      font: fontUsed,
      color
    });
  }

  function drawCenteredAt(text, centerPercentX, percentY, size, fontUsed, color = black) {
    const textWidth = fontUsed.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: (width * centerPercentX) - (textWidth / 2),
      y: yPercent(percentY),
      size,
      font: fontUsed,
      color
    });
  }

  drawCentered(achievementNumber, 0.245, 26, bold, blue);
  drawCentered(achievementTitle, 0.342, 20, bold, blue);
  drawCentered(cadetName, 0.447, 28, serif, black);
  drawCentered(cadetRank, 0.533, 16, bold, blue);

  drawCentered(formatDate(promotionDate), 0.683, 12, bold, black);
  drawCentered(unitLine, 0.722, 12, bold, black);

  // Signature line centers tuned to the actual template
  const leftSignatureCenter = 0.285;
  const rightSignatureCenter = 0.750;

  // LEFT
  drawCenteredAt(leftSignerName, leftSignatureCenter, 0.878, 12, font);
  drawCenteredAt(leftSignerTitle, leftSignatureCenter, 0.91, 10, font);

  // RIGHT
  drawCenteredAt(rightSignerName, rightSignatureCenter, 0.878, 12, font);
  drawCenteredAt(rightSignerTitle, rightSignatureCenter - 0.003, 0.91, 10, font);

  const finalBytes = await pdfDoc.save();

  const blob = new Blob([finalBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${cadetName.replace(/\s+/g, "-").toLowerCase()}-certificate.pdf`;
  a.click();

  URL.revokeObjectURL(url);
}

/* ------------------ EVENTS ------------------ */

document.querySelectorAll("input").forEach(el => {
  el.addEventListener("input", updatePreview);
  el.addEventListener("change", updatePreview);
});

document.getElementById("downloadBtn").addEventListener("click", generatePDF);

if (!document.getElementById("promotionDate").value) {
  document.getElementById("promotionDate").value =
    new Date().toISOString().slice(0, 10);
}

updatePreview();
