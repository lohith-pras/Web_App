import { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import type { ThemeMode } from '../types';

function getSystemPreference(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveTheme(mode: ThemeMode): boolean {
    if (mode === 'system') {
        return getSystemPreference();
    }
    return mode === 'dark';
}

export function useDarkMode() {
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        // Initialize from storage, default to 'system'
        return storage.getThemeMode();
    });

    const [isDark, setIsDark] = useState<boolean>(() => {
        // Resolve initial theme
        return resolveTheme(storage.getThemeMode());
    });

    // Listen for system preference changes
    useEffect(() => {
        if (themeMode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [themeMode]);

    // Apply theme and save to storage
    useEffect(() => {
        const resolved = resolveTheme(themeMode);
        setIsDark(resolved);

        // Apply dark mode class to document root
        if (resolved) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save to storage
        storage.saveThemeMode(themeMode);
    }, [themeMode]);

    const setTheme = (mode: ThemeMode) => {
        setThemeMode(mode);
    };

    const toggleDarkMode = () => {
        // Cycle through: system -> light -> dark -> system
        if (themeMode === 'system') {
            setThemeMode(isDark ? 'light' : 'dark');
        } else if (themeMode === 'light') {
            setThemeMode('dark');
        } else {
            setThemeMode('system');
        }
    };

    return { isDark, themeMode, setTheme, toggleDarkMode };
}
