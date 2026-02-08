this is the plan :

# Pre-Scale Architecture Refactoring Plan

## Executive Summary

Your smoking tracker uses cutting-edge technologies (React 19, TypeScript 5, Vite 7, Tailwind v4) but has fundamental architectural patterns that will block authentication, cloud storage, i18n, and desktop UI. The app follows a **local-first, mobile-only architecture** - perfect for a privacy-focused PWA, but incompatible with multi-device sync, user accounts, and responsive desktop experiences.

## Critical Findings

### ✅ What's Working

- All dependencies are latest stable versions
- Strict TypeScript with no `any` types
- Clean hooks-based architecture
- Apple HIG design system with glassmorphism
- Excellent PWA configuration for offline support

### 🚨 Architectural Blockers

1. **No Router** - Tab-based navigation in [App.tsx](src/App.tsx) blocks deep linking, URL-based navigation, and login/logout flows

2. **LocalStorage Lock-in** - [storage.ts](src/services/storage.ts) directly couples all hooks to localStorage; migrating to cloud requires rewriting 5+ hooks and 3 page components

3. **No Auth Layer** - Zero user context, no session management, no protected routes

4. **Hard-coded Strings** - 50+ UI strings across components with no i18n library; multi-language support requires touching every component

5. **Mobile-only Layout** - [Layout.tsx](src/components/layout/Layout.tsx) uses `max-w-md` (384px), making desktop users see a narrow column; [BottomNav.tsx](src/components/layout/BottomNav.tsx) wastes vertical space on desktop

6. **No Separation of Concerns** - Page components directly calculate stats, filter data, and manage business logic

7. **Missing Infrastructure** - No error boundaries, no API client, no environment config, no loading states

## Refactoring Roadmap

### Phase 1: Foundation (Do These NOW - ~1-2 weeks)

#### 1. Add React Router

**Goal:** Replace tab-based navigation with URL routing to enable deep linking, browser history, and proper navigation patterns for auth flows.

**Tasks:**

- Install `react-router-dom`
- Refactor [App.tsx](src/App.tsx) to use `<Routes>` instead of `activeTab` state
- Wrap [main.tsx](src/main.tsx) with `<BrowserRouter>`
- Convert tab logic in [BottomNav.tsx](src/components/layout/BottomNav.tsx) to `<NavLink>` components

**Why now:** Auth, desktop nav, and deep linking all require routing

#### 2. Add Error Boundary

**Goal:** Prevent white-screen crashes and provide graceful error handling.

**Tasks:**

- Create `src/components/common/ErrorBoundary.tsx`
- Wrap `<App>` in [main.tsx](src/main.tsx)
- Add fallback UI component

**Why now:** Prevents white-screen crashes when adding new features

#### 3. Create Environment Config

**Goal:** Enable different configurations for development, staging, and production.

**Tasks:**

- Add `.env.development` and `.env.production` files
- Define `VITE_API_URL`, `VITE_APP_NAME`, `VITE_ENABLE_ANALYTICS`
- Replace hard-coded values in [vite.config.ts](vite.config.ts)

**Why now:** You'll need different API endpoints for dev/staging/prod

#### 4. Abstract Storage Layer ⚠️ MOST CRITICAL

**Goal:** Decouple data access from localStorage to enable seamless cloud migration.

**Tasks:**

- Create `src/services/dataAccess.ts` interface with async methods:

  ```typescript
  interface DataAccess {
    getLogs(): Promise<SmokingLog[]>;
    saveLogs(logs: SmokingLog[]): Promise<void>;
    getCustomTriggers(): Promise<Trigger[]>;
    saveCustomTriggers(triggers: Trigger[]): Promise<void>;
    getMonthlyGoal(): Promise<number>;
    saveMonthlyGoal(goal: number): Promise<void>;
    getThemeMode(): Promise<ThemeMode>;
    saveThemeMode(mode: ThemeMode): Promise<void>;
    getStatus(): Promise<StorageStatus>;
    handleError(error: unknown): StorageError;
  }

  interface StorageStatus {
    available: boolean;
    syncing?: boolean;
    lastSync?: Date;
    error?: string;
  }

  interface StorageError {
    code: string;
    message: string;
    recoverable: boolean;
  }
  ```

- Implement `LocalStorageDataAccess` class (wraps current [storage.ts](src/services/storage.ts))
- Add `getStatus()` method to return storage availability and sync state
- Add `handleError()` method to normalize errors with consistent codes
- Create factory function to select implementation based on feature flags
- Implement one-time migration function `runMigrationFromLocal()` that:
  - Reads existing data via storage.ts adapter
  - Writes to chosen DataAccess implementation
  - Sets migration-complete flag (localStorage key: `migration_complete_v1`)
  - Only runs once per user/browser
