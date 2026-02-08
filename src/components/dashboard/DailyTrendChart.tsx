import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import type { DailyDataPoint } from '../../types';

interface DailyTrendChartProps {
    data: DailyDataPoint[];
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
                <p>No data yet. Start logging to see trends.</p>
            </div>
        );
    }

    // Calculate week-over-week change
    const recentAvg = data.slice(-7).reduce((sum, d) => sum + d.count, 0) / 7;
    const previousAvg = data.slice(-14, -7).reduce((sum, d) => sum + d.count, 0) / 7;
    const change = previousAvg > 0 ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100) : 0;

    return (
        <div>
            {data.length >= 14 && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block ${
                    change < 0 ? 'bg-green-500/20 text-green-500 dark:bg-green-600/20 dark:text-green-400' : 'bg-red-500/20 text-red-500 dark:bg-red-600/20 dark:text-red-400'
                }`}>
                    {change < 0 ? '↓' : '↑'} {Math.abs(change)}% vs last week
                </div>
            )}

            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                    <XAxis
                        dataKey="date"
                        className="stroke-gray-400 dark:stroke-gray-500"
                        tick={{ fill: 'currentColor', fontSize: 12 }}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
                        }}
                    />
                    <YAxis className="stroke-gray-400 dark:stroke-gray-500" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--tooltip-bg)',
                            border: '1px solid var(--tooltip-border)',
                            borderRadius: '8px',
                            color: 'var(--tooltip-text)',
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#colorCount)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
