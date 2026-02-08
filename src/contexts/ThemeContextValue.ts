import { createContext } from 'react';
import type { ThemeMode } from '../types';

export interface ThemeContextValue {
    isDark: boolean;
    themeMode: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
    toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
