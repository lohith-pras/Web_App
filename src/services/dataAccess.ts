import type { SmokingLog, Trigger, ThemeMode } from '../types';

/**
 * Abstract data access interface that can be implemented by different storage backends
 * This allows seamless migration from localStorage to cloud storage without changing UI code
 */
export interface IDataAccess {
    // Smoking logs
    getLogs(): Promise<SmokingLog[]>;
    saveLogs(logs: SmokingLog[]): Promise<void>;

    // Custom triggers
    getCustomTriggers(): Promise<Trigger[]>;
    saveCustomTriggers(triggers: Trigger[]): Promise<void>;

    // Monthly goal
    getMonthlyGoal(): Promise<number>;
    saveMonthlyGoal(goal: number): Promise<void>;

    // Theme mode
    getThemeMode(): Promise<ThemeMode>;
    saveThemeMode(mode: ThemeMode): Promise<void>;

    // Clear all data
    clearAll(): Promise<void>;
}
