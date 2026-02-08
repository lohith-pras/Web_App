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
        onMutate: async (newTrigger: Trigger) => {
            // Cancel outgoing refetches to avoid race conditions
            await queryClient.cancelQueries({ queryKey: TRIGGERS_QUERY_KEY });

            // Snapshot previous value
            const previousTriggers = queryClient.getQueryData<Trigger[]>(TRIGGERS_QUERY_KEY);

            // Optimistically update cache
            if (previousTriggers) {
                queryClient.setQueryData<Trigger[]>(TRIGGERS_QUERY_KEY, [...previousTriggers, newTrigger]);
            }

            // Return context for rollback
            return { previousTriggers };
        },
        onError: (_error, _newTrigger, context) => {
            // Rollback on error
            if (context?.previousTriggers) {
                queryClient.setQueryData(TRIGGERS_QUERY_KEY, context.previousTriggers);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: TRIGGERS_QUERY_KEY });
        },
    });
}

export function useUpdateTriggerMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedTrigger: Trigger) => {
            const currentTriggers = await dataAccess.getCustomTriggers();
            
            // Check if trigger exists before updating
            const triggerExists = currentTriggers.some(t => t.id === updatedTrigger.id);
            if (!triggerExists) {
                throw new Error(`Trigger with id ${updatedTrigger.id} not found. Cannot update non-existent trigger.`);
            }
            
            const updatedTriggers = currentTriggers.map(t =>
                t.id === updatedTrigger.id ? updatedTrigger : t
            );
            await dataAccess.saveCustomTriggers(updatedTriggers);
            return updatedTrigger;
        },
        onMutate: async (updatedTrigger: Trigger) => {
            // Cancel outgoing refetches to avoid race conditions
            await queryClient.cancelQueries({ queryKey: TRIGGERS_QUERY_KEY });

            // Snapshot previous value
            const previousTriggers = queryClient.getQueryData<Trigger[]>(TRIGGERS_QUERY_KEY);

            // Optimistically update cache
            if (previousTriggers) {
                const updatedTriggers = previousTriggers.map(t =>
                    t.id === updatedTrigger.id ? updatedTrigger : t
                );
                queryClient.setQueryData<Trigger[]>(TRIGGERS_QUERY_KEY, updatedTriggers);
            }

            // Return context for rollback
            return { previousTriggers };
        },
        onError: (_error, _updatedTrigger, context) => {
            // Rollback on error
            if (context?.previousTriggers) {
                queryClient.setQueryData(TRIGGERS_QUERY_KEY, context.previousTriggers);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
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
        onMutate: async (triggerId: string) => {
            // Cancel outgoing refetches to avoid race conditions
            await queryClient.cancelQueries({ queryKey: TRIGGERS_QUERY_KEY });

            // Snapshot previous value
            const previousTriggers = queryClient.getQueryData<Trigger[]>(TRIGGERS_QUERY_KEY);

            // Optimistically update cache
            if (previousTriggers) {
                const updatedTriggers = previousTriggers.filter(t => t.id !== triggerId);
                queryClient.setQueryData<Trigger[]>(TRIGGERS_QUERY_KEY, updatedTriggers);
            }

            // Return context for rollback
            return { previousTriggers };
        },
        onError: (_error, _triggerId, context) => {
            // Rollback on error
            if (context?.previousTriggers) {
                queryClient.setQueryData(TRIGGERS_QUERY_KEY, context.previousTriggers);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: TRIGGERS_QUERY_KEY });
        },
    });
}
