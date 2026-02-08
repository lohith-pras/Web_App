/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
            },
            colors: {
                // Apple HIG: Semantic label colors that adapt to light/dark mode
                label: {
                    primary: 'rgb(var(--color-label-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--color-label-secondary) / <alpha-value>)',
                    tertiary: 'rgb(var(--color-label-tertiary) / <alpha-value>)',
                    quaternary: 'rgb(var(--color-label-quaternary) / <alpha-value>)',
                },
                // Apple HIG: Background colors (base and elevated for depth)
                background: {
                    base: 'rgb(var(--color-bg-base) / <alpha-value>)',
                    elevated: 'rgb(var(--color-bg-elevated) / <alpha-value>)',
                    'elevated-secondary': 'rgb(var(--color-bg-elevated-secondary) / <alpha-value>)',
                },
                // Apple HIG: Separator colors
                separator: 'rgb(var(--color-separator) / <alpha-value>)',
                // Brand colors with proper contrast (7:1 ratio for accessibility)
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                success: {
                    light: '#10b981',
                    dark: '#34d399', // Brighter for dark mode
                },
                warning: {
                    light: '#f59e0b',
                    dark: '#fbbf24', // Brighter for dark mode
                },
                danger: {
                    light: '#ef4444',
                    dark: '#f87171', // Brighter for dark mode
                },
            },
            minHeight: {
                'touch': '44px',
            },
            minWidth: {
                'touch': '44px',
            },
            backgroundColor: {
                'glass-light': 'rgba(255, 255, 255, 0.7)',
                'glass-dark': 'rgba(255, 255, 255, 0.08)',
            },
            borderColor: {
                'glass-light': 'rgba(255, 255, 255, 0.3)',
                'glass-dark': 'rgba(255, 255, 255, 0.1)',
            },
        },
    },
    plugins: [],
}
