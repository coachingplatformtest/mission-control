# Bug Agent Context

## Project

**Coach Portal** — Training management for strength coaches.

- **Production:** https://coach-portal-olive.vercel.app
- **Repo:** `C:\Users\Cole\Documents\coach-portal\coach-portal`

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Auth:** Clerk
- **Database:** Prisma + Supabase PostgreSQL
- **Styling:** TailwindCSS + shadcn/ui

## Test Accounts

Use these for verification:
- **Client:** qa-client / QATest2026!Client
- **Coach:** qa-coach / QATest2026!Coach
- **Admin:** qa-admin / QATest2026!Admin *(needs to be created)*

## Common Bug Patterns

### iOS Safari Issues
- Input zoom when font-size < 16px
- 100dvh breaks viewport
- Fixed bottom elements need offset for nav bar

### State Management
- Async save + refetch can overwrite user input
- Need to track local changes before syncing

### API Authorization
- Coaches must only see their own clients (coachId check)
- Clients must only see their own data (userId check)

### Mobile Responsive
- Touch targets must be 48px minimum
- Bottom nav is 64px (h-16) — account for it

## Vercel Deploy

After Builder pushes:
- Wait ~1-2 min for deploy
- Check production URL, not localhost

## Browser Testing

For automated testing, use the "openclaw" managed browser profile if available.
For manual testing, walk through on mobile viewport first.

## Key Files When Debugging

- `app/api/**/route.ts` — API routes
- `components/**` — UI components
- `lib/prisma.ts` — Database client
- `prisma/schema.prisma` — Data model

## Error Patterns

Check these when debugging:
- Browser console (client errors)
- Network tab (API failures)
- Vercel function logs (server errors)
