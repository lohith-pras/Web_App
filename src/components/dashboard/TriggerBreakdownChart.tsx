import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { LegendPayload } from 'recharts';
import type { ChartDataPoint } from '../../types';

interface TriggerBreakdownChartProps {
    data: ChartDataPoint[];
}

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#ec4899', '#f59e0b', '#10b981'];

export function TriggerBreakdownChart({ data }: TriggerBreakdownChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-400">
                <p>No data yet. Start logging to see your triggers.</p>
            </div>
        );
    }

    return (
        <div>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={2}
                        stroke="rgba(255,255,255,0.1)"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                            color: '#f1f5f9',
                            padding: '8px 12px',
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                        formatter={(value, entry: LegendPayload) => (
                            // entry.payload.value is optional in LegendPayload type, so we use nullish coalescing for safety
                            <span className="text-gray-700 dark:text-gray-300">{`${value} (${entry.payload?.value ?? 0})`}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Top triggers list */}
            <div className="mt-4 space-y-2">
                {data.slice(0, 3).map((item, index) => {
                    const total = data.reduce((sum, d) => sum + d.value, 0);
                    const percentage = Math.round((item.value / total) * 100);

                    return (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full shadow-lg"
                                    style={{ 
                                        backgroundColor: COLORS[index % COLORS.length],
                                        boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}40`
                                    }}
                                />
                                <span className="text-gray-700 dark:text-gray-300 text-sm">{item.name}</span>
                            </div>
                            <span className="text-gray-900 dark:text-white font-medium">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
