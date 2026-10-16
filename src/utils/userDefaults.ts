import { UserProfile } from '../types';

/**
 * Default user settings for new profiles
 */
export const DEFAULT_USER_SETTINGS = {
  darkMode: false,
  fontSize: 'large' as const,
  language: 'en',
  pushAlerts: true,
  sound: true,
  vibrate: false,
  missedRepeat: true,
  voice: false
};

/**
 * Default onboarding state for new users
 */
export const DEFAULT_ONBOARDING = {
  done: false,
  problem: null,
  reminderStyle: null,
  fallback: null
};

/**
 * Create a default user profile
 */
export const createDefaultUserProfile = (
  uid: string,
  phone: string = '',
  name: string = '',
  overrides?: Partial<UserProfile>
): UserProfile => {
  return {
    uid,
    phone,
    name,
    email: '',
    photoURL: '',
    settings: DEFAULT_USER_SETTINGS,
    onboarding: DEFAULT_ONBOARDING,
    streak: 0,
    createdAt: new Date(),
    ...overrides
  };
};
