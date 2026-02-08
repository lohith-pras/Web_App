export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`relative overflow-hidden bg-white/30 dark:bg-white/[0.04] backdrop-blur-[20px] rounded-2xl animate-pulse ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_1.5s_infinite]"></div>
        </div>
    );
}
