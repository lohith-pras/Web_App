---
description: "Tailwind CSS v4+ installation, configuration, and usage patterns with Vite for the Smoking Tracker PWA"
applyTo: "vite.config.ts, **/*.css, **/*.tsx, **/*.jsx"
---

# Tailwind CSS v4 Instructions

Modern utility-first CSS framework with CSS-first configuration for React + Vite projects.

## Key Changes in Tailwind v4

- **No tailwind.config.js required** - Configuration is done via CSS
- **No PostCSS configuration needed** when using @tailwindcss/vite plugin
- **CSS-first configuration** using `@theme` directive
- **Automatic content detection** - No need to specify content paths
- **Single `@import` statement** replaces old `@tailwind` directives

## Installation with Vite

### Step 1: Install Dependencies

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 2: Configure Vite Plugin

Add the Tailwind plugin to `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Step 3: Import Tailwind in CSS

In your main CSS file (e.g., `src/index.css`):

```css
@import "tailwindcss";
```

**Do NOT use old directives:**

```css
/* ❌ OLD - Do not use in Tailwind v4 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ NEW - Use this in Tailwind v4 */
@import "tailwindcss";
```

### Step 4: Verify Import in Entry Point

Ensure CSS is imported in `src/main.tsx`:

```typescript
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

## CSS-First Configuration

### Custom Theme with @theme

Use the `@theme` directive to customize design tokens:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;

  /* Spacing (if needed beyond defaults) */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;

  /* Fonts */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "Fira Code", monospace;

  /* Border Radius */
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Glass morphism effect (custom) */
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.3);
}
```

### Custom Utilities

Define custom utility classes in CSS:

```css
@import "tailwindcss";

@utility glass-card {
  background: var(--glass-bg, rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.3));
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

@utility scrollbar-hidden {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

@utility content-auto {
  content-visibility: auto;
}
```

### Custom Variants

Define custom variants:

```css
@import "tailwindcss";

@variant hocus (&:hover, &:focus);
@variant group-hocus (:merge(.group):hover &, :merge(.group):focus &);
```

Usage:

```tsx
<button className="hocus:bg-blue-600">Hover or focus me</button>
```

## Utility-First Patterns

### Mobile-First Responsive Design

```tsx
function ResponsiveCard() {
  return (
    <div
      className="
      /* Mobile (default) */
      p-4 
      text-sm
      /* Tablet (md: 768px+) */
      md:p-6 
      md:text-base
      /* Desktop (lg: 1024px+) */
      lg:p-8 
      lg:text-lg
    "
    >
      Responsive content
    </div>
  );
}
```

### Flexbox and Grid Layouts

```tsx
// Flexbox
<div className="flex flex-col gap-4 items-center justify-center">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Responsive flex direction
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">Column/Row Item 1</div>
  <div className="flex-1">Column/Row Item 2</div>
</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Grid Item 1</div>
  <div>Grid Item 2</div>
  <div>Grid Item 3</div>
</div>
```

### Color and Spacing

```tsx
// Text colors
<p className="text-gray-700 hover:text-gray-900">Text</p>

// Background colors
<div className="bg-white hover:bg-gray-50">Hover me</div>

// Padding and margin
<div className="p-4 m-2">Content</div>
<div className="px-6 py-4">Asymmetric padding</div>

// Gap for flex/grid
<div className="flex gap-4">
  <div>Item</div>
  <div>Item</div>
</div>
```

### Borders and Rounded Corners

```tsx
// Borders
<div className="border border-gray-200 rounded-lg">
  Content
</div>

// Specific borders
<div className="border-t border-b-2 border-gray-300">
  Top and bottom borders
</div>

// Rounded corners
<div className="rounded-none">Square</div>
<div className="rounded-md">Medium rounded</div>
<div className="rounded-lg">Large rounded</div>
<div className="rounded-full">Fully rounded (circle/pill)</div>
```

### Shadows

```tsx
<div className="shadow-sm hover:shadow-lg transition-shadow">
  Hover for larger shadow
</div>
```

### Transitions and Animations

```tsx
<button className="
  transition-colors
  duration-200
  bg-blue-500
  hover:bg-blue-600
">
  Smooth color transition
</button>

<div className="
  transition-all
  duration-300
  transform
  hover:scale-105
">
  Scale on hover
</div>
```

## Common Patterns for Smoking Tracker

### Glass Morphism Card

```tsx
function GlassCard({ children }: { children: React.ReactNode }) {
  return <div className="glass-card p-6 rounded-xl shadow-lg">{children}</div>;
}
```

### Button Variants

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
  onClick: () => void;
}

function Button({ variant = "primary", children, onClick }: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2";

  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Responsive Chart Container

```tsx
function ChartContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-4 md:p-6 rounded-xl">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h3>
      <div className="w-full h-64 md:h-80">{children}</div>
    </div>
  );
}
```

### Mobile-Optimized Navigation

```tsx
function BottomNav() {
  return (
    <nav
      className="
      fixed bottom-0 left-0 right-0
      bg-white border-t border-gray-200
      flex justify-around items-center
      h-16 px-4
    "
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <NavButton icon="🏠" label="Home" />
      <NavButton icon="📊" label="Insights" />
      <NavButton icon="⚙️" label="Settings" />
    </nav>
  );
}
```

## Touch-Friendly Design

### Minimum Touch Target Size

Ensure interactive elements are at least 44px × 44px:

```tsx
<button
  className="
  w-11 h-11     /* 44px × 44px minimum */
  flex items-center justify-center
  rounded-lg
  bg-blue-500 text-white
