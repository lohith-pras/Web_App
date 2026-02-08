import { useState, useMemo } from 'react';
import { TimePeriodToggle } from '../components/dashboard/TimePeriodToggle';
import { TriggerBreakdownChart } from '../components/dashboard/TriggerBreakdownChart';
import { DailyTrendChart } from '../components/dashboard/DailyTrendChart';
import type { SmokingLog, TimePeriod, ChartDataPoint, DailyDataPoint } from '../types';
import { formatDate, getDaysAgo } from '../utils/dateHelpers';
import { GlassCard } from '../components/common/GlassCard';

import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

interface InsightsPageProps {
    logs: SmokingLog[];
    monthlyGoal: number;
    currentMonthCount: number;
    progress: number;
    isLoading?: boolean;
}

export function InsightsPage({ logs, monthlyGoal, currentMonthCount, progress, isLoading = false }: InsightsPageProps) {
    const { t } = useTranslation();
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
        return triggerData.length > 0 ? triggerData[0].name : t('settings.data.none', { defaultValue: 'None' });
    }, [triggerData, t]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 pt-8 pb-32 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                {/* Elevated glass icon background */}
                <div className="relative overflow-hidden w-12 h-12 rounded-full bg-primary-600/30 dark:bg-primary-500/20 backdrop-blur-[20px] backdrop-saturate-150 border border-t-white/30 dark:border-t-white/10 border-l-white/30 dark:border-l-white/10 border-b-white/10 dark:border-b-white/5 border-r-white/10 dark:border-r-white/5 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                {/* Apple HIG: Primary label for heading */}
                <h1 className="text-2xl font-bold text-label-primary">{t('insights.title')}</h1>
            </div>

            {/* Time Period Selector */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border border-t-white/30 dark:border-t-white/10 border-l-white/30 dark:border-l-white/10 border-b-white/10 dark:border-b-white/5 border-r-white/10 dark:border-r-white/5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-1 flex">
                {/* Custom toggle implementation would go here, reusing existing component for now but wrapping it */}
                <TimePeriodToggle selected={timePeriod} onChange={setTimePeriod} />
            </div>

            {/* Goal Progress */}
            <GlassCard className="relative overflow-hidden">
                <div className="relative z-10">
                    {/* Apple HIG: Tertiary label for section headers */}
                    <h3 className="text-label-tertiary text-xs font-semibold uppercase tracking-wider mb-3 pl-0.5">{t('settings.monthlyGoal.title')}</h3>
                    <div className="flex items-end gap-2 mb-4">
                        {/* Apple HIG: Primary and secondary labels */}
                        <span className="text-5xl font-bold text-label-primary">{currentMonthCount}</span>
                        <span className="text-xl text-label-secondary mb-2 font-medium">/ {monthlyGoal}</span>
                    </div>
                    {/* Glass Progress Bar */}
                    <div className="relative w-full h-4 bg-white/[0.08] border-t border-l border-t-white/20 border-l-white/20 border-b border-r border-b-white/5 border-r-white/5 rounded-full overflow-hidden backdrop-blur-[20px] backdrop-saturate-150">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Trends */}
            <div className="grid grid-cols-2 gap-4">
                <GlassCard className="flex flex-col py-5">
                    {/* Apple HIG: Tertiary label */}
                    <span className="text-xs text-label-tertiary font-semibold uppercase tracking-wider mb-2">{t('insights.stats.average')}</span>
                    <span className="text-3xl font-bold text-label-primary">{dailyAverage.toFixed(1)}</span>
                </GlassCard>
                <GlassCard className="flex flex-col py-5">
                    <span className="text-xs text-label-tertiary font-semibold uppercase tracking-wider mb-2">{t('insights.stats.mostCommon')}</span>
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400 truncate leading-tight">{topTrigger}</span>
                </GlassCard>
            </div>

            {/* Charts */}
            <GlassCard className="py-6">
                {/* Apple HIG: Secondary label for chart headers */}
                <h3 className="text-label-secondary text-base font-semibold mb-4 pl-1">{t('insights.charts.dailyTrend')}</h3>
                <div className="-mx-2">
                    <DailyTrendChart data={dailyTrendData} />
                </div>
            </GlassCard>

            <GlassCard className="py-6">
                <h3 className="text-label-secondary text-base font-semibold mb-4 pl-1">{t('insights.charts.triggerBreakdown')}</h3>
                <div>
                    <TriggerBreakdownChart data={triggerData} />
                </div>
            </GlassCard>
        </div>
    );
}
