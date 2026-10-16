import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDocs,
  Query,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { Medicine } from '../types';
import { todayStr } from '../utils/dateUtils';

export const subscribeToMedicines = (
  uid: string,
  callback: (meds: Medicine[]) => void
): Unsubscribe => {
  const q: Query = query(
    collection(getDb(), 'medicines'),
    where('uid', '==', uid),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot) => {
      const today = todayStr();
      const meds = snapshot.docs.map((d) => {
        const data = d.data() as Medicine;
        const takenToday = data.dailyStatus?.[today] === 'taken';
        return { ...data, id: d.id, takenToday };
      });
      callback(meds);
    },
    (error) => {
      console.error('[MedicineService] subscription error:', error);
    }
  );
};

export const saveMedicine = async (
  med: Omit<Medicine, 'id' | 'createdAt' | 'dailyStatus'>
) => {
  return addDoc(collection(getDb(), 'medicines'), {
    ...med,
    dailyStatus: {},
    createdAt: serverTimestamp(),
  });
};

export const markAsTaken = async (
  medId: string,
  medName: string,
  uid: string,
  scheduledTimes: string[]
) => {
  const today = todayStr();

  await updateDoc(doc(getDb(), 'medicines', medId), {
    [`dailyStatus.${today}`]: 'taken',
    lastTakenAt: serverTimestamp(),
  });

  await addDoc(collection(getDb(), 'history'), {
    uid,
    medicineId: medId,
    medicineName: medName,
    status: 'taken',
    scheduledTimes,
    date: today,
    timestamp: serverTimestamp(),
  });
};

export const markAsMissed = async (
  medId: string,
  medName: string,
  uid: string
) => {
  const today = todayStr();

  await updateDoc(doc(getDb(), 'medicines', medId), {
    [`dailyStatus.${today}`]: 'missed',
  });

  await addDoc(collection(getDb(), 'history'), {
    uid,
    medicineId: medId,
    medicineName: medName,
    status: 'missed',
    date: today,
    timestamp: serverTimestamp(),
  });
};

export const snoozeMedicine = async (medId: string, minutes: number) => {
  const until = new Date(Date.now() + minutes * 60 * 1000);
  return updateDoc(doc(getDb(), 'medicines', medId), {
    snoozeUntil: Timestamp.fromDate(until),
  });
};
