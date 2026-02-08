interface TodayCountProps {
    count: number;
    yesterdayCount: number;
}

export function TodayCount({ count, yesterdayCount }: TodayCountProps) {
    const difference = yesterdayCount - count;
    const percentage = count > 0 ? Math.round((count / 20) * 100) : 0; // Assuming max 20 per day for visual

    return (
        <div className="flex flex-col items-center py-8">
            {/* Circular Progress */}
            <div className="relative w-48 h-48 mb-6">
                <svg className="transform -rotate-90 w-48 h-48">
                    {/* Background circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#2a2a2a"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Today</p>
                    <p className="text-6xl font-bold text-white">{count}</p>
                    <p className="text-gray-400 text-sm mt-1">cigarettes</p>
                </div>
            </div>

            {/* Comparison message */}
            {yesterdayCount > 0 && (
                <p className="text-gray-400 text-sm text-center px-4">
                    {difference > 0 ? (
                        <span className="text-green-500">
                            You're doing great. That's {difference} less than yesterday!
                        </span>
                    ) : difference < 0 ? (
                        <span className="text-gray-400">
                            That's {Math.abs(difference)} more than yesterday
                        </span>
                    ) : (
                        <span className="text-gray-400">
                            Same as yesterday
                        </span>
                    )}
                </p>
            )}
        </div>
    );
}
