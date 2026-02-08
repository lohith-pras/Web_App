import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { SmokingLog, TimePeriod } from '../types';
import { storage } from '../services/storage';
import { formatDate, getDaysAgo } from '../utils/dateHelpers';

export function useSmokingLogs() {
    const [logs, setLogs] = useState<SmokingLog[]>([]);

    // Load logs from localStorage on mount
    useEffect(() => {
        const savedLogs = storage.getLogs();
        setLogs(savedLogs);
    }, []);

    // Save logs to localStorage whenever they change
    useEffect(() => {
        if (logs.length > 0 || storage.getLogs().length > 0) {
            storage.saveLogs(logs);
        }
    }, [logs]);

    const addLog = useCallback((trigger: string) => {
        const now = new Date();
        const newLog: SmokingLog = {
            id: uuidv4(),
            timestamp: now.toISOString(),
            trigger,
            date: formatDate(now),
        };
        setLogs(prev => [...prev, newLog]);
    }, []);

    const deleteLog = useCallback((id: string) => {
        setLogs(prev => prev.filter(log => log.id !== id));
    }, []);

    const getLogsForPeriod = useCallback((period: TimePeriod): SmokingLog[] => {
        if (period === 'all') {
            return logs;
        }

        const days = period === '7days' ? 7 : 30;
        const startDate = getDaysAgo(days);

        return logs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= startDate;
        });
    }, [logs]);

    const getTodayLogs = useCallback((): SmokingLog[] => {
        const today = formatDate(new Date());
        return logs.filter(log => log.date === today);
    }, [logs]);

    const getLogsForDate = useCallback((date: string): SmokingLog[] => {
        return logs.filter(log => log.date === date);
    }, [logs]);

    return {
        logs,
        addLog,
        deleteLog,
        getLogsForPeriod,
        getTodayLogs,
        getLogsForDate,
    };
}
