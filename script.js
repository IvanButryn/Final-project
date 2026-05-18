const taskInput = document.querySelector(".main-content__task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskContainer = document.querySelector(".main-content__tasks-container");
let activeCategory = "Today";

const categorySelect = document.querySelector(
  ".main-content__task-category-select",
);
const filter = document.querySelector(".main-content__filter-select");
const searchInput = document.querySelector(".main-content__search-input");

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (taskInput.value.trim() === "") {
    alert("Enter a task");
    return;
  }

  const category = categorySelect.value;

  let tagText = category;
  let tagClass = "";

  if (category === "work") {
    tagText = "Work";
    tagClass = "main-content__task-card-tag--work";
  }

  if (category === "personal") {
    tagText = "Personal";
    tagClass = "main-content__task-card-tag--personal";
  }

  if (category === "study") {
    tagText = "Study";
    tagClass = "main-content__task-card-tag--study";
  }

  const taskCard = document.createElement("div");
  taskCard.classList.add("main-content__task-card");

  const left = document.createElement("div");
  left.classList.add("main-content__task-card-left");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("main-content__task-card-checkbox");

  const text = document.createElement("p");
  text.classList.add("main-content__task-card-text");
  text.textContent = taskInput.value;

  left.appendChild(checkbox);
  left.appendChild(text);

  const right = document.createElement("div");
  right.classList.add("main-content__task-card-right");

  const tag = document.createElement("span");
  tag.classList.add("main-content__task-card-tag");

  if (tagClass) tag.classList.add(tagClass);

  tag.textContent = tagText;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("main-content__task-card-delete-btn");
  deleteBtn.textContent = "🗑️";

  right.appendChild(tag);
  right.appendChild(deleteBtn);

  taskCard.appendChild(left);
  taskCard.appendChild(right);

  taskContainer.appendChild(taskCard);

  saveTasks();
  applyFilters();
  updateProgress();
  updateSidebarCounts();

  taskInput.value = "";
});

taskContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("main-content__task-card-delete-btn")) {
    e.target.closest(".main-content__task-card").remove();

    saveTasks();
    applyFilters();
    updateProgress();
    updateSidebarCounts();
  }

  if (e.target.classList.contains("main-content__task-card-checkbox")) {
    const taskCard = e.target.closest(".main-content__task-card");

    taskCard.classList.toggle(
      "main-content__task-card--completed",
      e.target.checked,
    );

    saveTasks();
    applyFilters();
    updateProgress();
    updateSidebarCounts();
  }
});

taskContainer.addEventListener("dblclick", (e) => {
  if (e.target.classList.contains("main-content__task-card-text")) {
    const textElement = e.target;

    textElement.contentEditable = true;
    textElement.focus();

    textElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        textElement.contentEditable = false;

        saveTasks();
        applyFilters();
        updateProgress();
        updateSidebarCounts();
      }
    });
  }
});

// FILTER + SEARCH
function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  const filterValue = filter.value;

  document.querySelectorAll(".main-content__task-card").forEach((task) => {
    const text = task
      .querySelector(".main-content__task-card-text")
      .textContent.toLowerCase();

    const isCompleted = task.classList.contains(
      "main-content__task-card--completed",
    );

    const tag = task.querySelector(".main-content__task-card-tag");
    const tagName = tag ? tag.textContent.trim() : "";

    const matchesSearch = text.includes(searchValue);

    let matchesFilter = true;
    if (filterValue === "Completed") matchesFilter = isCompleted;
    if (filterValue === "Active") matchesFilter = !isCompleted;

    let matchesCategory =
      activeCategory === "Today" || tagName === activeCategory;

    task.style.display =
      matchesSearch && matchesFilter && matchesCategory ? "flex" : "none";
  });
}

filter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// PROGRESS
const progressFill = document.querySelector(".main-content__progress-fill");
const progressText = document.querySelector(
  ".main-content__progress-info-text",
);
const progressPercentage = document.querySelector(
  ".main-content__progress-info-percentage",
);

function updateProgress() {
  const tasks = document.querySelectorAll(".main-content__task-card");
  const completed = document.querySelectorAll(
    ".main-content__task-card--completed",
  ).length;

  const total = tasks.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressFill.style.width = percent + "%";
  progressText.textContent = `${completed} of ${total} tasks completed`;
  progressPercentage.textContent = percent + "%";
}

// SIDEBAR
function updateSidebarCounts() {
  const tasks = document.querySelectorAll(".main-content__task-card");

  let total = tasks.length;
  let work = 0;
  let personal = 0;
  let study = 0;

  tasks.forEach((task) => {
    const tag = task.querySelector(".main-content__task-card-tag");

    if (!tag) return;

    if (tag.classList.contains("main-content__task-card-tag--work")) work++;
    if (tag.classList.contains("main-content__task-card-tag--personal"))
      personal++;
    if (tag.classList.contains("main-content__task-card-tag--study")) study++;
  });

  const todayEl = document.getElementById("today-count");
  const workEl = document.getElementById("work-count");
  const studyEl = document.getElementById("study-count");
  const personalEl = document.getElementById("personal-count");

  if (todayEl) todayEl.textContent = total;
  if (workEl) workEl.textContent = work;
  if (studyEl) studyEl.textContent = study;
  if (personalEl) personalEl.textContent = personal;
}

