import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ChartDataPoint } from '../../types';

interface TriggerBreakdownChartProps {
    data: ChartDataPoint[];
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

export function TriggerBreakdownChart({ data }: TriggerBreakdownChartProps) {
    if (data.length === 0) {
        return (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Trigger Breakdown</h3>
                <div className="flex items-center justify-center h-48 text-gray-500">
                    <p>No data yet. Start logging to see your triggers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Trigger Breakdown</h3>

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
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #2a2a2a',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                    />
                    <Legend
                        wrapperStyle={{ color: '#9ca3af' }}
                        formatter={(value, entry: any) => (
                            <span className="text-gray-400">{`${value} (${entry.payload.value})`}</span>
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
                                <span className="text-gray-400 text-sm">{item.name}</span>
                            </div>
                            <span className="text-white font-medium">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
