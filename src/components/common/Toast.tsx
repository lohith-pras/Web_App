import type { ToastProps } from '../../types';

export function Toast({ message, show, onClose }: ToastProps) {
    return (
        <div
            className={`
        fixed bottom-32 left-1/2 -translate-x-1/2 z-50
        bg-emerald-500/90 backdrop-blur-xl border border-emerald-400/30 text-white px-6 py-3 rounded-2xl 
        shadow-[0_8px_32px_0_rgba(16,185,129,0.4)]
        transition-all duration-300 transform
        ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
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
