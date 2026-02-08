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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="relative overflow-hidden bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">What triggered it?</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
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
                            className="relative overflow-hidden flex flex-col items-center justify-center gap-2 bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 hover:bg-white/[0.12] hover:border-white/30 rounded-2xl p-6 transition-all active:scale-95 min-h-[100px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
                        >
                            <span className="text-3xl">{trigger.icon}</span>
                            <span className="text-white font-medium text-sm">{trigger.name}</span>
                        </button>
                    ))}
                </div>

                {/* Skip option */}
                <button
                    onClick={() => {
                        onSelectTrigger('Other');
                        onClose();
                    }}
                    className="w-full mt-4 py-3 text-gray-300 hover:text-white transition-colors hover:bg-white/[0.08] rounded-xl backdrop-blur-sm"
                >
                    Skip
                </button>
            </div>
        </div>
    );
}
