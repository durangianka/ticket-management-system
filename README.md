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

## Authentication

Authentication is handled by [Clerk](https://clerk.com) (`@clerk/nextjs`).

1. Create a free Clerk account and application at [dashboard.clerk.com](https://dashboard.clerk.com).
2. Copy your Publishable Key and Secret Key from the Clerk dashboard into `.env.local` as
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (see `.env.example`).
3. Sign-in and sign-up pages are available at `/sign-in` and `/sign-up`.
