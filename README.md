# Mutual Fund Tracker (Enhanced)

This project is an enhanced implementation of the assignment. It includes:

- Frontend: React + Vite + Tailwind + Chart.js
- Backend: Node.js + Express + MongoDB + JWT auth + caching proxy to mfapi.in
- Features: Search funds, view NAV chart, save/remove funds, compare funds, caching of external API, responsive UI.

## Quick start (local)

1. Clone or extract this project.
2. Backend:
   - cd backend
   - cp .env.example .env
   - set MONGO_URI and JWT_SECRET
   - npm install
   - npm run dev
3. Frontend:
   - cd frontend
   - npm install
   - npm run dev
4. Open the frontend (usually http://localhost:5173) and use the app.

Notes:
- The backend caches mfapi responses for better reliability.
- Use real MongoDB or local MongoDB instance.
