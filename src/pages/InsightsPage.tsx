
import { useState, useMemo } from 'react';
import { TimePeriodToggle } from '../components/dashboard/TimePeriodToggle';
import { TriggerBreakdownChart } from '../components/dashboard/TriggerBreakdownChart';
import { DailyTrendChart } from '../components/dashboard/DailyTrendChart';
import type { SmokingLog, TimePeriod, ChartDataPoint, DailyDataPoint } from '../types';
import { formatDate, getDaysAgo } from '../utils/dateHelpers';
import { GlassCard } from '../components/common/GlassCard';

interface InsightsPageProps {
    logs: SmokingLog[];
    monthlyGoal: number;
    currentMonthCount: number;
    progress: number;
}

export function InsightsPage({ logs, monthlyGoal, currentMonthCount, progress }: InsightsPageProps) {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('7days');

    // Filter logs by time period
    const filteredLogs = useMemo(() => {
        if (timePeriod === 'all') return logs;
        const days = timePeriod === '7days' ? 7 : 30;
        const startDate = getDaysAgo(days);
        return logs.filter(log => new Date(log.date) >= startDate);
    }, [logs, timePeriod]);

    // Calculate trigger breakdown
    const triggerData: ChartDataPoint[] = useMemo(() => {
        const triggerCounts: Record<string, number> = {};
        filteredLogs.forEach(log => {
            triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
        });
        return Object.entries(triggerCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredLogs]);

    // Calculate daily trend data
    const dailyTrendData: DailyDataPoint[] = useMemo(() => {
        const days = timePeriod === '7days' ? 7 : timePeriod === '30days' ? 30 : 90;
        const data: DailyDataPoint[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = getDaysAgo(i);
            const dateStr = formatDate(date);
            const count = logs.filter(log => log.date === dateStr).length;
            data.push({ date: dateStr, count });
        }

        return data;
    }, [logs, timePeriod]);

    // Calculate stats
    const dailyAverage = useMemo(() => {
        if (filteredLogs.length === 0) return 0;
        const days = timePeriod === '7days' ? 7 : timePeriod === '30days' ? 30 : Math.max(1, new Set(logs.map(l => l.date)).size);
        return filteredLogs.length / days;
    }, [filteredLogs, timePeriod, logs]);

    const topTrigger = useMemo(() => {
        return triggerData.length > 0 ? triggerData[0].name : 'None';
    }, [triggerData]);

    return (
        <div className="min-h-screen px-4 pt-8 pb-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
            </div>

            {/* Time Period Selector */}
            <div className="bg-white rounded-lg shadow-md p-1 flex relative">
                {/* Custom toggle implementation would go here, reusing existing component for now but wrapping it */}
                <TimePeriodToggle selected={timePeriod} onChange={setTimePeriod} />
            </div>

            {/* Goal Progress */}
            <GlassCard className="relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Monthly Goal</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-gray-900">{currentMonthCount}</span>
                        <span className="text-gray-600 mb-1">/ {monthlyGoal}</span>
                    </div>
                    {/* Simple Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
                        <div
                            className="h-full bg-primary-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Trends */}
            <div className="grid grid-cols-2 gap-4">
                <GlassCard className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase">Daily Avg</span>
                    <span className="text-2xl font-bold text-gray-900 mt-1">{dailyAverage.toFixed(1)}</span>
                </GlassCard>
                <GlassCard className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase">Top Trigger</span>
                    <span className="text-2xl font-bold text-primary-500 mt-1 truncate">{topTrigger}</span>
                </GlassCard>
            </div>

            {/* Charts */}
            <GlassCard>
                <h3 className="text-gray-500 text-sm font-medium mb-4">Activity Trend</h3>
                <div className="h-48 -mx-2">
                    <DailyTrendChart data={dailyTrendData} />
                </div>
            </GlassCard>

            <GlassCard>
                <h3 className="text-gray-500 text-sm font-medium mb-4">Triggers</h3>
                <div className="h-48">
                    <TriggerBreakdownChart data={triggerData} />
                </div>
            </GlassCard>
        </div>
    );
}
