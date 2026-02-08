// @ts-nocheck
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// POST /api/log - Log an activity from external sources (like Iterone)
http.route({
  path: "/api/log",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Verify the secret key
    const authHeader = request.headers.get("Authorization");
    const expectedKey = process.env.ACTIVITY_LOG_SECRET;
    
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const body = await request.json();
      
      // Validate required fields
      if (!body.actionType || !body.title) {
        return new Response(
          JSON.stringify({ error: "actionType and title are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Log the activity
      const activityId = await ctx.runMutation(api.activities.logActivity, {
        actionType: body.actionType,
        title: body.title,
        details: body.details,
        metadata: body.metadata,
        agent: body.agent || "iterone", // Default to iterone
      });

      return new Response(
        JSON.stringify({ success: true, activityId }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error logging activity:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// GET /api/activities - Get recent activities
http.route({
  path: "/api/activities",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const actionType = url.searchParams.get("actionType") || undefined;
    const agent = url.searchParams.get("agent") || undefined;

    try {
      const activities = await ctx.runQuery(api.activities.getActivities, {
        limit,
        actionType,
        agent,
      });

      return new Response(JSON.stringify(activities), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching activities:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
