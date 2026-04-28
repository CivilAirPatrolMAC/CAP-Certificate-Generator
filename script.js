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
  activityName: "Color Guard Competition",
  activityRecipient: "Hanniah Beacham",
  activitySubtitle: "For exceptional leadership and service",
  unitLine: "Fort Worth Composite Squadron, Fort Worth, Texas",
  leftSignerName: "Roman Vitanza",
  leftSignerTitle: "Squadron Commander",
  rightSignerName: "Joshua Bouldin",
  rightSignerTitle: "Deputy Commander For Cadets"
});

const DEFAULT_EXPORT_FORMAT = "pdf";

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

const RIBBON_IMAGE_MAP = Object.freeze({
  "ACHIEVEMENT 2": "images/arnold.png",
  "ACHIEVEMENT 3": "images/feik.png",
  "ACHIEVEMENT 4": "images/ricken.png",
  "ACHIEVEMENT 5": "images/lindbe.png",
  "ACHIEVEMENT 6": "images/doolit.png",
  "ACHIEVEMENT 7": "images/goddar.png",
  "ACHIEVEMENT 8": "images/armstr.png"
});

const CSV_FIELDS = Object.freeze({
  promotion: [
    "achievementNumber",
    "cadetName",
    "promotionDate",
    "unitLine",
    "leftSignerName",
    "leftSignerTitle",
    "rightSignerName",
    "rightSignerTitle"
  ],
  activities: [
    "activityName",
    "activityRecipient",
    "activitySubtitle",
    "promotionDate",
    "unitLine",
    "leftSignerName",
    "leftSignerTitle",
    "rightSignerName",
    "rightSignerTitle"
  ]
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

const BLOCKED_TERMS = Object.freeze([
  "ass", "asshole", "asswipe", "assclown", "assface", "asshat", "assbag", "asslicker", "asskisser", "assholeish",
  "bastard", "bastards",
  "bitch", "bitches", "bitchy",
  "bullshit", "bullshitter",
  "crap", "crappy",
  "damn", "dammit", "damnation",
  "dumbass", "dumbasses",
  "fuck", "fucks", "fucked", "fucking", "fucker", "fuckers", "fuckface", "fuckhead", "fuckwit", "fuckup", "fuckboy",
  "shit", "shits", "shitted", "shitting", "shitty", "shithead", "shitface", "shitbag", "shitshow", "shitstorm", "shitfaced",
  "piss", "pissed", "pissing", "pisser", "pisshead", "pussy", 
  "dick", "dicks", "dickhead", "dickbag", "dickface",
  "prick", "pricks",
  "jerk", "jerks",
  "jackass", "jackasses",
  "motherfucker", "motherfuckers", "mf",
  "son of a bitch", "sonofabitch", "sob",
  "goddamn", "goddammit", "goddamned",
  "dipshit", "dipshits",
  "clusterfuck", "clusterfucks"
]);

const BLOCKED_TERMS_REGEX = new RegExp(
  `\\b(?:${BLOCKED_TERMS.map((term) => term
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "\\s+"))
    .join("|")})\\b`,
  "i"
);

const GUIDANCE_ITEMS = Object.freeze({
  promotion: [
    "Verify the cadet’s full name, achievement, and promotion date.",
    "Confirm the unit line appears exactly as it should on the certificate.",
    "Review rank insignia, signature blocks, and spacing before downloading.",
    "Use the live preview to confirm the final certificate layout.",
    "Major milestone awards (Wright Brothers, Mitchell, Eaker, ect) will be mailed to the squadron commander and this tool should not be used to replace those"
  ],
  award: [
    "Verify the member's full name, achievement, and award date.",
    "Confirm the unit line appears exactly as it should on the certificate.",
    "Use the live preview to confirm the final certificate layout."
  ],
  activities: [
    "Verify the member's full name, activity name, and recognition date.",
    "Confirm the unit line appears exactly as it should on the certificate.",
    "Use the live preview to confirm the final certificate layout."
  ]
});

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
    activityName: getValue("activityName", DEFAULTS.activityName),
    activityRecipient: getValue("activityRecipient", DEFAULTS.activityRecipient),
    activitySubtitle: getValue("activitySubtitle", DEFAULTS.activitySubtitle),
    promotionDate: getValue("promotionDate"),
    unitLine: getValue("unitLine", DEFAULTS.unitLine),
    leftSignerName: getValue("leftSignerName", DEFAULTS.leftSignerName),
    leftSignerTitle: getValue("leftSignerTitle", DEFAULTS.leftSignerTitle),
    rightSignerName: getValue("rightSignerName", DEFAULTS.rightSignerName),
    rightSignerTitle: getValue("rightSignerTitle", DEFAULTS.rightSignerTitle)
  };
}

