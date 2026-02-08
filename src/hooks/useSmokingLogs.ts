import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { SmokingLog } from '../types';
// import { storage } from '../services/storage'; // Removed
import { formatDate } from '../utils/dateHelpers';
import { useLogsQuery, useAddLogMutation } from './useLogsQuery';

export function useSmokingLogs() {
    const logsQuery = useLogsQuery();
    const addLogMutation = useAddLogMutation();

    const addLog = useCallback((trigger: string) => {
        const now = new Date();
        const newLog: SmokingLog = {
            id: uuidv4(),
            timestamp: now.toISOString(),
            trigger,
            date: formatDate(now),
        };
        addLogMutation.mutate(newLog);
    }, [addLogMutation]);

    return {
        logs: logsQuery.data ?? [],
        isLoading: logsQuery.isLoading,
        isError: logsQuery.isError,
        error: logsQuery.error,
        addLog,
    };
}
