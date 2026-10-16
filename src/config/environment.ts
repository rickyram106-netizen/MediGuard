/// <reference types="vite/client" />

/**
 * Environment Configuration
 * Centralized environment variables and feature flags
 */

export const isDevelopment = import.meta.env.MODE === 'development';
export const isProduction = import.meta.env.MODE === 'production';

/**
 * Dev mode flag - for internal testing only
 * Should NEVER be enabled in production builds
 */
export const DEV_MODE_ENABLED =
  isDevelopment && import.meta.env.VITE_DEV_MODE === 'true';

/**
 * Firebase Configuration
 */
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * API Keys and External Services
 */
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Feature Flags
 */
export const FEATURES = {
  enableOfflineMode: true,
  enableAnalytics: !isDevelopment,
  enableErrorTracking: !isDevelopment,
  enableRemoteConfig: false,

  // Firebase is required for authentication and Firestore.
  enableFirebase: true,
};

/**
 * Timeout Constants (in milliseconds)
 */
export const TIMEOUTS = {
  FIREBASE_OPERATION: 10000,
  NETWORK_REQUEST: 5000,
  UI_TRANSITION: 300,
  ALARM_OVERLAY_DISMISS: 10000,
};

export default {
  isDevelopment,
  isProduction,
  DEV_MODE_ENABLED,
  FIREBASE_CONFIG,
  GEMINI_API_KEY,
  FEATURES,
  TIMEOUTS,
};