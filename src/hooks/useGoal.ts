import { useState, useMemo } from 'react';
import type { SmokingLog } from '../types';
import { storage } from '../services/storage';
import { DEFAULT_MONTHLY_GOAL } from '../constants/triggers';
import { getMonthStart } from '../utils/dateHelpers';

export function useGoal(logs: SmokingLog[]) {
    const [monthlyGoal] = useState<number>(() => {
        const saved = storage.getMonthlyGoal();
        return saved > 0 ? saved : DEFAULT_MONTHLY_GOAL;
    });

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

    return {
        monthlyGoal,
        currentMonthCount,
        progress,
    };
}
