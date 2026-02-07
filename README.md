# Mission Control Dashboard

A command center dashboard for Iterone AI Assistant, built with Next.js 15 and Convex.

## Features

### 1. Activity Feed
- Real-time chronological log of all AI actions
- Filter by action type (file edits, messages, searches, tool use)
- Date range filtering
- Activity statistics and insights

### 2. Calendar View
- Weekly calendar showing scheduled cron jobs
- Task status tracking (active, paused, completed, failed)
- Navigate between weeks
- All tasks list view

### 3. Global Search
- Search across memory files, documents, and scheduled tasks
- Filter by content type
- Snippet previews with context
- Real-time results

### 4. Dashboard Overview
- System status at a glance
- Quick stats for activities and tasks
- Recent activities preview
- Upcoming tasks preview
- Quick action navigation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Convex (real-time, serverless)
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Convex account (free tier available at https://convex.dev)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Convex:
```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex (or create an account)
- Create a new Convex project
- Generate your Convex URL
- Start the Convex development server

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

The `NEXT_PUBLIC_CONVEX_URL` should be automatically set by Convex, but if not, copy it from the Convex dashboard.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mission-control/
├── app/                    # Next.js App Router pages
│   ├── activity/          # Activity Feed page
│   ├── calendar/          # Calendar View page
│   ├── search/            # Global Search page
│   ├── layout.tsx         # Root layout with Convex provider
│   └── page.tsx           # Dashboard home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ActivityFeed.tsx  # Activity Feed component
│   ├── CalendarView.tsx  # Calendar View component
│   ├── Dashboard.tsx     # Dashboard home component
│   ├── DashboardLayout.tsx # Layout wrapper
│   ├── GlobalSearch.tsx  # Global Search component
│   └── Sidebar.tsx       # Navigation sidebar
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   ├── activities.ts     # Activity queries/mutations
│   ├── scheduledTasks.ts # Task queries/mutations
│   └── search.ts         # Search queries/mutations
└── lib/                  # Utility functions
    └── utils.ts          # Helper functions
```

## Usage

### Logging Activities

To log an activity from your AI assistant, use the Convex mutation:

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const logActivity = useMutation(api.activities.logActivity);

await logActivity({
  actionType: "file_edit",
  title: "Updated README.md",
  details: "Added installation instructions",
  metadata: {
    filePath: "/path/to/file.md",
  },
});
```

### Managing Scheduled Tasks

Create or update tasks:

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const upsertTask = useMutation(api.scheduledTasks.upsertTask);

await upsertTask({
  name: "Daily backup",
  schedule: "0 0 * * *", // Cron expression
  status: "active",
  nextRun: Date.now() + 86400000, // Tomorrow
  metadata: {
    command: "backup.sh",
  },
});
```

### Indexing Content for Search

Index documents for global search:

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const indexDocument = useMutation(api.search.indexDocument);

await indexDocument({
  type: "memory", // or "document" or "task"
  title: "Project Notes",
  content: "Full text content...",
  filePath: "C:\\Users\\Cole\\.openclaw\\workspace\\memory\\notes.md",
});
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. Configure environment variables:
   - Add `NEXT_PUBLIC_CONVEX_URL` from your Convex dashboard

4. Deploy!

### Deploy Convex to Production

```bash
npx convex deploy
```

This will give you a production Convex URL. Update your Vercel environment variables with this URL.

## Customization

### Adding New Action Types

Edit `lib/utils.ts` to add new action type colors and icons:

```typescript
export const actionTypeColors: Record<string, string> = {
  // Add your new type
  custom_action: "bg-teal-500/10 text-teal-500 border-teal-500/20",
};

export const actionTypeIcons: Record<string, string> = {
  custom_action: "🎯",
};
```

### Modifying the Theme

Update `app/globals.css` to customize colors:

```css
:root {
  --primary: 217.2 91.2% 59.8%; /* HSL color values */
  /* ... other colors */
}
```

## Dark Mode

The dashboard is designed with dark mode by default for a command center aesthetic. The theme is set in `app/layout.tsx` with `className="dark"` on the html element.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
