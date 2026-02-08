---
description: Main orchestration for Smoking Tracker PWA development
---

# Smoking Tracker PWA - Agent Orchestration

## Project Overview

**Type:** Progressive Web Application (PWA)  
**Purpose:** Track cigarette smoking patterns and triggers with supportive, non-judgmental UX  
**Stack:** React + TypeScript + Tailwind CSS + Recharts  
**Storage:** Browser localStorage (no backend)  
**Build Tool:** Vite  
**Package Manager:** npm (frontend), uv (Python tooling)

## Architecture

### 3-Layer Structure

```
┌─────────────────────────────────────┐
│   Presentation Layer (React)        │
│   - Components (logging, dashboard) │
│   - Pages (Log, Insights, Settings) │
│   - Layout & Navigation             │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│   Business Logic Layer              │
│   - Custom Hooks (state management) │
│   - Utilities (calculations, dates) │
│   - Services (storage, export)      │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│   Data Layer                        │
│   - localStorage wrapper            │
│   - Data models (TypeScript types)  │
│   - Data cleanup (6-month retention)│
└─────────────────────────────────────┘
```

## Specialized Agent Files

- **Frontend:** [.agent/frontend/AGENTS.md](.agent/frontend/AGENTS.md) - React/TypeScript implementation details
- **Backend:** [.agent/backend/AGENTS.md](.agent/backend/AGENTS.md) - Future API patterns (currently localStorage-only)

## Development Workflow

### Phase 1: Setup (Current)
1. ✅ Create project structure
2. ✅ Set up .gitignore
3. ✅ Create AGENTS.md files
4. ⏳ Initialize with `uv` for Python tooling
5. ⏳ Initialize Vite + React + TypeScript
6. ⏳ Configure Tailwind CSS

### Phase 2: Core Implementation
- Data models and storage layer
- Logging interface (quick log + triggers)
- Dashboard with visualizations
- Settings and goal tracking

### Phase 3: PWA Features
- Service worker setup
- Offline functionality
- Manifest configuration
- Installability

### Phase 4: Polish & Verification
- UI/UX refinement (supportive tone)
- Mobile optimization
- Performance testing
- Browser verification

## Key Principles

### 1. Mobile-First Design
- All components must work on 320px+ screens
- Touch targets minimum 44px
- No horizontal scrolling
- Fast load times (<2s)

### 2. Supportive UX
- **Never use shame-inducing language**
- Neutral-to-encouraging messaging
- Calming color palette (blues, greens, grays)
- Celebrate small wins

### 3. Data Privacy
- All data stored locally (localStorage)
- No external tracking
- User controls all data (export, delete)
- Automatic 6-month cleanup

### 4. Performance
- Lazy load chart libraries
- Memoize expensive calculations
- Debounce rapid interactions
- Optimize bundle size

## Code Standards

### TypeScript
- Strict mode enabled
- Explicit types (avoid `any`)
- Interfaces for all data models
- Proper error handling

### React
- Functional components only
- Custom hooks for reusable logic
- Proper dependency arrays
- Avoid prop drilling (use composition)

### Tailwind CSS
- Mobile-first breakpoints
- Consistent spacing scale
- Custom theme configuration
- Avoid arbitrary values where possible

### File Organization
```
src/
├── components/     # Organized by feature
├── pages/          # Top-level routes
├── hooks/          # Custom React hooks
├── services/       # Business logic
├── types/          # TypeScript interfaces
├── utils/          # Pure functions
└── constants/      # Static data
```

## Testing Strategy

### Automated
- TypeScript compilation (no errors)
- Build verification (`npm run build`)
- Linting (ESLint + Prettier)

### Manual
- Browser testing (Chrome, Safari, Firefox)
- Mobile viewport testing
- PWA installation testing
- Offline functionality testing
- Data persistence verification

## Deployment

**Target Platforms:** Vercel or Netlify (free tier)

**Build Command:** `npm run build`  
**Output Directory:** `dist/`  
**Environment Variables:** None required (localStorage-only)

## Communication Protocol

### Agent-to-Agent
- Frontend agents: Focus on UI/UX, React patterns, Tailwind styling
- Backend agents: Focus on data models, storage, future API design
- Main orchestrator: Coordinate between layers, ensure consistency

### Agent-to-User
- Use supportive, clear language
- Explain technical decisions when relevant
- Ask for clarification on ambiguous requirements
- Provide progress updates during implementation

## Success Metrics

- [ ] User can log cigarette in <3 seconds
- [ ] All charts render correctly with sample data
- [ ] App works completely offline
- [ ] Data persists across browser sessions
- [ ] CSV export contains all data
- [ ] Monthly goal tracking accurate
- [ ] 6-month data retention working
- [ ] Installable as PWA on mobile

## Notes

- This is a **localStorage-only** application (no backend server)
- Python/uv used only for auxiliary tooling (scripts, data generation)
- Focus on **supportive UX** - avoid judgmental language throughout
- All features must work **offline** (PWA requirement)
