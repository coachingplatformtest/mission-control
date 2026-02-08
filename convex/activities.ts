// @ts-nocheck
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Log a new activity
export const logActivity = mutation({
  args: {
    actionType: v.string(),
    title: v.string(),
    details: v.optional(v.string()),
    agent: v.optional(v.string()), // "iterone", "product", "design", "builder", "bug"
    tokensIn: v.optional(v.number()),
    tokensOut: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    metadata: v.optional(v.object({
      filePath: v.optional(v.string()),
      toolName: v.optional(v.string()),
      searchQuery: v.optional(v.string()),
      result: v.optional(v.string()),
      commitHash: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const activityId = await ctx.db.insert("activities", {
      timestamp: Date.now(),
      actionType: args.actionType,
      title: args.title,
      details: args.details,
      agent: args.agent || "iterone",
      tokensIn: args.tokensIn,
      tokensOut: args.tokensOut,
      durationMs: args.durationMs,
      metadata: args.metadata,
    });
    return activityId;
  },
});

// Get recent activities with optional filtering
export const getActivities = query({
  args: {
    limit: v.optional(v.number()),
    actionType: v.optional(v.string()),
    agent: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let activitiesQuery = ctx.db.query("activities");

    // Filter by action type if specified
    if (args.actionType) {
      activitiesQuery = activitiesQuery
        .withIndex("by_action_type", (q: any) => q.eq("actionType", args.actionType));
    } else if (args.agent) {
      activitiesQuery = activitiesQuery
        .withIndex("by_agent", (q: any) => q.eq("agent", args.agent));
    }

    // Get activities
    let activities = await activitiesQuery
      .order("desc")
      .take(1000); // Get more initially for date filtering

    // Filter by date range if specified
    if (args.startDate || args.endDate || (args.agent && args.actionType)) {
      activities = activities.filter((activity: any) => {
        if (args.startDate && activity.timestamp < args.startDate) return false;
        if (args.endDate && activity.timestamp > args.endDate) return false;
        if (args.agent && args.actionType && activity.agent !== args.agent) return false;
        return true;
      });
    }

    return activities.slice(0, limit);
  },
});

// Get activity statistics
export const getActivityStats = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let activities = await ctx.db.query("activities")
      .order("desc")
      .collect();

    // Filter by date range if specified
    if (args.startDate || args.endDate) {
      activities = activities.filter((activity) => {
        if (args.startDate && activity.timestamp < args.startDate) return false;
        if (args.endDate && activity.timestamp > args.endDate) return false;
        return true;
      });
    }

    // Count by action type
    const typeCount: Record<string, number> = {};
    // Count by agent
    const agentCount: Record<string, number> = {};
    // Token totals
    let totalTokensIn = 0;
    let totalTokensOut = 0;
    
    activities.forEach((activity) => {
      typeCount[activity.actionType] = (typeCount[activity.actionType] || 0) + 1;
      if (activity.agent) {
        agentCount[activity.agent] = (agentCount[activity.agent] || 0) + 1;
      }
      if (activity.tokensIn) totalTokensIn += activity.tokensIn;
      if (activity.tokensOut) totalTokensOut += activity.tokensOut;
    });

    return {
      total: activities.length,
      byType: typeCount,
      byAgent: agentCount,
      tokens: {
        input: totalTokensIn,
        output: totalTokensOut,
        total: totalTokensIn + totalTokensOut,
      },
    };
  },
});
