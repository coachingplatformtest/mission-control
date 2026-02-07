import { mutation } from "convex/server";

// Sample data seeder for testing the dashboard
export const seedSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    // Seed activities
    const activities = [
      {
        timestamp: now - 5 * 60 * 1000,
        actionType: "file_edit",
        title: "Updated user authentication",
        details: "Implemented JWT token refresh logic",
        metadata: {
          filePath: "/src/auth/tokens.ts",
        },
      },
      {
        timestamp: now - 15 * 60 * 1000,
        actionType: "search",
        title: "Searched codebase for API endpoints",
        details: "Found 23 matches across 8 files",
        metadata: {
          searchQuery: "api/endpoints",
        },
      },
      {
        timestamp: now - 30 * 60 * 1000,
        actionType: "message_sent",
        title: "Sent deployment notification",
        details: "Notified team about staging deployment",
      },
      {
        timestamp: now - oneHour,
        actionType: "tool_use",
        title: "Ran database migration",
        details: "Successfully migrated to schema v2.1",
        metadata: {
          toolName: "prisma migrate",
        },
      },
      {
        timestamp: now - 2 * oneHour,
        actionType: "file_edit",
        title: "Created new component",
        details: "Added UserProfile component with avatar support",
        metadata: {
          filePath: "/components/UserProfile.tsx",
        },
      },
      {
        timestamp: now - 3 * oneHour,
        actionType: "search",
        title: "Searched documentation",
        details: "Looking for Next.js caching strategies",
        metadata: {
          searchQuery: "next.js cache",
        },
      },
      {
        timestamp: now - 4 * oneHour,
        actionType: "task_scheduled",
        title: "Scheduled backup task",
        details: "Daily database backup at midnight",
      },
      {
        timestamp: now - 5 * oneHour,
        actionType: "tool_use",
        title: "Ran test suite",
        details: "All 142 tests passed",
        metadata: {
          toolName: "jest",
          result: "142 passed",
        },
      },
    ];

    for (const activity of activities) {
      await ctx.db.insert("activities", activity);
    }

    // Seed scheduled tasks
    const tasks = [
      {
        name: "Daily Database Backup",
        schedule: "0 0 * * *",
        description: "Backup production database to S3",
        status: "active",
        lastRun: now - oneDay,
        nextRun: now + oneDay,
        metadata: {
          command: "backup-db.sh",
          priority: "high",
        },
      },
      {
        name: "Weekly Report Generation",
        schedule: "0 9 * * 1",
        description: "Generate and email weekly analytics report",
        status: "active",
        lastRun: now - 7 * oneDay,
        nextRun: now + oneDay,
        metadata: {
          command: "generate-report.py",
          priority: "medium",
        },
      },
      {
        name: "Hourly Health Check",
        schedule: "0 * * * *",
        description: "Check all services are running",
        status: "active",
        lastRun: now - oneHour,
        nextRun: now + oneHour,
        metadata: {
          command: "health-check.sh",
          priority: "high",
        },
      },
      {
        name: "Cache Cleanup",
        schedule: "0 3 * * *",
        description: "Clear expired cache entries",
        status: "active",
        nextRun: now + 2 * oneDay,
        metadata: {
          command: "clear-cache.js",
          priority: "low",
        },
      },
      {
        name: "Log Rotation",
        schedule: "0 0 * * 0",
        description: "Rotate and archive old logs",
        status: "paused",
        lastRun: now - 14 * oneDay,
        metadata: {
          command: "logrotate.sh",
          priority: "medium",
        },
      },
    ];

    for (const task of tasks) {
      await ctx.db.insert("scheduledTasks", task);
    }

    // Seed search index
    const searchDocs = [
      {
        type: "memory",
        title: "Authentication Best Practices",
        content:
          "Remember to always use secure JWT tokens with short expiration times. Implement refresh token rotation for better security. Store sensitive tokens in httpOnly cookies to prevent XSS attacks.",
        filePath: "C:\\Users\\Cole\\.openclaw\\workspace\\memory\\auth-notes.md",
        lastUpdated: now - 2 * oneDay,
      },
      {
        type: "memory",
        title: "Database Optimization Tips",
        content:
          "Index foreign keys for better join performance. Use EXPLAIN to analyze query plans. Consider denormalization for read-heavy tables. Implement connection pooling to reduce overhead.",
        filePath: "C:\\Users\\Cole\\.openclaw\\workspace\\memory\\db-optimization.md",
        lastUpdated: now - 5 * oneDay,
      },
      {
        type: "document",
        title: "API Documentation",
        content:
          "Our REST API follows standard conventions. All endpoints require authentication via Bearer token. Rate limiting is set to 100 requests per minute. Responses are in JSON format.",
        filePath: "C:\\Users\\Cole\\.openclaw\\workspace\\api-docs.md",
        lastUpdated: now - oneDay,
      },
      {
        type: "document",
        title: "Deployment Guide",
        content:
          "To deploy to production: 1) Run tests, 2) Build the application, 3) Push to main branch, 4) Verify deployment in staging, 5) Promote to production. Always backup database before major deployments.",
        filePath: "C:\\Users\\Cole\\.openclaw\\workspace\\deployment.md",
        lastUpdated: now - 3 * oneDay,
      },
      {
        type: "task",
        title: "Implement user notifications",
        content:
          "Add real-time notification system using WebSockets. Support multiple notification types: info, warning, error, success. Store notifications in database for persistence.",
        filePath: "C:\\Users\\Cole\\.openclaw\\cron\\jobs.json",
        lastUpdated: now - oneHour,
      },
    ];

    for (const doc of searchDocs) {
      await ctx.db.insert("searchIndex", doc);
    }

    return {
      activities: activities.length,
      tasks: tasks.length,
      searchDocs: searchDocs.length,
    };
  },
});
