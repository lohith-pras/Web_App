interface StatsCardsProps {
    dailyAverage: number;
    topTrigger: string;
}

export function StatsCards({ dailyAverage, topTrigger }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Daily Average Card */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{dailyAverage.toFixed(1)}</p>
                <p className="text-gray-400 text-sm">Daily Average</p>
            </div>

            {/* Top Trigger Card */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-xl mb-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-xl font-bold text-white mb-1 truncate">{topTrigger || 'None'}</p>
                <p className="text-gray-400 text-sm">Top Trigger</p>
            </div>
        </div>
    );
}
