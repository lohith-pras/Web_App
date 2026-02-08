
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
                "bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 transition-all duration-200",
                onClick && "cursor-pointer hover:shadow-lg dark:hover:shadow-slate-900/70 active:scale-[0.98]",
                className
            )}
        >
            {children}
        </div>
    );
}
