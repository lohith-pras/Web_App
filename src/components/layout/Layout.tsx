
import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import type { TabType } from '../../types';

interface LayoutProps {
    children: ReactNode;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-gray-900 dark:text-white font-sans relative overflow-hidden transition-colors duration-300">
            {/* Light Mode Background Blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden opacity-100 dark:opacity-0 transition-opacity duration-300">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-blue-200/40 to-indigo-200/40 blur-[120px] animate-aurora-slow" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-purple-200/35 to-pink-200/35 blur-[100px] animate-aurora-slower" />
                <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-r from-cyan-200/30 to-blue-200/30 blur-[80px] animate-aurora" />
            </div>

            {/* Subtle radial gradient overlay */}
            <div className="fixed inset-0 bg-gradient-radial from-transparent via-transparent to-slate-100/50 dark:to-black/50 -z-10 transition-colors duration-300" />

            <main className="relative z-10 pb-28 max-w-md mx-auto min-h-screen flex flex-col p-4">
                {children}
            </main>

            <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
    );
}
