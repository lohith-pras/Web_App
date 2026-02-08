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
        onMutate: async (newLog: SmokingLog) => {
            // Cancel outgoing refetches to avoid race conditions
            await queryClient.cancelQueries({ queryKey: LOGS_QUERY_KEY });

            // Snapshot previous value
            const previousLogs = queryClient.getQueryData<SmokingLog[]>(LOGS_QUERY_KEY);

            // Optimistically update cache
            if (previousLogs) {
                queryClient.setQueryData<SmokingLog[]>(LOGS_QUERY_KEY, [...previousLogs, newLog]);
            }

            // Return context for rollback
            return { previousLogs };
        },
        onError: (_error, _newLog, context) => {
            // Rollback on error
            if (context?.previousLogs) {
                queryClient.setQueryData(LOGS_QUERY_KEY, context.previousLogs);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: LOGS_QUERY_KEY });
        },
    });
}
