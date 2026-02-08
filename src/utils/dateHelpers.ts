export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function getStartOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

export function getDaysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return getStartOfDay(date);
}

export function isToday(dateString: string): boolean {
    return dateString === formatDate(new Date());
}

export function getMonthStart(): Date {
    const date = new Date();
    date.setDate(1);
    return getStartOfDay(date);
}

export function getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
}

export function getHourFromTimestamp(timestamp: string): number {
    const date = new Date(timestamp);
    return date.getHours();
}

export function getMonthsAgo(months: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return getStartOfDay(date);
}

export function isOlderThan(dateString: string, months: number): boolean {
    const cutoffDate = getMonthsAgo(months);
    const checkDate = new Date(dateString);
    return checkDate < cutoffDate;
}

export function getDateRange(days: number): { start: Date; end: Date } {
    const end = new Date();
    const start = days === Infinity ? new Date(0) : getDaysAgo(days);
    return { start, end };
}
