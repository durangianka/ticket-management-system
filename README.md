# Ticket Management System

A ticket management demo with AI-assisted classification and routing. Tickets are automatically
categorized, prioritized, and routed using the Claude API, with manual override available. This is
a v1 slice: single-user access via Clerk login, no role-based permissions yet.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui components
- PostgreSQL (via Docker)
- Prisma ORM
- Clerk (authentication)
- Claude API (`@anthropic-ai/sdk`) for automatic ticket classification

## Prerequisites

- Node.js
- Docker Desktop (for Postgres)
- An Anthropic API key (optional — the app degrades gracefully without one)
- A free [Clerk](https://dashboard.clerk.com) account and API keys (or run `npx clerk@latest init`
  to auto-provision dev keys)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL` — matches the credentials in `docker-compose.yml` (defaults to
     `postgresql://ticket_admin:CHANGEME@localhost:5433/ticket_management?schema=public`)
   - `ANTHROPIC_API_KEY` — optional, enables AI classification
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — from
     [dashboard.clerk.com](https://dashboard.clerk.com), or run `npx clerk@latest init` to
     auto-provision dev keys
3. Start Postgres:
   ```bash
   docker compose up -d
   ```
4. Apply the database schema:
   ```bash
   npx prisma migrate dev
   ```
5. Load the 8 mock tickets:
   ```bash
   npx tsx prisma/seed.ts
   ```
6. Start the dev server:
   ```bash
   npm run dev
   ```
   App runs at [http://localhost:3000](http://localhost:3000).

## Routes & features

- `/tickets` — ticket list with priority, category, and routing badges
- `/tickets/[id]` — ticket detail, recommended next action, and manual reclassification
- `/tickets/new` — create a ticket with automatic AI classification
- `/dashboard` — stats overview and suggested next steps
- `/sign-in`, `/sign-up` — Clerk-hosted authentication

Classification covers:
- **Category**: Incident, Bug, Feature Request, Account/Billing, Access, Question
- **Priority**: P1-P4
- **Routing**: Answer Directly vs. Platform/Engineering

## Notes

- **Postgres password**: `docker-compose.yml` commits a dev-only Postgres password for local
  convenience. Rotate it before using this compose file anywhere beyond a developer's own machine.
- **v1 scope**: single-user (Clerk login only, no roles/permissions), no file upload (attachments
  are filename-only), and classification failures degrade gracefully — the ticket is saved with
  `classificationError: true` instead of crashing.
