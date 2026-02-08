import { useState, useEffect, useSyncExternalStore } from 'react';
import { storage } from '../services/storage';
import type { ThemeMode } from '../types';

function getSystemPreference(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
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

    const systemPrefersDark = useSyncExternalStore(
        (callback) => {
            if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
                return () => {};
            }
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', callback);
            return () => mediaQuery.removeEventListener('change', callback);
        },
        () => getSystemPreference(),
        () => false
    );

    const isDark = resolveTheme(themeMode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : themeMode);

    // Apply theme and save to storage
    useEffect(() => {
        // Apply dark mode class to document root
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save to storage
        storage.saveThemeMode(themeMode);
    }, [themeMode, isDark]);

    const setTheme = (mode: ThemeMode) => {
        setThemeMode(mode);
    };

    const toggleDarkMode = () => {
        // Toggle to opposite appearance. From system mode, switches to explicit
        // opposite of current system preference. Then: light -> dark -> system.
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
