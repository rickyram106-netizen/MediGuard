import { create } from 'zustand';

interface OnboardingState {
  answers: {
    problem: string | null;
    reminderStyle: string | null;
    fallback: string | null;
  };
  setAnswer: (key: string, value: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  answers: {
    problem: null,
    reminderStyle: null,
    fallback: null,
  },
  setAnswer: (key, value) =>
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    })),
  reset: () =>
    set({
      answers: {
        problem: null,
        reminderStyle: null,
        fallback: null,
      },
    }),
}));
