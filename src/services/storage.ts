import type { SmokingLog, Trigger, NotificationSettings } from '../types';
import { STORAGE_KEYS } from '../constants/triggers';

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get approximate localStorage usage in bytes
 */
export function getStorageSize(): number {
    let total = 0;
    try {
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
    } catch {
        return 0;
    }
    return total;
}

export const storage = {
    // Smoking logs
    getLogs(): SmokingLog[] {
        if (!isStorageAvailable()) return [];

        try {
            const data = localStorage.getItem(STORAGE_KEYS.LOGS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading logs from storage:', error);
            return [];
        }
    },

    saveLogs(logs: SmokingLog[]): boolean {
        if (!isStorageAvailable()) {
            console.error('localStorage is not available');
            return false;
        }

        try {
            localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
            return true;
        } catch (error) {
            console.error('Error saving logs to storage:', error);
            return false;
        }
    },

    // Custom triggers
    getCustomTriggers(): Trigger[] {
        if (!isStorageAvailable()) return [];

        try {
            const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_TRIGGERS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading custom triggers from storage:', error);
            return [];
        }
    },

    saveCustomTriggers(triggers: Trigger[]): boolean {
        if (!isStorageAvailable()) {
            console.error('localStorage is not available');
            return false;
        }

        try {
            localStorage.setItem(STORAGE_KEYS.CUSTOM_TRIGGERS, JSON.stringify(triggers));
            return true;
        } catch (error) {
            console.error('Error saving custom triggers to storage:', error);
            return false;
        }
    },

    // Monthly goal
    getMonthlyGoal(): number {
        if (!isStorageAvailable()) return 0;

        try {
            const data = localStorage.getItem(STORAGE_KEYS.MONTHLY_GOAL);
            return data ? parseInt(data, 10) : 0;
        } catch (error) {
            console.error('Error reading monthly goal from storage:', error);
            return 0;
        }
    },

    saveMonthlyGoal(goal: number): boolean {
        if (!isStorageAvailable()) {
            console.error('localStorage is not available');
            return false;
        }

        try {
            localStorage.setItem(STORAGE_KEYS.MONTHLY_GOAL, goal.toString());
            return true;
        } catch (error) {
            console.error('Error saving monthly goal to storage:', error);
            return false;
        }
    },

    // Notification settings
    getNotificationSettings(): NotificationSettings {
        if (!isStorageAvailable()) {
            return { dailyCheckIn: true, limitAlerts: true, checkInTime: '20:00' };
        }

        try {
            const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
            return data ? JSON.parse(data) : { dailyCheckIn: true, limitAlerts: true, checkInTime: '20:00' };
        } catch (error) {
            console.error('Error reading notification settings from storage:', error);
            return { dailyCheckIn: true, limitAlerts: true, checkInTime: '20:00' };
        }
    },

    saveNotificationSettings(settings: NotificationSettings): boolean {
        if (!isStorageAvailable()) {
            console.error('localStorage is not available');
            return false;
        }

        try {
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving notification settings to storage:', error);
            return false;
        }
    },

    // Theme mode
    getThemeMode(): 'light' | 'dark' | 'system' {
        if (!isStorageAvailable()) return 'system';

        try {
            const data = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
            if (data === 'light' || data === 'dark' || data === 'system') {
                return data;
            }
            return 'system';
        } catch (error) {
            console.error('Error reading theme mode from storage:', error);
            return 'system';
        }
    },

    saveThemeMode(mode: 'light' | 'dark' | 'system'): boolean {
        if (!isStorageAvailable()) {
            console.error('localStorage is not available');
            return false;
        }

        try {
            localStorage.setItem(STORAGE_KEYS.DARK_MODE, mode);
            return true;
        } catch (error) {
            console.error('Error saving theme mode to storage:', error);
            return false;
        }
    },

    // Legacy support
    getDarkMode(): boolean {
        const mode = this.getThemeMode();
        if (mode === 'system') {
            // Guard for SSR/non-browser environments
            if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
                return window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            // Fallback to light mode if matchMedia is unavailable
            return false;
        }
        return mode === 'dark';
    },

    saveDarkMode(isDark: boolean): boolean {
        return this.saveThemeMode(isDark ? 'dark' : 'light');
    },

    // Clear all data
    clearAll(): boolean {
        if (!isStorageAvailable()) {
            console.error('localStorage is not available');
            return false;
        }

        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    },
};

