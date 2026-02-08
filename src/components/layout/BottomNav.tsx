import type { TabType } from '../../types';

interface BottomNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    return (
        <nav className="fixed bottom-6 left-0 right-0 z-50 px-6 safe-area-inset-bottom">
            <div className="relative overflow-hidden max-w-md mx-auto bg-white/60 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-white/20 border-b border-r border-white/5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-2">
                <div className="flex justify-around items-center">
                    <button
                        onClick={() => onTabChange('log')}
                        className={`flex flex-col items-center justify-center px-6 py-3 rounded-full transition-all duration-300 ${
                            activeTab === 'log' 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-white/10'
                        }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-xs font-medium mt-1">Log</span>
                    </button>

                    <button
                        onClick={() => onTabChange('insights')}
                        className={`flex flex-col items-center justify-center px-6 py-3 rounded-full transition-all duration-300 ${
                            activeTab === 'insights'
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-white/10'
                        }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-xs font-medium mt-1">Insights</span>
                    </button>

                    <button
                        onClick={() => onTabChange('settings')}
                        className={`flex flex-col items-center justify-center px-6 py-3 rounded-full transition-all duration-300 ${
                            activeTab === 'settings'
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-white/10'
                        }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-medium mt-1">Settings</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
