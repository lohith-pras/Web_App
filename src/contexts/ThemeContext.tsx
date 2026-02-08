import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
// import { storage } from '../services/storage'; // Removed
import { useThemeModeQuery, useUpdateThemeModeMutation } from '../hooks/useThemeModeQuery';
import type { ThemeMode } from '../types';
import { ThemeContext } from './ThemeContextValue';

function getSystemPreference(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveTheme(mode: ThemeMode, systemPrefersDark: boolean): boolean {
    if (mode === 'system') {
        return systemPrefersDark;
    }
    return mode === 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const themeQuery = useThemeModeQuery();
    const updateThemeMutation = useUpdateThemeModeMutation();

    // Default to 'system' while loading or if undefined
    const themeMode = themeQuery.data ?? 'system';

    const systemPrefersDark = useSyncExternalStore(
        (callback) => {
            if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
                return () => { };
            }
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', callback);
            return () => mediaQuery.removeEventListener('change', callback);
        },
        () => getSystemPreference(),
        () => false
    );

    const isDark = resolveTheme(themeMode, systemPrefersDark);

    // Apply theme whenever it changes
    useEffect(() => {
        // Apply dark mode class to document root
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const setTheme = (mode: ThemeMode) => {
        updateThemeMutation.mutate(mode);
    };

    const toggleDarkMode = () => {
        // Toggle to opposite appearance. From system mode, switches to explicit
        // opposite of current system preference. Then: light -> dark -> system.
        if (themeMode === 'system') {
            setTheme(isDark ? 'light' : 'dark');
        } else if (themeMode === 'light') {
            setTheme('dark');
        } else {
            setTheme('system');
        }
    };

    return (
        <ThemeContext.Provider value={{ isDark, themeMode, setTheme, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}
