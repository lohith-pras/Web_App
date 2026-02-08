---
description: Frontend-specific agent instructions for React/TypeScript development
---

# Frontend Development - Agent Instructions

## Technology Stack

- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v3.x
- **Charts:** Recharts
- **State Management:** React hooks (useState, useEffect, custom hooks)
- **Routing:** Simple tab-based navigation (no react-router needed)
- **PWA:** vite-plugin-pwa

## Component Architecture

### Design Principles

1. **Composition over Inheritance**
   - Build small, focused components
   - Compose complex UIs from simple parts
   - Use children props for flexibility

2. **Single Responsibility**
   - Each component does one thing well
   - Separate presentation from logic
   - Extract reusable logic into custom hooks

3. **Mobile-First**
   - Design for 320px screens first
   - Progressive enhancement for larger screens
   - Touch-friendly interactions (min 44px tap targets)

### Component Categories

#### Layout Components
**Location:** `src/components/layout/`

- `Layout.tsx` - Main app wrapper with bottom nav
- `BottomNav.tsx` - Three-tab navigation (Log, Insights, Settings)

**Responsibilities:**
- Page routing/switching
- Persistent navigation
- Responsive layout structure

#### Logging Components
**Location:** `src/components/logging/`

- `QuickLogButton.tsx` - Primary CTA for logging
- `TriggerSelectionModal.tsx` - Trigger picker with grid layout
- `TodayCount.tsx` - Display today's cigarette count

**Key Requirements:**
- **Speed:** User must log in <3 seconds (2 taps)
- **Feedback:** Immediate visual confirmation
- **Accessibility:** Large touch targets, clear labels

#### Dashboard Components
**Location:** `src/components/dashboard/`

- `TimePeriodToggle.tsx` - Filter: 7/30/180/all days
- `TriggerBreakdownChart.tsx` - Pie/bar chart of triggers
- `DailyTrendChart.tsx` - Line chart of daily counts
- `TimeOfDayChart.tsx` - Bar chart by hour
- `WeekComparison.tsx` - This week vs last week
- `StatsCards.tsx` - Key metrics display

**Chart Guidelines:**
- Use Recharts components
- Responsive sizing (ResponsiveContainer)
- Calming color palette
- Mobile-optimized tooltips
- Loading states for calculations

#### Settings Components
**Location:** `src/components/settings/`

- `GoalSetting.tsx` - Monthly goal configuration
- `TriggerManagement.tsx` - Add/edit/delete custom triggers
- `DataExport.tsx` - CSV export button
- `DataClear.tsx` - Clear all data with confirmation

**UX Focus:**
- Clear labels and instructions
- Confirmation dialogs for destructive actions
- Success feedback for all actions

#### Common Components
**Location:** `src/components/common/`

- `Toast.tsx` - Brief success/error messages
- `ConfirmDialog.tsx` - Reusable confirmation modal

## Custom Hooks

### State Management Hooks

#### `useSmokingLogs.ts`
```typescript
export function useSmokingLogs() {
  const [logs, setLogs] = useState<SmokingLog[]>([]);
  
  const addLog = (trigger: string) => { /* ... */ };
  const deleteLog = (id: string) => { /* ... */ };
  const getLogsForPeriod = (period: TimePeriod) => { /* ... */ };
  
  return { logs, addLog, deleteLog, getLogsForPeriod };
}
```

#### `useTriggers.ts`
```typescript
export function useTriggers() {
  const [customTriggers, setCustomTriggers] = useState<string[]>([]);
  
  const allTriggers = [...DEFAULT_TRIGGERS, ...customTriggers];
  const addCustomTrigger = (name: string) => { /* ... */ };
  const deleteCustomTrigger = (id: string) => { /* ... */ };
  
  return { allTriggers, customTriggers, addCustomTrigger, deleteCustomTrigger };
}
```

#### `useGoal.ts`
```typescript
export function useGoal() {
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0);
  
  const progress = calculateProgress();
  const status = getStatus(); // 'green' | 'yellow' | 'red'
  
  return { monthlyGoal, setMonthlyGoal, progress, status };
}
```

