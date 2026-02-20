const TOTAL_DAYS = 30;
const COLS = 8;

const daysContainer = document.getElementById("days-container");
const fastedCountEl = document.getElementById("fasted-count");
const daysLeftEl = document.getElementById("days-left");

// Modal
const overlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const btnFasted = document.getElementById("btn-fasted");
const btnMakeup = document.getElementById("btn-makeup");
const btnClear = document.getElementById("btn-clear");
const btnCancel = document.getElementById("btn-cancel");

let selectedDayIndex = null;

// Arabic digits: ٠١٢٣٤٥٦٧٨٩
function toArabicNumber(num) {
  return String(num).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
}

// "none" | "fasted" | "makeup"
function loadState() {
  const raw = localStorage.getItem("ramadanTrackerStateV2");
  if (!raw) return Array(TOTAL_DAYS).fill("none");

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== TOTAL_DAYS) {
      return Array(TOTAL_DAYS).fill("none");
    }
    return parsed.map((v) => (v === "fasted" || v === "makeup" ? v : "none"));
  } catch {
    return Array(TOTAL_DAYS).fill("none");
  }
}

function saveState(state) {
  localStorage.setItem("ramadanTrackerStateV2", JSON.stringify(state));
}

let state = loadState();

function updateStats() {
  const fasted = state.filter((v) => v === "fasted").length;
  const makeup = state.filter((v) => v === "makeup").length;

  // Days left = not marked yet
  const left = TOTAL_DAYS - (fasted + makeup);

  fastedCountEl.innerHTML = `Days Fasted: <span class="stat-number">${fasted}</span>`;
  daysLeftEl.innerHTML = `Days Left: <span class="stat-number">${left}</span>`;
}

function openModal(dayIndex) {
  selectedDayIndex = dayIndex;
  modalTitle.textContent = `Day ${toArabicNumber(dayIndex + 1)}`;
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

function closeModal() {
  selectedDayIndex = null;
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

function setStatus(status) {
  if (selectedDayIndex === null) return;
  state[selectedDayIndex] = status; // "fasted" | "makeup" | "none"
  saveState(state);
  render();
  closeModal();
}

function render() {
  daysContainer.innerHTML = "";

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";

    if (state[i] === "fasted") cell.classList.add("fasted");
    if (state[i] === "makeup") cell.classList.add("makeup");

    cell.textContent = toArabicNumber(i + 1);
    cell.addEventListener("click", () => openModal(i));

    daysContainer.appendChild(cell);
  }

  updateStats();
}

// Modal button events
btnFasted.addEventListener("click", () => setStatus("fasted"));
btnMakeup.addEventListener("click", () => setStatus("makeup"));
btnClear.addEventListener("click", () => setStatus("none"));
btnCancel.addEventListener("click", closeModal);

// Click outside modal closes it
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

render();