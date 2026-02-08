import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataAccess } from '../services/dataAccessFactory';
import type { SmokingLog } from '../types';

const LOGS_QUERY_KEY = ['logs'];

export function useLogsQuery() {
    return useQuery({
        queryKey: LOGS_QUERY_KEY,
        queryFn: () => dataAccess.getLogs(),
    });
}

export function useAddLogMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newLog: SmokingLog) => {
            const currentLogs = await dataAccess.getLogs();
            const updatedLogs = [...currentLogs, newLog];
            await dataAccess.saveLogs(updatedLogs);
            return newLog;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LOGS_QUERY_KEY });
        },
    });
}
