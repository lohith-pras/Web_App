import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import type { DailyDataPoint } from '../../types';

interface DailyTrendChartProps {
    data: DailyDataPoint[];
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Daily Trend</h3>
                <div className="flex items-center justify-center h-48 text-gray-500">
                    <p>No data yet. Start logging to see trends.</p>
                </div>
            </div>
        );
    }

    // Calculate week-over-week change
    const recentAvg = data.slice(-7).reduce((sum, d) => sum + d.count, 0) / 7;
    const previousAvg = data.slice(-14, -7).reduce((sum, d) => sum + d.count, 0) / 7;
    const change = previousAvg > 0 ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100) : 0;

    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Daily Trend</h3>
                    <p className="text-gray-400 text-sm">Last 7 Days</p>
                </div>
                {data.length >= 14 && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${change < 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                        {change < 0 ? '↓' : '↑'} {Math.abs(change)}% vs last week
                    </div>
                )}
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
                        }}
                    />
                    <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #2a2a2a',
                            borderRadius: '8px',
                            color: '#fff',
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
