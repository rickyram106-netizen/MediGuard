/**
 * Application Constants
 * Centralized configuration for features, validation, and business rules
 */

// ============================================================================
// MEDICINE MANAGEMENT
// ============================================================================

export const MEDICINE = {
  UNITS: ['Tablet', 'Capsule', 'ml', 'Drops', 'Syrup'] as const,
  FREQUENCIES: ['Daily', 'Twice Daily', 'Weekly', 'As Needed'] as const,
  MISSED_ACTIONS: [
    'Repeat alert 10 min',
    'Skip to next dose',
    'Mark as missed'
  ] as const,
  
  SNOOZE_DURATION_MINUTES: 10,
  GRACE_PERIOD_MINUTES: 15,
  
  VALIDATION: {
    MIN_NAME_LENGTH: 1,
    MAX_NAME_LENGTH: 100,
    MIN_DOSAGE_LENGTH: 1,
    MAX_DOSAGE_LENGTH: 50,
  },
} as const;

// ============================================================================
// REMINDER SYSTEM
// ============================================================================

export const REMINDERS = {
  PRESET_TIMES: [
    '06:00 AM',
    '08:00 AM',
    '12:00 PM',
    '02:00 PM',
    '08:00 PM',
    '10:00 PM'
  ] as const,
  
  DEFAULT_TIMES: ['08:00 AM', '08:00 PM'] as const,
  
  CHECK_INTERVAL_MS: 60000, // 1 minute
  STATUS_BAR_UPDATE_INTERVAL_MS: 60000, // Update every minute
} as const;

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const AUTH = {
  PHONE_NUMBER: {
    LENGTH: 10,
    COUNTRY_CODE: '+91',
    REGEX: /^[6-9]\d{9}$/,
    DEV_MODE_NUMBER: '9999999999',
    DEV_MODE_OTP: '123456',
  },
  
  RECAPTCHA: {
    SIZE: 'invisible' as const,
    ENABLED_REGIONS: ['IN'], // India
  },
  
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
} as const;

// ============================================================================
// FAMILY CONTACTS & ALERTS
// ============================================================================

export const FAMILY = {
  ALERT_LEVELS: {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
  },
  
  ALERT_LEVEL_NAMES: {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  },
  
  ALERT_TIMING: {
    APP_NOTIFICATION_MIN: 10,
    SMS_ALERT_MIN: 20,
    CALL_ALERT_MIN: 30,
  },
} as const;

// ============================================================================
// USER PREFERENCES
// ============================================================================

export const USER_PREFERENCES = {
  FONT_SIZES: ['normal', 'large', 'xlarge'] as const,
  
  DEFAULT_SETTINGS: {
    darkMode: false,
    fontSize: 'large' as const,
    language: 'en',
    pushAlerts: true,
    sound: true,
    vibrate: false,
    missedRepeat: true,
    voice: false,
  },
  
  ONBOARDING_STEPS: {
    PROBLEM: 'problem',
    REMINDER_STYLE: 'reminderStyle',
    FALLBACK: 'fallback',
  },
  
  ONBOARDING_OPTIONS: {
    problem: [
      { label: '⏰ I forget to take them', value: 'forget' },
      { label: '😴 I miss them while sleeping', value: 'sleep' },
      { label: '🤯 I get confused about timing or dose', value: 'confused' },
      { label: '✅ I usually take them on time', value: 'consistent' },
    ],
    reminderStyle: [
      { label: '⏰ Exactly at the scheduled time', value: 'on_time' },
      { label: '🔔 A few minutes before', value: 'before' },
      { label: '🔁 Keep reminding until I confirm', value: 'repeat' },
    ],
    fallback: [
      { label: '🔁 Remind me again after some time', value: 'repeat' },
      { label: '👨‍👩‍👧 Inform a family member', value: 'family' },
      { label: '📊 Just record it in history', value: 'history' },
    ],
  },
} as const;

// ============================================================================
// COLORS & THEMING
// ============================================================================

export const COLORS = {
  PRIMARY: '#16A37F',
  PRIMARY_DARK: '#0F6E56',
  PRIMARY_LIGHT: '#E1F5EE',
  SUCCESS: '#22C55E',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#3B82F6',
} as const;

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  ONBOARDING_DONE: 'onboardingDone',
  ONBOARDING_ANSWERS: 'obAnswers',
  DEV_MODE_BYPASS: 'devModeBypass',
  DEV_MODE_UID: 'devModeUid',
} as const;

// ============================================================================
// FIRESTORE COLLECTIONS
// ============================================================================

export const FIRESTORE = {
  COLLECTIONS: {
    USERS: 'users',
    MEDICINES: 'medicines',
    HISTORY: 'history',
    FAMILY: 'family',
  },
  
  BATCH_SIZE: 50, // For pagination
  HISTORY_LIMIT: 50,
} as const;

export default {
  MEDICINE,
  REMINDERS,
  AUTH,
  FAMILY,
  USER_PREFERENCES,
  COLORS,
  STORAGE_KEYS,
  FIRESTORE,
};
