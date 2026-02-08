import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { SmokingLog } from '../types';
import { storage } from '../services/storage';
import { formatDate } from '../utils/dateHelpers';

export function useSmokingLogs() {
    const [logs, setLogs] = useState<SmokingLog[]>(() => storage.getLogs());

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

    return {
        logs,
        addLog,
    };
}
