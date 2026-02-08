
import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';
import { useSidebarCollapse } from '../../hooks/useSidebarCollapse';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { isCollapsed } = useSidebarCollapse();
    
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-gray-900 dark:text-white font-sans relative overflow-hidden transition-colors duration-300">
            {/* Light Mode Background Blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden opacity-100 dark:opacity-0 transition-opacity duration-300">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-blue-200/40 to-indigo-200/40 blur-[120px] animate-aurora-slow" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-purple-200/35 to-pink-200/35 blur-[100px] animate-aurora-slower" />
                <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-r from-cyan-200/30 to-blue-200/30 blur-[80px] animate-aurora" />
            </div>

            {/* Subtle radial gradient overlay */}
            <div className="fixed inset-0 [background-image:radial-gradient(circle,transparent,transparent,rgb(241_245_249/0.5)_100%)] dark:[background-image:radial-gradient(circle,transparent,transparent,rgb(0_0_0/0.5)_100%)] -z-10 transition-colors duration-300" />

            {/* Desktop Side Navigation */}
            <SideNav />

            {/* Main Content: Mobile full width with safe areas, Desktop offset by sidebar */}
            <main 
                className={`relative z-10 pb-24 md:pb-8 min-h-screen flex flex-col ${isCollapsed ? 'md:ml-20' : 'md:ml-80'}`}
                style={{
                    paddingLeft: 'max(env(safe-area-inset-left), 0px)',
                    paddingRight: 'max(env(safe-area-inset-right), 0px)'
                }}
            >
                {/* Structural padding layer - generous spacing for all viewports */}
                <div className="w-full max-w-md md:max-w-2xl lg:max-w-5xl mx-auto px-6 md:px-8 lg:px-12 py-6 md:py-8 lg:py-10">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
        </div>
    );
}

