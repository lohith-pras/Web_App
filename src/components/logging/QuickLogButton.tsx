interface QuickLogButtonProps {
    onClick: () => void;
}

export function QuickLogButton({ onClick }: QuickLogButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-green-500/20"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-lg">Log Cigarette</span>
        </button>
    );
}