// LOCAL STORAGE
function saveTasks() {
  const tasks = [];

  document.querySelectorAll(".main-content__task-card").forEach((task) => {
    const text = task.querySelector(
      ".main-content__task-card-text",
    ).textContent;
    const isCompleted = task.classList.contains(
      "main-content__task-card--completed",
    );

    const tag = task.querySelector(".main-content__task-card-tag");
    if (!tag) return;

    const tagText = tag.textContent;

    let tagType = "";

    if (tag.classList.contains("main-content__task-card-tag--work"))
      tagType = "work";
    if (tag.classList.contains("main-content__task-card-tag--personal"))
      tagType = "personal";
    if (tag.classList.contains("main-content__task-card-tag--study"))
      tagType = "study";

    tasks.push({ text, isCompleted, tagText, tagType });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const data = JSON.parse(localStorage.getItem("tasks")) || [];

  taskContainer.innerHTML = "";

  data.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.classList.add("main-content__task-card");

    if (task.isCompleted) {
      taskCard.classList.add("main-content__task-card--completed");
    }

    const left = document.createElement("div");
    left.classList.add("main-content__task-card-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("main-content__task-card-checkbox");
    checkbox.checked = task.isCompleted;

    const text = document.createElement("p");
    text.classList.add("main-content__task-card-text");
    text.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(text);

    const right = document.createElement("div");
    right.classList.add("main-content__task-card-right");

    const tag = document.createElement("span");
    tag.classList.add("main-content__task-card-tag");

    if (task.tagType) {
      tag.classList.add(`main-content__task-card-tag--${task.tagType}`);
    }

    tag.textContent = task.tagText;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("main-content__task-card-delete-btn");
    deleteBtn.textContent = "🗑️";

    right.appendChild(tag);
    right.appendChild(deleteBtn);

    taskCard.appendChild(left);
    taskCard.appendChild(right);

    taskContainer.appendChild(taskCard);
  });

  applyFilters();
  updateProgress();
  updateSidebarCounts();
}

loadTasks();

// RESET MODAL
document.addEventListener("DOMContentLoaded", () => {
  const clearStorageBtn = document.getElementById("clear-storage-btn");
  const modal = document.getElementById("reset-modal");
  const cancelBtn = document.getElementById("cancel-reset");
  const confirmBtn = document.getElementById("confirm-reset");

  if (!clearStorageBtn || !modal || !cancelBtn || !confirmBtn) {
    console.log("RESET ELEMENTS NOT FOUND");
    return;
  }

  clearStorageBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  confirmBtn.addEventListener("click", () => {
    localStorage.removeItem("tasks");

    taskContainer.innerHTML = "";

    updateProgress();
    updateSidebarCounts();
    applyFilters();

    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
});

// DARK MODE

const darkModeBtn = document.getElementById("dark-mode-btn");

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

// SIDEBAR CATEGORIES FUNCTIONAL

const categorySidebar = document.querySelectorAll(".sidebar__list-item");
const textThatHaveToBeChngd = document.querySelector(".main-content__title");

categorySidebar.forEach((cat) => {
  cat.addEventListener("click", () => {
    const categoryName = cat
      .querySelector(".sidebar__list-item-name")
      .textContent.trim();

    activeCategory = categoryName;

    if (categoryName === "Work") {
      textThatHaveToBeChngd.textContent = "💼 Work";
    } else if (categoryName === "Personal") {
      textThatHaveToBeChngd.textContent = "👤 Personal";
    } else if (categoryName === "Study") {
      textThatHaveToBeChngd.textContent = "📚 Study";
    } else {
      textThatHaveToBeChngd.textContent = "☀️ Today";
    }
  });
});

// this part changes tasks depending on category
categorySidebar.forEach((cat) => {
  cat.addEventListener("click", () => {
    categorySidebar.forEach((c) => c.classList.remove("sidebar__list-item--active"));
    cat.classList.add("sidebar__list-item--active");
    const categoryName = cat
      .querySelector(".sidebar__list-item-name")
      .textContent.trim();

    const tasks = document.querySelectorAll(".main-content__task-card");

    tasks.forEach((task) => {
      const tag = task.querySelector(".main-content__task-card-tag");

      if (categoryName === "Today") {
        task.style.display = "flex";
        return;
      }

      const tagName = tag ? tag.textContent.trim() : "";

      task.style.display = tagName === categoryName ? "flex" : "none";
    });
  });
});
