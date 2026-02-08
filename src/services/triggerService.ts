import type { Trigger, ValidationResult } from '../types';
import { storage } from './storage';
import { DEFAULT_TRIGGERS, MAX_CUSTOM_TRIGGERS } from '../constants/triggers';
import { validateTriggerName } from '../utils/validation';

/**
 * Get all triggers (default + custom)
 */
export function getAllTriggers(): Trigger[] {
    const customTriggers = storage.getCustomTriggers();
    return [...DEFAULT_TRIGGERS, ...customTriggers];
}

/**
 * Add a new custom trigger
 */
export function addCustomTrigger(name: string, icon: string = '⭐'): ValidationResult & { trigger?: Trigger } {
    const allTriggers = getAllTriggers();
    const customTriggers = storage.getCustomTriggers();

    // Check if we've reached the limit
    if (customTriggers.length >= MAX_CUSTOM_TRIGGERS) {
        return {
            isValid: false,
            error: `Maximum of ${MAX_CUSTOM_TRIGGERS} custom triggers allowed`,
        };
    }

    // Validate the trigger name
    const validation = validateTriggerName(name, allTriggers);
    if (!validation.isValid) {
        return validation;
    }

    // Create new trigger
    const newTrigger: Trigger = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        icon,
        isCustom: true,
    };

    // Save to storage
    const updated = [...customTriggers, newTrigger];
    const success = storage.saveCustomTriggers(updated);

    if (!success) {
        return {
            isValid: false,
            error: 'Failed to save trigger to storage',
        };
    }

    return {
        isValid: true,
        trigger: newTrigger,
    };
}

/**
 * Update an existing custom trigger
 */
export function updateCustomTrigger(
    id: string,
    updates: { name?: string; icon?: string }
): ValidationResult {
    const customTriggers = storage.getCustomTriggers();
    const triggerIndex = customTriggers.findIndex(t => t.id === id);

    if (triggerIndex === -1) {
        return {
            isValid: false,
            error: 'Trigger not found',
        };
    }

    const trigger = customTriggers[triggerIndex];

    // Validate name if it's being updated
    if (updates.name) {
        const allTriggers = getAllTriggers().filter(t => t.id !== id);
        const validation = validateTriggerName(updates.name, allTriggers);
        if (!validation.isValid) {
            return validation;
        }
    }

    // Update the trigger
    const updatedTrigger: Trigger = {
        ...trigger,
        name: updates.name?.trim() ?? trigger.name,
        icon: updates.icon ?? trigger.icon,
    };

    const updatedTriggers = [...customTriggers];
    updatedTriggers[triggerIndex] = updatedTrigger;

    const success = storage.saveCustomTriggers(updatedTriggers);

    if (!success) {
        return {
            isValid: false,
            error: 'Failed to update trigger in storage',
        };
    }

    return { isValid: true };
}

/**
 * Delete a custom trigger
 */
export function deleteCustomTrigger(id: string): ValidationResult {
    const customTriggers = storage.getCustomTriggers();
    const filtered = customTriggers.filter(t => t.id !== id);

    if (filtered.length === customTriggers.length) {
        return {
            isValid: false,
            error: 'Trigger not found',
        };
    }

    const success = storage.saveCustomTriggers(filtered);

    if (!success) {
        return {
            isValid: false,
            error: 'Failed to delete trigger from storage',
        };
    }

    return { isValid: true };
}

/**
 * Get usage statistics for each trigger
 */
export function getTriggerUsageStats(): Map<string, number> {
    const logs = storage.getLogs();
    const stats = new Map<string, number>();

    // Initialize all triggers with 0
    getAllTriggers().forEach(trigger => {
        stats.set(trigger.name, 0);
    });

    // Count usage
    logs.forEach(log => {
        const count = stats.get(log.trigger) ?? 0;
        stats.set(log.trigger, count + 1);
    });

    return stats;
}

/**
 * Check if a trigger is in use
 */
export function isTriggerInUse(triggerName: string): boolean {
    const logs = storage.getLogs();
    return logs.some(log => log.trigger === triggerName);
}

/**
 * Get the most used triggers
 */
export function getMostUsedTriggers(limit: number = 5): Array<{ name: string; count: number }> {
    const stats = getTriggerUsageStats();

    return Array.from(stats.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}
