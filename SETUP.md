# Mission Control Setup Guide

## Quick Start

Follow these steps to get Mission Control running locally:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex

Run the Convex development server. This will prompt you to create or log into your Convex account:

```bash
npx convex dev
```

**What this does:**
- Opens your browser to log into Convex
- Creates a new Convex project
- Generates the Convex backend code
- Starts watching for changes
- Provides your `NEXT_PUBLIC_CONVEX_URL`

**Keep this terminal window open** - it needs to stay running!

### 3. Configure Environment Variables

The `npx convex dev` command should automatically create a `.env.local` file with your Convex URL.

If it doesn't, create the file manually:

```bash
cp .env.local.example .env.local
```

Then add your Convex URL from the terminal output:

```
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

### 4. Seed Sample Data (Optional)

Open a new terminal and run:

```bash
npx convex run seedData:seedSampleData
```

This will populate your database with sample activities, tasks, and search documents so you can see the dashboard in action.

### 5. Start Next.js Development Server

In a new terminal (keep Convex running in the first one):

```bash
npm run dev
```

### 6. Open the Dashboard

Navigate to [http://localhost:3000](http://localhost:3000)

You should see:
- ✅ Dashboard with sample data (if you seeded it)
- ✅ Activity Feed with recent activities
- ✅ Calendar with scheduled tasks
- ✅ Global Search functionality

## Troubleshooting

### "NEXT_PUBLIC_CONVEX_URL is not defined"

**Solution:** Make sure you have a `.env.local` file with the Convex URL. Check the output from `npx convex dev` for the URL.

### Convex functions not working

**Solution:** Make sure `npx convex dev` is still running in a terminal window. It needs to stay active.

### Empty dashboard

**Solution:** Run the seed command to add sample data:
```bash
npx convex run seedData:seedSampleData
```

### TypeScript errors in Convex files

**Solution:** The Convex types are generated automatically. Make sure `npx convex dev` is running, which will generate the `convex/_generated` folder.

## Development Workflow

When developing, you should have **two terminal windows open**:

1. **Terminal 1**: Running `npx convex dev` (Convex backend)
2. **Terminal 2**: Running `npm run dev` (Next.js frontend)

Both need to be running for the dashboard to work properly.

## Next Steps

Once everything is running:

1. Explore the different pages (Dashboard, Activity Feed, Calendar, Search)
2. Check out the code structure in the README
3. Start integrating with your AI assistant to log real activities
4. Customize the theme and components to match your style

## Integration with Iterone

To integrate this dashboard with your Iterone AI assistant:

### Logging Activities

When your AI performs an action, log it:

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// In your component
const logActivity = useMutation(api.activities.logActivity);

// When an action happens
await logActivity({
  actionType: "file_edit",
  title: "Updated configuration",
  details: "Modified database connection settings",
  metadata: {
    filePath: "/config/database.yml",
  },
});
```

### Indexing Memory and Documents

Read your memory/document files and index them:

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import fs from "fs";
import path from "path";

const indexDocument = useMutation(api.search.indexDocument);

// Index memory files
const memoryDir = "C:\\Users\\Cole\\.openclaw\\workspace\\memory";
const files = fs.readdirSync(memoryDir);

for (const file of files) {
  const filePath = path.join(memoryDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  await indexDocument({
    type: "memory",
    title: file.replace(".md", ""),
    content: content,
    filePath: filePath,
  });
}
```

### Syncing Cron Jobs

Load your cron jobs and sync them:

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import fs from "fs";

const upsertTask = useMutation(api.scheduledTasks.upsertTask);

const cronJobs = JSON.parse(
  fs.readFileSync("C:\\Users\\Cole\\.openclaw\\cron\\jobs.json", "utf-8")
);

for (const job of cronJobs) {
  await upsertTask({
    name: job.name,
    schedule: job.schedule,
    description: job.description,
    status: job.enabled ? "active" : "paused",
    nextRun: calculateNextRun(job.schedule),
    metadata: {
      command: job.command,
    },
  });
}
```

## Deployment

See the main README.md for deployment instructions to Vercel.

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review the Convex docs: https://docs.convex.dev
- Check Next.js docs: https://nextjs.org/docs
