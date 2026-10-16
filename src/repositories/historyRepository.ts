/**
 * History Repository
 * Handles all Firestore operations for medicine history/adherence logs
 */

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Query,
} from 'firebase/firestore';
import { getDb } from '../services/firebase';
import { HistoryEntry } from '../types';
import { ErrorHandler } from '../services/errors/ErrorHandler';
import { FIRESTORE } from '../config/constants';
import { FEATURES } from '../config/environment';

// Note: avoid calling getDb() at module import time because
// it will throw when Firebase is disabled. Use lazy calls below.

/**
 * Fetch user's medicine history
 * Limited to recent entries for performance
 */
export async function getHistory(uid: string): Promise<HistoryEntry[]> {
  try {
    if (!FEATURES.enableFirebase) {
      return [];
    }
    const db = getDb();
    const q: Query = query(
      collection(db, FIRESTORE.COLLECTIONS.HISTORY),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(FIRESTORE.BATCH_SIZE)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as HistoryEntry));
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Get history for specific date range
 * Note: Requires a Firestore composite index on (uid: asc, timestamp: desc)
 */
export async function getHistoryByDateRange(
  uid: string,
  startDate: Date,
  endDate: Date
): Promise<HistoryEntry[]> {
  try {
    if (!FEATURES.enableFirebase) {
      return [];
    }
    const db = getDb();
    const q: Query = query(
      collection(db, FIRESTORE.COLLECTIONS.HISTORY),
      where('uid', '==', uid),
      where('timestamp', '>=', startDate),
      where('timestamp', '<=', endDate),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as HistoryEntry));
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Calculate adherence statistics
 */
export async function calculateAdherence(
  history: HistoryEntry[]
): Promise<{
  total: number;
  taken: number;
  missed: number;
  percentage: number;
}> {
  const taken = history.filter((h) => h.status === 'taken').length;
  const missed = history.filter((h) => h.status === 'missed').length;
  const total = taken + missed;

  return {
    total,
    taken,
    missed,
    percentage: total > 0 ? Math.round((taken / total) * 100) : 0,
  };
}

/**
 * Group history entries by date
 */
export function groupHistoryByDate(
  history: HistoryEntry[]
): Map<string, HistoryEntry[]> {
  const grouped = new Map<string, HistoryEntry[]>();

  history.forEach((entry) => {
    const date = entry.date;
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(entry);
  });

  return grouped;
}

export default {
  getHistory,
  getHistoryByDateRange,
  calculateAdherence,
  groupHistoryByDate,
};