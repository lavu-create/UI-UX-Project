function renderTaskChart() {
  const tasksObj = JSON.parse(localStorage.getItem("tasks") || "{}");
  const allTasks = Object.values(tasksObj).flat();
  let completed = 0, pending = 0;
  allTasks.forEach(t => t.done ? completed++ : pending++);
  const ctx = document.getElementById('tasksChart').getContext('2d');
  if (window.tasksChartObj) window.tasksChartObj.destroy();
  window.tasksChartObj = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ['#4caf50', '#f44336'],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
  // 👇 Display status on the right
  const statusBox = document.getElementById("taskStatus");
  const total = completed + pending;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  statusBox.innerHTML = `
    🟢 Completed: <span style="color: #4caf50; font-weight: bold;">${completed}</span><br>
    🔴 Pending: <span style="color: #f44336; font-weight: bold;">${pending}</span><br><br>
    📈 Efficiency: <span style="color: #2196f3; font-weight: bold;">${percent}%</span>
  `;
}


function renderEventChart() {
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  // Group events by month (YYYY-MM)
  const eventCounts = {};
  events.forEach(e => {
    if (!e.date) return;
    const month = e.date.slice(0, 7); // "YYYY-MM"
    if (!eventCounts[month]) eventCounts[month] = 0;
    eventCounts[month]++;
  });
  // Sort months
  const months = Object.keys(eventCounts).sort();
  const counts = months.map(month => eventCounts[month]);

  const ctx = document.getElementById('eventChart').getContext('2d');
  if (window.eventChartObj) window.eventChartObj.destroy();
  window.eventChartObj = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Events per Month',
        data: counts,
        borderColor: '#52b1ff',
        backgroundColor: 'rgba(82,177,255,0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Month' } },
        y: { title: { display: true, text: 'Event Count' }, beginAtZero: true }
      }
    }
  });
}

 //Mood
  function renderMoodChart() {
    const ctx = document.getElementById('moodChart').getContext('2d');
    const moodData = JSON.parse(localStorage.getItem("moodLog") || "[]");
    const moodCount = {};
    moodData.forEach(entry => {
      moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    });
    const labels = Object.keys(moodCount);
    const data = Object.values(moodCount);
    if (window.moodChartInstance) window.moodChartInstance.destroy();  // Reset old chart
    window.moodChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Mood Count',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      }
    });
  }

function renderMoodEventChart() {
  const moodData = JSON.parse(localStorage.getItem("moodLog") || "[]");
  const eventData = JSON.parse(localStorage.getItem("events") || "[]");

  // Group counts by date (YYYY-MM-DD)
  const moodCounts = {};
  const eventCounts = {};

  moodData.forEach(({ date }) => {
    const day = date?.slice(0, 10);
    if (day) moodCounts[day] = (moodCounts[day] || 0) + 1;
  });

  eventData.forEach(({ date }) => {
    const day = date?.slice(0, 10);
    if (day) eventCounts[day] = (eventCounts[day] || 0) + 1;
  });

  // Union of all unique days
  const allDays = Array.from(new Set([...Object.keys(moodCounts), ...Object.keys(eventCounts)])).sort();

  const moodVals = allDays.map(day => moodCounts[day] || 0);
  const eventVals = allDays.map(day => eventCounts[day] || 0);

  const ctx = document.getElementById("moodEventChart").getContext("2d");

  if (window.moodEventChartObj) window.moodEventChartObj.destroy();

  window.moodEventChartObj = new Chart(ctx, {
    type: "bar",
    data: {
      labels: allDays,
      datasets: [
        {
          label: "Moods",
          data: moodVals,
          backgroundColor: "#ff7b00ff", // orange
        },
        {
          label: "Events",
          data: eventVals,
          backgroundColor: "#607d8b", // blue-gray
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Daily Mood vs Event Count",
          color: "#ccc",
          font: {
            size: 16
          }
        },
        legend: {
          labels: {
            color: "#ccc"
          }
        },
      },
      scales: {
        x: {
          stacked: false,
          ticks: {
            color: "#ccc"
          },
          title: {
            display: true,
            text: "Date",
            color: "#aaa"
          }
        },
        y: {
          stacked: false,
          beginAtZero: true,
          ticks: {
            color: "#ccc"
          },
          title: {
            display: true,
            text: "Count",
            color: "#aaa"
          }
        }
      }
    }
  });
}


function renderMoodTaskChart() {
  const moodLog = JSON.parse(localStorage.getItem("moodLog")) || [];
  const tasksByDate = JSON.parse(localStorage.getItem("tasks")) || {};

  const moodCountByDate = {};
  const completedTasksByDate = {};

  // Count moods per date
  for (const entry of moodLog) {
    if (entry.date) {
      const date = entry.date.slice(0, 10); // extract YYYY-MM-DD
      moodCountByDate[date] = (moodCountByDate[date] || 0) + 1;
    }
  }

  // Count completed tasks per date
  for (const date in tasksByDate) {
    const tasks = tasksByDate[date];
    const completed = tasks.filter(t => t.done).length;
    completedTasksByDate[date] = completed;
  }

  // Combine unique dates
  const allDates = new Set([...Object.keys(moodCountByDate), ...Object.keys(completedTasksByDate)]);
  const sortedDates = [...allDates].sort();

  const moodData = sortedDates.map(date => moodCountByDate[date] || 0);
  const taskData = sortedDates.map(date => completedTasksByDate[date] || 0);

  const ctx = document.getElementById("moodTaskChart").getContext("2d");

  // Destroy previous chart if any
  if (window.moodTaskChartInstance) {
    window.moodTaskChartInstance.destroy();
  }

  window.moodTaskChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sortedDates,
      datasets: [
        {
          label: "Mood Logs",
          data: moodData,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
        {
          label: "Completed Tasks",
          data: taskData,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Mood vs Completed Tasks Per Day",
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          beginAtZero: true,
          stacked: false,
        },
      },
    },
  });
}