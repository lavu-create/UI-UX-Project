document.addEventListener("DOMContentLoaded", () => {
  // ------------------- Elements -------------------
  const loginModal = document.getElementById("loginModal");
  const openLoginBtn = document.getElementById("openLoginBtn");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const switchToLoginBtn = document.getElementById("switchToLogin");
  const switchToSignupBtn = document.getElementById("switchToSignup");

  // ------------------- Helper Functions -------------------
  const showModal = (modal) => modal.classList.remove("hidden");
  const hideModal = (modal) => modal.classList.add("hidden");

  const saveUserData = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.name || "");
    localStorage.setItem("userEmail", data.email || "");
  };

  const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  };

  const handleError = (error) => {
    console.error(error);
    alert(error.message || "Something went wrong. Please try again.");
  };

  const submitForm = async (url, payload, successMsg) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await handleResponse(response);
      saveUserData(data);
      alert(successMsg);
      hideModal(loginModal);
    } catch (error) {
      handleError(error);
    }
  };

  // ------------------- Modal Controls -------------------
  openLoginBtn.addEventListener("click", () => showModal(loginModal));
  closeLoginModal.addEventListener("click", () => hideModal(loginModal));

  switchToLoginBtn.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  });

  switchToSignupBtn.addEventListener("click", () => {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  // ------------------- Login -------------------
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!email || !password) return alert("Please enter email and password");

    submitForm(
      "https://clario-8rvp.onrender.com/api/users/login",
      { email, password },
      `Logged in successfully! Welcome ${email}`
    );
  });

  // ------------------- Signup -------------------
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    if (!name || !email || !password) return alert("All fields are required");

    submitForm(
      "https://clario-8rvp.onrender.com/api/users/register",
      { name, email, password },
      `Signup successful! Welcome ${name}`
    );
  });

  // ------------------- Initialize -------------------
  console.log("Login/Signup module initialized");

  const openInfoBtn = document.getElementById("openInfoBtn"); // your Info button
  const infoModal = document.getElementById("infoModal");     // Info modal container
  const closeInfoModal = document.getElementById("closeInfoModal"); // Close button in modal
  const infoName = document.getElementById("infoName");       // element to show name
  const infoEmail = document.getElementById("infoEmail");     // element to show email
  const infoProfilePic = document.getElementById("infoProfilePic"); // element to show profile pic
  const profPicBtn = document.getElementById("profilePicBtn"); // existing profile pic in sidebar
  // Open Info modal
  openInfoBtn.addEventListener("click", () => {
    // Set user info from localStorage
    infoName.textContent = localStorage.getItem("userName") || "Unknown";
    infoEmail.textContent = localStorage.getItem("userEmail") || "Unknown";
    // Set profile pic from sidebar
    infoProfilePic.src = profPicBtn.src;
    infoModal.classList.remove("hidden");
  });
  // Close Info modal
  closeInfoModal.addEventListener("click", () => {
    infoModal.classList.add("hidden");
  });

  const menuBtn = document.getElementById('menuToggle');
  const sidebar = document.querySelector(".sidebar");
  const sidebarWrapper = document.querySelector('.sidebar-wrapper');
  const container = document.querySelector(".container");
  menuBtn.addEventListener('click', () => {
    sidebarWrapper.classList.toggle('collapsed');
    container.classList.toggle("sidebar-collapsed");
    sidebar.classList.toggle("collapsed");
    sidebar.classList.toggle("expanded");
  });

  const themeToggle = document.getElementById("themeToggle");
  const themeSwitcher = document.getElementById("themeSwitcher");
  const defaultTheme = "sunburst-theme";
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    document.body.className = savedTheme;
    themeSwitcher.value = savedTheme.replace("-theme", "");
  } else {
    document.body.className = defaultTheme;
  }
  function applyTheme(themeName) {
    const themeClass = `${themeName}-theme`;
    document.body.className = themeClass;
    localStorage.setItem("selectedTheme", themeClass);
    themeSwitcher.value = themeName;
    updateStickyNoteOnThemeChange();
  }
  themeToggle.addEventListener("click", () => {
    const current = document.body.className.includes("daylight") ? "daylight" : "moonlight";
    const nextTheme = current === "daylight" ? "moonlight" : "daylight";
    applyTheme(nextTheme);
    updateStickyNoteOnThemeChange();
  });
  themeSwitcher.addEventListener("change", (e) => {
    const selected = e.target.value;
    if (selected) {
      applyTheme(selected)
      updateStickyNoteOnThemeChange();
    }
  });
  const resetThemeBtn = document.getElementById("resetThemeBtn");
  resetThemeBtn.addEventListener("click", () => {
    applyTheme("sunburst");
    themeSwitcher.value = "sunburst";
  });

  const calendar = document.getElementById("calendarGrid");
  const monthTitle = document.getElementById("monthTitle");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  let currentDate = new Date();
  let selectedDate = null;
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  function renderCalendar() {
    calendar.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    monthTitle.textContent = `${currentDate.toLocaleString("default", {
      month: "long",
    })} ${year}`;
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement("div");
      calendar.appendChild(blank);
    }
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    for (let d = 1; d <= daysInMonth; d++) {
      const dayBox = document.createElement("div");
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      if (date === new Date().toISOString().split("T")[0]) {
        dayBox.classList.add("today");
      }
      if (date === selectedDate) {
        dayBox.classList.add("selected-date");
      }
      const selectedCategory = document.getElementById("eventCategoryFilter").value;
      const todayEvents = events.filter((e) => {
        return e.date === date && (selectedCategory === "all" || e.category === selectedCategory);
      });
      dayBox.innerHTML = `<strong>${d}</strong>`;
      if (todayEvents.length > 0) {
        const eventBtn = document.createElement("button");
        eventBtn.className = "calendar-event-btn";
        eventBtn.textContent = `📅 ${todayEvents.length} Event${todayEvents.length > 1 ? "s" : ""}`;
        eventBtn.addEventListener("click", (e) => {
          e.stopPropagation();  // Prevent triggering dayBox click
          openDayEventsModal(date);
        });
        dayBox.appendChild(eventBtn);
      }
      dayBox.addEventListener("click", () => {
        selectedDate = date;
        renderCalendar();
        openDayEventsModal(date);
      });
      calendar.appendChild(dayBox);
    }
  }
  document.getElementById("eventCategoryFilter").addEventListener("change", renderCalendar);

  function openDayEventsModal(date) {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const dayEvents = events
    .map((e, index) => ({ ...e, index }))
    .filter((e) => e.date === date);
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "dayEventsModal";
    const content = document.createElement("div");
    content.className = "modal-content";
    const closeBtn = document.createElement("span");
    closeBtn.className = "close-btn";
    closeBtn.textContent = "×";
    closeBtn.onclick = () => modal.remove();
    const heading = document.createElement("h3");
    heading.textContent = `Events on ${date}`;
    content.appendChild(closeBtn);
    content.appendChild(heading);
    if (dayEvents.length === 0) {
      const noEvents = document.createElement("p");
      noEvents.textContent = "No events on this date.";
      content.appendChild(noEvents);
    } else {
      dayEvents.forEach((e) => {
        const wrapper = document.createElement("div");
        wrapper.className = "event-summary";
        const row = document.createElement("div");
        row.className = "event-title-row";
        const title = document.createElement("strong");
        title.textContent = e.title;
        title.style.cursor = "pointer";
        title.style.textDecoration = "underline";
        title.addEventListener("click", () => {
          eventIndexInput.value = e.index;
          eventTitle.value = e.title;
          eventDesc.value = e.desc;
          eventDate.value = e.date;
          eventCategory.value = e.category;
          deleteEvent.style.display = "inline-block";
          modal.remove(); // close day modal
          eventModal.classList.remove("hidden"); // open edit modal
        });
        const del = document.createElement("button");
        del.textContent = "🗑️";
        del.className = "delete-task-btn";
        del.onclick = () => {
          const modal = document.getElementById("deleteConfirmModal");
          const title = modal.querySelector("h3");
          const confirmBtn = document.getElementById("confirmDeleteBtn");
          const cancelBtn = document.getElementById("cancelDeleteBtn");
          // Set dynamic message and button text
          title.textContent = "Are you sure you want to delete this event?";
          confirmBtn.textContent = "Delete";
          // Replace buttons to clear old listeners
          const newConfirm = confirmBtn.cloneNode(true);
          const newCancel = cancelBtn.cloneNode(true);
          confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
          cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
          // Show modal
          modal.classList.remove("hidden");
          // Handle delete
          newConfirm.addEventListener("click", () => {
            const updated = events.filter((_, i) => i !== e.index);
            localStorage.setItem("events", JSON.stringify(updated));
            modal.classList.add("hidden");
            document.getElementById("dayEventsModal").remove();
            renderCalendar();
            renderEventChart();
          });
          newCancel.addEventListener("click", () => {
            modal.classList.add("hidden");
          });
        };

        const toggle = document.createElement("button");
        toggle.textContent = "🔻";
        toggle.className = "dropdown-toggle";
        toggle.onclick = () => {
          details.classList.toggle("hidden");
          toggle.textContent = details.classList.contains("hidden") ? "🔻" : "🔺";
        };
        row.appendChild(title);
        row.appendChild(toggle);
        row.appendChild(del);
        const details = document.createElement("div");
        details.className = "event-details hidden";
        details.innerHTML = `<p><strong>Category:</strong> ${e.category}</p>
        <p><strong>Description:</strong> ${e.desc || "No description"}</p>
        <p><strong>Time:</strong> ${e.time || "Not set"}</p>`;
        wrapper.appendChild(row);
        wrapper.appendChild(details);
        content.appendChild(wrapper);
      });
    }

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "➕ Add New Event";
    plusBtn.className = "themed-btn";
    plusBtn.onclick = () => {
      eventIndexInput.value = "";
      eventTitle.value = "";
      eventDesc.value = "";
      eventDate.value = date;
      eventCategory.value = "💼 Work";
      deleteEvent.style.display = "none";
      modal.remove();
      eventModal.classList.remove("hidden");
    };
    content.appendChild(plusBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
  document.getElementById("todayBtn").addEventListener("click", () => {
    currentDate = new Date();
    renderCalendar();
  });

  const addEventBtn = document.getElementById("addEventBtn");
  const eventModal = document.getElementById("eventModal");
  const closeModal = eventModal.querySelector(".close-btn");
  const saveEvent = document.getElementById("saveEvent");
  const deleteEvent = document.getElementById("deleteEvent");
  const eventTitle = document.getElementById("eventTitle");
  const eventDesc = document.getElementById("eventDesc");
  const eventDate = document.getElementById("eventDate");
  const eventTime = document.getElementById("eventTime");
  const eventCategory = document.getElementById("eventCategory");
  const eventIndexInput = document.getElementById("eventIndex");
  addEventBtn.addEventListener("click", () => {
    eventIndexInput.value = "";
    eventTitle.value = "";
    eventDesc.value = "";
    eventDate.value = "";
    eventCategory.value = "💼 Work";
    deleteEvent.style.display = eventIndexInput.value !== "" ? "inline-block" : "none";
    eventModal.classList.remove("hidden");
  });
  closeModal.addEventListener("click", () => {
    eventModal.classList.add("hidden");
  });
  saveEvent.addEventListener("click", () => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const newEvent = {
      title: eventTitle.value.trim(),
      desc: eventDesc.value.trim(),
      date: eventDate.value,
      time: eventTime.value,
      category: eventCategory.value,
      notified: false
    };
    const index = eventIndexInput.value;
    if (index !== "") {
      events[index] = newEvent;
    } else {
      events.push(newEvent);
    }
    localStorage.setItem("events", JSON.stringify(events));
    eventModal.classList.add("hidden");
    showSaveNotification("Saved!");
    renderCalendar();
    renderEventChart();
  });
  deleteEvent.addEventListener("click", () => {
    const modal = document.getElementById("deleteConfirmModal");
    const title = modal.querySelector("h3");
    const confirmBtn = document.getElementById("confirmDeleteBtn");
    const cancelBtn = document.getElementById("cancelDeleteBtn");
    title.textContent = "Are you sure you want to delete this event?";
    confirmBtn.textContent = "Delete";
    const newConfirm = confirmBtn.cloneNode(true);
    const newCancel = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
    modal.classList.remove("hidden");
    newConfirm.addEventListener("click", () => {
      const index = parseInt(eventIndexInput.value);
      if (!isNaN(index)) {
        const events = JSON.parse(localStorage.getItem("events") || "[]");
        events.splice(index, 1);
        localStorage.setItem("events", JSON.stringify(events));
        eventModal.classList.add("hidden");
        renderCalendar();
        renderEventChart();
      }
      modal.classList.add("hidden");
    });
    newCancel.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  });

  function showSaveNotification(text) {
    const toast = document.getElementById("notification");
    toast.textContent = text;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2000);
  }


  // ---------------- Clock ------------------
  function updateClock() {
    const clock = document.getElementById("liveClock");
    let savedFormat = localStorage.getItem("timeFormat") || "24";
    setInterval(() => {
      const now = new Date();
      let options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      options.hour12 = savedFormat === "12";
      clock.childNodes[0].nodeValue = now.toLocaleTimeString([], options);
    }, 1000);
    // Live listen to format change without reload
    document.getElementById("timeFormat").addEventListener("change", function() {
      savedFormat = this.value;
      localStorage.setItem("timeFormat", savedFormat);
      showToastNotification("✅ Time Format Updated!");
    });
  }
  updateClock();
  // ---------------- Settings Save ------------------
  const timeFormatSelect = document.getElementById("timeFormat");
  const reminderInput = document.querySelector(".reminder-input");
  const reminderUnitSelect = document.getElementById("eventReminder");
  const reminderSoundSelect = document.getElementById("reminderSound");
  // Load saved values
  timeFormatSelect.value = localStorage.getItem("timeFormat") || "24";
  reminderInput.value = localStorage.getItem("reminderValue") || 4;
  reminderUnitSelect.value = localStorage.getItem("reminderUnit") || "min";
  reminderSoundSelect.value = localStorage.getItem("reminderSound") || "default";
  document.getElementById("settSave").addEventListener("click", () => {
    localStorage.setItem("reminderValue", reminderInput.value);
    localStorage.setItem("reminderUnit", reminderUnitSelect.value);
    localStorage.setItem("reminderSound", reminderSoundSelect.value);
    showToastNotification("✅ Settings Saved!");
  });
  // ---------------- Reminder Check ------------------
  function checkEventReminders() {
    let events = JSON.parse(localStorage.getItem("events") || "[]");
    const reminderValue = parseInt(localStorage.getItem("reminderValue")) || 0;
    const reminderUnit = localStorage.getItem("reminderUnit") || "min";
    if (reminderValue === 0) return;
    const now = new Date();
    events.forEach((event) => {
      if (event.notified) return;
      const eventTime = new Date(`${event.date}T${event.time || "00:00"}`);
      const diffMs = eventTime - now;
      let diffInUnit = 0;
      if (reminderUnit === "min") diffInUnit = diffMs / (60 * 1000);
      else if (reminderUnit === "sec") diffInUnit = diffMs / 1000;
      else if (reminderUnit === "hrs") diffInUnit = diffMs / (60 * 60 * 1000);
      if (diffInUnit > 0 && diffInUnit <= reminderValue) {
        showNotification(`⏰ Reminder: ${event.title} at ${event.date}`);
        event.notified = true;
        localStorage.setItem("events", JSON.stringify(events));
      }
    });
  }
  setInterval(checkEventReminders, 1000);  // Check every second for better accuracy
  // ---------------- Reminder Bell ------------------
  document.getElementById("reminderBell").addEventListener("click", () => {
    stopReminderSound();
    document.getElementById("reminderBell").style.display = "none";
    document.getElementById("reminderToast").classList.remove("show");
  });
  function stopReminderSound() {
    const audio = document.getElementById("reminder-audio");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
  function showToastNotification(message) {
    const toast = document.getElementById('reminderToast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  function showNotification(message) {
    const toast = document.getElementById("reminderToast");
    const bell = document.getElementById("reminderBell");
    toast.textContent = message;
    toast.classList.add("show");
    bell.style.display = "inline";
    playReminderSound();
    // Stop sound when clicking toast
    toast.onclick = () => {
      stopReminderSound();
      toast.classList.remove("show");
      bell.style.display = "none";
    };
  }
  function playReminderSound() {
    const selectedSound = localStorage.getItem("reminderSound") || "default";
    const audio = document.getElementById("reminder-audio");
    let audioSrc = "";
    if (selectedSound === "default")
      audioSrc = "./assets/alarm-default-beep.wav";
    else if (selectedSound === "chime")
      audioSrc = "./assets/alarm-chime.mp3";
    else if (selectedSound === "alarm")
      audioSrc = "./assets/alarm.mp3";
    if (!audioSrc) return;
    if (audio.src !== audioSrc) audio.src = audioSrc;
    if (audio.paused) {
      audio.loop = true;   // ✅ Optional if you want looping reminder
      audio.play().catch((err) => console.warn("Audio play failed:", err));
    }
  }
  document.body.addEventListener("click", function unlockAudio() {
    const audio = document.getElementById("reminder-audio");
    if (audio) audio.play().catch(() => {});
    document.body.removeEventListener("click", unlockAudio);
  });


  const taskList = document.getElementById("taskList");
  const taskInput = document.getElementById("newTaskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  let selectedTaskDate = new Date().toISOString().split("T")[0]; // Default to today
  function renderTasks() {
    const filter = document.getElementById("taskFilter").value;
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    taskList.innerHTML = "";
    if (filter === "all") {
      const allDates = Object.keys(allTasks).sort((a, b) => new Date(b) - new Date(a));
      allDates.forEach(date => {
        const tasks = allTasks[date];
        tasks.forEach((task, index) => {
          const li = document.createElement("li");
          li.dataset.index = index;
          li.draggable = true;
          // Checkbox
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = task.done;
          checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            allTasks[date][index] = task;
            localStorage.setItem("tasks", JSON.stringify(allTasks));
            renderTasks();
            renderTaskChart();
            renderMoodTaskChart();
          });
          // Task Text
          const span = document.createElement("span");
          span.textContent = `${task.text} — 📅 ${date}`;
          // Delete Button
          const delBtn = document.createElement("button");
          delBtn.textContent = "🗑️";
          delBtn.style.marginLeft = "10px";
          delBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            allTasks[date] = tasks;
            localStorage.setItem("tasks", JSON.stringify(allTasks));
            renderTasks();
            renderTaskChart();
          });
          li.appendChild(checkbox);
          li.appendChild(span);
          li.appendChild(delBtn);
          // Drag and drop
          li.addEventListener("dragstart", dragStart);
          li.addEventListener("dragover", dragOver);
          li.addEventListener("drop", drop);
          taskList.appendChild(li);
        });
      });
    } else {
      const tasks = allTasks[selectedTaskDate] || [];
      tasks.forEach((task, index) => {
        if (filter === "done" && !task.done) return;
        if (filter === "pending" && task.done) return;
        const li = document.createElement("li");
        li.dataset.index = index;
        li.draggable = true;
        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => {
          task.done = checkbox.checked;
          allTasks[selectedTaskDate][index] = task;
          localStorage.setItem("tasks", JSON.stringify(allTasks));
          renderTasks();
          renderTaskChart();
        });
        // Task Text
        const span = document.createElement("span");
        span.textContent = task.text;
        // Delete Button
        const delBtn = document.createElement("button");
        delBtn.innerHTML = '<i data-feather="trash-2"></i>';
        delBtn.style.marginLeft = "10px";
        delBtn.addEventListener("click", () => {
          tasks.splice(index, 1);
          allTasks[selectedTaskDate] = tasks;
          localStorage.setItem("tasks", JSON.stringify(allTasks));
          renderTasks();
          renderTaskChart();
        });
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        // Drag and drop
        li.addEventListener("dragstart", dragStart);
        li.addEventListener("dragover", dragOver);
        li.addEventListener("drop", drop);
        taskList.appendChild(li);
      });
    }
  }
  document.getElementById("taskFilter").addEventListener("change", function() {
    renderTasks();  // Refresh when filter changes
  });

  function renderMiniCalendar() {
    const miniCalendar = document.getElementById("miniCalendar");
    if (!miniCalendar) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    miniCalendar.innerHTML = "";
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.classList.add("empty-cell"); // Add a class to blank cells
      miniCalendar.appendChild(empty);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.textContent = day;
      const cellDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (cellDate === new Date().toISOString().split("T")[0]) {
        cell.classList.add("today");
      }
      // Add selected day highlight
      if (cellDate === selectedTaskDate) {
        cell.classList.add("mini-selected");
      }
      cell.addEventListener("click", () => {
        selectedTaskDate = cellDate;
        renderTasks();
        renderMiniCalendar();
      });
      miniCalendar.appendChild(cell);
    }
  }
  
  const toggleMiniCal = document.getElementById("toggleMiniCal");
  const miniCalendarContainer = document.getElementById("miniCalendarContainer");
  let isMiniCalCollapsed = false;
  toggleMiniCal.addEventListener("click", () => {
    isMiniCalCollapsed = !isMiniCalCollapsed;
    miniCalendarContainer.style.display = isMiniCalCollapsed ? "none" : "block";
    toggleMiniCal.textContent = isMiniCalCollapsed ? "▶" : "▼";
  });
  selectedTaskDate = new Date().toISOString().split("T")[0];
  function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
  }
  function dragOver(e) {
    e.preventDefault();
  }
  function drop(e) {
    const from = e.dataTransfer.getData("text/plain");
    const to = e.target.dataset.index;
    if (from === undefined || to === undefined) return;
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    const tasks = allTasks[selectedTaskDate] || [];
    const [moved] = tasks.splice(from, 1);
    tasks.splice(to, 0, moved);
    allTasks[selectedTaskDate] = tasks;
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    renderTasks();
    renderTaskChart();
  }
  addTaskBtn.addEventListener("click", () => {
    const task = taskInput.value.trim();
    if (task) {
      const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
      if (!allTasks[selectedTaskDate]) {
        allTasks[selectedTaskDate] = [];
      }
      allTasks[selectedTaskDate].push({ text: task, done: false });
      localStorage.setItem("tasks", JSON.stringify(allTasks));
      taskInput.value = "";
      renderTasks();
      renderTaskChart();
    }
  });
  
  const stickyNoteArea = document.getElementById("stickyNoteArea");
  // Apply background color from theme variable
  function applyStickyNoteColor() {
    stickyNoteArea.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--note-bg');
  }
  // On page load
  stickyNoteArea.value = localStorage.getItem("stickyNote") || "";
  applyStickyNoteColor();
  // Save note content on input
  stickyNoteArea.addEventListener("input", () => {
    localStorage.setItem("stickyNote", stickyNoteArea.value);
  });
  // Observe theme changes to update sticky note background color
  const observer = new MutationObserver(() => {
    applyStickyNoteColor();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  // Remove any old custom color setting (cleanup)
  localStorage.removeItem("stickyNoteColor");
  


 
  //Mood Tracker
  const selectedMood = document.getElementById("selectedMood");
  const moodPopup = document.getElementById("moodPopup");
  // Toggle popup on click
  selectedMood.addEventListener("click", () => {
    moodPopup.classList.toggle("hidden");
  });
  // Handle mood selection
  moodPopup.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mood = btn.textContent;
      // Update visible mood
      selectedMood.textContent = mood;
      moodPopup.classList.add("hidden");
      // Save mood with timestamp
      const moods = JSON.parse(localStorage.getItem("moodLog") || "[]");
      const today = new Date().toISOString().split("T")[0];
      moods.push({ mood, date: today });
      localStorage.setItem("moodLog", JSON.stringify(moods));
      renderMoodChart();
      renderMoodEventChart();
      renderMoodTaskChart();
    });
  });
  // Close popup if clicked outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".mood-tracker")) {
      moodPopup.classList.add("hidden");
    }
  });
  // On page load, show last selected mood
  const savedMoods = JSON.parse(localStorage.getItem("moodLog") || "[]");
  if (savedMoods.length > 0) {
    const lastMood = savedMoods[savedMoods.length - 1].mood;
    selectedMood.textContent = lastMood;
  }



  //Profile PIC
  const profilePicBtn = document.getElementById("profilePicBtn");
  const profileModal = document.getElementById("profileModal");
  const profileDisplayArea = document.getElementById("profileDisplayArea");
  const closeProfileModal = document.getElementById("closeProfileModal");
  const changePicBtn = document.getElementById("changePicBtn");
  const defaultPicBtn = document.getElementById("defaultPicBtn");
  const uploadPicInput = document.getElementById("uploadPicInput");
  const defaultProfilePic = "assets/App logo.jpg";
  function loadProfilePic() {
    const savedPic = localStorage.getItem("profilePic");
    profilePicBtn.src = savedPic || defaultProfilePic;
  }
  function updateProfileModal() {
    const savedPic = localStorage.getItem("profilePic");
    profileDisplayArea.innerHTML = "";
    const img = document.createElement("img");
    img.src = savedPic || defaultProfilePic;
    profileDisplayArea.appendChild(img);
    profileModal.classList.remove("hidden");
  }
  profilePicBtn.addEventListener("click", updateProfileModal);
  closeProfileModal.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });
  changePicBtn.addEventListener("click", () => {
    uploadPicInput.click();
  });
  uploadPicInput.addEventListener("change", () => {
    const file = uploadPicInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("profilePic", reader.result);
      loadProfilePic();
      profileModal.classList.add("hidden");
    };
    reader.readAsDataURL(file);
  });
  defaultPicBtn.addEventListener("click", () => {
    localStorage.removeItem("profilePic");
    loadProfilePic();
    profileModal.classList.add("hidden");
  });

  const sidebarNameInput = document.getElementById("sidebarNameInput");
  // Load saved name or fallback to "Your Name"
  sidebarNameInput.value = localStorage.getItem("sidebarName") || "";
  // Show placeholder if input is empty
  sidebarNameInput.placeholder = "Your Name";
  // Save name to localStorage on input
  sidebarNameInput.addEventListener("input", () => {
    const name = sidebarNameInput.value.trim();
    if (name) {
      localStorage.setItem("sidebarName", name);
    } else {
      localStorage.removeItem("sidebarName");
    }
  });

  // Reset All Data
  document.getElementById("resetBtn").addEventListener("click", () => {
    const modal = document.getElementById("deleteConfirmModal");
    const title = modal.querySelector("h3");
    const confirmBtn = document.getElementById("confirmDeleteBtn");
    const cancelBtn = document.getElementById("cancelDeleteBtn");
    // Set message and confirm button text
    title.textContent = "Are you sure you want to reset all data?";
    confirmBtn.textContent = "Reset";
    // Remove old event listeners safely
    const newConfirm = confirmBtn.cloneNode(true);
    const newCancel = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
    // Show modal
    modal.classList.remove("hidden");
    // Bind new actions
    newConfirm.addEventListener("click", () => {
      localStorage.clear();
      modal.classList.add("hidden");
      location.reload();
    });
    newCancel.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  });

  //Print
  document.getElementById("printBtn").addEventListener("click", () => {
    window.print();
  });

  // Persist and apply saved category filter
  const categoryFilter = document.getElementById("eventCategoryFilter");
  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = savedCategory;
  categoryFilter.addEventListener("change", () => {
    localStorage.setItem("selectedCategory", categoryFilter.value);
    renderCalendar();
  });


  renderCalendar();
  renderTasks();
  renderMiniCalendar();


  //Section switching
  const navItems = document.querySelectorAll("nav li");
  const calendarSection = document.getElementById("calendarSection");
  const historySection = document.getElementById("historySection");
  const settingsSection = document.getElementById("settingsSection");
  function showSection(sectionName) {
    calendarSection.style.display = "none";
    historySection.style.display = "none";
    settingsSection.style.display = "none";
    if (sectionName === "calendar") calendarSection.style.display = "block";
    if (sectionName === "history") historySection.style.display = "block";
    if (sectionName === "settings") settingsSection.style.display = "block";
    // Save selection
    localStorage.setItem("selectedSection", sectionName);
  }
  // On page load
  const savedSection = localStorage.getItem("selectedSection") || "calendar";
  showSection(savedSection);
  // Set active nav item on load
  navItems.forEach(item => item.classList.remove("active"));
  if (savedSection === "calendar") navItems[0].classList.add("active");
  if (savedSection === "history") navItems[1].classList.add("active");
  if (savedSection === "settings") navItems[2].classList.add("active");
  // On click
  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      navItems.forEach(el => el.classList.remove("active"));
      item.classList.add("active");
      if (index === 0) showSection("calendar");
      if (index === 1) showSection("history");
      if (index === 2) showSection("settings");
    });
  });

  //search bar
  document.getElementById("searchInput").addEventListener("input", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "";
    if (!query) return;
    const matched = [];
    // Search Events
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    events.forEach((event, i) => {
      const { title, desc, category, date } = event;
      if (
        title.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        date.includes(query)
      ) {
        matched.push(`<div><strong>Event:</strong> ${title} (${date})</div>`);
      }
    });
    // Search Tasks
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    for (const [date, tasks] of Object.entries(allTasks)) {
      tasks.forEach((task, i) => {
        if (task.text.toLowerCase().includes(query)) {
          matched.push(`<div><strong>Task:</strong> ${task.text} (${date})</div>`);
        }
      });
    }
    // Search Sticky Note
    const note = localStorage.getItem("stickyNote") || "";
    if (note.toLowerCase().includes(query)) {
      matched.push(`<div><strong>Sticky Note:</strong> ${note}</div>`);
    }
    if (matched.length > 0) {
      resultsDiv.innerHTML = "";
      matched.forEach(result => {
      const div = document.createElement('div');
      div.innerHTML = result;
      resultsDiv.appendChild(div);
    });
    } else {
      resultsDiv.innerHTML = "<em>No matches found</em>";
    }
  });
  document.getElementById("searchBtn").addEventListener("click", () => {
    document.getElementById("searchInput").dispatchEvent(new Event('input'));
  });


  // Weather
  const weatherBox = document.getElementById('weatherBox');
  function getWeatherSummary(condition) {
    switch (condition.toLowerCase()) {
      case 'clear': return { emoji: '☀️', text: 'Sunny' };
      case 'clouds': return { emoji: '☁️', text: 'Cloudy' };
      case 'rain': return { emoji: '🌧️', text: 'Rainy' };
      case 'drizzle': return { emoji: '🌦️', text: 'Drizzle' };
      case 'thunderstorm': return { emoji: '⛈️', text: 'Stormy' };
      case 'snow': return { emoji: '❄️', text: 'Snowy' };
      case 'mist':
      case 'fog': return { emoji: '🌫️', text: 'Foggy' };
      default: return { emoji: '🌡️', text: 'Weather' };
    }
  }
  function fetchWeather({ lat, lon, city } = {}) {
    const apiKey = 'bae540d64dbdcc792cf2283b8d1f63fe';
    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=Mumbai,IN&appid=${apiKey}&units=metric`;
    }
    fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Network error");
      return response.json();
    })
    .then(data => {
      const temp = Math.round(data.main.temp);
      const condition = data.weather[0].main;
      const summary = getWeatherSummary(condition);
      weatherBox.textContent = `${summary.emoji} ${temp}°C - ${summary.text}`;
    })
    .catch(error => {
      console.error("Weather error:", error);
      weatherBox.textContent = "Unable to load weather";
    });
  }
  function initWeather() {
    const savedCity = localStorage.getItem("locationCity");
    if (savedCity) {
      // ✅ Use user-selected city
      fetchWeather({ city: savedCity });
    } else if ("geolocation" in navigator) {
      // 📍 Try to use geolocation
      navigator.geolocation.getCurrentPosition(
        position => {
          fetchWeather({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        error => {
          // ❌ Location denied → fallback to Mumbai
          fetchWeather({ city: "Mumbai" });
        }
      );
    } else {
      // ❌ No location, no city → Mumbai
      fetchWeather({ city: "Mumbai" });
    }
    // 🔄 Auto-refresh every 10 minutes
    setInterval(() => {
      const city = localStorage.getItem("locationCity");
      if (city) {
        fetchWeather({ city });
      } else if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            fetchWeather({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          () => {
            fetchWeather({ city: "Mumbai" });
          }
        );
      } else {
        fetchWeather({ city: "Mumbai" });
      }
    }, 600000);
  }
  initWeather();
  

  //Location
  const countryLocation = document.getElementById("countryLocation");
  const stateLocation = document.getElementById("stateLocation");
  const cityLocation = document.getElementById("cityLocation");

  let countriesData = [];

  fetch('countries-states-cities.json')
  .then(res => res.json())
  .then(json => {
    countriesData = json.countries; // store globally
    countriesData.forEach(country => {
      const opt = document.createElement("option");
      opt.value = country.name;
      opt.textContent = country.name;
      countryLocation.appendChild(opt);
    });

    const savedCountry = localStorage.getItem("locationCountry");
    if (savedCountry) {
      countryLocation.value = savedCountry;
      countryLocation.dispatchEvent(new Event("change"));
    }
  });

  // On country change
  countryLocation.addEventListener("change", () => {
    stateLocation.innerHTML = `<option value="">Select State</option>`;
    cityLocation.innerHTML = `<option value="">Select City</option>`;
    cityLocation.disabled = true;

    const countryName = countryLocation.value;
    if (!countryName) return;
    localStorage.setItem("locationCountry", countryName);
  
    const selectedCountry = countriesData.find(c => c.name === countryName);
    if (!selectedCountry) return;

    selectedCountry.states.forEach(state => {
      const opt = document.createElement("option");
      opt.value = state.name;
      opt.textContent = state.name;
      stateLocation.appendChild(opt);
    });
    stateLocation.disabled = false;

    const savedState = localStorage.getItem("locationState");
    if (savedState) {
      stateLocation.value = savedState;
      stateLocation.dispatchEvent(new Event("change"));
    }
  });

  // On state change
  stateLocation.addEventListener("change", () => {
    cityLocation.innerHTML = `<option value="">Select City</option>`; 
    const countryName = countryLocation.value;
    const stateName = stateLocation.value;
    if (!stateName) return;
    localStorage.setItem("locationState", stateName);

    const selectedCountry = countriesData.find(c => c.name === countryName);
    const selectedState = selectedCountry?.states.find(s => s.name === stateName);
    if (!selectedState) return;
  
    selectedState.cities.forEach(city => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      cityLocation.appendChild(opt);
    });
    cityLocation.disabled = false;

    const savedCity = localStorage.getItem("locationCity");
    if (savedCity) cityLocation.value = savedCity;
  });

  // On city change
  cityLocation.addEventListener("change", () => {
    const city = cityLocation.value;
    localStorage.setItem("locationCity", city);
  });
  

  //Terms & Policies
  const openTermsBtn = document.getElementById("openTermsBtn");
  const openPrivacyBtn = document.getElementById("openPrivacyBtn");
  const legalModal = document.getElementById("legalModal");
  const legalTitle = document.getElementById("legalTitle");
  const legalContent = document.getElementById("legalContent");
  const closeLegalModal = document.getElementById("closeLegalModal");
  const termsText = `
    <h3>1. Acceptance of Terms</h3>
    <p>By using Cllario, you agree to our terms...</p>
    <h3>2. User Responsibilities</h3>
    <p>You must use the app ethically and legally...</p>
    <!-- Add more sections here -->
  `;
  const privacyText = `
    <h3>1. Data We Collect</h3>
    <p>We collect only necessary data like name, photo, tasks...</p>
    <h3>2. How We Use Data</h3>
    <p>Your data stays in your device and helps personalize the app...</p>
    <!-- Add more sections here -->
  `;
  openTermsBtn.addEventListener("click", () => {
    legalTitle.textContent = "Terms & Conditions";
    legalContent.innerHTML = termsText;
    legalModal.classList.add("visible");
  });
  openPrivacyBtn.addEventListener("click", () => {
    legalTitle.textContent = "Privacy Policy";
    legalContent.innerHTML = privacyText;
    legalModal.classList.add("visible");
  });
  closeLegalModal.addEventListener("click", () => {
    legalModal.classList.remove("visible");
  });
  
  // Render charts if functions exist
  if (typeof renderTaskChart === "function") renderTaskChart();
  if (typeof renderEventChart === "function") renderEventChart();
  if (typeof renderMoodChart === "function") renderMoodChart();
  if (typeof renderMoodEventChart  === "function") renderMoodEventChart();
  if (typeof renderMoodTaskChart === "function") renderMoodTaskChart();

  feather.replace();
});
