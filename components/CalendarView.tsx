"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTime, formatDate, getWeekRange, getDayOfWeek } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Calendar } from "lucide-react";
import { useConvexAvailable } from "@/app/ConvexClientProvider";

function CalendarViewNoConvex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-2">Weekly view of scheduled tasks</p>
      </div>

      <Card className="border-yellow-500/50 bg-yellow-500/10">
        <CardContent className="flex items-center gap-4 py-6">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <div>
            <h3 className="font-semibold">Convex Not Configured</h3>
            <p className="text-sm text-muted-foreground">
              Set NEXT_PUBLIC_CONVEX_URL to enable task scheduling.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No scheduled tasks</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CalendarViewWithConvex() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { start, end } = getWeekRange(currentDate);

  const tasks = useQuery(api.scheduledTasks.getTasksForWeek, {
    weekStart: start.getTime(),
    weekEnd: end.getTime(),
  });

  const allTasks = useQuery(api.scheduledTasks.getTasks, {});

  const goToPreviousWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const goToNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Group tasks by day
  const tasksByDay: Record<string, typeof tasks> = {};
  if (tasks) {
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const dayKey = day.toISOString().split("T")[0];
      tasksByDay[dayKey] = [];
    }

    tasks.forEach((task: any) => {
      if (task.nextRun) {
        const taskDate = new Date(task.nextRun);
        const dayKey = taskDate.toISOString().split("T")[0];
        if (tasksByDay[dayKey]) {
          tasksByDay[dayKey]!.push(task);
        }
      }
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "paused":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-2">Weekly view of scheduled tasks</p>
      </div>

      {/* Stats */}
      {allTasks && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {allTasks.filter((t: any) => t.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Paused</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {allTasks.filter((t: any) => t.status === "paused").length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {formatDate(start.getTime())} - {formatDate(end.getTime())}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={goToToday}>
                Today
              </Button>
              <Button size="sm" variant="outline" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tasks === undefined ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {Object.entries(tasksByDay).map(([dayKey, dayTasks]) => {
                const dayDate = new Date(dayKey);
                const isToday = dayDate.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={dayKey}
                    className={`space-y-2 rounded-lg border p-3 ${
                      isToday ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium text-muted-foreground">
                        {getDayOfWeek(dayDate.getTime())}
                      </div>
                      <div className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>
                        {dayDate.getDate()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {!dayTasks || dayTasks.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No tasks
                        </p>
                      ) : (
                        dayTasks.map((task: any) => (
                          <div
                            key={task._id}
                            className="rounded-md border border-border bg-card p-2 space-y-1"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <p className="text-xs font-medium line-clamp-2">{task.name}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {task.nextRun && formatTime(task.nextRun)}
                            </div>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(task.status)} text-xs`}
                            >
                              {task.status}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>All Scheduled Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {allTasks === undefined ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : allTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No scheduled tasks</p>
              <p className="text-sm text-muted-foreground mt-2">
                Tasks will appear here when scheduled
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allTasks.map((task: any) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold">{task.name}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-mono">{task.schedule}</span>
                      {task.nextRun && <span>Next: {formatDate(task.nextRun)}</span>}
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function CalendarView() {
  const convexAvailable = useConvexAvailable();
  
  if (!convexAvailable) {
    return <CalendarViewNoConvex />;
  }

  return <CalendarViewWithConvex />;
}
