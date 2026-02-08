# Bug Agent Lessons

Patterns learned from debugging. Update after every fix.

---

## Check the Obvious First

Before deep debugging:
- Is the user logged in?
- Is the API returning 401/403?
- Is the data actually in the database?
- Is Vercel deploy complete?

90% of "bugs" are auth issues or stale deploys.

---

## iOS Safari Is Special

Many mobile bugs are iOS Safari specific:
- Input zoom (font-size < 16px)
- Viewport height issues (100dvh)
- Fixed positioning quirks

Test on Safari mobile viewport first.

---

## State Sync Bugs

If data "disappears" or "reverts":
- Check if async save is racing with refetch
- Look for `hasLocalChanges` pattern
- Verify the save actually completed before refetch

---

## Authorization Bugs

If user sees wrong data:
- Check `where` clause in Prisma query
- Verify coachId/userId ownership check exists
- Superadmin bypasses are intentional

---

## Don't Trust the Error Message

The visible error often isn't the root cause:
- "Cannot read property of undefined" → trace back to what's undefined and WHY
- "Network error" → check actual response in Network tab
- "Hydration mismatch" → usually async data + SSR timing

---

*Add new lessons after each fix.*
