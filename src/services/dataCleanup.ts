import { isOlderThan } from '../utils/dateHelpers';
import { storage } from './storage';

const RETENTION_MONTHS = 6;
const CLEANUP_CHECK_KEY = 'last_cleanup_check';

function cleanupOldLogs(): number {
    const logs = storage.getLogs();
    const initialCount = logs.length;

    const recentLogs = logs.filter(log => !isOlderThan(log.date, RETENTION_MONTHS));

    storage.saveLogs(recentLogs);

    const removedCount = initialCount - recentLogs.length;

    // Update last cleanup timestamp
    try {
        localStorage.setItem(CLEANUP_CHECK_KEY, new Date().toISOString());
    } catch (error) {
        console.error('Failed to save cleanup timestamp:', error);
    }

    return removedCount;
}

/**
 * Check if cleanup should run (once per day)
 */
function shouldRunCleanup(): boolean {
    try {
        const lastCheck = localStorage.getItem(CLEANUP_CHECK_KEY);

        if (!lastCheck) return true;

        const lastCheckDate = new Date(lastCheck);
        const now = new Date();

        // Run cleanup if last check was more than 24 hours ago
        const hoursSinceLastCheck = (now.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60);

        return hoursSinceLastCheck >= 24;
    } catch (error) {
        console.error('Failed to check cleanup status:', error);
        return true; // Run cleanup if we can't check
    }
}

/**
 * Run cleanup if needed (called on app initialization)
 */
export function autoCleanup(): number {
    if (shouldRunCleanup()) {
        return cleanupOldLogs();
    }
    return 0;
}
