import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { getDb } from './firebase';
import { FamilyContact } from '../types';

export const subscribeToContacts = (uid: string, callback: (contacts: FamilyContact[]) => void) => {
  const q = query(
    collection(getDb(), 'family'), 
    where('uid', '==', uid), 
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    const contacts = snap.docs.map(d => ({ ...d.data(), id: d.id } as FamilyContact));
    callback(contacts);
  });
};

export const saveContact = async (contact: Omit<FamilyContact, 'id' | 'createdAt'>) => {
  return addDoc(collection(getDb(), 'family'), {
    ...contact,
    createdAt: serverTimestamp()
  });
};
