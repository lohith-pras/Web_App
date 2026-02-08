
import type { TimePeriod } from '../../types';

interface TimePeriodToggleProps {
    selected: TimePeriod;
    onChange: (period: TimePeriod) => void;
}

export function TimePeriodToggle({ selected, onChange }: TimePeriodToggleProps) {
    const periods: { value: TimePeriod; label: string }[] = [
        { value: '7days', label: '7 Days' },
        { value: '30days', label: '30 Days' },
        { value: 'all', label: 'All Time' },
    ];

    return (
        <div className="flex w-full gap-1">
            {periods.map((period) => (
                <button
                    key={period.value}
                    onClick={() => onChange(period.value)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 relative overflow-hidden ${selected === period.value
                        ? 'text-white bg-primary-500 dark:bg-primary-600 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                >
                    {period.label}
                </button>
            ))}
        </div>
    );
}
