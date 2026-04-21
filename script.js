const { PDFDocument, StandardFonts, rgb } = PDFLib;

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

async function generatePDF() {

  const achievementNumber = document.getElementById("achievementNumber").value;
  const achievementTitle = document.getElementById("achievementTitle").value;
  const cadetName = document.getElementById("cadetName").value;
  const cadetRank = document.getElementById("cadetRank").value;
  const date = formatDate(document.getElementById("promotionDate").value);
  const unit = document.getElementById("unitLine").value;

  const leftName = document.getElementById("leftSignerName").value;
  const leftTitle = document.getElementById("leftSignerTitle").value;

  const rightName = document.getElementById("rightSignerName").value;
  const rightTitle = document.getElementById("rightSignerTitle").value;

  const existingPdfBytes = await fetch("template.pdf").then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();

  // === CENTER TEXT ===
  const centerX = width / 2;

  function drawCentered(text, y, size, fontUsed = font) {
    const textWidth = fontUsed.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: centerX - textWidth / 2,
      y,
      size,
      font: fontUsed,
      color: rgb(0, 0, 0)
    });
  }

  // === DRAW TEXT ===

  drawCentered(achievementNumber, height - 200, 28, bold);
  drawCentered(achievementTitle, height - 240, 20);
  drawCentered(cadetName, height - 300, 24, bold);
  drawCentered(cadetRank, height - 340, 16);

  drawCentered(
    `Proudly Presented on this ${date}`,
    height - 380,
    12
  );

  drawCentered(unit, height - 400, 12);

  // LEFT SIGNATURE
  page.drawText(leftName, {
    x: 120,
    y: 120,
    size: 12,
    font
  });

  page.drawText(leftTitle, {
    x: 120,
    y: 105,
    size: 10,
    font
  });

  // RIGHT SIGNATURE
  page.drawText(rightName, {
    x: width - 250,
    y: 120,
    size: 12,
    font
  });

  page.drawText(rightTitle, {
    x: width - 250,
    y: 105,
    size: 10,
    font
  });

  // === SAVE ===
  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${cadetName}-certificate.pdf`;
  a.click();

  URL.revokeObjectURL(url);
}

document.getElementById("downloadBtn").addEventListener("click", generatePDF);
