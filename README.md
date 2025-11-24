# 🌤️ Clario: AI-Driven Mood-Aware Productivity Calendar
<table>
  <tr>
    <td>
      <img src="FRONTEND/assets/App%20logo.jpg" alt="Clario App Logo" width="140"><br>
    </td>
    <td style="padding-left:15px; vertical-align:top;">
      <img src="FRONTEND/assets/website%20logo.jpg" alt="Clario Website Logo" width="100"><br>
      Personal Dashboard for Tasks, Mood Tracking & Productivity Analytics<br>
      Enhancing Productivity & Well-being for Everyone<br>
      ⚡️ Project submission (END-Semester Lab Evaluation)<br>
      👩‍💻 Submitted by: Lavanya (102303425)<br>
      👩‍🏫 Submitted to: Ms. Kanupriya
    </td>
  </tr>
</table>

---

## 🧠 The Problem We're Solving
In today’s fast-paced world, individuals often struggle to stay organized, maintain emotional balance, and keep track of personal growth. Juggling tasks, moods, and daily plans can feel overwhelming without a centralized system.

Clario solves this by offering a sleek, responsive, all-in-one dashboard that helps you:
- ✅ Stay on top of tasks and events
- 😊 Track moods and emotional well-being
- 🔔 Set smart reminders to stay focused
- 🌤️ Plan ahead with live weather updates
- 📊 Visualize your habits and productivity trends

---

## 🌟 Key Highlights

- 📅 **Smart Calendar** – Organize and view daily events  
- ✅ **Task Manager** – Add, complete, and filter tasks  
- ⏰ **Reminders** – Ringing alerts with visual cue (bell) and online sounds  
- 📝 **Sticky Notes** – Drag and drop idea pads  
- 😊 **Mood Tracker** – Log feelings with emoji & notes  
- 📊 **Data Visualization** – Analyze habits, moods, and task stats  
- 🌤️ **Live Weather** – Auto or manual location-based weather insights  
- 🔐 **Authentication** – Secure sign-up/login using JWT  
- 🎨 **Theme Toggle** – Light and Dark mode  
- 📱 **Responsive UI** – Works beautifully across devices  
- 💾 **Data Export / Reset** – Backup or clean with one click  

---

## 🌐 Live Demo



Check out Clario in action:

- [**Frontend (Live):**](https://lavu-create.github.io/UI-UX-Project/FRONTEND/)  
- [**Backend (API):**](https://clario-8rvp.onrender.com)  

> Note: Some features (like notifications or data export) may require backend APIs to be running.

---

## 💡 Why It Matters

- Clario helps you take control of your day and well-being by:
- Creating daily structure and mental clarity
- Supporting smart planning with weather insights
- Building emotional awareness through mood tracking
- Encouraging productive habits with visual data  

---

## 🧰 Tech Stack

| Layer              | Technologies                                       | Purpose                                 |
|--------------------|----------------------------------------------------|-----------------------------------------|
| Frontend           | HTML, CSS, JavaScript                              | Responsive layout, various themes       |
| Backend            | Node.js, Express.js                                | REST APIs, JWT protected routes         |
| Authentication     | JWT, bcrypt                                        | Password hashing and session management |
| Database           | MongoDB (primary) / JSON + LocalStorage (fallback) | Tasks, events, moods                    |
| Charts & Analytics | Chart.js                                           | Visualizing moods, tasks, events        |
| Notifications      | Web Audio API                                      | Online notification sounds              |
| Weather            | OpenWeatherMap API                                 | Auto/manual location updates            |
| Deployment         | GitHub Pages(frontend) + Render(backend)           | Fully hosted, live updates              |

---

## 🚀 Getting Started

### 🖥️ Frontend
```bash
cd CLARIO/FRONTEND
# Open index.html directly in your browser OR
# Start a local HTTP server for full JS features (optional):
# python -m http.server 5500
```

### 🔧 Backend
```bash
cd CLARIO/CLARIO-BACKEND/backend
npm install          # Install dependencies
node app.js          # Start backend server
```

Backend runs at: `http://localhost:3000`

---

## 🔐 Auth Flow

1. User signs up with email + password.
2. Password is hashed securely using bcrypt.
3. On login, a JWT token is issued.
4. Protected routes require a valid token.
5. Token is stored in localStorage for session persistence.  

---

## 📊 Data Visualization

Interactive charts to display:

- Task completion rates  
- Emoji-based mood trends  
- Event frequency and productivity spikes  

---

## 📁 Project Structure

```
Clario/  
├── CLARIO-BACKEND/        → Express APIs and server logic
│   └── backend/           → Signup/Login, JWT handling
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
├── DATA-VIZUALIZATION/    → Mood & task analytics (Charts)
├── FRONTEND/              → Complete UI (HTML, CSS, JS)
│   └── assets/            → Icons, sounds, images (used in frontend)  
└── README.md              → Project overview and documentation

```

---

## 🌱 Git Workflow

```bash
git clone https://github.com/your-username/clario.git  
cd clario  
git checkout -b feature/your-feature-name  
# Make changes  
git add .  
git commit -m "Added new feature"  
git push origin feature/your-feature-name
```

---

## 🛠️ Future Enhancements

- 🎙️ Voice Assistant Integration & Voice-Based Reminders  
- 🧠 AI-powered mood predictions 
- 👥 Shared Calendars & Collaboration
- 📱 Mobile App & PWA Support
- ⚡ Smart Task Priority Suggestions
- ☁️ Cloud Sync & Multi-Device Access

---

> Clario isn’t just a productivity tool — it’s your personal space to stay organized, motivated, and mindful.
> Thoughtfully crafted. Purposefully built. ✨
