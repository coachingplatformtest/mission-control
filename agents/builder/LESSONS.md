# Builder Lessons

Mistakes made and patterns to avoid.

---

## iOS Safari Input Zoom

Safari zooms viewport when input font-size < 16px. Always use `text-base` or larger on inputs.

```tsx
// Wrong
<input className="text-sm" />

// Right
<input className="text-base" />
```

---

## Don't Apply Input Styles Globally

Global CSS input styling in globals.css broke Clerk auth components. Apply input styles at component level only.

---

## 100dvh Breaks on iOS

`height: 100dvh` causes issues on iOS Safari. Use `min-h-screen` instead.

---

## Mobile Bottom Elements Need Offset

Fixed elements at bottom must account for mobile nav bar (64px / h-16).

```tsx
// Right
className="fixed bottom-16 sm:bottom-0"
```

---

## Shadows Over Borders

Cole prefers shadow-based depth over borders. Cards should have no border, just subtle shadow.

```tsx
// Wrong
className="border rounded-lg"

// Right  
className="rounded-2xl shadow-sm"
```

---

## State Sync Pattern

When saving data async and refetching, track local changes to avoid overwriting user input:

```javascript
// After successful save:
hasLocalChangesRef.current = false;
onRefetch();

// In sync effect:
useEffect(() => {
  if (!data || hasLocalChangesRef.current) return;
  setLocalState(data);
}, [data]);
```

---

## Scroll Issues on Focus

When inputs focus on mobile, content can jump. Control it:

```javascript
setTimeout(() => {
  element.scrollIntoView({ block: 'center' });
}, 300);
```

---

## Check Existing Patterns First

Before writing new code, check if a similar pattern exists in the codebase. Match it. Don't invent a third way.

---

## Test Locally Before Pushing

Always run `npm run dev` and verify the feature works before pushing. Test agent will verify on production, but obvious breaks should be caught locally.

---

## Don't Delete Without Asking

If code seems unused after refactoring, list it and ask:
> "Should I remove these now-unused elements: [list]?"

Don't leave dead code. Don't delete without confirmation.

---

*Add new lessons when corrections are made.*
