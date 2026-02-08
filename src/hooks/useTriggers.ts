import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Trigger } from '../types';
import { DEFAULT_TRIGGERS } from '../constants/triggers';
import { storage } from '../services/storage';

export function useTriggers() {
    const [customTriggers, setCustomTriggers] = useState<Trigger[]>(() => storage.getCustomTriggers());

    // Save custom triggers to localStorage whenever they change
    useEffect(() => {
        if (customTriggers.length > 0 || storage.getCustomTriggers().length > 0) {
            storage.saveCustomTriggers(customTriggers);
        }
    }, [customTriggers]);

    const allTriggers = [...DEFAULT_TRIGGERS, ...customTriggers];

    const addCustomTrigger = useCallback((name: string, icon: string = 'default') => {
        const newTrigger: Trigger = {
            id: uuidv4(),
            name,
            icon,
            isCustom: true,
        };
        setCustomTriggers(prev => [...prev, newTrigger]);
    }, []);

    const deleteCustomTrigger = useCallback((id: string) => {
        setCustomTriggers(prev => prev.filter(trigger => trigger.id !== id));
    }, []);

    const updateCustomTrigger = useCallback((id: string, name: string, icon: string) => {
        setCustomTriggers(prev =>
            prev.map(trigger =>
                trigger.id === id ? { ...trigger, name, icon } : trigger
            )
        );
    }, []);

    return {
        allTriggers,
        customTriggers,
        addCustomTrigger,
        deleteCustomTrigger,
        updateCustomTrigger,
    };
}
