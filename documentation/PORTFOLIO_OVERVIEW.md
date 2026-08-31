# 🚀 Comprehensive Portfolio Overview & Architecture Guide

This document provides a single, end-to-end breakdown of everything happening across the entire portfolio application—from frontend rendering to backend APIs, database persistence, administration, and deployment.

---

## 🏗️ 1. High-Level System Architecture

```
                                  +---------------------------------------+
                                  |            CLIENT BROWSER             |
                                  |  (React 19 + TypeScript + Tailwind)   |
                                  +-------------------+-------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
        +---------------------------------+                       +---------------------------------+
        |     PUBLIC PAGES & FEATURES     |                       |         ADMIN DASHBOARD         |
        |  - Home (Hero, About, Carousel) |                       |  - Auth with JWT Token          |
        |  - Projects (Live filter & tag) |                       |  - Add/Edit/Delete Projects     |
        |  - Skills Matrix                |                       |  - Add/Edit/Delete Achievements |
        |  - Contact Form (EmailJS)       |                       |  - Update Live Resume Link      |
        +----------------+----------------+                       +----------------+----------------+
                         |                                                         |
                         | (Read Requests)                                         | (CRUD + Bearer Auth)
                         +----------------------------+----------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |           NODE.JS / EXPRESS           |
                                  |        Backend API Server (:5000)     |
                                  |  - JWT Authentication Middleware      |
                                  |  - CORS & Error Handling              |
                                  +-------------------+-------------------+
                                                      |
                                                      | (Firebase Admin SDK)
                                                      v
                                  +---------------------------------------+
                                  |           GOOGLE FIRESTORE            |
                                  |              Collections:             |
                                  |  - `projects`                         |
                                  |  - `achievements`                     |
                                  |  - `settings/resume`                  |
                                  +---------------------------------------+
```

---

## 💻 2. Frontend Layer (`/src`)

The frontend is built using **React 19**, **TypeScript**, **Tailwind CSS**, and **Framer Motion** with a dark, futuristic cyberpunk aesthetic.

### Key Pages & Routing (`src/components/AppContent.tsx`)
- **`/` (Home)**: Features a high-impact cyberpunk Hero section with dynamic typography, an About Me overview, an interactive Achievements Carousel, and quick navigation cards.
- **`/projects`**: Displays all software projects. Features dynamic category filtering (`All`, `Web`, `AI/ML`, `Blockchain`, `Other`), direct links to GitHub repositories, live demo buttons, and featured tags.
- **`/skills`**: Interactive visual skills matrix organized by frontend, backend, AI/data, and tools with progress indicators.
- **`/contact`**: Interactive contact form directly connected to **EmailJS** for direct client-to-inbox messaging without backend overhead.
- **`/admin`**: Protected management dashboard allowing live updates to projects, achievements, and resume URL.
- **`*` (Catch-all)**: Automatically redirects any invalid path to `/` to avoid 404 errors.

### Dynamic Data Strategy
The frontend uses a hybrid data strategy:
1. When a page mounts, it calls the backend API (`GET /api/projects`, `GET /api/achievements`, `GET /api/resume`).
2. If the backend is running, live Firestore database items are displayed.
3. If the backend is offline or slow, built-in fallback data is rendered so visitors always see content seamlessly.

---

## ⚙️ 3. Backend API Layer (`/server`)

The backend is a **Node.js Express** service running on port `5000`.

### Endpoints Breakdown (`server/index.js`)

#### 🟢 Public Endpoints
- `GET /api/health` — System status and Firebase connection test.
- `GET /api/projects` — Fetches all projects from Firestore.
- `GET /api/achievements` — Fetches all achievements from Firestore.
- `GET /api/resume` — Fetches the active resume download/view link.

#### 🔴 Protected Endpoints (Requires `Authorization: Bearer <JWT_TOKEN>`)
- `POST /api/auth/login` — Verifies `ADMIN_PASSWORD` and returns a 24-hour signed JWT.
- `POST /api/projects` — Creates a new project in Firestore.
- `PUT /api/projects/:id` — Modifies an existing project.
- `DELETE /api/projects/:id` — Deletes a project from Firestore.
- `POST /api/achievements` — Adds a new achievement.
- `PUT /api/achievements/:id` — Updates an achievement.
- `DELETE /api/achievements/:id` — Deletes an achievement.
- `PUT /api/resume` — Updates the live resume URL in the database.

---

## 🗄️ 4. Database Layer (Firebase Firestore)

The backend connects to Google Cloud Firebase Firestore via the **Firebase Admin SDK** using the service account credentials in `server/.env`.

### Firestore Collections:
1. **`projects`**:
   - `title`: Project name
   - `description`: Detailed summary
   - `category`: Web, AI/ML, Blockchain, Other
   - `technologies`: Array of tech stack tags (e.g. `["React", "Python"]`)
   - `image`: URL / Google Drive direct link
   - `liveUrl`: URL for live demo
   - `githubUrl`: Source code link
   - `badge` & `badgeColor`: Highlight badge (e.g. "WINNER")
   - `order`: Display order rank

2. **`achievements`**:
   - `icon`: Emoji or icon indicator
   - `title`: Award or role title
   - `event`: Organization or competition
   - `detail`: Ranking/selection details
   - `date`: Month/Year

3. **`settings`** (Document: `resume`):
   - `url`: Direct Google Drive / PDF URL to your current resume.

---

## 🔐 5. Admin Dashboard Workflow (`/admin`)

1. **Authentication**: Admin visits `/admin`, enters the admin password.
2. **Token Storage**: The backend issues a JWT signed with `JWT_SECRET`, which is saved in `localStorage`.
3. **Live Management**:
   - Admin can add new hackathon wins or projects immediately.
   - Any edits are committed directly to Firebase Firestore.
   - Changes appear on the live portfolio instantly without needing to redeploy the frontend code!

---

## 🔌 6. Third-Party Integrations

1. **EmailJS**: Handles contact messages directly from the browser to your personal email inbox (`samarth260805@gmail.com`) using public API keys.
2. **Google Drive / Unsplash**: Hosts project images and the hosted resume PDF.
3. **Google Analytics**: Included in `public/index.html` for tracking visitors and page views.

---

## 🚀 7. Environment Variables Reference

| Variable | Location | Purpose |
| :--- | :--- | :--- |
| `REACT_APP_API_URL` | `.env` / Render Frontend | Points frontend to the backend API |
| `REACT_APP_EMAILJS_*` | `.env` / Render Frontend | EmailJS Service, Template & Public Keys |
| `PORT` | `server/.env` | Port for Express backend (`5000`) |
| `ADMIN_PASSWORD` | `server/.env` | Password for `/admin` login |
| `JWT_SECRET` | `server/.env` | 32+ character key for signing JWT tokens |
| `FIREBASE_SERVICE_ACCOUNT` | `server/.env` | JSON service account credentials for Firestore |
