import type { SmokingLog, Trigger } from '../types';
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

