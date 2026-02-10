// Run with: npx convex run scheduledTasks:upsertTask --prod
// Or paste this into Convex dashboard functions tab

const task = {
  name: "Weekly Limit Reset - Resume Work",
  schedule: "one-time",
  description: "Weekly token limit resets. Read through CoachPortalPlan.md to see next steps",
  status: "active",
  nextRun: 1770696000000, // Monday Feb 9, 2026 at 11 PM EST
  metadata: {
    priority: "high"
  }
};

console.log(JSON.stringify(task, null, 2));
