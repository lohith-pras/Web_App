import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import './i18n'; // Initialize i18n
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Runtime safeguard: Ensure auth is enabled in production
const isProduction = import.meta.env.MODE === 'production';
const authEnabled = import.meta.env.VITE_ENABLE_AUTH === 'true';

if (isProduction && !authEnabled) {
  throw new Error(
    'FATAL: Authentication must be enabled in production. Set VITE_ENABLE_AUTH=true in environment configuration.'
  );
}

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
