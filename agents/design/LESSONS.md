# Design Lessons

Things that went wrong or patterns to remember.

---

## iOS Safari Input Zoom

Safari zooms the viewport when input font-size is < 16px. Always use `text-base` or larger on inputs. This broke the app until fixed.

---

## Don't Apply Input Styles Globally

Global CSS input styling broke Clerk auth components. Apply input styles at the component level, not in globals.css.

---

## 100dvh Breaks on iOS

`height: 100dvh` causes issues on iOS Safari. Use `min-h-screen` instead.

---

## Mobile Bottom Elements Need Offset

Fixed elements at the bottom must account for mobile nav. Use `bottom-16 sm:bottom-0` pattern.

---

## Shadows Over Borders

Cole explicitly prefers shadow-based depth over borders. "Too boxy" was the feedback. Cards should have no border, just subtle shadow.

---

## Animation Performance

Framer Motion animations should be limited — too many cause jank on mobile. Use for key moments (checkmarks, transitions), not everything.

---

## Scroll Issues on Focus

When inputs focus on mobile, content can jump. Use `setTimeout(300)` + `scrollIntoView({ block: 'center' })` for controlled scroll behavior.

---

*Add new lessons as you learn them.*
