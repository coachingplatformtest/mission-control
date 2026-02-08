# Product Context

## What This App Is

**Coach Portal** — Training management for strength coaches (weightlifting, powerlifting, bodybuilding).

**Core philosophy:** "The coach IS the value — we make them faster, not replace them."

Not like TrainHeroic (templates). This is for coaches who write custom weekly programming for each client.

## Users

**Coaches** (primary)
- Manage 20-50 clients
- Write weekly programs per client
- Track client progress
- Pain: Cognitive load of managing many clients

**Clients** (secondary)
- Log workouts
- See their program
- Track progress over time

## What Exists

**Working:**
- Auth (Clerk) with role-based access
- Coach dashboard with client list
- Client training view (Hevy-inspired per-set logging)
- Progress charts
- Week management (copy weeks, adjust weights)

**Recent additions:**
- "Today" screen for clients (single CTA, week dots, streak)
- Single week focus with collapsible past weeks
- Per-set logging (prescribed vs actual)

**Blocked:**
- Templates feature (DB migration issue with Supabase)
- Offline support (deferred)

## User Journeys

**Coach daily flow:**
1. Open app → See client list
2. Click client → See their current week
3. Review what they logged → Adjust next week
4. Copy week → Modify weights/sets → Save

**Client daily flow:**
1. Open app → See "Today" screen
2. Tap "Start Workout" → Log sets
3. Mark day complete
4. (Optional) View progress charts

## Competitors

**Hevy** — Beautiful UI, per-set logging, great mobile experience. Consumer-focused.
**TrainHeroic** — Template-based, marketplace model. Less custom.
**TrueCoach** — Coach-focused, messaging, video. More expensive.

## What We're NOT

- No AI-written programs
- No estimated 1RM calculations
- No auto weight adjustments (coach decides)
- No swipe gestures (cross-platform consistency)

## Current Pain Points

1. Coaches can't save week templates (blocked by DB)
2. No messaging between coach/client (API exists, no UI)
3. No notifications when client completes workout
4. Analytics page is placeholder

## Production

- URL: https://coach-portal-olive.vercel.app
- Deploys: Auto via Vercel on push to main
