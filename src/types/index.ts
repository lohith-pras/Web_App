// Core data models
export interface SmokingLog {
    id: string;
    timestamp: string;
    trigger: string;
    date: string; // YYYY-MM-DD format
}

export interface Trigger {
    id: string;
    name: string;
    icon: string;
    isCustom: boolean;
}

export interface ToastProps {
    message: string;
    show: boolean;
    onClose: () => void;
}

// Utility types
export type TimePeriod = '7days' | '30days' | 'all';
export type TabType = 'log' | 'insights' | 'settings';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ChartDataPoint {
    name: string;
    value: number;
    color?: string;
}

export interface DailyDataPoint {
    date: string;
    count: number;
}

