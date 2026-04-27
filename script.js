const { PDFDocument, StandardFonts, rgb } = PDFLib;

const DEFAULTS = Object.freeze({
  certificateType: "promotion",
  achievementNumber: "ACHIEVEMENT 7",
  achievementTitle: "Dr. Robert Goddard",
  cadetName: "Hanniah Beacham",
  cadetRank: "Cadet Senior Master Sergeant",
  awardCategory: "Cadet of the Year",
  awardRecipient: "Hanniah Beacham",
  awardSubtitle: "For exceptional leadership and service",
  unitLine: "Fort Worth Composite Squadron, Fort Worth, Texas",
  leftSignerName: "Roman Vitanza",
  leftSignerTitle: "Squadron Commander",
  rightSignerName: "Joshua Bouldin",
  rightSignerTitle: "Deputy Commander for Cadets"
});

const RANK_IMAGE_MAP = Object.freeze({
  "ACHIEVEMENT 2": "ranks/A2.jpg",
  "ACHIEVEMENT 3": "ranks/A3.jpg",
  "ACHIEVEMENT 4": "ranks/A4.jpg",
  "ACHIEVEMENT 5": "ranks/A5.jpg",
  "ACHIEVEMENT 6": "ranks/A6.jpg",
  "ACHIEVEMENT 7": "ranks/A6.jpg",
  "ACHIEVEMENT 8": "ranks/A8.jpg",
  "ACHIEVEMENT 9": "ranks/A9.jpg",
  "ACHIEVEMENT 10": "ranks/A10.jpg",
  "ACHIEVEMENT 11": "ranks/A11.jpg",
  "ACHIEVEMENT 12": "ranks/A12.jpg",
  "ACHIEVEMENT 13": "ranks/A13.jpg",
  "ACHIEVEMENT 14": "ranks/A14.jpg",
  "ACHIEVEMENT 15": "ranks/A15.jpg",
  "ACHIEVEMENT 16": "ranks/A16.jpg"
});

const PREVIEW_MAP = Object.freeze({
  achievementNumber: "previewAchievementNumber",
  achievementTitle: "previewAchievementTitle",
  cadetName: "previewCadetName",
  cadetRank: "previewCadetRank",
  unitLine: "previewUnitLine",
  leftSignerName: "previewLeftSignerName",
  leftSignerTitle: "previewLeftSignerTitle",
  rightSignerName: "previewRightSignerName",
  rightSignerTitle: "previewRightSignerTitle"
});

const GUIDANCE_ITEMS = Object.freeze({
  promotion: [
    "Verify the cadet’s full name, achievement, and promotion date.",
    "Confirm the unit line appears exactly as it should on the certificate.",
    "Review rank insignia, signature blocks, and spacing before downloading.",
    "Use the live preview to confirm the final certificate layout.",
    "Major milestone awards (Wright Brothers, Mitchell, Eaker, ect) will be mailed to the squadron commander and this tool should not be used to replace those"
  ],
  award: [
    "Verify the member's full name, achievement, and award date",
    "Confirm the unit line appears exactly as it should on the certificate.",
    "Use the live preview to confirm the final certificate layout."
  ]
});

/* ------------------ HELPERS ------------------ */

function byId(id) {
  return document.getElementById(id);
}

function getValue(id, fallback = "") {
  const el = byId(id);
  return el ? el.value.trim() : fallback;
}

function getFormValues() {
  return {
    certificateType: getValue("certificateType", DEFAULTS.certificateType),
    achievementNumber: getValue("achievementNumber", DEFAULTS.achievementNumber),
    achievementTitle: getValue("achievementTitle", DEFAULTS.achievementTitle),
    cadetName: getValue("cadetName", DEFAULTS.cadetName),
    cadetRank: getValue("cadetRank", DEFAULTS.cadetRank),
    awardCategory: getValue("awardCategory", DEFAULTS.awardCategory),
    awardRecipient: getValue("awardRecipient", DEFAULTS.awardRecipient),
    awardSubtitle: getValue("awardSubtitle", DEFAULTS.awardSubtitle),
    promotionDate: getValue("promotionDate"),
    unitLine: getValue("unitLine", DEFAULTS.unitLine),
    leftSignerName: getValue("leftSignerName", DEFAULTS.leftSignerName),
    leftSignerTitle: getValue("leftSignerTitle", DEFAULTS.leftSignerTitle),
    rightSignerName: getValue("rightSignerName", DEFAULTS.rightSignerName),
    rightSignerTitle: getValue("rightSignerTitle", DEFAULTS.rightSignerTitle)
  };
}

