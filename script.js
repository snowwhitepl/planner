const monthYearDisplay = document.getElementById("monthYear");
const daysContainer = document.getElementById("calendarDays");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const noteModal = document.getElementById("noteModal");
const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNote");
const deleteNoteBtn = document.getElementById("deleteNote");
const closeModalBtn = document.getElementById("closeModal");
const categoryButtons = document.querySelectorAll(".note-categories button");
const checklist = document.getElementById("checklist");
const newTaskInput = document.getElementById("newTaskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importInput = document.getElementById("importInput");

let currentDate = new Date();
let selectedNoteKey = null;
let selectedCategory = "";
let checklistItems = [];

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  monthYearDisplay.textContent = currentDate.toLocaleString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  daysContainer.innerHTML = "";

  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < startDay; i++) {
    daysContainer.appendChild(document.createElement("div"));
  }

  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement("div");
    day.textContent = i;

    const noteKey = `${year}-${month}-${i}`;
    const savedData = localStorage.getItem(noteKey);
    let note = "", category = "";

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        note = parsed.note;
        category = parsed.category;

        if (category === "work") day.style.backgroundColor = "#3867d6";
        if (category === "personal") day.style.backgroundColor = "#20bf6b";
        if (category === "important") day.style.backgroundColor = "#eb3b5a";
      } catch (e) {
        note = savedData;
      }
    }

    const today = new Date();
    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    day.addEventListener("click", () => {
      selectedNoteKey = noteKey;
      noteInput.value = note || "";
      selectedCategory = category || "";
      checklistItems = (JSON.parse(savedData)?.checklist) || [];

      categoryButtons.forEach((b) => b.classList.remove("selected"));
      if (selectedCategory) {
        const btn = document.querySelector(`.note-categories button[data-category="${selectedCategory}"]`);
        if (btn) btn.classList.add("selected");
      }

      renderChecklist();
      noteModal.style.display = "flex";
    });

    daysContainer.appendChild(day);
  }
}

function renderChecklist() {
  checklist.innerHTML = "";
  checklistItems.forEach((item, index) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      checklistItems[index].done = checkbox.checked;
    });

    const text = document.createElement("span");
    text.textContent = item.text;

    li.appendChild(checkbox);
    li.appendChild(text);
    checklist.appendChild(li);
  });
}

addTaskBtn.addEventListener("click", () => {
  const taskText = newTaskInput.value.trim();
  if (taskText) {
    checklistItems.push({ text: taskText, done: false });
    newTaskInput.value = "";
    renderChecklist();
  }
});

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedCategory = btn.dataset.category;
  });
});

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

saveNoteBtn.addEventListener("click", () => {
  if (selectedNoteKey && noteInput.value.trim()) {
    const noteData = {
      note: noteInput.value.trim(),
      category: selectedCategory,
      checklist: checklistItems,
    };
    localStorage.setItem(selectedNoteKey, JSON.stringify(noteData));
    renderCalendar();
  }
  noteModal.style.display = "none";
});

deleteNoteBtn.addEventListener("click", () => {
  if (selectedNoteKey) {
    localStorage.removeItem(selectedNoteKey);
    renderCalendar();
  }
  noteModal.style.display = "none";
});

closeModalBtn.addEventListener("click", () => {
  noteModal.style.display = "none";
});

exportBtn.addEventListener("click", () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "planner.json";
  a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", () => {
  importInput.click();
});

importInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const data = JSON.parse(reader.result);
      for (const key in data) {
        localStorage.setItem(key, data[key]);
      }
      renderCalendar();
    } catch (e) {
      alert("Nieprawidłowy plik JSON.");
    }
  };
  reader.readAsText(file);
});

renderCalendar();