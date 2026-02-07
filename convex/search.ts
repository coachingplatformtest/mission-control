// @ts-nocheck
import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Index a document for search
export const indexDocument = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    content: v.string(),
    filePath: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if document already exists
    const existing = await ctx.db
      .query("searchIndex")
      .filter((q) => q.eq(q.field("filePath"), args.filePath))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        type: args.type,
        title: args.title,
        content: args.content,
        lastUpdated: Date.now(),
      });
      return existing._id;
    } else {
      // Insert new
      const id = await ctx.db.insert("searchIndex", {
        type: args.type,
        title: args.title,
        content: args.content,
        filePath: args.filePath,
        lastUpdated: Date.now(),
      });
      return id;
    }
  },
});

// Search across all indexed content
export const searchAll = query({
  args: {
    query: v.string(),
    type: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    let results = await ctx.db
      .query("searchIndex")
      .withSearchIndex("search_content", (q) => {
        let search = q.search("content", args.query);
        if (args.type) {
          search = search.eq("type", args.type);
        }
        return search;
      })
      .take(limit);

    // Also search in titles for better relevance
    const titleMatches = await ctx.db
      .query("searchIndex")
      .filter((q) => {
        let filter = q.or(
          q.eq(q.field("title"), args.query),
          q.gt(q.field("title"), "")
        );
        if (args.type) {
          filter = q.and(filter, q.eq(q.field("type"), args.type));
        }
        return filter;
      })
      .collect();

    // Filter title matches that contain the query
    const filteredTitleMatches = titleMatches.filter((doc) =>
      doc.title.toLowerCase().includes(args.query.toLowerCase())
    );

    // Combine and deduplicate results
    const resultIds = new Set(results.map((r) => r._id));
    for (const match of filteredTitleMatches) {
      if (!resultIds.has(match._id)) {
        results.push(match);
        resultIds.add(match._id);
      }
    }

    // Sort by relevance (title matches first, then by last updated)
    results.sort((a, b) => {
      const aInTitle = a.title.toLowerCase().includes(args.query.toLowerCase());
      const bInTitle = b.title.toLowerCase().includes(args.query.toLowerCase());
      if (aInTitle && !bInTitle) return -1;
      if (!aInTitle && bInTitle) return 1;
      return b.lastUpdated - a.lastUpdated;
    });

    return results.slice(0, limit).map((result) => ({
      ...result,
      snippet: extractSnippet(result.content, args.query),
    }));
  },
});

// Get all indexed documents by type
export const getDocumentsByType = query({
  args: {
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("searchIndex")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

// Helper function to extract snippet around search query
function extractSnippet(content: string, query: string, contextLength = 100): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) {
    // Query not found, return beginning of content
    return content.substring(0, contextLength * 2) + (content.length > contextLength * 2 ? "..." : "");
  }

  const start = Math.max(0, index - contextLength);
  const end = Math.min(content.length, index + query.length + contextLength);

  let snippet = content.substring(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return snippet;
}

// Bulk index documents
export const bulkIndexDocuments = mutation({
  args: {
    documents: v.array(v.object({
      type: v.string(),
      title: v.string(),
      content: v.string(),
      filePath: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const doc of args.documents) {
      const id = await ctx.db.insert("searchIndex", {
        type: doc.type,
        title: doc.title,
        content: doc.content,
        filePath: doc.filePath,
        lastUpdated: Date.now(),
      });
      ids.push(id);
    }
    return ids;
  },
});
