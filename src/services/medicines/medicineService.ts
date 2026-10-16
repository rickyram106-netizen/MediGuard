/**
 * Medicines Business Logic Service
 * Handles medicine operations with validation and error handling
 */

import {
  addMedicine as addMedicineRepo,
  updateMedicine as updateMedicineRepo,
  deleteMedicine as deleteMedicineRepo,
  markMedicineAsTaken as markAsTakenRepo,
  markMedicineAsMissed as markAsMissedRepo,
  snoozeMedicine as snoozeMedicineRepo,
} from '../../repositories/medicinesRepository';
import { Medicine } from '../../types';
import { ErrorHandler, AppError } from '../errors/ErrorHandler';
import { MEDICINE, REMINDERS } from '../../config/constants';
import { todayStr } from '../../utils/dateUtils';

/**
 * Medicines Service
 * High-level medicine operations
 */
export class MedicineService {
  /**
   * Validate medicine data
   */
  static validateMedicineData(
    medicine: Omit<Medicine, 'id' | 'createdAt' | 'dailyStatus'>
  ): boolean {
    if (!medicine.name || medicine.name.trim().length === 0) {
      throw ErrorHandler.handleValidationError('Medicine name is required');
    }

    if (
      medicine.name.length < MEDICINE.VALIDATION.MIN_NAME_LENGTH ||
      medicine.name.length > MEDICINE.VALIDATION.MAX_NAME_LENGTH
    ) {
      throw ErrorHandler.handleValidationError(
        `Medicine name must be between ${MEDICINE.VALIDATION.MIN_NAME_LENGTH} and ${MEDICINE.VALIDATION.MAX_NAME_LENGTH} characters`
      );
    }

    if (!Array.isArray(medicine.reminderTimes) || medicine.reminderTimes.length === 0) {
      throw ErrorHandler.handleValidationError('At least one reminder time is required');
    }

    return true;
  }

  /**
   * Add new medicine
   */
  static async addMedicine(
    medicine: Omit<Medicine, 'id' | 'createdAt' | 'dailyStatus'>
  ): Promise<string> {
    try {
      this.validateMedicineData(medicine);
      return await addMedicineRepo(medicine);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Update medicine
   */
  static async updateMedicine(
    medicineId: string,
    updates: Partial<Medicine>
  ): Promise<void> {
    try {
      if (updates.name && updates.name.trim().length === 0) {
        throw ErrorHandler.handleValidationError('Medicine name cannot be empty');
      }

      await updateMedicineRepo(medicineId, updates);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Delete medicine
   */
  static async deleteMedicine(medicineId: string): Promise<void> {
    try {
      await deleteMedicineRepo(medicineId);
    } catch (error) {
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Mark medicine as taken
   */
  static async markAsTaken(
    medicineId: string,
    uid: string,
    medicine: Medicine
  ): Promise<void> {
    try {
      const today = todayStr();

      await markAsTakenRepo(
        medicineId,
        today,
        uid,
        medicine.name,
        medicine.reminderTimes
      );
    } catch (error) {
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Mark medicine as missed
   */
  static async markAsMissed(
    medicineId: string,
    uid: string,
    medicineName: string
  ): Promise<void> {
    try {
      const today = todayStr();
      await markAsMissedRepo(medicineId, today, uid, medicineName);
    } catch (error) {
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Snooze medicine reminder
   */
  static async snooze(medicineId: string, minutes: number = REMINDERS.CHECK_INTERVAL_MS / 60000): Promise<void> {
    try {
      if (minutes <= 0 || minutes > 1440) { // Max 24 hours
        throw ErrorHandler.handleValidationError('Snooze time must be between 1 and 1440 minutes');
      }

      await snoozeMedicineRepo(medicineId, minutes);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Calculate medicine stats
   */
  static calculateStats(medicines: Medicine[]): {
    total: number;
    taken: number;
    pending: number;
    percentage: number;
  } {
    const total = medicines.length;
    const taken = medicines.filter((m) => m.takenToday).length;
    const pending = total - taken;
    const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;

    return { total, taken, pending, percentage };
  }

  /**
   * Check if medicine is overdue
   */
  static isMedicineOverdue(medicine: Medicine): boolean {
    // This would require checking against current time and reminder times
    // Implementation depends on app's business rules
    return false;
  }
}

export default MedicineService;
