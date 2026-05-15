const taskInput = document.querySelector(".main-content__task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskContainer = document.querySelector(".main-content__tasks-container");

const filter = document.querySelector(".main-content__filter-select");
const searchInput = document.querySelector(".main-content__search-input");

// Adding tasks functionality
addTaskBtn.addEventListener("click", () => {
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
  tag.textContent = "Work";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("main-content__task-card-delete-btn");
  deleteBtn.textContent = "🗑️";

  right.appendChild(tag);
  right.appendChild(deleteBtn);

  taskCard.appendChild(left);
  taskCard.appendChild(right);

  taskContainer.appendChild(taskCard);

  applyFilters();
  updateProgress();

  taskInput.value = "";
});

taskContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("main-content__task-card-delete-btn")) {
    e.target.closest(".main-content__task-card").remove();
    applyFilters();
    updateProgress();
  }

  if (e.target.classList.contains("main-content__task-card-checkbox")) {
    const taskCard = e.target.closest(".main-content__task-card");

    if (e.target.checked) {
      taskCard.classList.add("main-content__task-card--completed");
    } else {
      taskCard.classList.remove("main-content__task-card--completed");
    }

    applyFilters();
    updateProgress();
  }
});


// FILTER + SEARCH TOGETHER
function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  const filterValue = filter.value;

  const tasks = document.querySelectorAll(".main-content__task-card");

  tasks.forEach((task) => {
    const text = task
      .querySelector(".main-content__task-card-text")
      .textContent
      .toLowerCase();

    const isCompleted = task.classList.contains(
      "main-content__task-card--completed"
    );

    const matchesSearch = text.includes(searchValue);

    let matchesFilter = true;

    if (filterValue === "Completed") {
      matchesFilter = isCompleted;
    }

    if (filterValue === "Active") {
      matchesFilter = !isCompleted;
    }

    const shouldShow = matchesSearch && matchesFilter;

    task.style.display = shouldShow ? "flex" : "none";
  });
}


// EVENTS
filter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);


// PROGRESS BAR
const progressFill = document.querySelector(".main-content__progress-fill");
const progressText = document.querySelector(".main-content__progress-info-text");
const progressPercentage = document.querySelector(".main-content__progress-info-percentage");

function updateProgress() {
  const tasks = document.querySelectorAll(".main-content__task-card");
  let completedCount = 0;

  tasks.forEach(task => {
    const checkbox = task.querySelector(".main-content__task-card-checkbox");

    if (checkbox && checkbox.checked) {
      completedCount++;
    }
  });

  const totalTasks = tasks.length;

  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  progressFill.style.width = `${progressPercent}%`;
  progressText.textContent =
    `${completedCount} of ${totalTasks} tasks completed`;
  progressPercentage.textContent = `${progressPercent}%`;
}

updateProgress();