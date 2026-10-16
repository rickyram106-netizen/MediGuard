import { create } from 'zustand';
import { Medicine } from '../types';

interface MedState {
  medicines: Medicine[];
  setMedicines: (meds: Medicine[]) => void;
  getMedicineById: (id: string) => Medicine | undefined;
}

export const useMedStore = create<MedState>((set, get) => ({
  medicines: [],
  setMedicines: (medicines) => set({ medicines }),
  getMedicineById: (id) => get().medicines.find((m) => m.id === id),
}));
