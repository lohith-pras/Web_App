
import { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import type { SmokingLog, ThemeMode } from '../types';

import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const NOTIFICATIONS_PREF_KEY = 'notifications-enabled';

interface SettingsPageProps {
    monthlyGoal: number;
    logs: SmokingLog[];
    onClearData: () => void;
    isDark: boolean;
    themeMode: ThemeMode;
    onSetTheme: (mode: ThemeMode) => void;
    isLoading?: boolean;
}

export function SettingsPage({
    monthlyGoal,
    logs,
    onClearData,
    isDark,
    themeMode,
    onSetTheme,
    isLoading = false,
}: SettingsPageProps) {
    const { t } = useTranslation();
    // Initialize from localStorage and reconcile with actual browser permissions
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        try {
            const stored = localStorage.getItem(NOTIFICATIONS_PREF_KEY);
            return stored === 'true';
        } catch {
            return false;
        }
    });

    // Reconcile state with actual Notification permission on mount
    useEffect(() => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        
        // If permission is denied, ensure local state reflects that
        if (Notification.permission === 'denied') {
            setNotificationsEnabled(false);
            try {
                localStorage.setItem(NOTIFICATIONS_PREF_KEY, 'false');
            } catch (error) {
                console.error('Error saving notification preference:', error);
            }
        } 
        // If permission is granted, sync with stored preference
        else if (Notification.permission === 'granted') {
            // Keep existing preference if granted
        }
        // If permission is default (not asked), keep stored preference
    }, []);

    const handleNotificationToggle = async () => {
        // Check if Notifications API is supported
        if (typeof window === 'undefined' || !('Notification' in window)) {
            console.warn('Notifications are not supported in this browser');
            return;
        }

        // If enabling, request permission
        if (!notificationsEnabled) {
            try {
                const permission = await Notification.requestPermission();
                
                if (permission === 'granted') {
                    setNotificationsEnabled(true);
                    try {
                        localStorage.setItem(NOTIFICATIONS_PREF_KEY, 'true');
                    } catch (error) {
                        console.error('Error saving notification preference:', error);
                    }
                } else if (permission === 'denied') {
                    // Show user a message that they denied permission
                    console.warn('Notification permission denied by user');
                }
                // If 'default', user dismissed the prompt - do nothing
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        } else {
            // Disabling notifications - just update preference
            setNotificationsEnabled(false);
            try {
                localStorage.setItem(NOTIFICATIONS_PREF_KEY, 'false');
            } catch (error) {
                console.error('Error saving notification preference:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const getThemeLabel = () => {
        if (themeMode === 'system') {
            return isDark ? t('settings.theme.autoDark', { defaultValue: 'Auto (Dark)' }) : t('settings.theme.autoLight', { defaultValue: 'Auto (Light)' });
        }
        return themeMode === 'dark' ? t('settings.theme.dark') : t('settings.theme.light');
    };

    return (
        <div className="flex flex-col gap-6 w-full">
                {/* Header */}
                <div className="flex items-center gap-3 px-2 md:px-0">
                    <div className="relative overflow-hidden w-12 h-12 rounded-full bg-primary-600/30 dark:bg-primary-500/20 backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/30 dark:border-white/10 border-b border-r border-white/10 dark:border-white/5 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-label-primary">{t('settings.title')}</h1>
                </div>

                {/* Profile / Goal Section */}
                <div className="px-2 md:px-0">
                    <GlassCard className="flex items-center justify-between">
                    <div>
                        <h3 className="text-label-primary font-medium">{t('settings.monthlyGoal.title')}</h3>
                        <p className="text-sm text-label-secondary">{t('settings.monthlyGoal.description')}: {monthlyGoal} {t('log.cigarettes').toLowerCase()}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {monthlyGoal}
                    </div>
                </GlassCard>
                </div>

                {/* Settings Group: App */}
                <div className="flex flex-col gap-2 px-2 md:px-0">
                    <h3 className="text-label-tertiary text-xs font-semibold uppercase tracking-wider ml-4">{t('settings.preferences', { defaultValue: 'Preferences' })}</h3>
                    <GlassCard className="p-0 overflow-hidden divide-y divide-separator/20">
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-label-primary" id="notifications-label">{t('settings.notifications', { defaultValue: 'Notifications' })}</span>
                            <button
                                role="switch"
                                aria-checked={notificationsEnabled}
                                aria-labelledby="notifications-label"
                                onClick={handleNotificationToggle}
                                className={`w-12 h-7 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gray-300 dark:bg-white/10'
                                    }`}
                            >
                                <div
                                    aria-hidden="true"
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${notificationsEnabled ? 'translate-x-5' : ''
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-label-primary">{t('settings.theme.title')}</span>
                                <span className="text-xs text-label-secondary">{getThemeLabel()}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onSetTheme('light')}
                                    aria-label={t('settings.theme.light')}
                                    className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${themeMode === 'light'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                    title={t('settings.theme.light')}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => onSetTheme('dark')}
                                    aria-label={t('settings.theme.dark')}
                                    className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${themeMode === 'dark'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                    title={t('settings.theme.dark')}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => onSetTheme('system')}
                                    aria-label={t('settings.theme.system')}
                                    className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${themeMode === 'system'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                    title={t('settings.theme.system')}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Settings Group: Data */}
                <div className="flex flex-col gap-2 px-2 md:px-0">
                    <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-4">{t('settings.data.title')}</h3>
                    <GlassCard className="p-0 overflow-hidden divide-y divide-gray-200/50 dark:divide-white/5">
                        <button className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
                            <span className="text-gray-900 dark:text-white">{t('settings.data.export')}</span>
                            <span className="text-gray-600 dark:text-gray-300 text-sm">{logs.length} {t('settings.data.logs', { defaultValue: 'logs' })}</span>
                        </button>
                        <button
                            className="w-full text-left p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                            onClick={() => {
                                if (window.confirm(t('settings.data.confirmClear'))) {
                                    onClearData();
                                }
                            }}
                        >
                            <span className="text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">{t('settings.data.clearAll')}</span>
                        </button>
                    </GlassCard>
                </div>

                <div className="mt-8 text-center px-2 md:px-0">
                    <div className="relative overflow-hidden w-12 h-12 bg-white/60 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                        <svg className="w-7 h-7 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12" />
                        </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Version 1.0.0</p>
                </div>
        </div>
    );
}
