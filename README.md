# Kidney Connect - Full Project (Frontend + Backend)

This project now includes:
- `frontend/` (React + Vite)
- `backend/` (Node.js + Express + MongoDB Atlas)

## 1) Backend setup

1. Go to backend folder:
   - `cd backend`
2. Install packages:
   - `npm install`
3. Create `.env` from `.env.example` and set values:
   - `PORT=5000`
   - `MONGO_URI=<your atlas uri>`
   - `JWT_SECRET=<long random secret>`
   - `FRONTEND_URL=http://localhost:5173`
4. Start backend:
   - `npm run dev`

Backend API endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/profile`
- `POST /api/donors/search`

## 2) Frontend setup

1. Go to frontend folder:
   - `cd frontend`
2. Install packages:
   - `npm install`
3. (Optional) Create `.env` from `.env.example`:
   - `VITE_API_BASE_URL=http://localhost:5000`
4. Start frontend:
   - `npm start`

## 3) Run order

1. Start backend first (`backend` -> `npm run dev`)
2. Start frontend second (`frontend` -> `npm start`)
3. Open: `http://localhost:5173`

## Security note

You shared a MongoDB Atlas URI/password in chat. For safety:
- Keep the URI only in `backend/.env`
- Do not commit real credentials to git
- Rotate Atlas password after setup
