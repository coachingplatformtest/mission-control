"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, User, Clock, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AGENT_COLORS: Record<string, string> = {
  iterone: "bg-blue-500",
  product: "bg-purple-500",
  design: "bg-pink-500",
  builder: "bg-green-500",
  bug: "bg-orange-500",
};

const AGENT_LABELS: Record<string, string> = {
  iterone: "Lead",
  product: "Product",
  design: "Design",
  builder: "Builder",
  bug: "Bug",
};

function formatTokens(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

// Session limit is 200k context window
const SESSION_LIMIT = 200000;

export default function TokensPage() {
  // Get stats for different time periods
  const allTimeStats = useQuery(api.activities.getActivityStats, {});
  
  // Get today's stats
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStats = useQuery(api.activities.getActivityStats, {
    startDate: todayStart.getTime(),
  });

  // Get this week's stats (Mon-Sun)
  const weekStart = new Date();
  const day = weekStart.getDay();
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Monday
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  const weekStats = useQuery(api.activities.getActivityStats, {
    startDate: weekStart.getTime(),
  });

  // Get recent activities with tokens
  const recentActivities = useQuery(api.activities.getActivities, { limit: 20 });
  const activitiesWithTokens = recentActivities?.filter(
    (a: any) => a.tokensIn || a.tokensOut
  );

  const loading = allTimeStats === undefined || todayStats === undefined || weekStats === undefined;

  // Calculate per-agent token totals (from activities with token data)
  const agentTokens: Record<string, { input: number; output: number }> = {};
  activitiesWithTokens?.forEach((a: any) => {
    if (!agentTokens[a.agent]) {
      agentTokens[a.agent] = { input: 0, output: 0 };
    }
    agentTokens[a.agent].input += a.tokensIn || 0;
    agentTokens[a.agent].output += a.tokensOut || 0;
  });

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Token Usage</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-lg">
            Track session and weekly token limits
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Session Limit Card */}
            <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-cyan-500" />
                    Session Limit
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    Resets every 5 hours
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-2">
                  <div className="text-4xl sm:text-5xl font-bold text-cyan-500">
                    200k
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">context window per session</p>
                </div>
                
                {/* Visual limit bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>200k</span>
                  </div>
                  <div className="h-4 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Context usage tracked per-session (resets on compaction)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly & Today Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-500">
                    {formatTokens(weekStats?.tokens?.total || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTokens(weekStats?.tokens?.input || 0)} in / {formatTokens(weekStats?.tokens?.output || 0)} out
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {weekStats?.total || 0} activities
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-500">
                    {formatTokens(todayStats?.tokens?.total || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTokens(todayStats?.tokens?.input || 0)} in / {formatTokens(todayStats?.tokens?.output || 0)} out
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {todayStats?.total || 0} activities
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Per-Agent Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Usage by Agent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(agentTokens).length > 0 ? (
                    Object.entries(agentTokens)
                      .sort((a, b) => (b[1].input + b[1].output) - (a[1].input + a[1].output))
                      .map(([agent, tokens]) => {
                        const total = tokens.input + tokens.output;
                        const maxTokens = Math.max(...Object.values(agentTokens).map(t => t.input + t.output));
                        const percentage = maxTokens > 0 ? (total / maxTokens) * 100 : 0;
                        
                        return (
                          <div key={agent} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${AGENT_COLORS[agent] || "bg-gray-500"}`} />
                                <span className="font-medium text-sm">{AGENT_LABELS[agent] || agent}</span>
                              </div>
                              <span className="text-sm font-mono">
                                {formatTokens(total)}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${AGENT_COLORS[agent] || "bg-gray-500"}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{formatTokens(tokens.input)} in</span>
                              <span>{formatTokens(tokens.output)} out</span>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No agent token data yet. Agents will log usage as they work.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Token Activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activitiesWithTokens?.slice(0, 8).map((activity: any) => (
                    <div 
                      key={activity._id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${AGENT_COLORS[activity.agent] || "bg-gray-500"}`} />
                        <span className="text-sm truncate">{activity.title}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                        <span className="font-mono text-muted-foreground">
                          {formatTokens((activity.tokensIn || 0) + (activity.tokensOut || 0))}
                        </span>
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true }).replace("about ", "")}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!activitiesWithTokens || activitiesWithTokens.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No token data recorded yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
