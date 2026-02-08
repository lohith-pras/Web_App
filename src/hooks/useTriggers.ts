import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Trigger } from '../types';
import { DEFAULT_TRIGGERS } from '../constants/triggers';
// import { storage } from '../services/storage'; // Removed
import {
    useTriggersQuery,
    useAddTriggerMutation,
    useUpdateTriggerMutation,
    useDeleteTriggerMutation
} from './useTriggersQuery';

export function useTriggers() {
    const triggersQuery = useTriggersQuery();
    const addMutation = useAddTriggerMutation();
    const updateMutation = useUpdateTriggerMutation();
    const deleteMutation = useDeleteTriggerMutation();

    const customTriggers = triggersQuery.data ?? [];
    const allTriggers = [...DEFAULT_TRIGGERS, ...customTriggers];

    const addCustomTrigger = useCallback((name: string, icon: string = 'default') => {
        const newTrigger: Trigger = {
            id: uuidv4(),
            name,
            icon,
            isCustom: true,
        };
        addMutation.mutate(newTrigger);
    }, [addMutation]);

    const deleteCustomTrigger = useCallback((id: string) => {
        deleteMutation.mutate(id);
    }, [deleteMutation]);

    const updateCustomTrigger = useCallback((id: string, name: string, icon: string) => {
        const trigger = customTriggers.find(t => t.id === id);
        if (!trigger) {
            console.warn(
                `updateCustomTrigger: Trigger with id "${id}" not found. ` +
                `Current customTriggers count: ${customTriggers.length}. ` +
                `Update operation will be skipped.`
            );
            return;
        }
        updateMutation.mutate({ ...trigger, name, icon });
    }, [customTriggers, updateMutation]);

    return {
        allTriggers,
        customTriggers,
        addCustomTrigger,
        deleteCustomTrigger,
        updateCustomTrigger,
        isLoading: triggersQuery.isLoading,
        isError: triggersQuery.isError,
        error: triggersQuery.error,
    };
}
