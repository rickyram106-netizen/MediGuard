export interface UserSettings {
  darkMode: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  language: string;
  pushAlerts: boolean;
  sound: boolean;
  vibrate: boolean;
  missedRepeat: boolean;
  voice: boolean;
}

export interface OnboardingData {
  done: boolean;
  problem: string | null;
  reminderStyle: string | null;
  fallback: string | null;
}

export interface UserProfile {
  uid: string;
  phone: string;
  name: string;
  email: string;
  photoURL: string;
  settings: UserSettings;
  onboarding: OnboardingData;
  streak: number;
  createdAt: any;
}

export interface Medicine {
  id: string;
  uid: string;
  name: string;
  dosage: string;
  unit: string;
  reminderTimes: string[];
  frequency: string;
  missedAction: string;
  notes: string;
  dailyStatus: Record<string, 'taken' | 'missed' | 'pending'>;
  snoozeUntil?: any;
  createdAt: any;
  takenToday?: boolean;
}

export interface FamilyContact {
  id: string;
  uid: string;
  name: string;
  phone: string;
  role: string;
  alertLevel: number;
  createdAt: any;
  lastAlerted?: any;
}

export interface HistoryEntry {
  id: string;
  uid: string;
  medicineId: string;
  medicineName: string;
  status: 'taken' | 'missed';
  scheduledTimes: string[];
  date: string;
  timestamp: any;
}
