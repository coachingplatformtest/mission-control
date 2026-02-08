# Backlog

Work items ready to be built. Lead assigns these to Builder.

---

## Ready

### Placeholder Pages - Decide Fate
**Priority:** Low
**Effort:** Small
**Description:** Schedule, Analytics, Resources pages show "Coming Soon". Options:
- Remove from nav until ready
- Add expected dates
- Build basic functionality
**Notes:** May confuse users, needs Cole's input

### Coach Dashboard Weekly Summary
**Priority:** High
**Effort:** Medium (half-day)
**Type:** Journey Completer
**Description:** Coaches managing 20-50 clients need a quick overview of weekly progress. Current flow forces clicking into each client individually. Add dashboard cards showing: clients who completed this week, clients who missed days, clients needing program updates.
**Acceptance:** Dashboard shows at-a-glance weekly progress for all clients. Coach can identify who needs attention without clicking through individual client pages.

### Empty State Onboarding Flow
**Priority:** Medium
**Effort:** Medium (half-day)
**Type:** Friction Killer
**Description:** New coaches see empty client list with no guidance. Current state just shows "No clients yet" which doesn't explain next steps. Add progressive onboarding: demo client with sample program, clear CTA to "Add First Client", and brief guide on program creation.
**Acceptance:** New coach understands how to get started within 30 seconds. Demo content shows the value immediately.

### Client Progress Quick Actions
**Priority:** High
**Effort:** Small (hours)
**Type:** Friction Killer
**Description:** When coach reviews client's logged workouts, they need quick actions for common responses (copy week with weight increase, add notes, flag concerns). Currently requires multiple navigation steps and page loads.
**Acceptance:** Coach can review logged week and take most common actions (copy week, adjust weights, add notes) without leaving the client view.

---

## Ideas (Not Yet Scheduled)

### Rolling Week Model
**Priority:** Medium (deferred)
**Description:** Auto-advance weeks when client logs all days. Single program view for coach.
**Spec:** docs/ROLLING-WEEK-SPEC.md
**Notes:** Cole approved concept, not yet scheduled

### Offline Support (PWA)
**Priority:** Low (deferred)
**Description:** Cache data locally for gym use without signal
**Notes:** Service worker shell exists, needs real implementation

### Add More Exercises to Test Data
**Priority:** Low
**Description:** Seed more variety in test exercises (deadlift, overhead press, etc.)
**Notes:** Current test data is minimal

---

## Completed

### 2026-02-08 (morning)
- ✅ WeekStatsBar "0 sets" bug - Fixed (was using legacy targetSetsReps)
- ✅ Client dashboard → "Today" screen (single CTA, week dots, streak)
- ✅ Training page: single week focus with collapsible past weeks

### 2026-02-08 (overnight)
- ✅ Week 2 "0 sets" bug - Fixed by adding PrescribedSet records
- ✅ All lint errors fixed (0 errors, 23 warnings remaining)
- ✅ Type safety - Replaced ~25 `any` types with proper interfaces
- ✅ QA verified Week 2 fix passes

### 2026-02-07
- ✅ Admin test account created (qa-admin@coach-portal-test.com)
- ✅ Chart multi-point selection bug fixed (use logId not entryId)
- ✅ Superadmin role bug fixed (6 API routes)
- ✅ User identity display - shows Clerk user, not DB record
- ✅ Progress chart modal - fixed disappearing issue
- ✅ Edit completed workout - fixed infinite loading
- ✅ Grammar "1 exercises" → "1 exercise"
- ✅ "Needs Update" clarity - added helper text
- ✅ Consolidated ProgressChart component (single shared component)
- ✅ E2E browser testing infrastructure working

---

*Last updated: 2026-02-08 02:50*
