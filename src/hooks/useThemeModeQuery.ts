import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataAccess } from '../services/dataAccessFactory';
import type { ThemeMode } from '../types';

const THEME_QUERY_KEY = ['themeMode'];

export function useThemeModeQuery() {
    return useQuery({
        queryKey: THEME_QUERY_KEY,
        queryFn: () => dataAccess.getThemeMode(),
    });
}

export function useUpdateThemeModeMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newMode: ThemeMode) => {
            await dataAccess.saveThemeMode(newMode);
            return newMode;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: THEME_QUERY_KEY });
        },
    });
}
