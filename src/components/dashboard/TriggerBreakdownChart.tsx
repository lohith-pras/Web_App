import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { LegendPayload } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import type { ChartDataPoint } from '../../types';

interface TriggerBreakdownChartProps {
    data: ChartDataPoint[];
}

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#ec4899', '#f59e0b', '#10b981'];

export function TriggerBreakdownChart({ data }: TriggerBreakdownChartProps) {
    const { isDark } = useDarkMode();

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p>No data yet. Start logging to see your triggers.</p>
            </div>
        );
    }

    // Theme-dependent colors
    const tooltipBg = isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    const tooltipBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const tooltipColor = isDark ? '#f1f5f9' : '#0f172a';
    const legendTextColor = isDark ? '#d1d5db' : '#374151';

    return (
        <div>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={2}
                        stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                            color: tooltipColor,
                            padding: '8px 12px',
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '13px', color: legendTextColor }}
                        formatter={(value, entry: LegendPayload) => (
                            <span style={{ color: legendTextColor }}>{`${value} (${entry.payload?.value ?? 0})`}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Top triggers list */}
            <div className="mt-6 space-y-3">
                {data.slice(0, 3).map((item, index) => {
                    const total = data.reduce((sum, d) => sum + d.value, 0);
                    const percentage = Math.round((item.value / total) * 100);

                    return (
                        <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full shadow-lg"
                                    style={{ 
                                        backgroundColor: COLORS[index % COLORS.length],
                                        boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}60`
                                    }}
                                />
                                <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="text-gray-900 dark:text-white font-semibold text-base">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
