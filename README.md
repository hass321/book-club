# Book Club App

A full-stack Book Club application with Docker-based Postgres, Fastify + TypeScript backend, and React + TailwindCSS frontend.

## Features
- CRUD for books and authors
- Modular, type-safe backend
- Modern, intuitive frontend

## Setup

### 1. Start Postgres
```sh
docker-compose up -d
```
- DB: `bookclub`
- User: `bookclub_user`
- Password: `bookclub_pass`

### 2. Backend
```sh
cd backend
npm install
npm run dev
```
- Environment: see `.env.example`
- Common scripts: `dev`, `build`, `migrate`, `seed`, `test`

### 3. Frontend
```sh
cd frontend
npm install
npm run dev
```

## Folder Structure
- `backend/` Fastify + TypeScript API
- `frontend/` React + TailwindCSS client
- `docker-compose.yml` Postgres setup

## Environment Variables
See backend `.env.example` for DB config.

## Developer Experience
- Type-safe queries
- Request validation
- Error handling
- Modular code
- Clear domain boundaries