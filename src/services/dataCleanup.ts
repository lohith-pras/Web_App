import type { CleanupStats } from '../types';
import { isOlderThan, formatDate } from '../utils/dateHelpers';
import { storage } from './storage';

const RETENTION_MONTHS = 6;
const CLEANUP_CHECK_KEY = 'last_cleanup_check';

/**
 * Get statistics about logs that would be removed by cleanup
 */
export function getCleanupStats(): CleanupStats {
    const logs = storage.getLogs();
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - RETENTION_MONTHS);

    const logsToRemove = logs.filter(log => isOlderThan(log.date, RETENTION_MONTHS));

    const oldestLog = logs.length > 0
        ? logs.reduce((oldest, log) =>
            new Date(log.date) < new Date(oldest.date) ? log : oldest
        )
        : null;

    return {
        totalLogs: logs.length,
        logsToRemove: logsToRemove.length,
        oldestLogDate: oldestLog ? oldestLog.date : null,
        cutoffDate: formatDate(cutoffDate),
    };
}

/**
 * Remove logs older than 6 months
 * Returns the number of logs removed
 */
export function cleanupOldLogs(): number {
    const logs = storage.getLogs();
    const initialCount = logs.length;

    const recentLogs = logs.filter(log => !isOlderThan(log.date, RETENTION_MONTHS));

    storage.saveLogs(recentLogs);

    const removedCount = initialCount - recentLogs.length;

    // Update last cleanup timestamp
    localStorage.setItem(CLEANUP_CHECK_KEY, new Date().toISOString());

    return removedCount;
}

/**
 * Check if cleanup should run (once per day)
 */
export function shouldRunCleanup(): boolean {
    const lastCheck = localStorage.getItem(CLEANUP_CHECK_KEY);

    if (!lastCheck) return true;

    const lastCheckDate = new Date(lastCheck);
    const now = new Date();

    // Run cleanup if last check was more than 24 hours ago
    const hoursSinceLastCheck = (now.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60);

    return hoursSinceLastCheck >= 24;
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
