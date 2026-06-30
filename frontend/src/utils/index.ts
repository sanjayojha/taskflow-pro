import { formatDistanceToNow, isPast, isToday } from "date-fns";

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
