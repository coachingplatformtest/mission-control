// @ts-nocheck
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get scheduled tasks
export const getTasks = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let tasksQuery = ctx.db.query("scheduledTasks");

    if (args.status) {
      tasksQuery = tasksQuery.withIndex("by_status", (q) => q.eq("status", args.status));
    }

    const tasks = await tasksQuery.collect();
    return tasks.sort((a, b) => (a.nextRun || 0) - (b.nextRun || 0));
  },
});

// Get tasks for a specific week
export const getTasksForWeek = query({
  args: {
    weekStart: v.number(),
    weekEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("scheduledTasks")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Filter tasks that have runs scheduled in the week range
    return tasks.filter((task) => {
      if (!task.nextRun) return false;
      return task.nextRun >= args.weekStart && task.nextRun <= args.weekEnd;
    });
  },
});

// Create or update a scheduled task
export const upsertTask = mutation({
  args: {
    id: v.optional(v.id("scheduledTasks")),
    name: v.string(),
    schedule: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    lastRun: v.optional(v.number()),
    nextRun: v.optional(v.number()),
    metadata: v.optional(v.object({
      command: v.optional(v.string()),
      priority: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      // Update existing task
      await ctx.db.patch(args.id, {
        name: args.name,
        schedule: args.schedule,
        description: args.description,
        status: args.status,
        lastRun: args.lastRun,
        nextRun: args.nextRun,
        metadata: args.metadata,
      });
      return args.id;
    } else {
      // Create new task
      const taskId = await ctx.db.insert("scheduledTasks", {
        name: args.name,
        schedule: args.schedule,
        description: args.description,
        status: args.status,
        lastRun: args.lastRun,
        nextRun: args.nextRun,
        metadata: args.metadata,
      });
      return taskId;
    }
  },
});

// Update task status
export const updateTaskStatus = mutation({
  args: {
    id: v.id("scheduledTasks"),
    status: v.string(),
    lastRun: v.optional(v.number()),
    nextRun: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      lastRun: args.lastRun,
      nextRun: args.nextRun,
    });
  },
});
