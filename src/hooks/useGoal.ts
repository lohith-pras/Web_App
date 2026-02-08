import { useState, useEffect, useCallback, useMemo } from 'react';
import type { GoalStatus, SmokingLog } from '../types';
import { storage } from '../services/storage';
import { DEFAULT_MONTHLY_GOAL } from '../constants/triggers';
import { getMonthStart } from '../utils/dateHelpers';

export function useGoal(logs: SmokingLog[]) {
    const [monthlyGoal, setMonthlyGoal] = useState<number>(DEFAULT_MONTHLY_GOAL);

    // Load goal from localStorage on mount
    useEffect(() => {
        const saved = storage.getMonthlyGoal();
        if (saved > 0) {
            setMonthlyGoal(saved);
        }
    }, []);

    // Save goal to localStorage whenever it changes
    const updateGoal = useCallback((newGoal: number) => {
        setMonthlyGoal(newGoal);
        storage.saveMonthlyGoal(newGoal);
    }, []);

    // Calculate current month's count
    const currentMonthCount = useMemo(() => {
        const monthStart = getMonthStart();
        return logs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= monthStart;
        }).length;
    }, [logs]);

    // Calculate progress percentage
    const progress = useMemo(() => {
        if (monthlyGoal === 0) return 0;
        return Math.min(Math.round((currentMonthCount / monthlyGoal) * 100), 100);
    }, [currentMonthCount, monthlyGoal]);

    // Determine status color
    const status: GoalStatus = useMemo(() => {
        if (progress < 70) return 'green';
        if (progress < 90) return 'yellow';
        return 'red';
    }, [progress]);

    return {
        monthlyGoal,
        setMonthlyGoal: updateGoal,
        currentMonthCount,
        progress,
        status,
    };
}
