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

Create a new PostgreSQL database or Supabase project. The current repository does not include an application-wide `backend/schema.sql`; set up the core `users` and `voters` tables using the schema for this app before starting the API. On startup, the API adds the voter columns it uses and creates the `system_audits` table. The geography table and its data must also be imported before using geography selectors and regional analytics.

Create `public.master_geography` with the headers from the supplied geography CSV:

```sql
CREATE TABLE public.master_geography (
	"ID" INTEGER PRIMARY KEY,
	"District" TEXT NOT NULL,
	"Region" TEXT NOT NULL,
	"Constituency" TEXT NOT NULL,
	"Mandals/Neighbourhoods" TEXT NOT NULL
);
```

Import the CSV into that table without renaming its columns. Region, constituency, and mandal selectors use `Region`, `Constituency`, and `Mandals/Neighbourhoods`; `District` and `ID` are retained from the source data. Do not use columns from the previous geography dataset.

## Configure and Run

In PowerShell, from the project root, prepare the backend environment file without overwriting an existing one:

```powershell
if (-not (Test-Path backend/.env)) { Copy-Item backend/.env.example backend/.env }
```

Set `DATABASE_URL`, a random `JWT_SECRET` of at least 32 characters, and the Supabase storage values in `backend/.env`. For Render or another hosted Node service, copy the **Session Pooler** URI from the project's **Connect** panel and keep its supplied host, username, and port (`5432`) unchanged. Keep the Supabase service-role key on the backend only.

Open **Terminal 1**:

```powershell
cd backend
npm ci
npm run dev
```

The API listens on `http://localhost:5000`; check it at `http://localhost:5000/api/health`.

Open **Terminal 2** from the project root:

```powershell
if (-not (Test-Path frontend/.env)) { Copy-Item frontend/.env.example frontend/.env }
cd frontend
npm ci
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`. `VITE_API_BASE_URL` should be `http://localhost:5000` for local development. Production deployments must set it to this project's backend URL; the frontend will not fall back to another deployment.

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

Deploy `frontend/` as a Vercel project and set `VITE_API_BASE_URL` to this project's backend URL. Deploy `backend/` as a Node service, set its environment variables in the hosting provider, and allow the deployed frontend origin with `FRONTEND_URL`. Import the geography CSV into `public.master_geography` before using geography selectors. Uploaded documents use a private Supabase Storage bucket named `voter-documents` by default.
