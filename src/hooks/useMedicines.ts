/**
 * useMedicines Hook
 * Manages medicines subscription and operations
 */

import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/store';
import { subscribeToMedicines } from '../repositories/medicinesRepository';
import MedicineService from '../services/medicines/medicineService';
import { ErrorHandler, AppError } from '../services/errors/ErrorHandler';
import { Medicine } from '../types';
import { FEATURES } from '../config/environment';

/**
 * Medicines hook with subscriptions and operations
 */
export function useMedicines(uid: string | undefined) {
  const {
    medicines,
    isMedicinesLoading,
    medicinesError,
    setMedicines,
    setMedicinesLoading,
    setMedicinesError,
    getTakenMedicinesCount,
    getTotalMedicinesCount,
    getAdherencePercentage,
  } = useAppStore();

  // Subscribe to medicines
  useEffect(() => {
    if (!uid) {
      setMedicines([]);
      return;
    }

    // If Firebase is disabled, skip setting up real subscriptions.
    if (!FEATURES.enableFirebase) {
      setMedicines([]);
      setMedicinesLoading(false);
      setMedicinesError(null);
      return;
    }

    setMedicinesLoading(true);

    const unsubscribe = subscribeToMedicines(uid, (meds) => {
      setMedicines(meds);
      setMedicinesLoading(false);
      setMedicinesError(null);
    });

    return () => {
      unsubscribe();
    };
  }, [uid, setMedicines, setMedicinesLoading, setMedicinesError]);

  // Add medicine
  const addMedicine = useCallback(
    async (medicine: Omit<Medicine, 'id' | 'createdAt' | 'dailyStatus'>) => {
      try {
        setMedicinesError(null);

        const medicineId = await MedicineService.addMedicine(medicine);

        return medicineId;
      } catch (error) {
        const appError = error instanceof AppError
          ? error
          : ErrorHandler.handleUnknownError(error);

        setMedicinesError(appError.userMessage || appError.message);
        throw appError;
      }
    },
    [setMedicinesError]
  );

  // Mark as taken
  const markAsTaken = useCallback(
    async (medicineId: string) => {
      try {
        setMedicinesError(null);

        const medicine = medicines.find((m) => m.id === medicineId);
        if (!medicine || !uid) {
          throw new Error('Medicine not found or user not authenticated');
        }

        await MedicineService.markAsTaken(medicineId, uid, medicine);
      } catch (error) {
        const appError = error instanceof AppError
          ? error
          : ErrorHandler.handleUnknownError(error);

        setMedicinesError(appError.userMessage || appError.message);
        throw appError;
      }
    },
    [medicines, uid, setMedicinesError]
  );

  // Mark as missed
  const markAsMissed = useCallback(
    async (medicineId: string) => {
      try {
        setMedicinesError(null);

        const medicine = medicines.find((m) => m.id === medicineId);
        if (!medicine || !uid) {
          throw new Error('Medicine not found or user not authenticated');
        }

        await MedicineService.markAsMissed(medicineId, uid, medicine.name);
      } catch (error) {
        const appError = error instanceof AppError
          ? error
          : ErrorHandler.handleUnknownError(error);

        setMedicinesError(appError.userMessage || appError.message);
        throw appError;
      }
    },
    [medicines, uid, setMedicinesError]
  );

  // Snooze medicine
  const snooze = useCallback(
    async (medicineId: string, minutes?: number) => {
      try {
        setMedicinesError(null);
        await MedicineService.snooze(medicineId, minutes);
      } catch (error) {
        const appError = error instanceof AppError
          ? error
          : ErrorHandler.handleUnknownError(error);

        setMedicinesError(appError.userMessage || appError.message);
        throw appError;
      }
    },
    [setMedicinesError]
  );

  // Delete medicine
  const deleteMedicine = useCallback(
    async (medicineId: string) => {
      try {
        setMedicinesError(null);
        await MedicineService.deleteMedicine(medicineId);
      } catch (error) {
        const appError = error instanceof AppError
          ? error
          : ErrorHandler.handleUnknownError(error);

        setMedicinesError(appError.userMessage || appError.message);
        throw appError;
      }
    },
    [setMedicinesError]
  );

  // Get stats
  const stats = MedicineService.calculateStats(medicines);

  return {
    medicines,
    isLoading: isMedicinesLoading,
    error: medicinesError,
    stats,
    takenCount: getTakenMedicinesCount(),
    totalCount: getTotalMedicinesCount(),
    adherencePercentage: getAdherencePercentage(),
    // Operations
    addMedicine,
    markAsTaken,
    markAsMissed,
    snooze,
    deleteMedicine,
  };
}

export default useMedicines;
