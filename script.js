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

const cadetRank = document.getElementById("cadetRank");

ranks.forEach(r => {
  const option = document.createElement("option");
  option.textContent = r;
  cadetRank.appendChild(option);
});

const inputs = [
  "cadetName",
  "cadetRank",
  "promotionDate",
  "unitName",
  "commanderName",
  "commanderTitle"
];

function formatDate(val) {
  if (!val) return "";
  const d = new Date(val + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function update() {
  document.getElementById("previewName").textContent =
    document.getElementById("cadetName").value || "Cadet Name";

  document.getElementById("previewRank").textContent =
    cadetRank.value;

  document.getElementById("previewDate").textContent =
    formatDate(document.getElementById("promotionDate").value);

  document.getElementById("previewUnit").textContent =
    document.getElementById("unitName").value || "";

  document.getElementById("previewCommander").innerHTML =
    (document.getElementById("commanderName").value || "") +
    "<br>" +
    (document.getElementById("commanderTitle").value || "");
}

inputs.forEach(id => {
  document.getElementById(id).addEventListener("input", update);
});

document.getElementById("printButton").onclick = () => window.print();

// defaults
document.getElementById("cadetName").value = "Cadet Jane Q. Sample";
document.getElementById("unitName").value = "Example Composite Squadron";
document.getElementById("commanderName").value = "Capt John Smith, CAP";
document.getElementById("commanderTitle").value = "Squadron Commander";
document.getElementById("promotionDate").value =
  new Date().toISOString().slice(0, 10);

update();
