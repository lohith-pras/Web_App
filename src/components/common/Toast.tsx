import type { ToastProps } from '../../types';

export function Toast({ message, show, onClose }: ToastProps) {
    return (
        <div
            className={`
        fixed bottom-24 left-1/2 -translate-x-1/2 z-50
        bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg
        transition-all duration-300 transform
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
            onClick={onClose}
        >
            <div className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
}
