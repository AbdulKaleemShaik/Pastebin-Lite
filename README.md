# Pastebin Lite

A lightweight, full-stack **MERN** application for creating and sharing text snippets with configurable expiration logic and view limits.

This project is built to satisfy automated evaluation requirements and is optimized for **serverless deployment on Vercel**.

---

## 📝 Project Description

**Pastebin Lite** allows users to create text pastes and share a unique URL to view them. A paste becomes **unavailable** once either of the following constraints is triggered:

* **Time-To-Live (TTL)** expiration
* **Maximum view count** reached

If both constraints are present, the paste becomes unavailable as soon as **either** constraint triggers.

The application exposes:

* A **RESTful JSON API** for programmatic access
* A simple **HTML-based UI** for creating and viewing pastes

All validation, expiry, and view-limit logic is enforced **server-side**.

---

## 🧱 Tech Stack (MERN)

* **MongoDB Atlas** – Persistence layer
* **Express.js** – Backend API
* **React (Vite)** – Frontend UI
* **Node.js** – Runtime environment

---

## 💾 Persistence Layer

This project uses **MongoDB Atlas** to ensure persistence across requests in a serverless environment.

* **Mongoose** is used for schema definition and data validation
* **MongoDB connection caching** is implemented to prevent connection exhaustion on Vercel
* The backend does **not** rely on in-memory state

Each paste stores:

* `content` – Text content
* `createdAt` – Creation timestamp
* `expiresAt` – TTL-based expiration timestamp (nullable)
* `maxViews` – Maximum allowed views (nullable)
* `views` – Current view counter

Availability is determined strictly on the backend.

---

## 📂 Project Structure

```
root/
│── backend/
│   ├── api/
│   │   └── index.js
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │   └── now.js
│   ├── .env
│   └── package.json
│
│── client/
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🛠️ Local Setup Instructions

### Prerequisites

* **Node.js** (LTS version)
* **MongoDB Atlas account** (or a local MongoDB instance)

---

## 1️⃣ Backend Configuration

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3001
APP_URL=http://localhost:3001
TEST_MODE=0
```

Start the server:

```bash
# Run via nodemon as configured in your scripts
nodemon api/index.js
```

The backend will run at:

```
http://localhost:3001
```

---

## 2️⃣ Frontend Configuration

Navigate to the client folder:

```bash
cd ../client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_BACKEND_URL=http://localhost:3001
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

## 🔌 API Overview

### Health Check

```
GET /api/healthz
```

* Returns HTTP 200 with JSON
* Reflects whether the application can access MongoDB

Example response:

```json
{ "ok": true }
```

---

### Create a Paste

```
POST /api/pastes
```

Request body:

```json
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
```

Rules:

* `content` is required and must be a non-empty string
* `ttl_seconds` is optional (integer ≥ 1)
* `max_views` is optional (integer ≥ 1)

Response:

```json
{
  "id": "string",
  "url": "https://your-app.vercel.app/p/<id>"
}
```

---

### Fetch a Paste (API)

```
GET /api/pastes/:id
```

Response (200):

```json
{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

Notes:

* Each successful fetch counts as a view
* `remaining_views` is `null` if unlimited
* `expires_at` is `null` if no TTL

Unavailable cases (missing, expired, view limit exceeded):

* Always return **HTTP 404** with a JSON body

---

### View a Paste (HTML)

```
GET /p/:id
```

* Returns HTML (200) containing the paste content
* Each successful view counts as a view
* Returns HTTP 404 if the paste is unavailable
* Content is rendered safely (no script execution)

---

## ⏱️ Deterministic Time for Testing

To support automated expiry testing, deterministic time handling is implemented.

If the environment variable:

```
TEST_MODE=1
```

is set, the backend will treat the request header:

```
x-test-now-ms: <milliseconds since epoch>
```

as the **current time for TTL checks only**.

If the header is absent, real system time is used.

---

## 🚀 Deployment

* Designed for **Vercel serverless deployment**
* MongoDB connection caching ensures safe reuse across invocations
* All environment variables must be configured in the Vercel dashboard

---

## 🧠 Design Decisions

* MongoDB Atlas was chosen to guarantee persistence across serverless requests
* All expiry and view-limit checks are enforced server-side
* Deterministic time handling enables reliable automated testing
* API and HTML routes share the same validation logic
* No hardcoded secrets or localhost URLs are committed

---

## ✅ Features Summary

* Create and share text pastes
* TTL-based expiration
* View-count-based expiration
* Deterministic time support for testing
* RESTful JSON API
* Serverless-safe persistence

---

## 📄 License

This project is intended for educational and evaluation purposes.
