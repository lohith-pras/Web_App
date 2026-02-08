
import { useState, useMemo, useId } from 'react';
import { TriggerSelectionModal } from '../components/logging/TriggerSelectionModal';
import { TriggerIcon } from '../components/common/TriggerIcon';
import type { Trigger, SmokingLog } from '../types';
import { formatDate } from '../utils/dateHelpers';

interface LogPageProps {
    triggers: Trigger[];
    onAddLog: (trigger: string) => void;
    logs: SmokingLog[];
}

export function LogPage({ triggers, onAddLog, logs }: LogPageProps) {
    const [showModal, setShowModal] = useState(false);
    const progressGradientId = useId();

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
        <div className="flex flex-col min-h-screen justify-between p-6 pb-32">
            {/* TOP: Header & Large Progress Circle */}
            <header className="flex-none">
                <div className="flex items-center justify-between w-full mb-6">
                    <div className="flex flex-col">
                        {/* Apple HIG: Primary label for main heading */}
                        <h1 className="text-2xl font-bold text-label-primary tracking-wider">QuitTrack</h1>
                        {/* Apple HIG: Secondary label for supporting text */}
                        <span className="text-primary-600 dark:text-primary-400 text-xs font-medium tracking-wide">
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    {/* Avatar with elevated glass effect */}
                    <div className="relative overflow-hidden bg-white/70 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-t-white/30 dark:border-t-white/10 border-l border-l-white/30 dark:border-l-white/10 border-b border-b-white/10 dark:border-b-white/5 border-r border-r-white/10 dark:border-r-white/5 w-10 h-10 flex items-center justify-center rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500" />
                    </div>
                </div>

                {/* Large Circular Progress - Primary Visual Anchor */}
                <div className="flex justify-center py-10">
                    <div 
                        className="relative flex items-center justify-center" 
                        style={{ width: 280, height: 280 }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${todayCount} cigarettes smoked today. Last smoked: ${timeSinceLastSmoke}`}
                    >
                        {/* Glassmorphic Circle Background - elevated style */}
                        <div className="absolute inset-0 bg-white/70 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/30 dark:border-white/10 border-b border-r border-white/10 dark:border-white/5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]" />
                        
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
                                stroke="rgba(148,163,184,0.2)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                className="dark:stroke-white/10"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx={140}
                                cy={140}
                                r={126}
                                fill="transparent"
                                stroke={`url(#${progressGradientId})`}
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 126}
                                strokeDashoffset={2 * Math.PI * 126 - (progress / 100) * 2 * Math.PI * 126}
                                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                            />
                            <defs>
                                <linearGradient id={progressGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="50%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        {/* Center Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                            {/* Apple HIG: Primary label for main count */}
                            <span className="text-6xl font-bold text-label-primary mb-2">{todayCount}</span>
                            {/* Apple HIG: Tertiary label for supporting text */}
                            <span className="text-sm text-label-tertiary uppercase tracking-widest">Cigarettes</span>
                            {/* Apple HIG: Success color, brighter in dark mode */}
                            <span className="text-xs text-success-light dark:text-success-dark mt-2 font-medium">
                                Last: {timeSinceLastSmoke}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* MIDDLE: Recent Triggers Section */}
            <section className="flex-1">
                {/* Apple HIG: Tertiary label for section headers */}
                <h3 className="text-sm uppercase tracking-wider text-label-tertiary mb-6">Triggers</h3>
                <div className="grid grid-cols-4 gap-3">
                    {triggers.slice(0, 4).map(trigger => (
                        <button
                            key={trigger.id}
                            onClick={() => onAddLog(trigger.name)}
                            className="relative overflow-hidden flex flex-col items-center justify-center bg-white/70 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/30 dark:border-white/10 border-b border-r border-white/10 dark:border-white/5 rounded-2xl p-4 gap-2 hover:bg-white/80 dark:hover:bg-white/[0.12] hover:border-white/40 dark:hover:border-white/15 active:scale-95 transition-all min-h-[90px] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
                        >
                            <TriggerIcon icon={trigger.icon} className="w-7 h-7 text-label-primary" />
                            {/* Apple HIG: Secondary label for button text */}
                            <span className="text-xs text-label-secondary font-medium">{trigger.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* BOTTOM: Fixed Floating Action Button */}
            <div className="fixed bottom-24 left-0 right-0 z-10 px-6">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={() => setShowModal(true)}
                        className="relative overflow-hidden w-full py-3.5 rounded-2xl bg-white/70 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/30 dark:border-white/10 border-b border-r border-white/10 dark:border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] font-semibold text-label-primary text-base md:text-lg flex items-center justify-center gap-2.5 active:scale-95 transition-all hover:bg-white/80 dark:hover:bg-white/[0.12] hover:border-white/40 dark:hover:border-white/15"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Log Cigarette</span>
                    </button>
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
