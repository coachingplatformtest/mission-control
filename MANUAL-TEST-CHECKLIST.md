# Manual Test Checklist - 2026-02-08 Features

Test everything before Monday 11 PM reset. Mark with ✅ or ❌ and add notes.

---

## 🔐 Auth & Roles (Baseline)

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Coach login | Sign in as coach | Redirects to /coach | |
| Client login | Sign in as client | Redirects to /client | |
| Admin login | Sign in as admin | Redirects to /admin | |
| Role protection | Try /admin as coach | Should block/redirect | |

---

## 📱 Offline Support (PWA)

**Prerequisites:** Open coach-portal on phone, "Add to Home Screen"

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Offline indicator | Turn on airplane mode, open app | Shows "Offline - using cached data" banner | |
| Cached data loads | While offline, navigate to training | Shows cached program data | |
| Log workout offline | Log a set while offline | Saves locally, shows "will sync" | |
| Auto-sync on reconnect | Turn off airplane mode | Shows "Syncing..." then "Synced ✓" | |
| Data persists | Refresh after sync | Logged data still there | |

---

## 🔄 Rolling Week (Phase 1 & 2)

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Week header shows | Open client training | See "Week X" header | |
| Complete all days | Log all days in a week | Brief celebration modal (2 sec) | |
| Auto-advance | After celebration | Automatically shows next week | |
| No repeat celebration | Refresh after completing | No celebration shown again | |
| No next week | Complete all available weeks | Shows "Waiting for coach" message | |
| Single week program | Client with 1 week, complete it | Shows waiting state | |

---

## ⚡ Quick Actions

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Bar appears | Complete a week | Floating action bar shows | |
| Copy Week | Tap Copy Week | Modal with weight/set adjustments | |
| Copy works | Complete copy | New week created with adjusted values | |
| Add Note | Tap Add Note | Note modal opens | |
| Flag works | Tap Flag | Week gets flagged for review | |

---

## 📊 Coach Dashboard

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Weekly summary cards | Open coach dashboard | See Completed/Needs Work/Waiting cards | |
| Card counts accurate | Compare to client list | Numbers match actual statuses | |
| Click card filters | Click a summary card | Filters client list | |
| Empty state | New coach, 0 clients | Shows welcome + "Add Client" CTA | |
| Demo client | Click "Create Demo Client" | Demo client created with sample data | |

---

## 📁 Resources Feature

**⚠️ REQUIRES: Run SQL migration first (prisma/migrations/manual/001_resources_mvp.sql)**

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| SQL migration ran | Check Supabase | Resource table has coachId, type columns | |
| Coach adds link | /coach/resources → Add Link | Modal: title, URL, description, assign | |
| Assign to all | Select "All Clients" | Resource visible to all coach's clients | |
| Assign to one | Select specific client | Resource only visible to that client | |
| Client sees resources | Login as client → /client/resources | Shows resources from coach | |
| Link opens | Click resource | Opens URL in new tab | |
| Delete resource | Coach deletes resource | Removed from list and client view | |

---

## 🎯 Touch Targets (Mobile)

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Checkmark button | Tap set complete checkbox | Easy to tap (48px target) | |
| Weight/reps inputs | Tap input fields | Easy to tap and focus | |
| Effort picker | Tap RPE/RIR buttons | Easy to tap | |
| Modal close buttons | Tap X to close modals | Easy to tap | |

---

## 🎨 UI Polish

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Shadows not borders | Look at cards | Soft shadows, no harsh borders | |
| Consistent corners | Check cards | All use rounded-2xl | |
| Empty states | Pages with no data | Helpful messages, not blank | |
| Error states | Force an error (offline + no cache) | Shows error with retry | |

---

## ⚡ Performance

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Dashboard load | Open coach dashboard | Loads fast, no jank | |
| Progress charts | Open progress page | Charts load smoothly (lazy-loaded) | |
| Training page | Open client training | Fast initial load | |

---

## 🔒 Security (Spot Check)

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Coach can't see other's clients | Try accessing another coach's client | Blocked/404 | |
| Client can't see other's data | Try accessing another client's data | Blocked/404 | |
| Auto-save validates | Try saving invalid data (dev tools) | Rejected with error | |

---

## 🐛 Bug Fixes Verification

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Toast not alert | Fail a save (offline, reject) | Toast notification, not browser alert | |
| Race condition | Rapid save clicks | Only one save happens | |
| Transaction safety | (Hard to test manually) | Program update is atomic | |

---

## 📅 Mission Control

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Calendar shows event | Open /calendar | Monday 11 PM event visible | |
| Token tracking | Open /tokens | Shows agent usage breakdown | |
| Activity feed | Open /activity | Recent activities listed | |

---

## Notes

**Issues found:**
- 
- 
- 

**Blocked items:**
- Resources feature needs SQL migration

**Questions for Iterone:**
- 
- 

---

*Created: 2026-02-08 ~4:45 PM*
*Test before: Monday 2026-02-09 11 PM*
