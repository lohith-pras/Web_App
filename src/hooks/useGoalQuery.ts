import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataAccess } from '../services/dataAccessFactory';

const GOAL_QUERY_KEY = ['monthlyGoal'];

export function useGoalQuery() {
    return useQuery({
        queryKey: GOAL_QUERY_KEY,
        queryFn: () => dataAccess.getMonthlyGoal(),
    });
}

export function useUpdateGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newGoal: number) => {
            await dataAccess.saveMonthlyGoal(newGoal);
            return newGoal;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GOAL_QUERY_KEY });
        },
    });
}
