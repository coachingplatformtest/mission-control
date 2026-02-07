# Quick Reference Card

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Convex (in terminal 1)
npx convex dev

# 3. Start Next.js (in terminal 2)
npm run dev

# 4. (Optional) Seed sample data
npx convex run seedData:seedSampleData
```

Open: http://localhost:3000

**Windows shortcut:** Double-click `start.bat` to start both servers!

## 📂 Key Files

| File | Purpose |
|------|---------|
| `convex/schema.ts` | Database schema definitions |
| `convex/activities.ts` | Activity log functions |
| `convex/scheduledTasks.ts` | Task management functions |
| `convex/search.ts` | Search functionality |
| `convex/seedData.ts` | Sample data seeder |
| `lib/utils.ts` | Utility functions & styling |
| `components/Dashboard.tsx` | Home page component |
| `app/globals.css` | Theme colors & styles |

## 🎨 Pages

| URL | Component | Description |
|-----|-----------|-------------|
| `/` | Dashboard | Overview & stats |
| `/activity` | ActivityFeed | Action log |
| `/calendar` | CalendarView | Weekly task calendar |
| `/search` | GlobalSearch | Full-text search |

## 📊 Database Tables

### activities
```typescript
{
  timestamp: number,
  actionType: string,
  title: string,
  details?: string,
  metadata?: {
    filePath?: string,
    toolName?: string,
    searchQuery?: string,
    result?: string,
  }
}
```

### scheduledTasks
```typescript
{
  name: string,
  schedule: string,        // cron expression
  description?: string,
  status: string,          // "active" | "paused" | "completed" | "failed"
  lastRun?: number,
  nextRun?: number,
  metadata?: {
    command?: string,
    priority?: string,
  }
}
```

### searchIndex
```typescript
{
  type: string,            // "memory" | "document" | "task"
  title: string,
  content: string,
  filePath: string,
  lastUpdated: number,
}
```

## 🔧 Common Operations

### Log an Activity
```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const logActivity = useMutation(api.activities.logActivity);

await logActivity({
  actionType: "file_edit",
  title: "Updated config",
  details: "Changed database settings",
  metadata: { filePath: "/config/db.json" }
});
```

### Create a Task
```typescript
const upsertTask = useMutation(api.scheduledTasks.upsertTask);

await upsertTask({
  name: "Daily backup",
  schedule: "0 0 * * *",
  status: "active",
  nextRun: Date.now() + 86400000
});
```

### Index a Document
```typescript
const indexDocument = useMutation(api.search.indexDocument);

await indexDocument({
  type: "memory",
  title: "Notes",
  content: "Full text content...",
  filePath: "C:\\path\\to\\file.md"
});
```

## 🎯 Action Types

| Type | Icon | Color | Use For |
|------|------|-------|---------|
| `file_edit` | 📝 | Blue | File modifications |
| `message_sent` | 💬 | Green | Messages/notifications |
| `search` | 🔍 | Purple | Search operations |
| `tool_use` | 🔧 | Orange | Tool executions |
| `task_scheduled` | 📅 | Pink | Task scheduling |

Add more in `lib/utils.ts`!

## 🎨 Customization

### Change Primary Color
Edit `app/globals.css`:
```css
--primary: 217.2 91.2% 59.8%; /* HSL values */
```

### Add Action Type
Edit `lib/utils.ts`:
```typescript
export const actionTypeColors = {
  custom: "bg-teal-500/10 text-teal-500 border-teal-500/20"
};

export const actionTypeIcons = {
  custom: "🎯"
};
```

## 📦 Deployment

### Vercel
```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy Convex to production
npx convex deploy

# 3. Import in Vercel dashboard
# 4. Add env var: NEXT_PUBLIC_CONVEX_URL=<prod-url>
# 5. Deploy!
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Convex URL not defined" | Run `npx convex dev` first |
| Empty dashboard | Seed data: `npx convex run seedData:seedSampleData` |
| TypeScript errors | Restart Convex dev server to regenerate types |
| Styles not working | Check TailwindCSS v4 is installed |

## 📚 Documentation

- **Full docs**: `README.md`
- **Setup guide**: `SETUP.md`
- **Project overview**: `PROJECT_SUMMARY.md`
- **This file**: `QUICK_REFERENCE.md`

## 🔗 Useful Links

- Convex Docs: https://docs.convex.dev
- Next.js Docs: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- TailwindCSS: https://tailwindcss.com

## 💡 Tips

1. Keep `npx convex dev` running while developing
2. Use the seed data command to test features quickly
3. Check the Convex dashboard for database inspection
4. Use Vercel for easy deployment
5. Customize colors in `globals.css` for your brand

---

**Need help?** Check the full documentation in README.md and SETUP.md!
