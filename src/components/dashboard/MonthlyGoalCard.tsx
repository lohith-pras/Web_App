interface MonthlyGoalCardProps {
    current: number;
    goal: number;
    progress: number;
}

export function MonthlyGoalCard({ current, goal, progress }: MonthlyGoalCardProps) {
    const remaining = Math.max(0, goal - current);
    const isOnTrack = progress < 90;

    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Monthly Goal</h3>
                    <p className="text-gray-400 text-sm">Keep it under {goal}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-green-500">{current}</p>
                    <p className="text-gray-500 text-sm">/{goal}</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#2a2a2a] rounded-full h-3 mb-3 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${progress < 70 ? 'bg-green-500' : progress < 90 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            {/* Status message */}
            <div className="flex items-center gap-2 text-sm">
                <span className={isOnTrack ? 'text-green-500' : 'text-yellow-500'}>
                    {isOnTrack ? '✓' : '⚠'}
                </span>
                <p className="text-gray-400">
                    {isOnTrack
                        ? `You're doing great! You've reduced your intake by ${Math.round(100 - progress)}% compared to last month.`
                        : `${remaining} cigarettes remaining this month`}
                </p>
            </div>
        </div>
    );
}
