import { useTheme } from './useTheme';

/**
 * Hook for accessing dark mode state and theme controls
 * @deprecated Use useTheme() directly for consistent state across components
 */
export function useDarkMode() {
    return useTheme();
}
