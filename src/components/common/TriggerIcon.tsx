import type { ReactElement } from 'react';

interface TriggerIconProps {
    icon: string;
    className?: string;
}

// Move icon renderers to module scope to avoid recreating on every render
const ICON_RENDERERS: Record<string, (className: string) => ReactElement> = {
    // Stress - Lightning bolt
    stress: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    // Social - Two people
    social: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    // Coffee - Simple coffee cup
    coffee: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v12a4 4 0 004 4h6a4 4 0 004-4V3M3 3h14M3 3l1 4h12l1-4M21 9a2 2 0 100 4M5 21h10" />
        </svg>
    ),
    // After Meals - Fork and knife
    'after-meal': (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m0 0v10m0-10h6m-6 0V3m0 12a2 2 0 002 2h2a2 2 0 002-2V5m0 0V3m0 2V3M5 3v2m0 10V5a2 2 0 012-2m0 0V3m12 18H5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18M9 3h6" />
        </svg>
    ),
    // Driving - Steering wheel
    driving: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2M12 19v2M3 12h2M19 12h2" />
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
    ),
    // Boredom - Clock
    boredom: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
        </svg>
    ),
    // Default fallback - Circle dot
    default: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
    ),
};

/**
 * Renders minimal SVG icons for trigger types
 * Maps icon keys to clean, minimalist SVG designs
 */
export function TriggerIcon({ icon, className = "w-6 h-6" }: TriggerIconProps) {
    const renderIcon = ICON_RENDERERS[icon] ?? ICON_RENDERERS.default;
    return <>{renderIcon(className)}</>;
}
