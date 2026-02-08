interface DataClearProps {
    onClear: () => void;
}

export function DataClear({ onClear }: DataClearProps) {
    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
            <button
                onClick={onClear}
                className="w-full flex items-center justify-between bg-[#2a2a2a] hover:bg-red-500/10 rounded-lg p-4 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-red-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="text-red-500 font-medium">Clear History</p>
                        <p className="text-gray-400 text-sm">Delete all logged data</p>
                    </div>
                </div>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <p className="text-xs text-gray-500 mt-3">
                This action cannot be undone. All your data will be permanently deleted.
            </p>
        </div>
    );
}
