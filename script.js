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

const rankSelect = document.getElementById("rank");
const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");

const previewName = document.getElementById("previewName");
const previewRank = document.getElementById("previewRank");
const previewDate = document.getElementById("previewDate");

// Populate dropdown
ranks.forEach(rank => {
  const option = document.createElement("option");
  option.textContent = rank;
  rankSelect.appendChild(option);
});

// Format date nicely
function formatDate(value) {
  if (!value) return "Date";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// Update preview
function updatePreview() {
  previewName.textContent = nameInput.value || "Name";
  previewRank.textContent = rankSelect.value;
  previewDate.textContent = formatDate(dateInput.value);
}

// Event listeners
[nameInput, rankSelect, dateInput].forEach(el => {
  el.addEventListener("input", updatePreview);
});

// Print
document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});

// Initialize
updatePreview();
