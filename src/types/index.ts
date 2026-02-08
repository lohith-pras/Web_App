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
export type GoalStatus = 'green' | 'yellow' | 'red';
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

// Settings interfaces
export interface NotificationSettings {
    dailyCheckIn: boolean;
    limitAlerts: boolean;
    checkInTime: string;
}

// Storage data structure
export interface StorageData {
    logs: SmokingLog[];
    customTriggers: Trigger[];
    monthlyGoal: number;
    notifications: NotificationSettings;
}

// Validation types
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface CleanupStats {
    totalLogs: number;
    logsToRemove: number;
    oldestLogDate: string | null;
    cutoffDate: string;
}
