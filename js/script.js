document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // 2. Interactive Academic Planner (planner.html)
  const plannerForm = document.getElementById("plannerForm");
  const taskListEl = document.getElementById("taskList");
  const taskCounterEl = document.getElementById("taskCounter");
  const emptyMessageEl = document.getElementById("emptyMessage");

  if (plannerForm && taskListEl) {
    // Load existing tasks from localStorage or initialize default sample array
    let tasks = JSON.parse(localStorage.getItem("cos106_tasks")) || [
      {
        id: 1,
        title: "Submit COS 106 Responsive Portfolio Website",
        course: "COS 106",
        dueDate: "2026-11-20",
        completed: false
      }
    ];

    function saveTasks() {
      localStorage.setItem("cos106_tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
      taskListEl.innerHTML = "";
      taskCounterEl.textContent = `${tasks.length} ${tasks.length === 1 ? "Task" : "Tasks"}`;

      if (tasks.length === 0) {
        emptyMessageEl.style.display = "block";
        return;
      }

      emptyMessageEl.style.display = "none";

      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
          <div>
            <strong class="task-title">${escapeHTML(task.title)}</strong>
            <div class="task-meta">Course: ${escapeHTML(task.course)} &bull; Due: ${escapeHTML(task.dueDate)}</div>
          </div>
          <div class="task-actions">
            <button type="button" class="btn-sm btn-complete" data-action="toggle" data-id="${task.id}">
              ${task.completed ? "Undo" : "Complete"}
            </button>
            <button type="button" class="btn-sm btn-delete" data-action="delete" data-id="${task.id}">
              Delete
            </button>
          </div>
        `;

        taskListEl.appendChild(li);
      });
    }

    function addTask(title, course, dueDate) {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        course: course.trim().toUpperCase(),
        dueDate: dueDate,
        completed: false
      };
      tasks.push(newTask);
      saveTasks();
      renderTasks();
    }

    function toggleTask(id) {
      tasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      saveTasks();
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
    }

    // Handle Add Task Form Submission
    plannerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const titleInput = document.getElementById("taskTitle");
      const courseInput = document.getElementById("taskCourse");
      const dateInput = document.getElementById("taskDate");

      if (!titleInput.value.trim() || !courseInput.value.trim() || !dateInput.value) {
        return;
      }

      addTask(titleInput.value, courseInput.value, dateInput.value);
      plannerForm.reset();
    });

    // Event Delegation for Complete & Delete Buttons
    taskListEl.addEventListener("click", (event) => {
      const btn = event.target.closest("button");
      if (!btn) return;

      const taskId = Number(btn.dataset.id);
      const action = btn.dataset.action;

      if (action === "toggle") {
        toggleTask(taskId);
      } else if (action === "delete") {
        deleteTask(taskId);
      }
    });

    renderTasks();
  }

  // 3. Contact Form Validation (contact.html)
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const fullName = document.getElementById("fullName").value.trim();
      const emailAddress = document.getElementById("emailAddress").value.trim();
      const phoneNumber = document.getElementById("phoneNumber").value.trim();
      const message = document.getElementById("message").value.trim();

      const nameError = document.getElementById("nameError");
      const emailError = document.getElementById("emailError");
      const phoneError = document.getElementById("phoneError");
      const messageError = document.getElementById("messageError");
      const formFeedback = document.getElementById("formFeedback");

      // Clear previous messages
      nameError.textContent = "";
      emailError.textContent = "";
      phoneError.textContent = "";
      messageError.textContent = "";
      formFeedback.textContent = "";
      formFeedback.className = "form-feedback";

      let isValid = true;

      // Validate Name (Not Empty)
      if (fullName === "") {
        nameError.textContent = "Full name is required.";
        isValid = false;
      }

      // Validate Email (Not Empty & Valid Format)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailAddress === "") {
        emailError.textContent = "Email address is required.";
        isValid = false;
      } else if (!emailPattern.test(emailAddress)) {
        emailError.textContent = "Please enter a valid email address (e.g., name@example.com).";
        isValid = false;
      }

      // Validate Phone Number (Not Empty & Digits Only)
      const digitsOnlyPattern = /^\d+$/;
      if (phoneNumber === "") {
        phoneError.textContent = "Phone number is required.";
        isValid = false;
      } else if (!digitsOnlyPattern.test(phoneNumber)) {
        phoneError.textContent = "Phone number must contain only digits (0-9).";
        isValid = false;
      }

      // Validate Message (Not Empty)
      if (message === "") {
        messageError.textContent = "Please enter a message.";
        isValid = false;
      }

      if (isValid) {
        formFeedback.textContent = "Thank you! Your message has been validated and submitted.";
        formFeedback.classList.add("success");
        contactForm.reset();
      } else {
        formFeedback.textContent = "Please fix the errors highlighted above before submitting.";
        formFeedback.classList.add("error");
      }
    });
  }

  // Helper to prevent HTML injection when rendering user tasks
  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});
