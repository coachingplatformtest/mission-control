# Design Context

## Design Philosophy

Cole's preferences:
- **No harsh/boxy designs** — subtle shadows, rounded corners, balanced spacing
- **Hevy is the reference** — clean, borderless, modern
- **Touch targets 48px minimum** on mobile

## Current Stack

- **TailwindCSS** — utility-first styling
- **shadcn/ui** — component library base
- **Framer Motion** — animations (use sparingly for performance)

## Visual Patterns (Current)

**Cards**
- No borders — shadow-based depth instead
- `rounded-2xl` (16px radius)
- Shadow levels: card → hover → elevated → modal

**Inputs**
- 48px height for touch targets
- `text-base` (16px) minimum — prevents iOS Safari zoom
- Refined focus rings, not harsh outlines

**Colors**
- Role-based accents: emerald (coach/client), purple (admin)
- Muted backgrounds, not pure white
- Sufficient contrast for accessibility

**Spacing**
- Consistent padding scale (Tailwind defaults)
- Generous whitespace — breathing room feels premium

**Typography**
- Clear hierarchy: page title → section → body → caption
- Not too many weights competing

**Tables**
- Lighter dividers, no heavy header backgrounds
- Clean, scannable

## Known Issues

- Some placeholder pages exist (Analytics, Resources)
- Mobile bottom nav needs safe area handling for iPhone
- Some inputs may still have inconsistent styling

## Responsiveness

- Mobile-first approach
- Desktop: Collapsible sidebar
- Mobile: Bottom navigation bar
- Tablet: Hybrid (sidebar can collapse)

## Production

- URL: https://coach-portal-olive.vercel.app
- Auto-deploys on push

## Reference Apps

- **Hevy** — per-set logging UI, clean mobile experience
- **Linear** — information density done right
- **Notion** — whitespace and typography balance
