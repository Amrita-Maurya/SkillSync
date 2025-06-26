

# SkillSync 🚀

A **Full-Stack Peer Learning Accountability Platform**

## Overview 📚

**SkillSync** is a **MERN stack web application** built to help **college students track, manage, and stay accountable in their skill development journey**.
It offers two learning modes — **Self Accountability** and **Group Accountability** — providing a personalized or collaborative experience for goal tracking.

This project focuses on solving the problem of **learning consistency**, **peer motivation**, and **targeted skill-building**, especially within **college communities**.

---

## Tech Stack 🛠️

* **Frontend:** React.js (with Axios for API calls)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (using Mongoose ODM)
* **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing
* **Tools:** VS Code, Git, GitHub

---

## Features ✨

✅ **College-Verified Login:**
Restricts user registration to **valid college email domains**, ensuring a focused student user base.

✅ **Skill Tracking:**
Students can **add skills they already know** and **skills they want to learn**, creating a personalized learning profile.

✅ **Self vs Group Accountability Modes:**

* **Self Accountability:** Private daily progress tracking. Only the user can view their skill updates and learning journey.
* **Group Accountability:** Students **join skill-based learning groups**, **set daily targets**, **update progress**, and **motivate peers through appreciation reactions**.

✅ **Progress Updates:**
Users can **log daily study hours**, **note learning activities**, and **view progress streaks**.

✅ **Streak Tracking & Motivation:**
Daily **streak counter** and **quote of the day** to keep users motivated and consistent.

✅ **Skill-Tagged Doubt Forum:**
Students can **post doubts** related to specific skills.
**Learners and experts from the same skill group get notified** and can provide answers.

---

## Installation & Setup 🚀

1. **Clone the repository:**

```bash
git clone https://github.com/Amrita-Maurya/SkillSync.git
```

2. **Backend Setup:**

```bash
cd backend
npm install
```

* **Create a `.env` file** with your MongoDB connection string and JWT secret.

3. **Frontend Setup:**

```bash
cd frontend
npm install
```

4. **Run the app:**

In one terminal (Backend):

```bash
npm start
```

In another terminal (Frontend):

```bash
npm start
```

---

## Future Improvements 🔮

* Implement **real-time notifications** for group activity using WebSockets.
* Add **leaderboards for most consistent learners**.
* Enable **profile badges** for streak milestones.
* Deploy on **Render** or **Vercel + Railway** for production.

---

