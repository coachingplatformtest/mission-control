import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start on Sunday
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // End on Saturday
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function getDayOfWeek(timestamp: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(timestamp).getDay()];
}

export const actionTypeColors: Record<string, string> = {
  file_edit: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  message_sent: "bg-green-500/10 text-green-500 border-green-500/20",
  search: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  tool_use: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  task_scheduled: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  default: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function getActionTypeColor(actionType: string): string {
  return actionTypeColors[actionType] || actionTypeColors.default;
}

export const actionTypeIcons: Record<string, string> = {
  file_edit: "📝",
  message_sent: "💬",
  search: "🔍",
  tool_use: "🔧",
  task_scheduled: "📅",
  default: "•",
};

export function getActionTypeIcon(actionType: string): string {
  return actionTypeIcons[actionType] || actionTypeIcons.default;
}
