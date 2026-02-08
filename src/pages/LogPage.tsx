
import { useState, useMemo } from 'react';
import { TriggerSelectionModal } from '../components/logging/TriggerSelectionModal';
import type { Trigger, SmokingLog } from '../types';
import { formatDate } from '../utils/dateHelpers';
import { GlassCard } from '../components/common/GlassCard';

interface LogPageProps {
    triggers: Trigger[];
    onAddLog: (trigger: string) => void;
    logs: SmokingLog[];
}

export function LogPage({ triggers, onAddLog, logs }: LogPageProps) {
    const [showModal, setShowModal] = useState(false);

    // Get today's count
    const today = formatDate(new Date());
    const todayLogs = logs.filter(log => log.date === today);
    const todayCount = todayLogs.length;

    // TODO: Get this from settings/logic. For now, hardcode a daily limit or goal.
    const dailyLimit = 10;
    const progress = Math.min((todayCount / dailyLimit) * 100, 100);

    const timeSinceLastSmoke = useMemo(() => {
        if (logs.length === 0) return 'No logs yet';

        // Sort logs new to old
        const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (sortedLogs.length === 0) return 'No logs yet';

        const last = new Date(sortedLogs[0].timestamp);
        const now = new Date();
        const diffMs = now.getTime() - last.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);

        if (diffHrs > 0) return `${diffHrs}h ${diffMins % 60}m ago`;
        return `${diffMins}m ago`;
    }, [logs]);

    return (
        <div className="flex flex-col items-center pt-8 px-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between w-full mb-8">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-thin text-gray-900 dark:text-white tracking-wider">QuitTrack</h1>
                    <span className="text-primary-500 dark:text-primary-400 text-sm font-medium tracking-wide">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>
                <div className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 w-10 h-10 flex items-center justify-center rounded-full">
                    {/* User Profile / Settings shortcut? */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-success-500 to-primary-500 opacity-80" />
                </div>
            </div>

            {/* Main Progress */}
            <div className="mb-12 relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
                {/* Background Circle */}
                <svg
                    width={280}
                    height={280}
                    viewBox="0 0 280 280"
                    className="absolute rotate-[-90deg]"
                >
                    <circle
                        cx={140}
                        cy={140}
                        r={126}
                        fill="transparent"
                        className="stroke-gray-200 dark:stroke-slate-700"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx={140}
                        cy={140}
                        r={126}
                        fill="transparent"
                        className="stroke-success-500 dark:stroke-success-400"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 126}
                        strokeDashoffset={2 * Math.PI * 126 - (progress / 100) * 2 * Math.PI * 126}
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                    />
                </svg>
                {/* Center Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    <span className="text-6xl font-bold text-gray-900 dark:text-white mb-2">{todayCount}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest">Cigarettes</span>
                    <span className="text-xs text-success-500 dark:text-success-400 mt-2 font-medium">
                        Last: {timeSinceLastSmoke}
                    </span>
                </div>
            </div>

            {/* Quick Log Button */}
            <button
                onClick={() => setShowModal(true)}
                className="w-full bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 rounded-lg py-6 mb-8 flex items-center justify-center gap-4 active:scale-95 transition-all group border border-gray-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/70"
            >
                <div className="w-12 h-12 rounded-full bg-success-500 dark:bg-success-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <span className="text-xl font-medium text-gray-900 dark:text-white">Log Cigarette</span>
            </button>

            {/* Recent / Context */}
            <div className="w-full">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Recent Triggers</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {triggers.slice(0, 4).map(trigger => (
                        <GlassCard
                            key={trigger.id}
                            onClick={() => onAddLog(trigger.name)}
                            className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 gap-2 hover:border-primary-500 dark:hover:border-primary-400"
                        >
                            <span className="text-2xl">{trigger.icon}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{trigger.name}</span>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <TriggerSelectionModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSelectTrigger={onAddLog}
                triggers={triggers}
            />
        </div>
    );
}
