"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, TrendingDown, User, Clock, Zap } from "lucide-react";
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

// Estimate cost based on Claude Opus pricing (~$15/1M input, ~$75/1M output)
function estimateCost(tokensIn: number, tokensOut: number): string {
  const inputCost = (tokensIn / 1000000) * 15;
  const outputCost = (tokensOut / 1000000) * 75;
  const total = inputCost + outputCost;
  if (total < 0.01) return "<$0.01";
  return `$${total.toFixed(2)}`;
}

export default function TokensPage() {
  // Get stats for different time periods
  const allTimeStats = useQuery(api.activities.getActivityStats, {});
  
  // Get today's stats
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStats = useQuery(api.activities.getActivityStats, {
    startDate: todayStart.getTime(),
  });

  // Get recent activities with tokens
  const recentActivities = useQuery(api.activities.getActivities, { limit: 20 });
  const activitiesWithTokens = recentActivities?.filter(
    (a: any) => a.tokensIn || a.tokensOut
  );

  const loading = allTimeStats === undefined || todayStats === undefined;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Token Tracker</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-lg">
            Monitor AI token usage and costs
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Today's Summary - Big mobile-first card */}
            <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                    <Coins className="h-5 w-5 text-cyan-500" />
                    Today&apos;s Usage
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-2">
                  <div className="text-4xl sm:text-5xl font-bold text-cyan-500">
                    {formatTokens((todayStats?.tokens?.total) || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">tokens used today</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-green-500/10 p-3 text-center">
                    <TrendingDown className="h-4 w-4 text-green-500 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-bold text-green-500">
                      {formatTokens(todayStats?.tokens?.input || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Input</p>
                  </div>
                  <div className="rounded-xl bg-orange-500/10 p-3 text-center">
                    <TrendingUp className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-bold text-orange-500">
                      {formatTokens(todayStats?.tokens?.output || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Output</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/50">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Est. cost:</span>
                  <span className="font-semibold text-yellow-500">
                    {estimateCost(todayStats?.tokens?.input || 0, todayStats?.tokens?.output || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* All Time Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">All Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold">
                      {formatTokens(allTimeStats?.tokens?.total || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatTokens(allTimeStats?.tokens?.input || 0)} in / {formatTokens(allTimeStats?.tokens?.output || 0)} out
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-yellow-500">
                      {estimateCost(allTimeStats?.tokens?.input || 0, allTimeStats?.tokens?.output || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">total cost</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Per-Agent Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Usage by Agent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(allTimeStats?.byAgent || {}).map(([agent, count]) => {
                    const percentage = allTimeStats?.total 
                      ? Math.round(((count as number) / allTimeStats.total) * 100)
                      : 0;
                    return (
                      <div key={agent} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${AGENT_COLORS[agent] || "bg-gray-500"}`} />
                            <span className="font-medium">{AGENT_LABELS[agent] || agent}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {count as number} activities ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${AGENT_COLORS[agent] || "bg-gray-500"}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(allTimeStats?.byAgent || {}).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No agent activity yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Token-Heavy Activities */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Token Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activitiesWithTokens?.slice(0, 10).map((activity: any) => (
                    <div 
                      key={activity._id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${AGENT_COLORS[activity.agent] || "bg-gray-500"}`} />
                        <span className="text-sm truncate">{activity.title}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                        <span className="text-green-500 font-mono">
                          {formatTokens(activity.tokensIn || 0)}↓
                        </span>
                        <span className="text-orange-500 font-mono">
                          {formatTokens(activity.tokensOut || 0)}↑
                        </span>
                        <span className="text-muted-foreground w-16 text-right">
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
