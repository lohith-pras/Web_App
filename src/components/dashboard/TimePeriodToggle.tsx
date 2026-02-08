
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
                    type="button"
                    onClick={() => onChange(period.value)}
                    aria-pressed={selected === period.value}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all duration-300 relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                        selected === period.value
                            ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {period.label}
                </button>
            ))}
        </div>
    );
}