- Update factory to invoke migration when selecting cloud storage
- Later implement `CloudDataAccess` without changing hooks
- Refactor [useSmokingLogs.ts](src/hooks/useSmokingLogs.ts), [useTriggers.ts](src/hooks/useTriggers.ts), [useGoal.ts](src/hooks/useGoal.ts) to:
  - Call `getStatus()` before syncing
  - Wrap calls with try/catch that pass errors through `handleError()`
  - Set UI loading/error states consistently
- Add loading states to all data hooks
- Ensure offline-first sync/queue or conflict-resolution can be layered on top

**Why now:** This is the MOST CRITICAL change - it unblocks cloud storage without rewriting everything later

#### 5. Install React Query

**Goal:** Add proper async state management with automatic caching, refetching, and error handling.

**Tasks:**

- Add `@tanstack/react-query`
- Wrap app in `<QueryClientProvider>` in [main.tsx](src/main.tsx)
- Refactor data hooks to use `useQuery` and `useMutation`
- Add loading and error states to UI components

**Why now:** Cloud storage requires async operations, loading states, error handling, and optimistic updates - React Query handles this out of the box

#### 6. Setup i18n Infrastructure

**Goal:** Prepare for multi-language support by extracting hard-coded strings.

**Tasks:**

- Install `react-i18next` and `i18next`
- Create `src/locales/en.json` with all current strings
- Wrap app in `<I18nextProvider>` in [main.tsx](src/main.tsx)
- Create extraction script to find hard-coded strings
- Refactor [LogPage.tsx](src/pages/LogPage.tsx) as reference implementation using `useTranslation()` hook

**Why now:** Extracting 50+ strings later is much harder than doing it incrementally

---

### Phase 2: Desktop Responsiveness (~1 week)

#### 7. Responsive Layout Refactor

**Goal:** Make the app usable and beautiful on desktop browsers.

**Tasks:**

- Remove `max-w-md` constraint from [Layout.tsx](src/components/layout/Layout.tsx)
- Add breakpoint-aware container: `max-w-md md:max-w-2xl lg:max-w-5xl`
- Create `src/components/layout/SideNav.tsx` for desktop
- Make [BottomNav.tsx](src/components/layout/BottomNav.tsx) conditionally render: `<div className="md:hidden">` (mobile only)
- Use router-based navigation in both NavBar components

#### 8. Multi-Column Page Layouts

**Goal:** Optimize page layouts for larger screens.

**Tasks:**

- Refactor [InsightsPage.tsx](src/pages/InsightsPage.tsx) to use grid: `grid grid-cols-1 lg:grid-cols-2`
- Expand chart containers for desktop: `<ResponsiveContainer width="100%" height={300}>` → `height={400}` on large screens
- Add desktop-optimized spacing in [GlassCard.tsx](src/components/common/GlassCard.tsx)

---

### Phase 3: Auth Preparation & Security (~1 week)

#### 9. Security Hardening

**Goal:** Implement security best practices for cloud/auth integration.

**Tasks:**

- **CSP and Header Hardening:**
  - Define Content Security Policy headers in production deployment
  - Add security headers (X-Frame-Options, X-Content-Type-Options, etc.)
  - Document CSP directives for API endpoints and CDN resources
- **CSRF Token Strategy:**
  - Implement CSRF tokens for state-changing endpoints (POST, PUT, DELETE)
  - Add token validation middleware to API routes
  - Store CSRF token in httpOnly cookie or header
- **Input Sanitization and Validation:**
  - Validate all user inputs on both client and server
  - Sanitize trigger names, log notes, and user-generated content
  - Use schema validation (e.g., Zod) for API request/response
- **Secure Token Storage:**
  - Document recommendation: httpOnly cookies vs localStorage tradeoffs
  - Update AuthContext to handle token storage securely
  - Implement token rotation and expiration handling
- **Client-side Rate Limiting:**
  - Add debounce to API calls (e.g., 300ms for log creation)
  - Implement request throttling for expensive operations
  - Prevent rapid-fire mutations that could cause race conditions
- **Request Signing/HMAC:**
  - Document API endpoint authentication strategy
  - Consider request signing for sensitive operations
  - Add timestamp validation to prevent replay attacks
- **Dependency Scanning:**
  - Set up npm audit in CI/CD pipeline
  - Add Snyk or GitHub Dependabot for vulnerability scanning
  - Document process for updating vulnerable dependencies
- **Update Feature Flags:**
  - Add security feature toggles in [src/config/features.ts](src/config/features.ts)
  - Document which security features are enabled by default
- **Update AuthContext:**
  - Add secure token handling documentation
  - Implement token refresh mechanism
  - Add session timeout handling
- **Update User Flow:**
  - Document authentication state machine in [AuthContext.tsx](src/contexts/AuthContext.tsx)
  - Add session validation on app load
  - Implement proper logout cleanup
