import { useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import type { SmokingLog } from '../../types';

interface CentralInsightsCardProps {
    logs: SmokingLog[];
    timeSinceLastSmoke: string;
}

/**
 * CentralInsightsCard - Displays key progress metrics in the center of the screen
 * Shows money saved, cigarettes avoided, and health improvements
 */
export function CentralInsightsCard({ 
    logs, 
    timeSinceLastSmoke 
}: CentralInsightsCardProps) {
    // Calculate stats based on logs
    const stats = useMemo(() => {
        if (logs.length === 0) {
            return {
                moneySaved: 0,
                cigarettesAvoided: 0,
                daysTracking: 0,
                longestStreak: 0,
                avgPerDay: 0,
            };
        }

        // Average cost per cigarette (can be moved to settings later)
        const costPerCigarette = 0.50; // $0.50 per cigarette
        
        // Get first log date to calculate days tracking
        const sortedLogs = [...logs].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        const firstLogDate = new Date(sortedLogs[0].timestamp);
        const daysTracking = Math.floor((Date.now() - firstLogDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Calculate average cigarettes per day
        const avgPerDay = logs.length / daysTracking;
        
        // Estimate cigarettes avoided (if they were smoking 20/day before, calculate reduction)
        const estimatedDailyBefore = 20; // Can be moved to settings
        const cigarettesAvoided = Math.max(0, Math.floor((estimatedDailyBefore - avgPerDay) * daysTracking));
        
        // Calculate money saved
        const moneySaved = cigarettesAvoided * costPerCigarette;

        return {
            moneySaved,
            cigarettesAvoided,
            daysTracking,
            avgPerDay,
        };
    }, [logs]);

    return (
        <GlassCard className="w-full p-6 space-y-6">
            {/* Title */}
            <div className="text-center">
                <h2 className="text-lg font-semibold text-white mb-1">Progress Snapshot</h2>
                <p className="text-xs text-gray-300">Your journey so far</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Money Saved */}
                <div className="relative overflow-hidden bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 rounded-xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <div className="text-3xl">💰</div>
                        <div className="text-2xl font-bold text-emerald-400">${stats.moneySaved.toFixed(2)}</div>
                        <div className="text-xs text-gray-300 text-center">Money Saved</div>
                    </div>
                </div>

                {/* Cigarettes Avoided */}
                <div className="relative overflow-hidden bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 rounded-xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <div className="text-3xl">🚭</div>
                        <div className="text-2xl font-bold text-indigo-400">{stats.cigarettesAvoided}</div>
                        <div className="text-xs text-gray-300 text-center">Not Smoked</div>
                    </div>
                </div>

                {/* Days Tracking */}
                <div className="relative overflow-hidden bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 rounded-xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <div className="text-3xl">📅</div>
                        <div className="text-2xl font-bold text-purple-400">{stats.daysTracking}</div>
                        <div className="text-xs text-gray-300 text-center">Days Tracking</div>
                    </div>
                </div>

                {/* Average Per Day */}
                <div className="relative overflow-hidden bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 rounded-xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <div className="text-3xl">📊</div>
                        <div className="text-2xl font-bold text-blue-400">{stats.avgPerDay.toFixed(1)}</div>
                        <div className="text-xs text-gray-300 text-center">Avg Per Day</div>
                    </div>
                </div>
            </div>

            {/* Last Smoke Info */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/20 to-indigo-600/30 backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 rounded-xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-300">Last cigarette</span>
                        <span className="text-lg font-semibold text-white">{timeSinceLastSmoke}</span>
                    </div>
                    <div className="text-3xl">⏱️</div>
                </div>
            </div>
        </GlassCard>
    );
}
