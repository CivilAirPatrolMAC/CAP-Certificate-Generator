const ranks = [
  "Cadet Airman",
  "Cadet Airman First Class",
  "Cadet Senior Airman",
  "Cadet Staff Sergeant",
  "Cadet Technical Sergeant",
  "Cadet Master Sergeant",
  "Cadet Senior Master Sergeant",
  "Cadet Chief Master Sergeant",
  "Cadet Second Lieutenant",
  "Cadet First Lieutenant",
  "Cadet Captain",
  "Cadet Major",
  "Cadet Lieutenant Colonel"
];

const cadetNameInput = document.getElementById("cadetName");
const cadetRankSelect = document.getElementById("cadetRank");
const promotionDateInput = document.getElementById("promotionDate");
const unitNameInput = document.getElementById("unitName");
const commanderNameInput = document.getElementById("commanderName");
const commanderTitleInput = document.getElementById("commanderTitle");

const previewName = document.getElementById("previewName");
const previewRank = document.getElementById("previewRank");
const previewDate = document.getElementById("previewDate");
const previewUnit = document.getElementById("previewUnit");
const previewCommander = document.getElementById("previewCommander");
const printButton = document.getElementById("printButton");

function populateRanks() {
  ranks.forEach((rank) => {
    const option = document.createElement("option");
    option.value = rank;
    option.textContent = rank;
    cadetRankSelect.appendChild(option);
  });
}

function formatDate(value) {
  if (!value) return "Date to be entered";

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function updatePreview() {
  previewName.textContent = cadetNameInput.value.trim() || "Cadet Jane Q. Sample";
  previewRank.textContent = cadetRankSelect.value || "Cadet Airman";
  previewDate.textContent = formatDate(promotionDateInput.value);
  previewUnit.textContent = unitNameInput.value.trim() || "Example Composite Squadron";

  const commanderName = commanderNameInput.value.trim() || "Capt John Smith, CAP";
  const commanderTitle = commanderTitleInput.value.trim() || "Squadron Commander";

  previewCommander.innerHTML = `${commanderName}<br>${commanderTitle}`;
}

function initializeDefaults() {
  cadetNameInput.value = "Cadet Jane Q. Sample";
  promotionDateInput.value = new Date().toISOString().slice(0, 10);
  unitNameInput.value = "Example Composite Squadron";
  commanderNameInput.value = "Capt John Smith, CAP";
  commanderTitleInput.value = "Squadron Commander";
}

[cadetNameInput, cadetRankSelect, promotionDateInput, unitNameInput, commanderNameInput, commanderTitleInput]
  .forEach((element) => {
    element.addEventListener("input", updatePreview);
    element.addEventListener("change", updatePreview);
  });

printButton.addEventListener("click", () => {
  window.print();
});

populateRanks();
initializeDefaults();
cadetRankSelect.value = "Cadet Airman";
updatePreview();
