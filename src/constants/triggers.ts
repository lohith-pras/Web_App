import type { Trigger } from '../types';

export const DEFAULT_TRIGGERS: Trigger[] = [
    { id: 'stress', name: 'Stress', icon: 'stress', isCustom: false },
    { id: 'social', name: 'Social', icon: 'social', isCustom: false },
    { id: 'coffee', name: 'Coffee', icon: 'coffee', isCustom: false },
    { id: 'after-meal', name: 'After Meals', icon: 'after-meal', isCustom: false },
    { id: 'driving', name: 'Driving', icon: 'driving', isCustom: false },
    { id: 'boredom', name: 'Boredom', icon: 'boredom', isCustom: false },
];

export const STORAGE_KEYS = {
    LOGS: 'smoking_logs',
    CUSTOM_TRIGGERS: 'custom_triggers',
    MONTHLY_GOAL: 'monthly_goal',
    DARK_MODE: 'dark_mode',
} as const;

export const DEFAULT_MONTHLY_GOAL = 200;