### Performance Hooks

- **useMemo:** For expensive calculations (daily averages, chart data)
- **useCallback:** For event handlers passed to child components
- **useEffect:** For side effects (localStorage sync, cleanup)

## Styling Guidelines

### Tailwind CSS Conventions

#### Color Palette (Calming, Supportive)
```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#f0f9ff',   // Light blue
    100: '#e0f2fe',
    500: '#0ea5e9',  // Main blue
    700: '#0369a1',
  },
  success: {
    500: '#10b981',  // Green (for reductions)
  },
  neutral: {
    500: '#6b7280',  // Gray (neutral feedback)
  },
  warning: {
    500: '#f59e0b',  // Amber (approaching limit)
  },
}
```

#### Spacing & Sizing
- Touch targets: `min-h-[44px] min-w-[44px]`
- Card padding: `p-4` or `p-6`
- Section spacing: `space-y-6`
- Grid gaps: `gap-4`

#### Responsive Breakpoints
```css
/* Mobile first - default styles for 320px+ */
.component { /* base styles */ }

/* Tablet */
@media (min-width: 640px) { /* sm: */ }

/* Desktop */
@media (min-width: 1024px) { /* lg: */ }
```

#### Component Patterns
```tsx
// Card component
<div className="bg-white rounded-lg shadow-md p-6">
  {/* content */}
</div>

// Button (touch-friendly)
<button className="
  min-h-[44px] px-6 py-3
  bg-primary-500 text-white
  rounded-lg font-medium
  active:bg-primary-700
  transition-colors
">
  Log Cigarette
</button>

// Grid layout (trigger selection)
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
  {triggers.map(trigger => (
    <button key={trigger} className="...">
      {trigger}
    </button>
  ))}
</div>
```

## TypeScript Patterns

### Type Definitions
**Location:** `src/types/index.ts`

```typescript
// Core data models
export interface SmokingLog {
  id: string;
  timestamp: string;
  trigger: string;
  date: string;
}

// Component props
export interface TriggerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrigger: (trigger: string) => void;
  triggers: string[];
}

// Utility types
export type TimePeriod = '7days' | '30days' | '6months' | 'all';
export type GoalStatus = 'green' | 'yellow' | 'red';
```

### Best Practices
- Use `interface` for object shapes
- Use `type` for unions, primitives
- Avoid `any` - use `unknown` if type is truly unknown
- Properly type event handlers: `React.MouseEvent<HTMLButtonElement>`
- Type custom hook return values

## UX/UI Requirements

### Supportive, Non-Judgmental Language

#### ✅ Good Examples
- "Entry logged" (not "Cigarette recorded")
- "Today: 5 cigarettes" (neutral count)
- "Data exported successfully"
- "3 days below your average!" (celebrate wins)

#### ❌ Avoid
- "You failed again"
- "Gave in to craving"
- "Total money wasted"
- Aggressive red colors for exceeding goals
- Guilt-inducing cumulative stats

### Micro-Animations
```tsx
// Success toast (fade in/out)
<div className="
  transition-opacity duration-300
  opacity-0 data-[show=true]:opacity-100
">
  ✓ Entry logged
</div>

// Button press feedback
<button className="
  transform active:scale-95
  transition-transform duration-100
">
  Log Cigarette
</button>
```

### Empty States
Always provide helpful guidance when no data exists:

```tsx
{logs.length === 0 ? (
  <div className="text-center py-12 text-gray-500">
    <p className="text-lg mb-2">No entries yet</p>
    <p className="text-sm">Tap "Log Cigarette" to get started</p>
  </div>
) : (
  <ChartComponent data={logs} />
)}
```

## Data Flow

