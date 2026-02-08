
import { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import type { SmokingLog, ThemeMode } from '../types';

interface SettingsPageProps {
    monthlyGoal: number;
    logs: SmokingLog[];
    onClearData: () => void;
    isDark: boolean;
    themeMode: ThemeMode;
    onSetTheme: (mode: ThemeMode) => void;
}

export function SettingsPage({
    monthlyGoal,
    logs,
    onClearData,
    isDark,
    themeMode,
    onSetTheme,
}: SettingsPageProps) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const getThemeLabel = () => {
        if (themeMode === 'system') {
            return isDark ? 'Auto (Dark)' : 'Auto (Light)';
        }
        return themeMode === 'dark' ? 'Dark' : 'Light';
    };

    return (
        <div className="min-h-screen px-4 pt-8 pb-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="relative overflow-hidden w-12 h-12 rounded-full bg-indigo-600/30 backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 flex items-center justify-center text-indigo-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>

            {/* Profile / Goal Section */}
            <GlassCard className="flex items-center justify-between">
                <div>
                    <h3 className="text-gray-900 dark:text-white font-medium">Monthly Goal</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Current target: {monthlyGoal} cigs</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {monthlyGoal}
                </div>
            </GlassCard>

            {/* Settings Group: App */}
            <div className="flex flex-col gap-2">
                <h3 className="text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider ml-4">Preferences</h3>
                <GlassCard className="p-0 overflow-hidden divide-y divide-gray-200/50 dark:divide-white/5">
                    <div className="p-4 flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white" id="notifications-label">Notifications</span>
                        <button
                            role="switch"
                            aria-checked={notificationsEnabled}
                            aria-labelledby="notifications-label"
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`w-12 h-7 rounded-full transition-colors relative ${
                                notificationsEnabled ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gray-300 dark:bg-white/10'
                            }`}
                        >
                            <div 
                                aria-hidden="true"
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                                    notificationsEnabled ? 'translate-x-5' : ''
                                }`} 
                            />
                        </button>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-gray-900 dark:text-white">Theme</span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">{getThemeLabel()}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onSetTheme('light')}
                                aria-label="Light theme"
                                className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                                    themeMode === 'light'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                                title="Light mode"
                            >
                                ☀️
                            </button>
                            <button
                                onClick={() => onSetTheme('dark')}
                                aria-label="Dark theme"
                                className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                                    themeMode === 'dark'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                                title="Dark mode"
                            >
                                🌙
                            </button>
                            <button
                                onClick={() => onSetTheme('system')}
                                aria-label="System preference"
                                className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                                    themeMode === 'system'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                                title="System preference"
                            >
                                🌓
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Settings Group: Data */}
            <div className="flex flex-col gap-2">
                <h3 className="text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider ml-4">Data</h3>
                <GlassCard className="p-0 overflow-hidden divide-y divide-gray-200/50 dark:divide-white/5">
                    <button className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
                        <span className="text-gray-900 dark:text-white">Export Data</span>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{logs.length} logs</span>
                    </button>
                    <button
                        className="w-full text-left p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                        onClick={() => {
                            if (window.confirm("Clear all data?")) {
                                onClearData();
                            }
                        }}
                    >
                        <span className="text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">Clear All Data</span>
                    </button>
                </GlassCard>
            </div>

            <div className="mt-8 text-center">
                <div className="relative overflow-hidden w-12 h-12 bg-white/60 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <span className="text-2xl">🚭</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Version 1.0.0</p>
            </div>
        </div>
    );
}
