# Product Lessons

Things that went wrong or patterns to avoid.

---

## Don't Propose Features Requiring DB Migrations

Prisma migrations don't work with Supabase pooler (port 6543). Any feature needing schema changes is blocked until this is resolved. Check if a feature needs new tables/fields before proposing.

**Blocked features:** Templates, Messaging tables

---

## Cole Doesn't Like Harsh/Boxy UI

When describing UI, emphasize: subtle shadows, rounded corners, balanced spacing. No harsh borders. Hevy is the reference.

---

## No AI Coaching Features

Cole explicitly rejected:
- AI-written programs
- Smart weight suggestions
- Auto-generated check-in summaries

The coach is the value. We make them faster, not replace them.

---

## Check BACKLOG.md Before Proposing

Many ideas have already been identified. Don't duplicate. Read BACKLOG.md thoroughly before adding new items.

---

## Big Changes Need Approval

Anything >1 day effort or changing core UX goes to PENDING-APPROVAL.md, not BACKLOG.md. Cole reviews these.

---

*Add new lessons as you learn them.*
