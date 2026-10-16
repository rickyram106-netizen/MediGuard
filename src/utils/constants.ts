/**
 * APPLICATION CONSTANTS
 * Centralized configuration for the entire application
 */

// Medicine Management
export const MEDICINE_UNITS = ['Tablet', 'Capsule', 'ml', 'Drops', 'Syrup'] as const;
export const MEDICINE_FREQUENCIES = ['Daily', 'Twice Daily', 'Weekly', 'As Needed'] as const;
export const MEDICINE_MISSED_ACTIONS = ['Repeat alert 10 min', 'Skip to next dose', 'Mark as missed'] as const;

// Reminder System
export const PRESET_REMINDER_TIMES = ['06:00 AM', '08:00 AM', '12:00 PM', '02:00 PM', '08:00 PM', '10:00 PM'] as const;
export const DEFAULT_REMINDER_TIMES = ['08:00 AM', '08:00 PM'] as const;
export const SNOOZE_DURATION_MINUTES = 10;
export const ALARM_CHECK_INTERVAL_MS = 60000; // 1 minute
export const GRACE_PERIOD_MINUTES = 15;

// Family Contact Alert Levels
export const ALERT_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export const ALERT_LEVEL_NAMES = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
} as const;

// Font Sizes
export const FONT_SIZES = ['normal', 'large', 'xlarge'] as const;

// Onboarding Configuration
export const ONBOARDING_STEPS = {
  PROBLEM: 'problem',
  REMINDER_STYLE: 'reminderStyle',
  FALLBACK: 'fallback',
} as const;

export const ONBOARDING_OPTIONS = {
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
} as const;

// Color Palette (Non-gradient, Professional)
export const COLOR_PALETTE = {
  primary: '#16A37F', // Teal
  primaryDark: '#0F6E56', // Teal Dark
  primaryLight: '#E1F5EE', // Teal Light
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
} as const;

// Status Bar Update Interval
export const STATUS_BAR_UPDATE_INTERVAL_MS = 60000; // Update every minute instead of 30s

// Phone Number Configuration
export const PHONE_NUMBER_CONFIG = {
  LENGTH: 10,
  COUNTRY_CODE: '+91',
  REGEX: /^[6-9]\d{9}$/,
  DEV_MODE_NUMBER: '9999999999',
} as const;

// Firebase Collections
export const COLLECTIONS = {
  USERS: 'users',
  MEDICINES: 'medicines',
  HISTORY: 'history',
  FAMILY: 'family',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ONBOARDING_DONE: 'onboarding_done',
  ONBOARDING_ANSWERS: 'onboarding_answers',
  THEME_PREFERENCE: 'theme_preference',
} as const;

// Navigation
export const TABS = {
  HOME: 'home',
  ADD: 'add',
  FAMILY: 'family',
  HISTORY: 'history',
  SETTINGS: 'settings',
  PROFILE: 'profile',
} as const;

// Screen Names
export const SCREENS = {
  SPLASH: 'splash',
  LOGIN: 'login',
  ONBOARD: 'onboard',
  MAIN: 'main',
} as const;

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_OTP: 'Please enter a valid 6-digit OTP',
  INVALID_TIME: 'Please select a valid time',
  MEDICINE_NAME_REQUIRED: 'Medicine name is required',
  REMINDER_TIME_REQUIRED: 'Please select at least one reminder time',
  CONTACT_NAME_REQUIRED: 'Contact name is required',
  CONTACT_PHONE_REQUIRED: 'Contact phone number is required',
} as const;

// Pagination
export const PAGINATION = {
  HISTORY_ITEMS_PER_PAGE: 50,
  INITIAL_HISTORY_LOAD: 50,
} as const;

// Animation Duration (milliseconds)
export const ANIMATIONS = {
  FADE: 200,
  SLIDE: 300,
  BOUNCE: 600,
  SNOOZE_INTERVAL: 1200,
} as const;
