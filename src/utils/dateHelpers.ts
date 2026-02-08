export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

export function getMonthStart(): Date {
    const date = new Date();
    date.setDate(1);
    return getStartOfDay(date);
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

