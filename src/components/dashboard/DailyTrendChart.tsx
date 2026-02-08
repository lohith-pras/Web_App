import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import type { DailyDataPoint } from '../../types';

interface DailyTrendChartProps {
    data: DailyDataPoint[];
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-400">
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
                    change < 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                    {change < 0 ? '↓' : '↑'} {Math.abs(change)}% vs last week
                </div>
            )}

            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="auroraGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="50%" stopColor="#6366f1" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" strokeOpacity={0.1} />
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
                        }}
                    />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                            color: '#f1f5f9',
                            padding: '8px 12px',
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="url(#auroraGradient)"
                        strokeWidth={3}
                        fill="url(#auroraGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
