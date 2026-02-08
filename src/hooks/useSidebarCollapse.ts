import { useState, useEffect } from 'react';

const SIDEBAR_COLLAPSE_KEY = 'sidebar-collapsed';

export function useSidebarCollapse() {
    // Initialize with safe default for SSR
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Read from localStorage client-side only
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        try {
            const stored = localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
            if (stored === 'true') {
                setIsCollapsed(true);
            }
        } catch (error) {
            console.error('Error reading sidebar collapse state:', error);
        }
    }, []);

    // Write to localStorage, guarding for SSR
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(isCollapsed));
        } catch (error) {
            console.error('Error saving sidebar collapse state:', error);
        }
    }, [isCollapsed]);

    const toggle = () => setIsCollapsed(prev => !prev);

    return { isCollapsed, toggle };
}
