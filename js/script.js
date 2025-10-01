document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const todoList = document.getElementById("todo-list");
  const filterSelect = document.getElementById("filter-select");
  const deleteAllBtn = document.getElementById("delete-all-btn");
  const taskSummary = document.getElementById("task-summary");

  let todos = [];

  function renderTodos() {
    const filterValue = filterSelect.value;
    let filteredTodos = todos;

    if (filterValue === "pending") {
      filteredTodos = todos.filter((todo) => !todo.completed);
    } else if (filterValue === "completed") {
      filteredTodos = todos.filter((todo) => todo.completed);
    }

    todoList.innerHTML = "";

    if (filteredTodos.length === 0) {
      const noTaskRow = document.createElement("tr");
      const noTaskCell = document.createElement("td");
      noTaskCell.colSpan = 4;
      noTaskCell.className = "no-task";
      noTaskCell.textContent =
        filterValue === "all"
          ? "No tasks yet. Add one!"
          : "No tasks found for this filter.";
      noTaskRow.appendChild(noTaskCell);
      todoList.appendChild(noTaskRow);
    } else {
      filteredTodos.forEach((todo) => {
        const row = document.createElement("tr");
        row.dataset.id = todo.id;

        const taskCell = document.createElement("td");
        taskCell.textContent = todo.task;
        row.appendChild(taskCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = todo.dueDate;
        row.appendChild(dateCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = todo.completed ? "Completed" : "Pending";
        statusCell.className = todo.completed
          ? "status-completed"
          : "status-pending";
        row.appendChild(statusCell);

        const actionsCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "action-btn";
        deleteBtn.dataset.id = todo.id;
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);

        todoList.appendChild(row);
      });
    }

    updateTaskSummary();
  }

  function updateTaskSummary() {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    taskSummary.textContent = `Tasks: ${total} | Completed: ${completed}`;
  }

  function addTodo(task, dueDate) {
    const newTodo = {
      id: Date.now(),
      task,
      dueDate,
      completed: false,
    };
    todos.push(newTodo);
    renderTodos();
  }

  function toggleTodoStatus(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      renderTodos();
    }
  }

  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    renderTodos();
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = todoInput.value.trim();
    const dueDate = dateInput.value;

    addTodo(task, dueDate);
    todoInput.value = "";
    dateInput.value = "";
    todoInput.focus();
  });

  todoList.addEventListener("click", (e) => {
    const target = e.target;
    const row = target.closest("tr");
    if (!row) return;

    const id = Number(row.dataset.id);

    if (target.classList.contains("action-btn")) {
      deleteTodo(id);
    } else {
      toggleTodoStatus(id);
    }
  });

  filterSelect.addEventListener("change", renderTodos);

  deleteAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      todos.length = 0;
      renderTodos();
    }
  });

  renderTodos();
});
