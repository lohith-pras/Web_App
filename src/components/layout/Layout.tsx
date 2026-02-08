
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
        <div className="min-h-screen text-white font-sans relative overflow-hidden">

            {/* Background blobs for animation */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[120px] animate-blob mix-blend-screen pointer-events-none z-0 opacity-50" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/40 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen pointer-events-none z-0 opacity-50" />

            <main className="relative z-10 pb-24 max-w-md mx-auto min-h-screen flex flex-col p-4">
                {children}
            </main>

            <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
    );
}
