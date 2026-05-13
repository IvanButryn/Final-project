const taskInput = document.querySelector(".main-content__task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskContainer = document.querySelector(".main-content__tasks-container");

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

  taskInput.value = "";
});

taskContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("main-content__task-card-delete-btn")) {
    e.target.closest(".main-content__task-card").remove();
  }
});

const checkboxes = document.querySelectorAll(
  ".main-content__task-card-checkbox",
);

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    const taskCard = e.target.closest(".main-content__task-card");

    if (e.target.checked) {
      taskCard.classList.add("main-content__task-card--completed");
    } else {
      taskCard.classList.remove("main-content__task-card--completed");
    }
  });
});
