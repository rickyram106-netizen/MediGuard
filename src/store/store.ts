import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  Medicine,
  UserProfile,
  FamilyContact,
  UserSettings,
} from '../types';

export interface AppState {
  user: UserProfile | null;
  isAuthLoading: boolean;
  authError: string | null;

  medicines: Medicine[];
  isMedicinesLoading: boolean;
  medicinesError: string | null;

  contacts: FamilyContact[];
  isContactsLoading: boolean;
  contactsError: string | null;

  activeTab: string;
  isOnboarding: boolean;
  theme: 'light' | 'dark';

  setUser: (user: UserProfile | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;

  setMedicines: (medicines: Medicine[]) => void;
  setMedicinesLoading: (loading: boolean) => void;
  setMedicinesError: (error: string | null) => void;
  getMedicineById: (id: string) => Medicine | undefined;

  setContacts: (contacts: FamilyContact[]) => void;
  setContactsLoading: (loading: boolean) => void;
  setContactsError: (error: string | null) => void;

  setActiveTab: (tab: string) => void;
  setIsOnboarding: (isOnboarding: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;

  getTakenMedicinesCount: () => number;
  getTotalMedicinesCount: () => number;
  getAdherencePercentage: () => number;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    user: null,

    // Fixed: authentication is not stuck in loading state
    isAuthLoading: false,

    authError: null,

    medicines: [],
    isMedicinesLoading: false,
    medicinesError: null,

    contacts: [],
    isContactsLoading: false,
    contactsError: null,

    activeTab: 'home',
    isOnboarding: false,
    theme: 'light',

    setUser: (user: UserProfile | null) =>
      set({
        user,
        authError: null,
      }),

    setAuthLoading: (isAuthLoading: boolean) =>
      set({
        isAuthLoading,
      }),

    setAuthError: (authError: string | null) =>
      set({
        authError,
      }),

    updateSettings: (newSettings: Partial<UserSettings>) =>
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              settings: {
                ...state.user.settings,
                ...newSettings,
              },
            }
          : null,
      })),

    setMedicines: (medicines: Medicine[]) =>
      set({
        medicines,
        medicinesError: null,
      }),

    setMedicinesLoading: (isMedicinesLoading: boolean) =>
      set({
        isMedicinesLoading,
      }),

    setMedicinesError: (medicinesError: string | null) =>
      set({
        medicinesError,
      }),

    getMedicineById: (id: string) => {
      const { medicines } = get();
      return medicines.find((m) => m.id === id);
    },

    setContacts: (contacts: FamilyContact[]) =>
      set({
        contacts,
        contactsError: null,
      }),

    setContactsLoading: (isContactsLoading: boolean) =>
      set({
        isContactsLoading,
      }),

    setContactsError: (contactsError: string | null) =>
      set({
        contactsError,
      }),

    setActiveTab: (activeTab: string) =>
      set({
        activeTab,
      }),

    setIsOnboarding: (isOnboarding: boolean) =>
      set({
        isOnboarding,
      }),

    setTheme: (theme: 'light' | 'dark') =>
      set({
        theme,
      }),

    getTakenMedicinesCount: () => {
      const { medicines } = get();
      return medicines.filter((m) => m.takenToday).length;
    },

    getTotalMedicinesCount: () => {
      const { medicines } = get();
      return medicines.length;
    },

    getAdherencePercentage: () => {
      const {
        getTakenMedicinesCount,
        getTotalMedicinesCount,
      } = get();

      const total = getTotalMedicinesCount();

      if (total === 0) {
        return 0;
      }

      const taken = getTakenMedicinesCount();

      return Math.round((taken / total) * 100);
    },
  }))
);

export function useLegacyAppStore() {
  const store = useAppStore();

  return {
    user: store.user,
    loading: store.isAuthLoading,
    setUser: store.setUser,
    setLoading: store.setAuthLoading,
    updateSettings: store.updateSettings,
  };
}

export function useLegacyMedStore() {
  const store = useAppStore();

  return {
    medicines: store.medicines,
    setMedicines: store.setMedicines,
    getMedicineById: store.getMedicineById,
  };
}

export function useLegacyOnboardingStore() {
  const store = useAppStore();

  return {
    answers: {
      problem: null,
      reminderStyle: null,
      fallback: null,
    },
    setAnswer: () => {},
    reset: () => {},
  };
}

export default useAppStore;