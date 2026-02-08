import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Activity log for tracking all AI actions
  activities: defineTable({
    timestamp: v.number(),
    actionType: v.string(), // "file_edit", "message_sent", "search", "tool_use", etc.
    title: v.string(),
    details: v.optional(v.string()),
    agent: v.optional(v.string()), // "iterone", "product", "builder", "qa"
    metadata: v.optional(v.object({
      filePath: v.optional(v.string()),
      toolName: v.optional(v.string()),
      searchQuery: v.optional(v.string()),
      result: v.optional(v.string()),
    })),
  }).index("by_timestamp", ["timestamp"])
    .index("by_action_type", ["actionType"])
    .index("by_agent", ["agent"])
    .index("by_timestamp_and_type", ["timestamp", "actionType"]),

  // Search index for memory files, documents, and tasks
  searchIndex: defineTable({
    type: v.string(), // "memory", "document", "task"
    title: v.string(),
    content: v.string(),
    filePath: v.string(),
    lastUpdated: v.number(),
  }).index("by_type", ["type"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["type"],
    }),

  // Scheduled tasks (cron jobs)
  scheduledTasks: defineTable({
    name: v.string(),
    schedule: v.string(), // cron expression
    description: v.optional(v.string()),
    status: v.string(), // "active", "paused", "completed", "failed"
    lastRun: v.optional(v.number()),
    nextRun: v.optional(v.number()),
    metadata: v.optional(v.object({
      command: v.optional(v.string()),
      priority: v.optional(v.string()),
    })),
  }).index("by_status", ["status"])
    .index("by_next_run", ["nextRun"]),
});
