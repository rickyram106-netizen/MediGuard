import { create } from 'zustand';
import { UserProfile, UserSettings } from '../types';

interface AppState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  updateSettings: (newSettings) => 
    set((state) => ({
      user: state.user 
        ? { ...state.user, settings: { ...state.user.settings, ...newSettings } } 
        : null
    })),
}));