- **Add apiClient Safeguards:**
  - Add TODO in apiClient for CSRF token interceptors
  - Implement token refresh interceptor
  - Add logging for suspicious activity (multiple 401s, rate limit hits, etc.)

**Why now:** Security must be built in from the start, not bolted on later

#### 10. Create Auth Context (Still Using LocalStorage)

**Goal:** Build auth UI patterns and state management before backend exists.

**Tasks:**

- Create `src/contexts/AuthContext.tsx` with `UserContext` (initially storing user in localStorage)
- Add login/logout methods (fake auth for now)
- Protect routes with `<ProtectedRoute>` wrapper component
- Create basic [LoginPage.tsx](src/pages/LoginPage.tsx) and [SignupPage.tsx](src/pages/SignupPage.tsx)

**Why now:** UI patterns and state management can be built before backend exists

#### 10. Attach User ID to Data

**Goal:** Prepare data structures for multi-user support with proper validation and migration.

**Tasks:**

- Add `userId` field to `SmokingLog` type in [types/index.ts](src/types/index.ts)
- Modify storage layer to namespace data by user: `smoking_logs_${userId}`
- Implement userId validation guard in LocalStorageDataAccess:
  - In `getKey()` or `getCurrentUserId()`, throw clear error if userId is missing/falsy
  - Error message should include context: "userId required before storage operations"
  - Prevent composition of keys like `smoking_logs_${userId}` when userId is undefined
- Add one-time migration routine:
  - Move existing non-namespaced SmokingLog items to `smoking_logs_${userId}` namespace
  - Trigger when userId first becomes available (after login)
  - Set migration flag: `user_data_migrated_${userId}`
- Ensure auth flow (login/logout in AuthContext / ProtectedRoute):
  - Sets canonical `current_user_id` in localStorage on login
  - Clears `current_user_id` on logout
  - Validates userId exists before any storage operations
  - Gracefully rejects storage operations if userId is absent
- Handle userId changes:
  - Clear previous user's cache/state on logout
  - Load new user's data on login
  - Prevent data leakage between users
- This allows multi-user support even in localStorage (for testing)

---

### Phase 4: API Client Infrastructure (~1 week)

#### 11. Create API Service Layer

**Goal:** Build typed API client ready for backend integration with secure token handling.

**Tasks:**

- Create `src/api/client.ts` with axios instance:

  ```typescript
  import axios from "axios";
  import type { InternalAxiosRequestConfig } from "axios";

  export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  // Request interceptor for auth tokens - safely access and mutate headers
  apiClient.interceptors.request.use(
    (config) => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error reading auth token:", error);
        // Continue without token rather than blocking request
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor for error handling - specially handle 401s with token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 Unauthorized - attempt token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue this request until refresh completes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // Call refresh endpoint (implement refreshAuthToken)
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {
              refreshToken,
            },
          );

          const newAccessToken = data.accessToken;
          const newRefreshToken = data.refreshToken;

          // Update stored tokens
          localStorage.setItem("auth_token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }

          // Update header and retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error, null);

          // Refresh failed - logout user
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("current_user_id");

          // Redirect to login or dispatch logout action
          // logoutUser(); // Implement this function

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle other errors
      return Promise.reject(error);
    },
  );
  ```

- Create `src/api/endpoints.ts` with typed endpoint functions:

  ```typescript
  import { apiClient } from "./client";
  import type { SmokingLog, Trigger } from "../types";

  export const api = {
    logs: {
      getAll: () => apiClient.get<SmokingLog[]>("/logs"),
      create: (log: SmokingLog) => apiClient.post("/logs", log),
      update: (id: string, log: Partial<SmokingLog>) =>
        apiClient.patch(`/logs/${id}`, log),
      delete: (id: string) => apiClient.delete(`/logs/${id}`),
    },
    triggers: {
      getAll: () => apiClient.get<Trigger[]>("/triggers"),
      create: (trigger: Trigger) => apiClient.post("/triggers", trigger),
    },
    // ... other endpoints
  };
  ```

**Why now:** When backend is ready, just swap the data access implementation

#### 12. Implement Feature Flags

**Goal:** Enable gradual rollout of cloud features without breaking existing functionality.

**Tasks:**

- Add `src/config/features.ts`:
  ```typescript
  export const features = {
    useCloudStorage: import.meta.env.VITE_USE_CLOUD === "true",
    enableAuth: import.meta.env.VITE_ENABLE_AUTH === "true",
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  };
  ```
- Use flags to toggle between localStorage and API calls during migration
- Add UI indicators for cloud sync status when cloud storage is enabled

---

## Architecture Decisions

### Storage Abstraction Pattern

**Choice:** Repository Pattern with async interface  
**Reason:** Allows swapping localStorage for cloud API without changing UI code. Provides clean migration path and testability.

