import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContextValue';

/**
 * Hook for accessing dark mode state and theme controls
 * Must be used within a ThemeProvider
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