function applyDefaultValues() {
  Object.entries(DEFAULTS).forEach(([id, value]) => {
    const el = byId(id);
    if (el) {
      el.value = value;
    }
  });

  const exportFormat = byId("exportFormat");
  if (exportFormat) {
    exportFormat.value = DEFAULT_EXPORT_FORMAT;
  }

  const promotionDate = byId("promotionDate");
  if (promotionDate) {
    promotionDate.value = new Date().toISOString().slice(0, 10);
  }

  syncAchievementFields();
  syncCertificateTypeFields();
  updatePreview();
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

function getRankImage(achievementNumber) {
  return RANK_IMAGE_MAP[achievementNumber] || null;
}

function getRibbonImage(achievementNumber) {
  return RIBBON_IMAGE_MAP[achievementNumber] || null;
}

function resolvePromotionFields(formValues) {
  const achievementSelect = byId("achievementNumber");
  const option = achievementSelect
    ? Array.from(achievementSelect.options).find((candidate) => candidate.value === formValues.achievementNumber)
    : null;

  return {
    ...formValues,
    achievementTitle: formValues.achievementTitle || option?.dataset.title || "",
    cadetRank: formValues.cadetRank || option?.dataset.rank || ""
  };
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
  const isAward = formValues.certificateType === "award";
  const previewValues = isPromotion
    ? {
        achievementNumber: formValues.achievementNumber,
        achievementTitle: formValues.achievementTitle,
        cadetName: formValues.cadetName,
        cadetRank: formValues.cadetRank
      }
    : isAward
      ? {
          achievementNumber: formValues.awardCategory,
          achievementTitle: "",
          cadetName: formValues.awardRecipient,
          cadetRank: formValues.awardSubtitle
        }
      : {
          achievementNumber: formValues.activityName,
          achievementTitle: "",
          cadetName: formValues.activityRecipient,
          cadetRank: formValues.activitySubtitle
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
  const ribbonImage = byId("previewRibbonImage");
  if (!rankImage || !ribbonImage) return;

  const rankImagePath = getRankImage(achievementNumber);
  if (rankImagePath) {
    rankImage.src = rankImagePath;
    rankImage.style.display = "block";
  } else {
    rankImage.removeAttribute("src");
    rankImage.style.display = "none";
  }

  const ribbonImagePath = getRibbonImage(achievementNumber);
  if (ribbonImagePath) {
    ribbonImage.src = ribbonImagePath;
    ribbonImage.style.display = "block";
  } else {
    ribbonImage.removeAttribute("src");
    ribbonImage.style.display = "none";
  }
}

function updatePreview() {
  const formValues = getFormValues();
  const certificatePreview = document.querySelector(".certificate-preview");
  certificatePreview?.classList.toggle("award-mode", formValues.certificateType !== "promotion");
  setPreviewText(formValues);
  setPreviewRankImage(formValues.certificateType === "promotion" ? formValues.achievementNumber : "");
}

function syncCertificateTypeFields() {
  const certificateType = getValue("certificateType", DEFAULTS.certificateType);
  const isPromotion = certificateType === "promotion";
  const isAward = certificateType === "award";
  const isActivity = certificateType === "activities";
  const promotionFields = byId("promotionFields");
  const awardFields = byId("awardFields");
  const activityFields = byId("activityFields");
  const promotionDateLabel = byId("promotionDateLabel");
  const unitLineLabel = byId("unitLineLabel");
  const unitLineHelp = byId("unitLineHelp");
  const leftSignerTitleInput = byId("leftSignerTitle");
  const rightSignerTitleInput = byId("rightSignerTitle");
  const bulkStatus = byId("bulkStatus");

  promotionFields?.classList.toggle("hidden", !isPromotion);
  awardFields?.classList.toggle("hidden", !isAward);
  activityFields?.classList.toggle("hidden", !isActivity);

  if (promotionDateLabel) {
    promotionDateLabel.textContent = isPromotion ? "Date earned in eServices" : "Date Earned";
  }
  if (unitLineLabel) {
    unitLineLabel.textContent = isActivity ? "Activity Location" : "Unit Line";
  }
  if (unitLineHelp) {
    unitLineHelp.textContent = isActivity
      ? "Enter the full location name as it should appear on the certificate (e.g., Fort Wolters, Mineral Wells, Texas)."
      : "Enter the full unit name and location as it should appear on the certificate (e.g., Squadron, City, State).";
  }

  if (leftSignerTitleInput) {
    leftSignerTitleInput.placeholder = isActivity ? "Activity Director" : DEFAULTS.leftSignerTitle;
  }
  if (rightSignerTitleInput) {
    rightSignerTitleInput.placeholder = isActivity ? "Deputy Director" : DEFAULTS.rightSignerTitle;
  }

  if (bulkStatus && isAward) {
    bulkStatus.textContent = "Bulk CSV mode currently supports Promotion and Activities certificate types.";
  } else if (bulkStatus) {
    bulkStatus.textContent = "";
  }

  syncGuidanceChecklist(certificateType);
}

function syncGuidanceChecklist(certificateType) {
  const checklist = byId("guidanceChecklist");
  if (!checklist) return;
  const guidanceItems = GUIDANCE_ITEMS[certificateType] || GUIDANCE_ITEMS.promotion;
  checklist.innerHTML = guidanceItems.map((item) => `<li>${item}</li>`).join("");
}

function collectCertificateText(formValues) {
  const isPromotion = formValues.certificateType === "promotion";
  const isAward = formValues.certificateType === "award";

  const variableText = isPromotion
    ? [formValues.achievementNumber, formValues.achievementTitle, formValues.cadetName, formValues.cadetRank]
    : isAward
      ? [formValues.awardCategory, formValues.awardRecipient, formValues.awardSubtitle]
      : [formValues.activityName, formValues.activityRecipient, formValues.activitySubtitle];

  return [
    ...variableText,
    formValues.unitLine,
    formValues.leftSignerName,
    formValues.leftSignerTitle,
    formValues.rightSignerName,
    formValues.rightSignerTitle
  ].join(" ");
}

function containsBlockedTerms(text) {
  return BLOCKED_TERMS_REGEX.test(text);
}

function downloadNonsenseImage() {
  const a = document.createElement("a");
  a.href = "nonsense.png";
  a.download = "nonsense.png";
  a.click();
}

function sanitizeFileName(value, fallback = "certificate") {
  const base = (value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return base || fallback;
}

function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerDataUrlDownload(dataUrl, fileName) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName;
  a.click();
}

function escapeCsvCell(value) {
  const content = String(value ?? "");
  if (/[,"\n]/.test(content)) {
    return `"${content.replace(/"/g, '""')}"`;
  }
  return content;
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field.trim());
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(field.trim());
      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field || row.length) {
    row.push(field.trim());
    if (row.some((cell) => cell !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function getCsvHeaders(certificateType) {
  return CSV_FIELDS[certificateType] || null;
}

function downloadCsvTemplate() {
  const certificateType = getValue("certificateType", DEFAULTS.certificateType);
  const headers = getCsvHeaders(certificateType);
  const status = byId("bulkStatus");

  if (!headers) {
    if (status) status.textContent = "CSV templates are available for Promotion and Activities only.";
    return;
  }

  const defaultRow = headers.map((field) => getFormValues()[field] || "");
  const csv = [headers, defaultRow]
    .map((line) => line.map((cell) => escapeCsvCell(cell)).join(","))
    .join("\n");

  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${certificateType}-bulk-template.csv`);
  if (status) status.textContent = "Template downloaded. Fill one recipient per row and upload the file.";
}

function mapRowToFormValues(baseValues, headers, rowValues) {
  const mapped = { ...baseValues };
  headers.forEach((header, index) => {
    mapped[header] = (rowValues[index] || "").trim();
  });

  if (mapped.certificateType === "promotion") {
    return resolvePromotionFields(mapped);
  }

  return mapped;
}

function validateCsvHeaders(headers, certificateType) {
  const requiredHeaders = getCsvHeaders(certificateType);
  if (!requiredHeaders) {
    return "Bulk generation is currently available for Promotion and Activities only.";
  }

  const missingHeaders = requiredHeaders.filter((field) => !headers.includes(field));
  if (missingHeaders.length) {
    return `Missing required header(s): ${missingHeaders.join(", ")}`;
  }

  return "";
}

async function generatePDFBytes(values) {
  const formValues = values.certificateType === "promotion" ? resolvePromotionFields(values) : values;
  const isPromotion = formValues.certificateType === "promotion";
  const isAward = formValues.certificateType === "award";

  if (containsBlockedTerms(collectCertificateText(formValues))) {
    throw new Error("Certificate contains blocked terms.");
  }

  const pdfBytes = await fetch("template.pdf").then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];

  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const blue = rgb(0.05, 0.18, 0.52);
  const black = rgb(0.1, 0.1, 0.1);

  const yPercent = (percent) => height * (1 - percent);
  const centerXForText = (text, size, fontUsed) => (width - fontUsed.widthOfTextAtSize(text, size)) / 2;

  function drawCentered(text, percentY, size, fontUsed, color) {
    page.drawText(text, { x: centerXForText(text, size, fontUsed), y: yPercent(percentY), size, font: fontUsed, color });
  }

  function splitTextIntoLines(text, maxWidth, size, fontUsed) {
    const words = text.trim().split(/\s+/);
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (fontUsed.widthOfTextAtSize(candidate, size) <= maxWidth) {
        currentLine = candidate;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines.length ? lines : [text];
  }

  function drawCenteredWrapped(text, percentY, size, fontUsed, color, maxWidth, lineHeightPercent = 0.035) {
    const lines = splitTextIntoLines(text, maxWidth, size, fontUsed);
    const lineOffset = ((lines.length - 1) * lineHeightPercent) / 2;
    lines.forEach((line, index) => drawCentered(line, percentY - lineOffset + (index * lineHeightPercent), size, fontUsed, color));
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

  function drawCenteredAtWrapped(text, centerPercentX, percentY, size, fontUsed, color = black, maxWidth = width * 0.25, lineHeightPercent = 0.02) {
    const lines = splitTextIntoLines(text, maxWidth, size, fontUsed);
    lines.forEach((line, index) => drawCenteredAt(line, centerPercentX, percentY + (index * lineHeightPercent), size, fontUsed, color));
  }

  const certificateHeading = isPromotion ? formValues.achievementNumber : isAward ? formValues.awardCategory : formValues.activityName;
  const certificateTitle = isPromotion ? formValues.achievementTitle : "";
  const recipientName = isPromotion ? formValues.cadetName : isAward ? formValues.awardRecipient : formValues.activityRecipient;
  const recipientLine = isPromotion ? formValues.cadetRank : isAward ? formValues.awardSubtitle : formValues.activitySubtitle;

  drawCenteredWrapped(certificateHeading, 0.245, 26, bold, blue, width * 0.84, 0.04);
  if (certificateTitle) drawCentered(certificateTitle, 0.342, 20, bold, blue);
  drawCentered(recipientName, isPromotion ? 0.447 : 0.418, 28, serif, black);
  drawCentered(recipientLine, isPromotion ? 0.533 : 0.505, 16, bold, blue);

  const rankImagePath = isPromotion ? getRankImage(formValues.achievementNumber) : null;
  if (rankImagePath) {
    const imgBytes = await fetch(rankImagePath).then((res) => res.arrayBuffer());
    const img = rankImagePath.toLowerCase().endsWith(".png") ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
    const imgWidth = 100;
    const imgHeight = (img.height / img.width) * imgWidth;

    page.drawImage(img, {
      x: (width * 0.22) - (imgWidth / 2),
      y: (height * 0.49) - (imgHeight / 2),
      width: imgWidth,
      height: imgHeight
    });
  }

  const ribbonImagePath = isPromotion ? getRibbonImage(formValues.achievementNumber) : null;
  if (ribbonImagePath) {
    const imgBytes = await fetch(ribbonImagePath).then((res) => res.arrayBuffer());
    const img = ribbonImagePath.toLowerCase().endsWith(".png") ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
    const imgWidth = 95;
    const imgHeight = (img.height / img.width) * imgWidth;

    page.drawImage(img, {
      x: (width * 0.305) - (imgWidth / 2),
      y: (height * 0.49) - (imgHeight / 2),
      width: imgWidth,
      height: imgHeight
    });
  }

  const presentationLine = isPromotion
    ? `Proudly Presented on this ${formatDate(formValues.promotionDate)}`
    : `Recognized on this ${formatDate(formValues.promotionDate)}`;

  drawCentered(presentationLine, 0.66, 12, bold, black);
  drawCentered(formValues.unitLine, 0.695, 12, bold, black);

  drawCenteredAt(formValues.leftSignerName, 0.285, 0.874, 12, font);
  drawCenteredAt(formValues.leftSignerTitle, 0.285, 0.91, 10, font);
  drawCenteredAt(formValues.rightSignerName, 0.737, 0.874, 12, font);
  drawCenteredAtWrapped(formValues.rightSignerTitle, 0.737, 0.91, 10, font, black, width * 0.18, 0.019);

  return pdfDoc.save({ useObjectStreams: true });
}

async function generatePrintQualityPDFBytes(values) {
  const formValues = values.certificateType === "promotion" ? resolvePromotionFields(values) : values;
  const isPromotion = formValues.certificateType === "promotion";
  const isAward = formValues.certificateType === "award";

  if (containsBlockedTerms(collectCertificateText(formValues))) {
    throw new Error("Certificate contains blocked terms.");
  }

  const pdfBytes = await fetch("template.pdf").then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];

  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const blue = rgb(0.05, 0.18, 0.52);
  const black = rgb(0.1, 0.1, 0.1);
  const yPercent = (percent) => height * (1 - percent);
  const centerXForText = (text, size, fontUsed) => (width - fontUsed.widthOfTextAtSize(text, size)) / 2;
  const drawCentered = (text, percentY, size, fontUsed, color) => {
    page.drawText(text, { x: centerXForText(text, size, fontUsed), y: yPercent(percentY), size, font: fontUsed, color });
  };

  function splitTextIntoLines(text, maxWidth, size, fontUsed) {
    const words = text.trim().split(/\s+/);
    const lines = [];
    let currentLine = "";
    words.forEach((word) => {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (fontUsed.widthOfTextAtSize(candidate, size) <= maxWidth) {
        currentLine = candidate;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines.length ? lines : [text];
  }

  function drawCenteredWrapped(text, percentY, size, fontUsed, color, maxWidth, lineHeightPercent = 0.035) {
    const lines = splitTextIntoLines(text, maxWidth, size, fontUsed);
    const lineOffset = ((lines.length - 1) * lineHeightPercent) / 2;
    lines.forEach((line, index) => drawCentered(line, percentY - lineOffset + (index * lineHeightPercent), size, fontUsed, color));
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

  function drawCenteredAtWrapped(text, centerPercentX, percentY, size, fontUsed, color = black, maxWidth = width * 0.25, lineHeightPercent = 0.02) {
    const lines = splitTextIntoLines(text, maxWidth, size, fontUsed);
    lines.forEach((line, index) => drawCenteredAt(line, centerPercentX, percentY + (index * lineHeightPercent), size, fontUsed, color));
  }

  const certificateHeading = isPromotion ? formValues.achievementNumber : isAward ? formValues.awardCategory : formValues.activityName;
  const certificateTitle = isPromotion ? formValues.achievementTitle : "";
  const recipientName = isPromotion ? formValues.cadetName : isAward ? formValues.awardRecipient : formValues.activityRecipient;
  const recipientLine = isPromotion ? formValues.cadetRank : isAward ? formValues.awardSubtitle : formValues.activitySubtitle;

  drawCenteredWrapped(certificateHeading, 0.245, 26, bold, blue, width * 0.84, 0.04);
  if (certificateTitle) drawCentered(certificateTitle, 0.342, 20, bold, blue);
  drawCentered(recipientName, isPromotion ? 0.447 : 0.418, 28, serif, black);
  drawCentered(recipientLine, isPromotion ? 0.533 : 0.505, 16, bold, blue);

  const rankImagePath = isPromotion ? getRankImage(formValues.achievementNumber) : null;
  if (rankImagePath) {
    const imgBytes = await fetch(rankImagePath).then((res) => res.arrayBuffer());
    const img = rankImagePath.toLowerCase().endsWith(".png") ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
    const imgWidth = 100;
    const imgHeight = (img.height / img.width) * imgWidth;
    page.drawImage(img, {
      x: (width * 0.22) - (imgWidth / 2),
      y: (height * 0.49) - (imgHeight / 2),
      width: imgWidth,
      height: imgHeight
    });
  }

  const ribbonImagePath = isPromotion ? getRibbonImage(formValues.achievementNumber) : null;
  if (ribbonImagePath) {
    const imgBytes = await fetch(ribbonImagePath).then((res) => res.arrayBuffer());
    const img = ribbonImagePath.toLowerCase().endsWith(".png") ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
    const imgWidth = 95;
    const imgHeight = (img.height / img.width) * imgWidth;

    page.drawImage(img, {
      x: (width * 0.305) - (imgWidth / 2),
      y: (height * 0.49) - (imgHeight / 2),
      width: imgWidth,
      height: imgHeight
    });
  }

  const presentationLine = isPromotion
    ? `Proudly Presented on this ${formatDate(formValues.promotionDate)}`
    : `Recognized on this ${formatDate(formValues.promotionDate)}`;

  drawCentered(presentationLine, 0.66, 12, bold, black);
  drawCentered(formValues.unitLine, 0.695, 12, bold, black);
  drawCenteredAt(formValues.leftSignerName, 0.285, 0.874, 12, font);
  drawCenteredAt(formValues.leftSignerTitle, 0.285, 0.91, 10, font);
  drawCenteredAt(formValues.rightSignerName, 0.737, 0.874, 12, font);
  drawCenteredAtWrapped(formValues.rightSignerTitle, 0.737, 0.91, 10, font, black, width * 0.18, 0.019);

  return pdfDoc.save({ useObjectStreams: false, addDefaultPage: false });
}

async function generatePrintTestPDFBytes() {
  const pdfBytes = await fetch("template.pdf").then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const red = rgb(0.75, 0.05, 0.05);
  const blue = rgb(0.05, 0.18, 0.52);
  const gray = rgb(0.25, 0.25, 0.25);

  const margin = 36;
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - (margin * 2),
    height: height - (margin * 2),
    borderColor: red,
    borderWidth: 1.2
  });

  page.drawLine({ start: { x: width / 2, y: margin }, end: { x: width / 2, y: height - margin }, color: blue, thickness: 0.8 });
  page.drawLine({ start: { x: margin, y: height / 2 }, end: { x: width - margin, y: height / 2 }, color: blue, thickness: 0.8 });

  page.drawText("CERTIFICATE PRINTER ALIGNMENT TEST PAGE", {
    x: 72,
    y: height - 52,
    size: 14,
    font: bold,
    color: red
  });

  page.drawText("If this border or crosshair is clipped, adjust printer margins/scaling to 100% actual size.", {
    x: 72,
    y: height - 72,
    size: 10,
    font,
    color: gray
  });

  page.drawText(`Generated: ${new Date().toLocaleString("en-US")}`, {
    x: 72,
    y: 44,
    size: 9,
    font,
    color: gray
  });

  return pdfDoc.save({ useObjectStreams: false });
}

function getRecipientName(formValues) {
  return formValues.certificateType === "promotion"
    ? formValues.cadetName
    : formValues.certificateType === "award"
      ? formValues.awardRecipient
      : formValues.activityRecipient;
}

async function generatePNG(formValues) {
  if (!window.html2canvas) {
    throw new Error("PNG export requires html2canvas.");
  }

  const previewNode = document.querySelector(".certificate-preview");
  if (!previewNode) {
    throw new Error("Preview container missing.");
  }

  const canvas = await window.html2canvas(previewNode, {
    backgroundColor: "#ffffff",
    scale: 3,
    useCORS: true
  });

  const fileName = `${sanitizeFileName(getRecipientName(formValues))}-certificate.png`;
  triggerDataUrlDownload(canvas.toDataURL("image/png"), fileName);
}

async function generateExport() {
  const formValues = getFormValues();
  const exportFormat = getValue("exportFormat", "pdf");

  try {
    if (exportFormat === "png") {
      await generatePNG(formValues);
      return;
    }

    const finalBytes = exportFormat === "pdf-print"
      ? await generatePrintQualityPDFBytes(formValues)
      : await generatePDFBytes(formValues);

    triggerDownload(new Blob([finalBytes], { type: "application/pdf" }), `${sanitizeFileName(getRecipientName(formValues))}-certificate.pdf`);
  } catch (error) {
    if (String(error.message || "").includes("blocked terms")) {
      downloadNonsenseImage();
      return;
    }

    const status = byId("bulkStatus");
    if (status) status.textContent = "Unable to generate certificate. Please verify your inputs and try again.";
    console.error(error);
  }
}

async function generatePrintTestPage() {
  try {
    const testPdfBytes = await generatePrintTestPDFBytes();
    triggerDownload(new Blob([testPdfBytes], { type: "application/pdf" }), "certificate-print-test-page.pdf");
  } catch (error) {
    const status = byId("bulkStatus");
    if (status) status.textContent = "Unable to generate print test page right now.";
    console.error(error);
  }
}

async function handleBulkUpload(file) {
  const status = byId("bulkStatus");
  const baseValues = getFormValues();

  if (!file) return;
  if (!(window.JSZip)) {
    if (status) status.textContent = "Bulk generation requires JSZip to be available.";
    return;
  }

  const certificateType = baseValues.certificateType;
  if (!getCsvHeaders(certificateType)) {
    if (status) status.textContent = "Bulk generation is currently available for Promotion and Activities only.";
    return;
  }

  const text = await file.text();
  const rows = parseCSV(text);

  if (!rows.length) {
    if (status) status.textContent = "The uploaded CSV is empty.";
    return;
  }

  const headers = rows[0];
  const headerError = validateCsvHeaders(headers, certificateType);
  if (headerError) {
    if (status) status.textContent = headerError;
    return;
  }

  const bodyRows = rows.slice(1).filter((row) => row.some((cell) => cell && cell.trim()));
  if (!bodyRows.length) {
    if (status) status.textContent = "No data rows found in CSV.";
    return;
  }

  const zip = new JSZip();
  const skippedRows = [];

  for (let i = 0; i < bodyRows.length; i += 1) {
    const row = bodyRows[i];
    const rowValues = mapRowToFormValues(baseValues, headers, row);

    try {
      const pdfBytes = await generatePDFBytes(rowValues);
      const recipient = rowValues.certificateType === "promotion" ? rowValues.cadetName : rowValues.activityRecipient;
      zip.file(`${String(i + 1).padStart(3, "0")}-${sanitizeFileName(recipient)}-certificate.pdf`, pdfBytes);
    } catch (error) {
      skippedRows.push(i + 2);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  triggerDownload(zipBlob, `${certificateType}-certificates.zip`);

  if (status) {
    status.textContent = skippedRows.length
      ? `ZIP downloaded. ${bodyRows.length - skippedRows.length} certificates created. Skipped CSV row(s): ${skippedRows.join(", ")}.`
      : `ZIP downloaded with ${bodyRows.length} certificates.`;
  }
}

function bindFormEvents() {
  document.querySelectorAll("input, select").forEach((el) => {
    const handler = () => {
      if (el.id === "achievementNumber") syncAchievementFields();
      if (el.id === "certificateType") syncCertificateTypeFields();
      updatePreview();
    };

    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  });
}

function bindBulkEvents() {
  const downloadTemplateBtn = byId("downloadTemplateBtn");
  const uploadCsvBtn = byId("uploadCsvBtn");
  const bulkCsvInput = byId("bulkCsvInput");

  downloadTemplateBtn?.addEventListener("click", downloadCsvTemplate);

  uploadCsvBtn?.addEventListener("click", () => {
    bulkCsvInput?.click();
  });

  bulkCsvInput?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    await handleBulkUpload(file);
    event.target.value = "";
  });
}

function initializePromotionDate() {
  const promotionDate = byId("promotionDate");
  if (!promotionDate?.value) {
    promotionDate.value = new Date().toISOString().slice(0, 10);
  }
}

function initialize() {
  const disclaimerModal = byId("disclaimerModal");
  const openDisclaimer = () => disclaimerModal?.classList.remove("hidden");
  const closeDisclaimer = () => disclaimerModal?.classList.add("hidden");

  syncAchievementFields();
  syncCertificateTypeFields();
  initializePromotionDate();
  bindFormEvents();
  bindBulkEvents();
  byId("downloadBtn")?.addEventListener("click", generateExport);
  byId("printTestBtn")?.addEventListener("click", generatePrintTestPage);
  byId("resetBtn")?.addEventListener("click", applyDefaultValues);
  byId("openDisclaimerBtn")?.addEventListener("click", openDisclaimer);
  byId("closeDisclaimerBtn")?.addEventListener("click", closeDisclaimer);
  byId("closeDisclaimerBackdrop")?.addEventListener("click", closeDisclaimer);
  disclaimerModal?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === "closeDisclaimerBtn" || target.id === "closeDisclaimerBackdrop") {
      closeDisclaimer();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && disclaimerModal && !disclaimerModal.classList.contains("hidden")) {
      closeDisclaimer();
    }
  });
  updatePreview();
}

initialize();
