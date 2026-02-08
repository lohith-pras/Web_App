import type { Trigger } from '../../types';

interface TriggerSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTrigger: (triggerName: string) => void;
    triggers: Trigger[];
}

export function TriggerSelectionModal({
    isOpen,
    onClose,
    onSelectTrigger,
    triggers,
}: TriggerSelectionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 border-t sm:border border-gray-200 dark:border-slate-700 animate-slide-up transition-colors duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What triggered it?</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Trigger Grid */}
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {triggers.map((trigger) => (
                        <button
                            key={trigger.id}
                            onClick={() => {
                                onSelectTrigger(trigger.name);
                                onClose();
                            }}
                            className="flex flex-col items-center justify-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl p-6 transition-all active:scale-95 min-h-[100px]"
                        >
                            <span className="text-3xl">{trigger.icon}</span>
                            <span className="text-gray-900 dark:text-white font-medium text-sm">{trigger.name}</span>
                        </button>
                    ))}
                </div>

                {/* Skip option */}
                <button
                    onClick={() => {
                        onSelectTrigger('Other');
                        onClose();
                    }}
                    className="w-full mt-4 py-3 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    Skip
                </button>
            </div>
        </div>
    );
}
