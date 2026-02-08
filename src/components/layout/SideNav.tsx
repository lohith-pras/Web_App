import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { TabType } from '../../types';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTranslation } from 'react-i18next';
import { useSidebarCollapse } from '../../hooks/useSidebarCollapse';
import packageJson from '../../../package.json';

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                <circle cx="8" cy="6" r="2" fill="currentColor" />
                <circle cx="16" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
            </svg>
        ),
    },
];

export function SideNav() {
    const { t } = useTranslation();
    const { isDark } = useDarkMode();
    const location = useLocation();
    const { isCollapsed, toggle } = useSidebarCollapse();

    // Determine active tab from current route using prefix matching for nested routes
    // Prefer longest matching path when multiple items match
    const activeTab = useMemo(() => {
        const pathname = location.pathname;
        // Handle root path specially to avoid matching everything
        if (pathname === '/') return 'log';
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
        <nav className={`hidden md:flex fixed left-0 top-0 bottom-0 z-50 ${isCollapsed ? 'w-20' : 'w-80'}`}>
            {/* Apple HIG: Elevated glass background for navigation */}
            <div className="relative overflow-visible w-full h-full bg-white/70 dark:bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-150 border-r border-r-white/30 dark:border-r-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 flex flex-col">
                {/* App Logo/Title and Collapse Button */}
                <div className="mb-8 flex flex-col gap-4">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                        <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col' : ''}`}>
                            <div className="relative overflow-hidden w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500" />
                            {!isCollapsed && <h2 className="text-xl font-bold text-label-primary">{t('app.name')}</h2>}
                        </div>
                        {!isCollapsed && (
                            <button
                                onClick={toggle}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-label-secondary"
                                aria-label="Collapse sidebar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {isCollapsed && (
                        <button
                            onClick={toggle}
                            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-label-secondary mx-auto"
                            aria-label="Expand sidebar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Navigation Items */}
                <div className="flex flex-col gap-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                aria-current={isActive ? 'page' : undefined}
                                className={`relative flex items-center rounded-2xl z-10 ${isCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3'}`}
                                title={isCollapsed ? t(item.labelKey) : undefined}
                            >
                                {/* Animated liquid glass bubble background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSideTab"
                                        className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                {/* Icon with smooth color transition */}
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

                                {/* Label with smooth color transition */}
                                {!isCollapsed && (
                                    <motion.span
                                        className="text-base font-medium relative z-10"
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
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Footer Info */}
                {!isCollapsed && (
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <p className="text-xs text-label-tertiary text-center">Version {packageJson.version}</p>
                    </div>
                )}
            </div>
        </nav>
    );
}
