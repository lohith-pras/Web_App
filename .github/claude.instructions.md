# Claude AI Assistant Instructions

## Project Context

This is a **Smoking Tracker PWA** - a Progressive Web App built with React and TypeScript to help users track smoking habits, identify triggers, and visualize progress towards reduction goals.

### Core Technologies

- **React 19**: UI framework with functional components and hooks
- **TypeScript**: Type-safe JavaScript with strict typing
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling framework
- **Recharts**: Charting library for data visualization
- **LocalStorage**: Client-side data persistence (privacy-focused)
- **PWA**: Installable with offline support via vite-plugin-pwa

### Application Architecture

- **Pages**: LogPage, InsightsPage, SettingsPage
- **Components**: Organized by feature (common, dashboard, layout, logging, settings)
- **Hooks**: Custom hooks for state management (useSmokingLogs, useTriggers, useGoal, useToast)
- **Services**: Storage abstraction and data cleanup utilities
- **Types**: Centralized TypeScript type definitions

### Additional Resources

For in-depth guidance on specific technologies:

- **React 19 Development**: See `.github/instructions/react-development.instructions.md` for modern hooks, patterns, and best practices
- **Tailwind CSS v4**: See `.github/instructions/tailwind-v4.instructions.md` for CSS-first configuration and utility patterns
- **TypeScript Best Practices**: See `.github/instructions/typescript.instructions.md` for strict typing, type guards, and ES2022+ features

### Custom Agents

Use specialized agents for focused work:

- **@FRONTEND_AGENT** - React components, TypeScript, Tailwind UI, hooks, state management
- **@BACKEND_AGENT** - Vite config, build optimization, PWA setup, npm management

To use an agent, mention it in your request: `@FRONTEND_AGENT create a responsive chart component`

## Working with Claude (Sonnet & Opus)

### Code Style & Quality

- Write clean, idiomatic React/TypeScript code
- Use TypeScript strict mode - include explicit types for props, state, and return values
- Prefer functional components with hooks over class components
- Use proper React hooks patterns (useState, useEffect, useMemo, useCallback)
- Follow existing naming conventions (PascalCase for components, camelCase for functions)
- Use Tailwind CSS utility classes for styling

### When Writing Code

1. **Read before editing**: Always examine existing code before modifications
2. **Prefer editing over creating**: Modify existing files rather than creating new ones
3. **Test your changes**: Verify components render correctly and hooks work as expected
4. **Maintain consistency**: Follow existing patterns for hooks, components, and utilities
5. **Preserve data structure**: Be careful with LocalStorage data format changes

### Communication Preferences

- **Be concise**: Provide direct, actionable responses
- **Show, don't tell**: Provide code examples rather than lengthy explanations
- **Batch operations**: When multiple files need changes, make them together
- **Focus on the task**: Avoid tangential information unless critical

### Best Practices for Prompts

**Good prompts:**

- "Add a filter to show only logs from the last 7 days in InsightsPage"
- "Create a new chart component to visualize hourly smoking patterns"
- "Refactor the trigger selection modal to support custom trigger categories"
- "Fix the date formatting issue in the daily trend chart"

**Include context:**

- Mention relevant file paths (e.g., `src/hooks/useSmokingLogs.ts`)
- Specify component props and state requirements
- Note any UI/UX constraints or design patterns to follow
- Reference existing patterns in the codebase

### React/TypeScript Specific Guidelines

**React:**

- Use functional components exclusively
- Properly type all props with `interface` or `type` declarations
- Use `useState` for component state, custom hooks for shared logic
- Memoize expensive computations with `useMemo`
- Memoize callbacks passed to child components with `useCallback`
- Handle side effects properly with `useEffect` and cleanup functions

**TypeScript:**

- Avoid `any` type - use proper types or `unknown` if necessary
- Define types in `src/types/index.ts` for shared types
- Use type guards for runtime type checking
- Leverage union types for state variants (e.g., `TabType`)

**Tailwind CSS:**

- Use utility classes instead of custom CSS
- Follow existing design patterns (glass morphism via GlassCard component)
- Use responsive classes for mobile-first design
- Leverage Tailwind's color palette and spacing scale

**Data & State Management:**

- All data persists to LocalStorage via `src/services/storage.ts`
- Never mutate state directly - use proper React state setters
- Use the existing custom hooks for data operations
- Validate data structure when reading from LocalStorage

### File Operations

- Use descriptive file paths
- Preserve existing code structure and formatting
- Read files before editing to understand context
- Make targeted changes rather than full rewrites
- Components go in appropriate feature folders under `src/components/`

### Error Handling

- Handle missing or corrupted LocalStorage data gracefully
- Validate user input in forms and modals
- Provide user-friendly error messages via Toast component
- Use optional chaining and nullish coalescing for safe property access

### Documentation

- Only create documentation files (\*.md) when explicitly requested
- Keep code comments focused and technical
- Document complex state logic or non-obvious React patterns
- Comment on LocalStorage schema changes or migration needs

## Task Management

For complex multi-step tasks, Claude will:

- Break down work into clear steps
- Track progress through todo lists
- Mark tasks complete as they finish
- Keep you informed of progress

## Getting Help

When asking Claude for assistance:

- Provide relevant code snippets or file paths
- Describe expected vs. actual behavior (especially UI/UX issues)
- Include browser console errors in full
- Mention any constraints (mobile compatibility, offline support, data privacy)

## PWA & Mobile Considerations

- Test changes work on mobile viewports
- Ensure offline functionality is preserved
- Consider touch interactions and mobile UX patterns
- LocalStorage has size limits (~5-10MB) - monitor data growth

---

**Model Recommendations:**

- **Claude Sonnet**: Balanced performance for most coding tasks
- **Claude Opus**: Complex architectural decisions, state management refactoring, or PWA optimization

---

## System Reminders

<system-reminder>
As you answer the user's questions, you can use the following context:

### important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
</system-reminder>
