# InstaMini — Social Media Post App

A minimal social-media-style app for creating and viewing posts (monorepo with `frontend` and `server`). Clean UI, authentication, and a small feed.

This repository contains two main parts:

- `frontend/` — React + Vite single-page app (development server runs on http://localhost:5173)
- `server/` — Express API server (default port `4001`) with user and post endpoints

This README explains how to run the project locally, environment variables, repo layout, and recommended contribution and CI files included in the repository.

---

## Live Demo

- Frontend: [https://insta-mini-social-media-post-app.vercel.app/](https://insta-mini-social-media-post-app.vercel.app/)
- Backend: [https://instamini-social-media-post-app.onrender.com](https://instamini-social-media-post-app.onrender.com)

---

## Quick start (development)

Prerequisites

- Node.js 18+ (or latest LTS)
- npm (or pnpm/yarn) installed
- MongoDB instance (local or hosted)

1. Clone the repo

```bash
git clone <repo-url>
cd InstaMini-Social-Media-Post-App
```

2. Install dependencies and run server

```bash
cd server
npm install

# copy .env.example -> .env and fill values (see Environment variables below)
node index.js
```

The server will listen on http://localhost:4001 by default (or the port in your `.env`).

3. Run frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Project structure

- `frontend/` — React app (Vite). Key files:
  - `src/main.jsx` — app entry
  - `src/pages/Feed.jsx` — main feed page
  - `src/App.css` — central styles
- `server/` — Express API
  - `index.js` — server entry
  - `controllers/`, `routes/`, `models/`, `middlewares/` — app structure

---

## Environment variables

Server (`server/.env`)

- `PORT` — optional, default `4001`
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWT tokens
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — optional if Cloudinary is used for uploads

Frontend (`frontend/.env`)

- `VITE_API_BASE_URL` — optional; defaults to relative requests. For local dev you can set `VITE_API_BASE_URL=http://localhost:4001` if needed.

---

## Scripts

Server (inside `server/`)

- `node index.js` — run server directly

Frontend (inside `frontend/`)

- `npm run dev` — start Vite dev server
- `npm run build` — build production bundle
- `npm run preview` — preview production build

---

## CI / GitHub Actions

This repository contains a basic CI workflow at `.github/workflows/ci.yml` that installs and builds the frontend and runs lightweight checks for the server. Review and adapt the workflow to your preferred Node version and test commands.

---

## Contributing

Please see `CONTRIBUTING.md` for details on how to contribute, run linters, and open issues or pull requests.

---

## License

This project is provided under the MIT License — see the `LICENSE` file for details.
