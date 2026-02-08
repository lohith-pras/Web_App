interface GoalSettingProps {
    goal: number;
    onGoalChange: (newGoal: number) => void;
    currentProgress: number;
}

export function GoalSetting({ goal, onGoalChange, currentProgress }: GoalSettingProps) {
    const handleIncrement = () => {
        onGoalChange(goal + 10);
    };

    const handleDecrement = () => {
        if (goal > 10) {
            onGoalChange(goal - 10);
        }
    };

    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Monthly Goal</h3>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Cigarettes Limit</p>
                    <p className="text-xs text-gray-500">Set a realistic limit</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDecrement}
                        className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white transition-colors"
                    >
                        −
                    </button>
                    <span className="text-2xl font-bold text-white min-w-[60px] text-center">{goal}</span>
                    <button
                        onClick={handleIncrement}
                        className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#2a2a2a] rounded-full h-2 mb-2 overflow-hidden">
                <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(currentProgress, 100)}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 text-right">{currentProgress}%</p>

            <p className="text-xs text-gray-400 mt-4">
                Reducing your monthly intake gradually increases your chance of quitting.
            </p>
        </div>
    );
}
