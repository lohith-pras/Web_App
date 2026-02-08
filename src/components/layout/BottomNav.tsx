import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { TabType } from '../../types';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTranslation } from 'react-i18next';

interface NavItem {
    id: TabType;
    path: string;
    labelKey: string;
    icon: ReactNode;
}

const navItems: NavItem[] = [
    {
        id: 'log',
        path: '/log',
        labelKey: 'nav.log',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8M8 12h8" />
            </svg>
        ),
    },
    {
        id: 'insights',
        path: '/insights',
        labelKey: 'nav.insights',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l4-4 4 4 6-6 4 4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 7v8h-8" />
            </svg>
        ),
    },
    {
        id: 'settings',
        path: '/settings',
        labelKey: 'nav.settings',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                <circle cx="8" cy="6" r="2" fill="currentColor" />
                <circle cx="16" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
            </svg>
        ),
    },
];

export function BottomNav() {
    const { t } = useTranslation();
    const { isDark } = useDarkMode();
    const location = useLocation();

    // Determine active tab from current route using prefix matching for nested routes
    // Prefer longest matching path when multiple items match
    const activeTab = useMemo(() => {
        const pathname = location.pathname;
        const matchingItems = navItems.filter(item => pathname.startsWith(item.path));
        if (matchingItems.length === 0) return 'log';
        // Sort by path length descending to get longest match
        matchingItems.sort((a, b) => b.path.length - a.path.length);
        return matchingItems[0].id;
    }, [location.pathname]);

    // Theme-aware colors from CSS variables
    const colors = useMemo(() => ({
        active: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
        inactive: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
        activeShadow: isDark ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))' : 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
        inactiveShadow: 'none',
    }), [isDark]);

    return (
        <nav 
            className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-6 safe-area-inset-bottom"
            style={{
                paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
                paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
                paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
            }}
        >
            {/* Apple HIG: Elevated glass background for navigation */}
            <div className="relative overflow-visible max-w-md mx-auto bg-white/70 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-t border-l border-t-white/30 dark:border-t-white/10 border-l-white/30 dark:border-l-white/10 border-b border-r border-b-white/10 dark:border-b-white/5 border-r-white/10 dark:border-r-white/5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-2">
                <div className="relative flex justify-around items-center">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                aria-current={isActive ? 'page' : undefined}
                                className="relative flex flex-col items-center justify-center px-4 py-4 rounded-full z-10"
                            >
                                {/* Animated liquid glass bubble background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                {/* Icon and label with smooth color transition */}
                                <motion.div
                                    className="relative z-10"
                                    animate={{
                                        color: isActive ? colors.active : colors.inactive,
                                        filter: isActive ? colors.activeShadow : colors.inactiveShadow,
                                    }}
                                    transition={{
                                        duration: 0.3,
                                    }}
                                >
                                    {item.icon}
                                </motion.div>
                                <motion.span
                                    className="text-xs font-medium mt-1 relative z-10"
                                    animate={{
                                        color: isActive ? colors.active : colors.inactive,
                                        filter: isActive ? colors.activeShadow : colors.inactiveShadow,
                                    }}
                                    transition={{
                                        duration: 0.3,
                                    }}
                                >
                                    {t(item.labelKey)}
                                </motion.span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