### Router Choice

**Choice:** React Router v6  
**Reason:** Industry standard, excellent TypeScript support, aligns with React 19 patterns.

### State Management

**Choice:** React Query instead of Redux/Zustand/Context  
**Reason:** Designed specifically for async server state, provides caching, refetching, optimistic updates out of the box.

### i18n Library

**Choice:** react-i18next  
**Reason:** Most mature React i18n solution, supports lazy loading, pluralization, and date/number formatting.

### Desktop Navigation

**Choice:** Conditional rendering (mobile bottom nav, desktop side nav)  
**Reason:** Clearer separation of concerns than adaptive components, easier to maintain.

---

## Verification Checklist

### After Phase 1

- [ ] App works exactly as before but with URL routing (`/log`, `/insights`, `/settings`)
- [ ] Error boundary catches crashes (test by throwing error in component)
- [ ] Data access layer passes all operations through abstraction interface
- [ ] Loading states appear during data operations
- [ ] i18n works for at least one page (LogPage shows translated strings)
- [ ] Environment variables load correctly in development

### After Phase 2

- [ ] Desktop browsers show proper multi-column layout
- [ ] Side navigation appears on screens > 768px
- [ ] Bottom navigation hidden on desktop
- [ ] Charts expand horizontally on large screens
- [ ] All pages look good on mobile, tablet, and desktop

### After Phase 3-4

- [ ] Login/logout flow works (even with fake auth)
- [ ] Routes are protected based on auth state
- [ ] API client can make authenticated requests
- [ ] Feature flags control localStorage vs. cloud storage
- [ ] User data is properly namespaced

---

## Timeline Estimate

| Phase                | Duration  | Priority                           |
| -------------------- | --------- | ---------------------------------- |
| Phase 1 (Foundation) | 1-2 weeks | **CRITICAL** - Do first            |
| Phase 2 (Desktop)    | 1 week    | High - Can parallel with Phase 1   |
| Phase 3 (Auth Prep)  | 2-3 days  | Medium - Requires Phase 1 complete |
| Phase 4 (API Layer)  | 1 week    | Medium - Mostly boilerplate        |

**Total Effort: 3-4 weeks** of focused refactoring before adding new features.

---

## Key Insight

Your app is perfectly architected as a **local, mobile-only PWA**. The refactoring isn't fixing "bad code" - it's **pivoting the architecture** from local-first to cloud-ready, from mobile-only to responsive, from single-user to multi-user.

**Do this refactoring BEFORE adding authentication or cloud storage, or you'll be rewriting major parts twice.**

---

## Files Requiring Modification

### Phase 1

- `src/main.tsx` - Add providers (Router, QueryClient, i18n, ErrorBoundary)
- `src/App.tsx` - Replace tab state with routing
- `src/components/layout/BottomNav.tsx` - Convert to NavLink components
- `src/services/dataAccess.ts` - **NEW FILE** - Abstraction interface
- `src/services/localStorageDataAccess.ts` - **NEW FILE** - Implementation
- `src/hooks/useSmokingLogs.ts` - Use async pattern
- `src/hooks/useTriggers.ts` - Use async pattern
- `src/hooks/useGoal.ts` - Use async pattern
- `src/locales/en.json` - **NEW FILE** - Translation strings
- `src/pages/LogPage.tsx` - Add i18n
- `.env.development` - **NEW FILE**
- `.env.production` - **NEW FILE**

### Phase 2

- `src/components/layout/Layout.tsx` - Remove max-width constraint
- `src/components/layout/SideNav.tsx` - **NEW FILE** - Desktop navigation
- `src/components/layout/BottomNav.tsx` - Add mobile-only display
- `src/pages/InsightsPage.tsx` - Add grid layout
- `src/components/common/GlassCard.tsx` - Desktop spacing

### Phase 3

- `src/contexts/AuthContext.tsx` - **NEW FILE**
- `src/components/auth/ProtectedRoute.tsx` - **NEW FILE**
- `src/pages/LoginPage.tsx` - **NEW FILE**
- `src/pages/SignupPage.tsx` - **NEW FILE**
- `src/types/index.ts` - Add userId to SmokingLog

### Phase 4

- `src/api/client.ts` - **NEW FILE**
- `src/api/endpoints.ts` - **NEW FILE**
- `src/config/features.ts` - **NEW FILE**
- `src/services/cloudDataAccess.ts` - **NEW FILE** - API implementation

---

## Current Technical Debt Score: 6/10

- **Low Debt (1-3):** Projects that can scale easily
- **Medium Debt (4-6):** Need refactoring before major features ← **You are here**
- **High Debt (7-10):** Requires architectural redesign

**This app is at the inflection point** - it works great as a local mobile app, but adding auth, cloud storage, i18n, or desktop support will require **significant architectural changes**
