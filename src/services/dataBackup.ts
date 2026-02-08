import type { StorageData } from '../types';
import { storage } from './storage';
import { isValidSmokingLog, isValidTrigger } from '../utils/validation';

/**
 * Export all data as JSON string
 */
export function exportAllData(): string {
    const data: StorageData = {
        logs: storage.getLogs(),
        customTriggers: storage.getCustomTriggers(),
        monthlyGoal: storage.getMonthlyGoal(),
        notifications: storage.getNotificationSettings(),
    };

    return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON string with validation
 * Returns { success: boolean, error?: string, imported?: number }
 */
export function importData(jsonString: string): { success: boolean; error?: string; imported?: number } {
    try {
        const data = JSON.parse(jsonString) as Partial<StorageData>;

        let importedCount = 0;

        // Validate and import logs
        if (data.logs && Array.isArray(data.logs)) {
            const validLogs = data.logs.filter(isValidSmokingLog);
            if (validLogs.length > 0) {
                storage.saveLogs(validLogs);
                importedCount += validLogs.length;
            }
        }

        // Validate and import custom triggers
        if (data.customTriggers && Array.isArray(data.customTriggers)) {
            const validTriggers = data.customTriggers.filter(isValidTrigger);
            if (validTriggers.length > 0) {
                storage.saveCustomTriggers(validTriggers);
                importedCount += validTriggers.length;
            }
        }

        // Import monthly goal
        if (typeof data.monthlyGoal === 'number' && data.monthlyGoal >= 0) {
            storage.saveMonthlyGoal(data.monthlyGoal);
            importedCount++;
        }

        // Import notification settings
        if (data.notifications) {
            storage.saveNotificationSettings(data.notifications);
            importedCount++;
        }

        return { success: true, imported: importedCount };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Invalid JSON format'
        };
    }
}

/**
 * Download backup file to user's device
 */
export function downloadBackup(): void {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `smoking-tracker-backup-${timestamp}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
}

/**
 * Read file from user's device for import
 */
export function readBackupFile(file: File): Promise<{ success: boolean; error?: string; imported?: number }> {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target?.result as string;
            const result = importData(content);
            resolve(result);
        };

        reader.onerror = () => {
            resolve({ success: false, error: 'Failed to read file' });
        };

        reader.readAsText(file);
    });
}
