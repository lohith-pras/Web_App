
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

// Apple HIG: Uses elevated background for layered glassmorphic cards
export function GlassCard({ children, className, onClick }: GlassCardProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? handleKeyDown : undefined}
            className={cn(
                "relative overflow-hidden rounded-2xl px-6 py-6",
                // Apple HIG: Softened white in light mode, elevated background in dark mode
                "bg-white/70 dark:bg-white/[0.08]",
                "backdrop-blur-[20px] backdrop-saturate-150",
                // Apple HIG: Reduced border opacity for better depth perception
                "border-t border-white/30 dark:border-white/10",
                "border-l border-l-white/30 dark:border-l-white/10",
                "border-b border-b-white/10 dark:border-b-white/5",
                "border-r border-r-white/10 dark:border-r-white/5",
                "shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]",
                "transition-all duration-300",
                onClick && "cursor-pointer hover:bg-white/80 dark:hover:bg-white/[0.12] hover:border-white/40 dark:hover:border-white/15 active:scale-[0.98]",
                className
            )}
        >
            {children}
        </div>
    );
}
