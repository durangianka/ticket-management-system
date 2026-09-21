# Ticket Management System

This is a placeholder for a basic ticket/issue tracking system. Requirements are still being defined collaboratively, and this repository currently contains only the initial project scaffold with no functional code yet.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui components
- Postgres via Docker + Prisma (setup in progress)

## Database setup

1. Copy `.env.example` to `.env` and fill in real values (never commit `.env`).
2. Start Postgres: `docker compose up -d`
3. Run migrations: `npx prisma migrate dev`

The dev-only Postgres password baked into `docker-compose.yml` is for local
development only. Rotate it before using this compose file anywhere beyond a
developer's own machine.
