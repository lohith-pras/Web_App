
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function GlassCard({ children, className, onClick }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-3xl p-6",
                "bg-white/60 dark:bg-white/[0.08]",
                "backdrop-blur-[20px] backdrop-saturate-150",
                "border-t border-l border-white/20 border-b border-r border-white/5",
                "shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]",
                "transition-all duration-300",
                onClick && "cursor-pointer hover:bg-white/70 dark:hover:bg-white/[0.12] hover:border-white/30 active:scale-[0.98]",
                className
            )}
        >
            {children}
        </div>
    );
}
