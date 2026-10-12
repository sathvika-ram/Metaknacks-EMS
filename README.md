# Metaknacks EMS

Voter enrollment and management application with a React frontend, Express API, PostgreSQL database, JWT authentication, role-based dashboards, and Supabase Storage uploads.

## Project Structure

```text
frontend/   React + Vite application
backend/    Express API, PostgreSQL schema, and backend scripts
```

## Requirements

- Node.js 20.19+ or 22.12+
- PostgreSQL 15+ or a Supabase project
- `psql` for applying the schema from a terminal (or use the Supabase SQL Editor)

## Fresh Database Setup

Create a new PostgreSQL database or Supabase project. Apply [`backend/schema.sql`](backend/schema.sql) using the Supabase SQL Editor or from PowerShell with `psql`:

```powershell
psql "postgresql://USER:PASSWORD@HOST:PORT/DATABASE" -f backend/schema.sql
```

Import the application's geography dataset into `master_geography` to populate the region, constituency, mandal, and village selectors. Preserve the source column headers shown in `backend/schema.sql`. The dataset is not included in this repository.

## Configure and Run

In PowerShell, from the project root, prepare the backend environment file:

```powershell
Copy-Item -NoClobber backend/.env.example backend/.env
```

Set `DATABASE_URL`, a random `JWT_SECRET` of at least 32 characters, and the Supabase storage values in `backend/.env`. For local PostgreSQL, set `DATABASE_URL` to its connection string. For production Supabase, use the Session Pooler on port `6543` with `pgbouncer=true`. Keep the Supabase service-role key on the backend only.

Open **Terminal 1**:

```powershell
cd backend
npm ci
npm run dev
```

The API listens on `http://localhost:5000`; check it at `http://localhost:5000/api/health`.

Open **Terminal 2** from the project root:

```powershell
Copy-Item -NoClobber frontend/.env.example frontend/.env
cd frontend
npm ci
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`. `VITE_API_BASE_URL` should be `http://localhost:5000` for local development.

## Create the First Admin

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then from `backend/` run:

```powershell
npm run seed:admin
```

The seed script creates or updates the super-admin account without deleting existing data. Do not enable admin seeding on a production deployment.

## Publish a Fresh GitHub Repository

Create an empty repository on GitHub, then run these commands from the project root. Replace the URL with the new repository's URL:

```powershell
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

Environment files and `node_modules` are ignored by Git. Commit `.env.example` files, never `.env` files or service-role keys.

## Deployment Notes

Deploy `frontend/` as a Vercel project and set `VITE_API_BASE_URL` to the new backend URL. Deploy `backend/` as a Node service, set its environment variables in the hosting provider, and allow the deployed frontend origin with `FRONTEND_URL`. Apply `backend/schema.sql` to the new database and import the geography dataset before using the geography selectors. Uploaded documents use a private Supabase Storage bucket named `voter-documents` by default.
