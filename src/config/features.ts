/**
 * Feature flags for gradual rollout of new functionality
 */
export const features = {
  useCloudStorage: import.meta.env.VITE_USE_CLOUD === 'true',
  enableAuth: import.meta.env.VITE_ENABLE_AUTH === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

export const config = {
  apiUrl: import.meta.env.VITE_API_URL || '',
  appName: import.meta.env.VITE_APP_NAME || 'Smoking Tracker',
} as const;
