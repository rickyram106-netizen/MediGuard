/**
 * Medicines Repository
 * Handles all Firestore operations for medicines
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDocs,
  Firestore,
  Query,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '../services/firebase';
import { Medicine } from '../types';
import { ErrorHandler } from '../services/errors/ErrorHandler';
import { FIRESTORE } from '../config/constants';

/**
 * Subscribe to user's medicines
 * Automatically handles realtime updates
 */
export function subscribeToMedicines(
  uid: string,
  onSnapshot_: (medicines: Medicine[]) => void
): Unsubscribe {
  try {
    const q: Query = query(
      collection(getDb(), FIRESTORE.COLLECTIONS.MEDICINES),
      where('uid', '==', uid),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const medicines = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as Medicine));

        onSnapshot_(medicines);
      },
      (error) => {
        console.error('[MedicinesRepository] Subscription error:', error);
        throw ErrorHandler.handleFirebaseError(error);
      }
    );
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Add new medicine
 */
export async function addMedicine(
  medicine: Omit<Medicine, 'id' | 'createdAt' | 'dailyStatus'>
): Promise<string> {
  try {
    const medicineDoc = {
      ...medicine,
      dailyStatus: {},
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(getDb(), FIRESTORE.COLLECTIONS.MEDICINES),
      medicineDoc
    );

    return docRef.id;
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Update medicine
 */
export async function updateMedicine(
  medicineId: string,
  updates: Partial<Medicine>
): Promise<void> {
  try {
    const docRef = doc(getDb(), FIRESTORE.COLLECTIONS.MEDICINES, medicineId);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Delete medicine
 */
export async function deleteMedicine(medicineId: string): Promise<void> {
  try {
    await deleteDoc(
      doc(getDb(), FIRESTORE.COLLECTIONS.MEDICINES, medicineId)
    );
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Mark medicine as taken
 */
export async function markMedicineAsTaken(
  medicineId: string,
  date: string,
  uid: string,
  medicineName: string,
  scheduledTimes: string[]
): Promise<void> {
  try {
    // Update medicine daily status
    const medicineRef = doc(getDb(), FIRESTORE.COLLECTIONS.MEDICINES, medicineId);
    await updateDoc(medicineRef, {
      [`dailyStatus.${date}`]: 'taken',
      lastTakenAt: serverTimestamp(),
    });

    // Record in history
    await addDoc(collection(getDb(), FIRESTORE.COLLECTIONS.HISTORY), {
      uid,
      medicineId,
      medicineName,
      status: 'taken',
      scheduledTimes,
      date,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Mark medicine as missed
 */
export async function markMedicineAsMissed(
  medicineId: string,
  date: string,
  uid: string,
  medicineName: string
): Promise<void> {
  try {
    // Update medicine daily status
    const medicineRef = doc(getDb(), FIRESTORE.COLLECTIONS.MEDICINES, medicineId);
    await updateDoc(medicineRef, {
      [`dailyStatus.${date}`]: 'missed',
    });

    // Record in history
    await addDoc(collection(getDb(), FIRESTORE.COLLECTIONS.HISTORY), {
      uid,
      medicineId,
      medicineName,
      status: 'missed',
      date,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Snooze medicine reminder
 */
export async function snoozeMedicine(
  medicineId: string,
  minutes: number
): Promise<void> {
  try {
    const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000);
    const medicineRef = doc(getDb(), FIRESTORE.COLLECTIONS.MEDICINES, medicineId);

    await updateDoc(medicineRef, {
      snoozeUntil: Timestamp.fromDate(snoozeUntil),
    });
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

export default {
  subscribeToMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  markMedicineAsTaken,
  markMedicineAsMissed,
  snoozeMedicine,
};
