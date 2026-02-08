import type { Trigger } from '../types';

export const DEFAULT_TRIGGERS: Trigger[] = [
    { id: 'stress', name: 'Stress', icon: '😰', isCustom: false },
    { id: 'social', name: 'Social', icon: '👥', isCustom: false },
    { id: 'coffee', name: 'Coffee', icon: '☕', isCustom: false },
    { id: 'after-meal', name: 'After Meals', icon: '🍽️', isCustom: false },
    { id: 'driving', name: 'Driving', icon: '🚗', isCustom: false },
    { id: 'boredom', name: 'Boredom', icon: '😑', isCustom: false },
];

export const STORAGE_KEYS = {
    LOGS: 'smoking_logs',
    CUSTOM_TRIGGERS: 'custom_triggers',
    MONTHLY_GOAL: 'monthly_goal',
    NOTIFICATIONS: 'notification_settings',
    DARK_MODE: 'dark_mode',
} as const;

export const DEFAULT_MONTHLY_GOAL = 200;

export const TIME_PERIODS = {
    '7days': { label: '7 Days', days: 7 },
    '30days': { label: '30 Days', days: 30 },
    'all': { label: 'All Time', days: Infinity },
} as const;

// Trigger management limits
export const MAX_CUSTOM_TRIGGERS = 20;
export const TRIGGER_NAME_MAX_LENGTH = 30;
export const TRIGGER_NAME_MIN_LENGTH = 1;

// Validation patterns
export const TRIGGER_NAME_PATTERN = /^[a-zA-Z0-9\s\-']+$/;

