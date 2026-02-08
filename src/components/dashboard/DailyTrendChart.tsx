import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import type { DailyDataPoint } from '../../types';

interface DailyTrendChartProps {
    data: DailyDataPoint[];
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
    const { isDark } = useDarkMode();
    
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p>No data yet. Start logging to see trends.</p>
            </div>
        );
    }

    // Calculate week-over-week change
    const recentAvg = data.slice(-7).reduce((sum, d) => sum + d.count, 0) / 7;
    const previousAvg = data.slice(-14, -7).reduce((sum, d) => sum + d.count, 0) / 7;
    const change = previousAvg > 0 ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100) : 0;

    // Theme-dependent colors
    const gridStroke = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)';
    const axisStroke = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    const tickFill = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)';
    const tooltipBg = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)';
    const tooltipBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const tooltipColor = isDark ? '#f1f5f9' : '#0f172a';

    return (
        <div>
            {data.length >= 14 && (
                <div className={`px-3 py-1.5 rounded-full text-sm font-semibold mb-4 inline-block ${
                    change > 0 
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                        : change < 0
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-500/20 text-slate-600 dark:text-slate-300 border border-slate-500/30'
                }`}>
                    {change > 0 ? '↑' : change < 0 ? '↓' : '—'} {change === 0 ? '0' : Math.abs(change)}% vs last week
                </div>
            )}

            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="auroraGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                            <stop offset="50%" stopColor="#6366f1" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} strokeOpacity={0.1} />
                    <XAxis
                        dataKey="date"
                        stroke={axisStroke}
                        tick={{ fill: tickFill, fontSize: 12 }}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
                        }}
                    />
                    <YAxis stroke={axisStroke} tick={{ fill: tickFill, fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                            color: tooltipColor,
                            padding: '8px 12px',
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fill="url(#auroraGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
