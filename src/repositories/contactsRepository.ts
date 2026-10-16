/**
 * Contacts Repository
 * Handles all Firestore operations for family contacts
 */

import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Firestore,
  Query,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '../services/firebase';
import { FamilyContact } from '../types';
import { ErrorHandler } from '../services/errors/ErrorHandler';
import { FIRESTORE } from '../config/constants';

/**
 * Subscribe to user's family contacts
 */
export function subscribeToContacts(
  uid: string,
  onSnapshot_: (contacts: FamilyContact[]) => void
): Unsubscribe {
  try {
    const q: Query = query(
      collection(getDb(), FIRESTORE.COLLECTIONS.FAMILY),
      where('uid', '==', uid),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const contacts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as FamilyContact));

        onSnapshot_(contacts);
      },
      (error) => {
        console.error('[ContactsRepository] Subscription error:', error);
        throw ErrorHandler.handleFirebaseError(error);
      }
    );
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Add new family contact
 */
export async function addContact(
  contact: Omit<FamilyContact, 'id' | 'createdAt'>
): Promise<string> {
  try {
    const contactDoc = {
      ...contact,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(getDb(), FIRESTORE.COLLECTIONS.FAMILY),
      contactDoc
    );

    return docRef.id;
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Update family contact
 */
export async function updateContact(
  contactId: string,
  updates: Partial<FamilyContact>
): Promise<void> {
  try {
    const docRef = doc(getDb(), FIRESTORE.COLLECTIONS.FAMILY, contactId);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Delete family contact
 */
export async function deleteContact(contactId: string): Promise<void> {
  try {
    await deleteDoc(doc(getDb(), FIRESTORE.COLLECTIONS.FAMILY, contactId));
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

/**
 * Record last alert timestamp for contact
 */
export async function recordContactAlert(
  contactId: string
): Promise<void> {
  try {
    const docRef = doc(getDb(), FIRESTORE.COLLECTIONS.FAMILY, contactId);
    await updateDoc(docRef, {
      lastAlerted: serverTimestamp(),
    });
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

export default {
  subscribeToContacts,
  addContact,
  updateContact,
  deleteContact,
  recordContactAlert,
};