"
>
  +
</button>
```

### Touch Feedback

```tsx
<button
  className="
  active:scale-95
  active:opacity-80
  transition-transform
"
>
  Tap me
</button>
```

## Dark Mode Support

Use Tailwind's dark mode utilities:

```tsx
<div
  className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  border border-gray-200 dark:border-gray-700
"
>
  Adaptive content
</div>
```

Enable dark mode in Vite config CSS:

```css
@import "tailwindcss";

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1a202c;
    --color-text: #f7fafc;
  }
}
```

## Performance Tips

- **Avoid inline styles**: Use Tailwind classes instead
- **Use `@apply` sparingly**: Only for frequently repeated combinations
- **Leverage purging**: Tailwind v4 automatically removes unused classes
- **Group utilities logically**: Layout → spacing → colors → effects

## Accessibility with Tailwind

```tsx
// Focus states
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500">
  Accessible button
</button>

// Screen reader only text
<span className="sr-only">Additional context for screen readers</span>

// High contrast
<p className="text-gray-700 dark:text-gray-200">
  Sufficient contrast
</p>
```

## Common Mistakes to Avoid

❌ **Don't create tailwind.config.js** (unless you have specific legacy needs)  
❌ **Don't use old `@tailwind` directives**  
❌ **Don't create PostCSS config** when using @tailwindcss/vite  
❌ **Don't use arbitrary values excessively** - prefer theme values  
❌ **Don't combine too many utilities** - Extract to components

✅ **Do use `@import "tailwindcss"`**  
✅ **Do use `@theme` for customization**  
✅ **Do follow mobile-first approach**  
✅ **Do keep utility classes in JSX maintainable**  
✅ **Do use custom utilities via `@utility`**

## Troubleshooting

### Styles Not Applying

1. Verify `@import "tailwindcss";` in CSS
2. Check Vite config has `tailwindcss()` plugin
3. Ensure CSS file is imported in main.tsx
4. Clear Vite cache: `rm -rf node_modules/.vite && npm run dev`

### Plugin Not Found

```bash
npm install @tailwindcss/vite
```

### TypeScript Errors

Ensure correct import in vite.config.ts:

```typescript
import tailwindcss from "@tailwindcss/vite";
```

## Reference

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind CSS Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
