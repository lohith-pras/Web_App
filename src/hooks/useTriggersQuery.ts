import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataAccess } from '../services/dataAccessFactory';
import type { Trigger } from '../types';

const TRIGGERS_QUERY_KEY = ['triggers'];

export function useTriggersQuery() {
    return useQuery({
        queryKey: TRIGGERS_QUERY_KEY,
        queryFn: () => dataAccess.getCustomTriggers(),
    });
}

export function useAddTriggerMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newTrigger: Trigger) => {
            const currentTriggers = await dataAccess.getCustomTriggers();
            const updatedTriggers = [...currentTriggers, newTrigger];
            await dataAccess.saveCustomTriggers(updatedTriggers);
            return newTrigger;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRIGGERS_QUERY_KEY });
        },
    });
}

export function useUpdateTriggerMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedTrigger: Trigger) => {
            const currentTriggers = await dataAccess.getCustomTriggers();
            const updatedTriggers = currentTriggers.map(t =>
                t.id === updatedTrigger.id ? updatedTrigger : t
            );
            await dataAccess.saveCustomTriggers(updatedTriggers);
            return updatedTrigger;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRIGGERS_QUERY_KEY });
        },
    });
}

export function useDeleteTriggerMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (triggerId: string) => {
            const currentTriggers = await dataAccess.getCustomTriggers();
            const updatedTriggers = currentTriggers.filter(t => t.id !== triggerId);
            await dataAccess.saveCustomTriggers(updatedTriggers);
            return triggerId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRIGGERS_QUERY_KEY });
        },
    });
}
