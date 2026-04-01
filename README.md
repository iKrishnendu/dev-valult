# DevVault

DevVault is a full-stack MERN dashboard for organizing developer learning resources by subject, category, and resource type.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS + Zustand
- Backend: Node.js + Express + MongoDB + Mongoose

## Project Structure

```text
frontend/
  src/
    components/
    hooks/
    pages/
    store/
    utils/
backend/
  src/
    config/
    controllers/
    models/
    routes/
    utils/
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Required environment variables:

- `MONGODB_URI`
- `PORT`
- `CLIENT_URL`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

Default backend URL: `http://localhost:5000`

## Vercel Deployment

You can deploy this without major structural changes by creating two Vercel projects:

### 1. Backend on Vercel

- Create a Vercel project with the root directory set to `backend`
- Add environment variables in Vercel:
  - `MONGODB_URI`
  - `CLIENT_URL`
- The serverless entrypoint is [backend/api/[[...all]].js](d:/My%20Computer/Placement/Project%20for%20placement/Notes/backend/api/[[...all]].js)
- Your API will stay under the same paths:
  - `/api/subjects`
  - `/api/categories`
  - `/api/resources`

### 2. Frontend on Vercel

- Create another Vercel project with the root directory set to `frontend`
- Add:
  - `VITE_API_URL=https://your-backend-project.vercel.app/api`
- Build command:
  - `npm run build`
- Output directory:
  - `dist`

### Notes

- MongoDB connection reuse for Vercel is handled in [db.js](d:/My%20Computer/Placement/Project%20for%20placement/Notes/backend/src/config/db.js)
- Local development still works with `npm run dev` inside [backend](d:/My%20Computer/Placement/Project%20for%20placement/Notes/backend) and [frontend](d:/My%20Computer/Placement/Project%20for%20placement/Notes/frontend)

## API Endpoints

### Subjects

- `POST /api/subjects`
- `GET /api/subjects`
- `GET /api/subjects/:id`
- `PUT /api/subjects/:id`
- `DELETE /api/subjects/:id`

### Categories

- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Resources

- `POST /api/resources`
- `PUT /api/resources/:id`
- `DELETE /api/resources/:id`

## Features

- Subject sidebar navigation
- Category-based resource organization
- Resource types with smart icon rendering
- Search and bookmark filtering
- Light and dark theme toggle persisted in `localStorage`
- YouTube preview modal
- Empty states and loading states
- Full CRUD flows for subjects, categories, and resources

## Verification

- Backend syntax check: `node --check src/server.js`
- Frontend type check: `npx tsc -b`

In this workspace, `vite build` is blocked by a sandbox-specific `spawn EPERM` issue while loading config from a path with spaces. The application code and TypeScript layer are otherwise in place.
