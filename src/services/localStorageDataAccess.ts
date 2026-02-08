import type { SmokingLog, Trigger, ThemeMode } from '../types';
import type { IDataAccess } from './dataAccess';
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
 * LocalStorage implementation of the data access interface
 * Wraps synchronous localStorage operations in async interface for consistency
 */
export class LocalStorageDataAccess implements IDataAccess {
    async getLogs(): Promise<SmokingLog[]> {
        if (!isStorageAvailable()) return [];

        try {
            const data = localStorage.getItem(STORAGE_KEYS.LOGS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading logs from storage:', error);
            return [];
        }
    }

    async saveLogs(logs: SmokingLog[]): Promise<void> {
        if (!isStorageAvailable()) {
            throw new Error('localStorage is not available');
        }

        try {
            localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
        } catch (error) {
            console.error('Error saving logs to storage:', error);
            throw error;
        }
    }

    async getCustomTriggers(): Promise<Trigger[]> {
        if (!isStorageAvailable()) return [];

        try {
            const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_TRIGGERS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading custom triggers from storage:', error);
            return [];
        }
    }

    async saveCustomTriggers(triggers: Trigger[]): Promise<void> {
        if (!isStorageAvailable()) {
            throw new Error('localStorage is not available');
        }

        try {
            localStorage.setItem(STORAGE_KEYS.CUSTOM_TRIGGERS, JSON.stringify(triggers));
        } catch (error) {
            console.error('Error saving custom triggers to storage:', error);
            throw error;
        }
    }

    async getMonthlyGoal(): Promise<number> {
        if (!isStorageAvailable()) return 0;

        try {
            const data = localStorage.getItem(STORAGE_KEYS.MONTHLY_GOAL);
            return data ? parseInt(data, 10) : 0;
        } catch (error) {
            console.error('Error reading monthly goal from storage:', error);
            return 0;
        }
    }

    async saveMonthlyGoal(goal: number): Promise<void> {
        if (!isStorageAvailable()) {
            throw new Error('localStorage is not available');
        }

        try {
            localStorage.setItem(STORAGE_KEYS.MONTHLY_GOAL, goal.toString());
        } catch (error) {
            console.error('Error saving monthly goal to storage:', error);
            throw error;
        }
    }

    async getThemeMode(): Promise<ThemeMode> {
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
    }

    async saveThemeMode(mode: ThemeMode): Promise<void> {
        if (!isStorageAvailable()) {
            throw new Error('localStorage is not available');
        }

        try {
            localStorage.setItem(STORAGE_KEYS.DARK_MODE, mode);
        } catch (error) {
            console.error('Error saving theme mode to storage:', error);
            throw error;
        }
    }

    async clearAll(): Promise<void> {
        if (!isStorageAvailable()) {
            throw new Error('localStorage is not available');
        }

        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    }
}
