
import { motion } from 'framer-motion';

interface LiquidCircularProgressProps {
    progress: number; // 0 to 100
    size?: number;
    color?: string; // Hex color for the liquid
    children?: React.ReactNode;
}

export function LiquidCircularProgress({
    progress,
    size = 200,
    color = '#34D399', // Default to Mint
    children
}: LiquidCircularProgressProps) {
    const radius = size * 0.45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle (Glass Track) */}
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="absolute rotate-[-90deg]"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="12"
                    strokeLinecap="round"
                />

                {/* Progress Circle (Solid Color) */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            {/* Inner "Liquid" Blob Effect (Decorative background) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden rounded-full">
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: size * 0.8,
                        height: size * 0.8,
                        background: color,
                        filter: "blur(40px)",
                        borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%"
                    }}
                />
            </div>

            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                {children}
            </div>
        </div>
    );
}
