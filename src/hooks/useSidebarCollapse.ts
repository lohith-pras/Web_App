import { useState, useEffect, useRef } from 'react';

const SIDEBAR_COLLAPSE_KEY = 'sidebar-collapsed';

export function useSidebarCollapse() {
    // Initialize synchronously from localStorage to avoid flicker
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            const stored = localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
            return stored === 'true';
        } catch (error) {
            console.error('Error reading sidebar collapse state:', error);
            return false;
        }
    });

    // Track whether the hook has initialized to prevent writing on first render
    const initializedRef = useRef(false);

    // Mark as initialized after first render
    useEffect(() => {
        initializedRef.current = true;
    }, []);

    // Write to localStorage only after initialization to prevent overwriting on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!initializedRef.current) return; // Skip write on initial mount
        
        try {
            localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(isCollapsed));
        } catch (error) {
            console.error('Error saving sidebar collapse state:', error);
        }
    }, [isCollapsed]);

    const toggle = () => setIsCollapsed(prev => !prev);

    return { isCollapsed, toggle };
}
