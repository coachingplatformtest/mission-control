# Builder Context

## Project

**Coach Portal** — Training management for strength coaches.

- **Repo:** `C:\Users\Cole\Documents\coach-portal\coach-portal`
- **Production:** https://coach-portal-olive.vercel.app
- **GitHub:** https://github.com/coachingplatformtest/coach-portal.git

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Auth:** Clerk (superadmin/admin/client roles)
- **Database:** Prisma 7 + Supabase PostgreSQL
- **Styling:** TailwindCSS
- **Components:** shadcn/ui
- **Charts:** Recharts
- **Animations:** Framer Motion (use sparingly)

## Database Connection

```
postgresql://postgres.vtjubqtyjmninacvtppm:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres
```

**CRITICAL:** Must use `aws-1-us-east-1` (not aws-0). Port 6543 (pooler) required for Vercel serverless.

**Migration blocker:** Prisma migrations don't work with pooler. Schema changes need manual SQL in Supabase dashboard.

## File Structure

```
app/
  api/           — API routes (Route Handlers)
  admin/         — Superadmin pages
  coach/         — Coach pages
  client/        — Client pages
  dashboard/     — Role-based redirect
components/
  layout/        — AppShell, Sidebar, MobileNav
  shared/        — Reusable components
  ui/            — shadcn components
lib/
  prisma.ts      — Prisma client
  clerk-admin.ts — Clerk admin API
  utils.ts       — Helpers
prisma/
  schema.prisma  — Database schema
```

## Code Patterns

### API Routes (App Router)
```typescript
// app/api/example/route.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... implementation
}
```

### Components
- Use shadcn/ui components where available
- `"use client"` only when needed (interactivity, hooks)
- Mobile-first responsive design
- 48px minimum touch targets

### Styling
- Tailwind utilities, no custom CSS unless necessary
- No borders on cards — use shadows
- `rounded-2xl` for cards
- `text-base` minimum on inputs (iOS Safari zoom fix)

### Authorization Pattern
```typescript
// Coaches see only their clients
const clients = await prisma.client.findMany({
  where: { coachId: coach.id }
});

// Clients see only their data
const data = await prisma.progressEntry.findMany({
  where: { client: { userId } }
});
```

## User Roles

- **superadmin** (Cole) → `/admin` — sees all
- **coach** → `/coach` — sees only their clients
- **client** → `/client` — sees only their data

## Commit Style

```
feat: add workout history modal
fix: correct API route conflict
refactor: simplify exercise card component
```

## Deploy

- Push to `main` → Vercel auto-deploys
- Wait ~1-2 min for deploy to complete
- Test agent verifies on production after deploy
