"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTimestamp, getActionTypeColor, getActionTypeIcon } from "@/lib/utils";
import { useState } from "react";
import { Filter, AlertCircle, Activity } from "lucide-react";
import { useConvexAvailable } from "@/app/ConvexClientProvider";

const actionTypes = [
  "all",
  "file_edit",
  "message_sent",
  "search",
  "tool_use",
  "task_scheduled",
];

function ActivityFeedNoConvex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
        <p className="text-muted-foreground mt-2">
          Real-time log of all AI assistant actions
        </p>
      </div>

      <Card className="border-yellow-500/50 bg-yellow-500/10">
        <CardContent className="flex items-center gap-4 py-6">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <div>
            <h3 className="font-semibold">Convex Not Configured</h3>
            <p className="text-sm text-muted-foreground">
              Set NEXT_PUBLIC_CONVEX_URL to enable activity logging.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No activities yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityFeedWithConvex() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start?: number; end?: number }>({});

  const activities = useQuery(api.activities.getActivities, {
    limit: 50,
    actionType: selectedType === "all" ? undefined : selectedType,
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  const stats = useQuery(api.activities.getActivityStats, {
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
        <p className="text-muted-foreground mt-2">
          Real-time log of all AI assistant actions
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          {Object.entries(stats.byType).slice(0, 3).map(([type, count]) => (
            <Card key={type}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium capitalize">
                  {type.replace("_", " ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count as number}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {actionTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type === "all" ? "All" : type.replace("_", " ")}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Showing {activities?.length || 0} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities === undefined ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No activities yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Activities will appear here as the AI assistant performs actions
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
                    {getActionTypeIcon(activity.actionType)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{activity.title}</h4>
                      <Badge
                        variant="outline"
                        className={getActionTypeColor(activity.actionType)}
                      >
                        {activity.actionType.replace("_", " ")}
                      </Badge>
                    </div>
                    {activity.details && (
                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>
                    )}
                    {activity.metadata?.filePath && (
                      <p className="text-xs font-mono text-muted-foreground">
                        {activity.metadata.filePath}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function ActivityFeed() {
  const convexAvailable = useConvexAvailable();
  
  if (!convexAvailable) {
    return <ActivityFeedNoConvex />;
  }

  return <ActivityFeedWithConvex />;
}
