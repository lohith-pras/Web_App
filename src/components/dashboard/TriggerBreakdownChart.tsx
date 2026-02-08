import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ChartDataPoint } from '../../types';

interface TriggerBreakdownChartProps {
    data: ChartDataPoint[];
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

export function TriggerBreakdownChart({ data }: TriggerBreakdownChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
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
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--tooltip-bg)',
                            border: '1px solid var(--tooltip-border)',
                            borderRadius: '8px',
                            color: 'var(--tooltip-text)',
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                        formatter={(value, entry: any) => (
                            <span className="text-gray-600 dark:text-gray-400">{`${value} (${entry.payload.value})`}</span>
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
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-gray-600 dark:text-gray-400 text-sm">{item.name}</span>
                            </div>
                            <span className="text-gray-900 dark:text-white font-medium">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
