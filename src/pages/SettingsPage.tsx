
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

    const getThemeIcon = () => {
        if (themeMode === 'system') return '🌓';
        return themeMode === 'dark' ? '🌙' : '☀️';
    };

    return (
        <div className="min-h-screen px-4 pt-8 pb-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-500 dark:text-primary-400">
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current target: {monthlyGoal} cigs</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
                    {monthlyGoal}
                </div>
            </GlassCard>

            {/* Settings Group: App */}
            <div className="flex flex-col gap-2">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider ml-4">Preferences</h3>
                <GlassCard className="p-0 overflow-hidden divide-y divide-gray-200 dark:divide-slate-700">
                    <div className="p-4 flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">Notifications</span>
                        <button
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`w-12 h-7 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-success-500 dark:bg-success-600' : 'bg-gray-300 dark:bg-slate-600'}`}
                        >
                            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-5' : ''}`} />
                        </button>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-gray-900 dark:text-white">Theme</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{getThemeLabel()}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onSetTheme('light')}
                                className={`w-10 h-10 rounded-lg transition-all flex items-center justify-center ${
                                    themeMode === 'light'
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-slate-600'
                                }`}
                                title="Light mode"
                            >
                                ☀️
                            </button>
                            <button
                                onClick={() => onSetTheme('dark')}
                                className={`w-10 h-10 rounded-lg transition-all flex items-center justify-center ${
                                    themeMode === 'dark'
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-slate-600'
                                }`}
                                title="Dark mode"
                            >
                                🌙
                            </button>
                            <button
                                onClick={() => onSetTheme('system')}
                                className={`w-10 h-10 rounded-lg transition-all flex items-center justify-center ${
                                    themeMode === 'system'
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-slate-600'
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
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider ml-4">Data</h3>
                <GlassCard className="p-0 overflow-hidden divide-y divide-gray-200 dark:divide-slate-700">
                    <button className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <span className="text-gray-900 dark:text-white">Export Data</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{logs.length} logs</span>
                    </button>
                    <button
                        className="w-full text-left p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
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
                <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🚭</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Version 1.0.0</p>
            </div>
        </div>
    );
}
