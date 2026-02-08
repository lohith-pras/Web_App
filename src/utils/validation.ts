import type { SmokingLog, Trigger, ValidationResult } from '../types';

/**
 * Type guard to check if data is a valid SmokingLog
 */
export function isValidSmokingLog(data: unknown): data is SmokingLog {
    if (!data || typeof data !== 'object') return false;

    const log = data as Partial<SmokingLog>;

    return (
        typeof log.id === 'string' &&
        log.id.length > 0 &&
        typeof log.timestamp === 'string' &&
        !isNaN(Date.parse(log.timestamp)) &&
        typeof log.trigger === 'string' &&
        log.trigger.length > 0 &&
        typeof log.date === 'string' &&
        isValidDate(log.date)
    );
}

/**
 * Type guard to check if data is a valid Trigger
 */
export function isValidTrigger(data: unknown): data is Trigger {
    if (!data || typeof data !== 'object') return false;

    const trigger = data as Partial<Trigger>;

    return (
        typeof trigger.id === 'string' &&
        trigger.id.length > 0 &&
        typeof trigger.name === 'string' &&
        trigger.name.length > 0 &&
        trigger.name.length <= 30 &&
        typeof trigger.icon === 'string' &&
        trigger.icon.length > 0 &&
        typeof trigger.isCustom === 'boolean'
    );
}

/**
 * Validate date string format (YYYY-MM-DD)
 */
export function isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

/**
 * Sanitize user input by trimming and removing potentially harmful characters
 */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .substring(0, 100); // Limit length
}

/**
 * Validate trigger name
 */
export function validateTriggerName(name: string, existingTriggers: Trigger[]): ValidationResult {
    const sanitized = sanitizeInput(name);

    if (sanitized.length === 0) {
        return { isValid: false, error: 'Trigger name cannot be empty' };
    }

    if (sanitized.length > 30) {
        return { isValid: false, error: 'Trigger name must be 30 characters or less' };
    }

    const nameExists = existingTriggers.some(
        t => t.name.toLowerCase() === sanitized.toLowerCase()
    );

    if (nameExists) {
        return { isValid: false, error: 'A trigger with this name already exists' };
    }

    return { isValid: true };
}

/**
 * Validate monthly goal
 */
export function validateMonthlyGoal(goal: number): ValidationResult {
    if (!Number.isInteger(goal)) {
        return { isValid: false, error: 'Goal must be a whole number' };
    }

    if (goal < 0) {
        return { isValid: false, error: 'Goal cannot be negative' };
    }

    if (goal > 10000) {
        return { isValid: false, error: 'Goal seems unreasonably high' };
    }

    return { isValid: true };
}