### Adding a Log Entry
```
User taps "Log Cigarette"
  ↓
Modal opens with trigger grid
  ↓
User selects trigger
  ↓
useSmokingLogs.addLog(trigger)
  ↓
Generate UUID, timestamp, date
  ↓
Save to localStorage
  ↓
Update state (re-render)
  ↓
Show success toast
  ↓
Close modal
  ↓
Update "Today: X" count
```

### Chart Data Updates
```
User changes time period
  ↓
TimePeriodToggle updates state
  ↓
All chart components receive new period
  ↓
useSmokingLogs.getLogsForPeriod(period)
  ↓
Filter logs by date range
  ↓
Calculate chart data (useMemo)
  ↓
Recharts re-renders with new data
```

## Performance Optimization

### Code Splitting
```tsx
// Lazy load chart components (heavy dependencies)
const DailyTrendChart = lazy(() => import('./components/dashboard/DailyTrendChart'));

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <DailyTrendChart data={chartData} />
</Suspense>
```

### Memoization
```tsx
// Expensive calculations
const dailyAverage = useMemo(() => {
  return calculateDailyAverage(logs, period);
}, [logs, period]);

// Event handlers
const handleAddLog = useCallback((trigger: string) => {
  addLog(trigger);
  setShowModal(false);
}, [addLog]);
```

### Debouncing
```tsx
// For rapid taps on log button
const debouncedAddLog = useMemo(
  () => debounce(addLog, 300),
  [addLog]
);
```

## PWA Implementation

### Service Worker (vite-plugin-pwa)
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ]
});
```

### Offline Detection
```tsx
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

## Testing Checklist

### Component Testing
- [ ] All components render without errors
- [ ] Props are properly typed
- [ ] Event handlers work correctly
- [ ] Conditional rendering works
- [ ] Loading states display properly

### Responsive Testing
- [ ] Works on 320px width (iPhone SE)
- [ ] Works on 375px width (iPhone 12/13)
- [ ] Works on 428px width (iPhone 14 Pro Max)
- [ ] Works on tablet (768px+)
- [ ] No horizontal scrolling at any size

### Interaction Testing
- [ ] Buttons are touch-friendly (44px+)
- [ ] Modals open/close correctly
- [ ] Forms validate input
- [ ] Success feedback appears
- [ ] Animations are smooth (60fps)

### Data Testing
- [ ] Logs persist after page reload
- [ ] Custom triggers save correctly
- [ ] Goals update properly
- [ ] CSV export works
- [ ] Data cleanup runs on init

## Common Patterns

### Modal Pattern
```tsx
export function TriggerSelectionModal({ isOpen, onClose, onSelect }: Props) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {/* content */}
      </div>
    </div>
  );
}
```

### Toast Pattern
```tsx
export function Toast({ message, show, onClose }: Props) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  
  return (
    <div className={`
      fixed bottom-20 left-1/2 -translate-x-1/2
      transition-opacity duration-300
      ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      {message}
    </div>
  );
}
```

## File Naming Conventions

- Components: PascalCase (`TriggerSelectionModal.tsx`)
- Hooks: camelCase with `use` prefix (`useSmokingLogs.ts`)
- Utils: camelCase (`dateHelpers.ts`)
- Types: PascalCase (`index.ts` with exported interfaces)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_TRIGGERS`)

## Import Order

```tsx
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { PieChart, Pie, Cell } from 'recharts';

// 3. Local components
import { Toast } from '../common/Toast';

// 4. Hooks
import { useSmokingLogs } from '../../hooks/useSmokingLogs';

// 5. Utils/services
import { formatDate } from '../../utils/dateHelpers';

// 6. Types
import type { SmokingLog, TimePeriod } from '../../types';

// 7. Constants
import { DEFAULT_TRIGGERS } from '../../constants/triggers';
```

## Key Reminders

1. **Mobile-first always** - Design for smallest screen first
2. **Supportive UX** - Never use judgmental language
3. **Performance matters** - Lazy load, memoize, debounce
4. **Type everything** - Avoid `any`, use proper TypeScript
5. **Accessibility** - Touch targets, labels, keyboard navigation
6. **Offline-first** - All features must work without internet
