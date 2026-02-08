export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary-500 blur-[1px] animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary-500 animate-spin"></div>
            </div>
        </div>
    );
}
