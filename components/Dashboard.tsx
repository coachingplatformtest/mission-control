"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Search, TrendingUp, Zap, AlertCircle } from "lucide-react";
import { formatTimestamp, getActionTypeColor, getActionTypeIcon } from "@/lib/utils";
import Link from "next/link";
import { useConvexAvailable } from "@/app/ConvexClientProvider";

function ConvexNotConfigured() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Command center for Iterone AI Assistant
        </p>
      </div>

      <Card className="border-yellow-500/50 bg-yellow-500/10">
        <CardContent className="flex items-center gap-4 py-6">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <div>
            <h3 className="font-semibold">Convex Not Configured</h3>
            <p className="text-sm text-muted-foreground">
              Set NEXT_PUBLIC_CONVEX_URL environment variable to enable data persistence.
              Run <code className="bg-muted px-1 rounded">npx convex dev</code> to set up Convex.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats with zeros */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-2">All-time actions logged</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-2">Scheduled automations</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">File Edits</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-2">Files modified</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Zap className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-xl font-bold text-yellow-500">Limited</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Convex not configured</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Navigate to key features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/activity">
              <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 w-full hover:bg-accent">
                <Activity className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Activity Feed</div>
                  <div className="text-xs text-muted-foreground">View all AI actions</div>
                </div>
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 w-full hover:bg-accent">
                <Calendar className="h-6 w-6 text-green-500" />
                <div className="text-left">
                  <div className="font-semibold">Calendar</div>
                  <div className="text-xs text-muted-foreground">Manage scheduled tasks</div>
                </div>
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 w-full hover:bg-accent">
                <Search className="h-6 w-6 text-purple-500" />
                <div className="text-left">
                  <div className="font-semibold">Global Search</div>
                  <div className="text-xs text-muted-foreground">Search everything</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardWithConvex() {
  const recentActivities = useQuery(api.activities.getActivities, { limit: 5 });
  const activityStats = useQuery(api.activities.getActivityStats, {});
  const upcomingTasks = useQuery(api.scheduledTasks.getTasks, { status: "active" });
  const allTasks = useQuery(api.scheduledTasks.getTasks, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Command center for Iterone AI Assistant
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activityStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">All-time actions logged</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {allTasks?.filter((t) => t.status === "active").length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Scheduled automations</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">File Edits</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activityStats?.byType?.file_edit || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Files modified</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Zap className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xl font-bold text-green-500">Active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest actions from the AI assistant</CardDescription>
              </div>
              <Link href="/activity">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivities === undefined ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No activities yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity: any) => (
                  <div
                    key={activity._id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg">
                      {getActionTypeIcon(activity.actionType)}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm truncate">{activity.title}</h4>
                        <Badge
                          variant="outline"
                          className={`${getActionTypeColor(activity.actionType)} text-xs flex-shrink-0`}
                        >
                          {activity.actionType.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Next scheduled automations</CardDescription>
              </div>
              <Link href="/calendar">
                <Button variant="ghost" size="sm">View calendar</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingTasks === undefined ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : upcomingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No scheduled tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.slice(0, 5).map((task: any) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{task.name}</h4>
                      <p className="text-xs font-mono text-muted-foreground">{task.schedule}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex-shrink-0">
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Navigate to key features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/activity">
              <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 w-full hover:bg-accent">
                <Activity className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Activity Feed</div>
                  <div className="text-xs text-muted-foreground">View all AI actions</div>
                </div>
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 w-full hover:bg-accent">
                <Calendar className="h-6 w-6 text-green-500" />
                <div className="text-left">
                  <div className="font-semibold">Calendar</div>
                  <div className="text-xs text-muted-foreground">Manage scheduled tasks</div>
                </div>
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 w-full hover:bg-accent">
                <Search className="h-6 w-6 text-purple-500" />
                <div className="text-left">
                  <div className="font-semibold">Global Search</div>
                  <div className="text-xs text-muted-foreground">Search everything</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Dashboard() {
  const convexAvailable = useConvexAvailable();
  
  if (!convexAvailable) {
    return <ConvexNotConfigured />;
  }

  return <DashboardWithConvex />;
}