function ordinal(n) {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;

  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
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

function getRankImage(achievementNumber) {
  return RANK_IMAGE_MAP[achievementNumber] || null;
}

function syncAchievementFields() {
  const achievementSelect = byId("achievementNumber");
  const titleInput = byId("achievementTitle");
  const rankInput = byId("cadetRank");

  const selectedOption = achievementSelect?.options[achievementSelect.selectedIndex];
  const title = selectedOption?.dataset.title || "";
  const rank = selectedOption?.dataset.rank || "";

  if (titleInput) {
    titleInput.value = title;
    titleInput.disabled = !title;
  }

  if (rankInput) {
    rankInput.value = rank;
    rankInput.disabled = true;
  }
}

function setPreviewText(formValues) {
  const isPromotion = formValues.certificateType === "promotion";
  const previewValues = isPromotion
    ? {
        achievementNumber: formValues.achievementNumber,
        achievementTitle: formValues.achievementTitle,
        cadetName: formValues.cadetName,
        cadetRank: formValues.cadetRank
      }
    : {
        achievementNumber: formValues.awardCategory,
        achievementTitle: "",
        cadetName: formValues.awardRecipient,
        cadetRank: formValues.awardSubtitle
      };

  Object.entries(PREVIEW_MAP).forEach(([formKey, previewId]) => {
    const previewNode = byId(previewId);
    if (previewNode) {
      const hasOverride = Object.prototype.hasOwnProperty.call(previewValues, formKey);
      previewNode.textContent = hasOverride ? previewValues[formKey] : formValues[formKey];
    }
  });

  const presentedLine = byId("previewPresentedLine");
  if (presentedLine) {
    presentedLine.textContent = isPromotion
      ? `Proudly Presented on this ${formatDate(formValues.promotionDate)}`
      : `Recognized on this ${formatDate(formValues.promotionDate)}`;
  }
}

function setPreviewRankImage(achievementNumber) {
  const rankImage = byId("previewRankImage");
  if (!rankImage) return;

  const imagePath = getRankImage(achievementNumber);

  if (imagePath) {
    rankImage.src = imagePath;
    rankImage.style.display = "block";
    return;
  }

  rankImage.removeAttribute("src");
  rankImage.style.display = "none";
}

/* ------------------ PREVIEW ------------------ */

function updatePreview() {
  const formValues = getFormValues();
  const certificatePreview = document.querySelector(".certificate-preview");
  certificatePreview?.classList.toggle("award-mode", formValues.certificateType === "award");
  setPreviewText(formValues);
  const selectedAchievement = formValues.certificateType === "promotion"
    ? formValues.achievementNumber
    : "";
  setPreviewRankImage(selectedAchievement);
}

function syncCertificateTypeFields() {
  const certificateType = getValue("certificateType", DEFAULTS.certificateType);
  const promotionFields = byId("promotionFields");
  const awardFields = byId("awardFields");

  if (promotionFields) {
    promotionFields.classList.toggle("hidden", certificateType !== "promotion");
  }

  if (awardFields) {
    awardFields.classList.toggle("hidden", certificateType !== "award");
  }

  syncGuidanceChecklist(certificateType);
}

function syncGuidanceChecklist(certificateType) {
  const checklist = byId("guidanceChecklist");
  if (!checklist) return;

  const guidanceItems = GUIDANCE_ITEMS[certificateType] || GUIDANCE_ITEMS.promotion;
  checklist.innerHTML = guidanceItems.map((item) => `<li>${item}</li>`).join("");
}

/* ------------------ PDF ------------------ */

async function generatePDF() {
  const formValues = getFormValues();
  const isPromotion = formValues.certificateType === "promotion";

  const pdfBytes = await fetch("template.pdf").then((res) => res.arrayBuffer());
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

  function centerXForText(text, size, fontUsed) {
    return (width - fontUsed.widthOfTextAtSize(text, size)) / 2;
  }

  function drawCentered(text, percentY, size, fontUsed, color) {
    page.drawText(text, {
      x: centerXForText(text, size, fontUsed),
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

  const certificateHeading = isPromotion ? formValues.achievementNumber : formValues.awardCategory;
  const certificateTitle = isPromotion ? formValues.achievementTitle : "";
  const recipientName = isPromotion ? formValues.cadetName : formValues.awardRecipient;
  const recipientLine = isPromotion ? formValues.cadetRank : formValues.awardSubtitle;
  const recipientNameY = isPromotion ? 0.447 : 0.418;
  const recipientLineY = isPromotion ? 0.533 : 0.505;

  drawCentered(certificateHeading, 0.245, 26, bold, blue);
  if (certificateTitle) {
    drawCentered(certificateTitle, 0.342, 20, bold, blue);
  }
  drawCentered(recipientName, recipientNameY, 28, serif, black);
  drawCentered(recipientLine, recipientLineY, 16, bold, blue);

  const rankImagePath = isPromotion ? getRankImage(formValues.achievementNumber) : null;
  if (rankImagePath) {
    const imgBytes = await fetch(rankImagePath).then((res) => res.arrayBuffer());
    const img = rankImagePath.toLowerCase().endsWith(".png")
      ? await pdfDoc.embedPng(imgBytes)
      : await pdfDoc.embedJpg(imgBytes);

    const imgWidth = 100;
    const imgHeight = (img.height / img.width) * imgWidth;

    const centerX = width * 0.22;
    const centerY = height * 0.49;

    page.drawImage(img, {
      x: centerX - (imgWidth / 2),
      y: centerY - (imgHeight / 2),
      width: imgWidth,
      height: imgHeight
    });
  }

  const baseY = 0.66;
  const lineSpacing = 0.035;

  const presentationLine = isPromotion
    ? `Proudly Presented on this ${formatDate(formValues.promotionDate)}`
    : `Recognized on this ${formatDate(formValues.promotionDate)}`;
  drawCentered(presentationLine, baseY, 12, bold, black);
  drawCentered(formValues.unitLine, baseY + lineSpacing, 12, bold, black);

  const leftSignatureCenter = 0.285;
  const rightSignatureCenter = 0.695;

  drawCenteredAt(formValues.leftSignerName, leftSignatureCenter, 0.878, 12, font);
  drawCenteredAt(formValues.leftSignerTitle, leftSignatureCenter, 0.91, 10, font);
  drawCenteredAt(formValues.rightSignerName, rightSignatureCenter, 0.878, 12, font);
  drawCenteredAt(formValues.rightSignerTitle, rightSignatureCenter - 0.003, 0.91, 10, font);

  const finalBytes = await pdfDoc.save();

  const blob = new Blob([finalBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  const fileNameBase = (isPromotion ? formValues.cadetName : formValues.awardRecipient)
    .replace(/\s+/g, "-")
    .toLowerCase();
  a.download = `${fileNameBase}-certificate.pdf`;
  a.click();

  URL.revokeObjectURL(url);
}

/* ------------------ EVENTS ------------------ */

function bindFormEvents() {
  document.querySelectorAll("input, select").forEach((el) => {
    const handler = () => {
      if (el.id === "achievementNumber") {
        syncAchievementFields();
      }
      if (el.id === "certificateType") {
        syncCertificateTypeFields();
      }
      updatePreview();
    };

    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  });
}

function initializePromotionDate() {
  const promotionDate = byId("promotionDate");
  if (!promotionDate?.value) {
    promotionDate.value = new Date().toISOString().slice(0, 10);
  }
}

function initialize() {
  syncAchievementFields();
  syncCertificateTypeFields();
  initializePromotionDate();
  bindFormEvents();
  byId("downloadBtn")?.addEventListener("click", generatePDF);
  updatePreview();
}

initialize();
