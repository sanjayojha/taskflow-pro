import type { TaskPriority, TaskStatus } from "@/types";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";

export function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

export function formatRelative(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isOverdue(date: string | Date): boolean {
    const d = new Date(date);
    return isPast(d) && !isToday(d);
}

export function formatDueDate(date: string | Date): string {
    const d = new Date(date);
    if (isToday(d)) return "Today";
    if (isTomorrow(d)) return "Tomorrow";
    return format(d, "MMM d");
}

// Priority helpers

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
};

export const PRIORITY_DOT_COLORS: Record<TaskPriority, string> = {
    low: "bg-green-500",
    medium: "bg-amber-500",
    high: "bg-orange-500",
    critical: "bg-danger-600",
};

export const PRIORITY_TEXT_COLORS: Record<TaskPriority, string> = {
    low: "text-green-700 bg-green-50",
    medium: "text-amber-700 bg-amber-50",
    high: "text-orange-700 bg-orange-50",
    critical: "text-danger-600 bg-danger-50",
};

// Status helpers

export const STATUS_LABELS: Record<TaskStatus, string> = {
    backlog: "Backlog",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
};

export const STATUS_ORDER: TaskStatus[] = ["backlog", "in_progress", "review", "done"];

export const STATUS_DOT_COLORS: Record<TaskStatus, string> = {
    backlog: "bg-surface-300",
    in_progress: "bg-brand-600",
    review: "bg-amber-600",
    done: "bg-green-600",
};
