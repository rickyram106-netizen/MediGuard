import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  User,
  ConfirmationResult,
  Auth,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getDb } from '../services/firebase';
import { UserProfile } from '../types';
import { createDefaultUserProfile } from '../utils/userDefaults';
import { ErrorHandler } from '../services/errors/ErrorHandler';
import { FIRESTORE } from '../config/constants';

let recaptchaVerifier: RecaptchaVerifier | null = null;

export function setupRecaptcha(
  auth: Auth,
  containerId: string
): RecaptchaVerifier {
  if (recaptchaVerifier) {
    return recaptchaVerifier;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {},
  });

  return recaptchaVerifier;
}

export async function sendOTP(
  auth: Auth,
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  try {
    const fullPhone = `+91${phoneNumber}`;

    return await signInWithPhoneNumber(
      auth,
      fullPhone,
      recaptchaVerifier
    );
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

export async function verifyOTP(
  confirmationResult: ConfirmationResult,
  otp: string
): Promise<User> {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

export async function signInAnon(auth: Auth): Promise<User> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

export async function signOutUser(auth: Auth): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

export function onAuthChange(
  auth: Auth,
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  try {
    const docRef = doc(
      getDb(),
      FIRESTORE.COLLECTIONS.USERS,
      uid
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }

    return null;
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

export async function createUserProfile(
  user: User,
  phoneNumber?: string
): Promise<UserProfile> {
  try {
    const profile = createDefaultUserProfile(
      user.uid,
      phoneNumber || user.phoneNumber || '',
      '',
      { createdAt: serverTimestamp() }
    );

    await setDoc(
      doc(getDb(), FIRESTORE.COLLECTIONS.USERS, user.uid),
      profile
    );

    return profile;
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const docRef = doc(
      getDb(),
      FIRESTORE.COLLECTIONS.USERS,
      uid
    );

    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    throw ErrorHandler.handleFirebaseError(error);
  }
}

export default {
  setupRecaptcha,
  sendOTP,
  verifyOTP,
  signInAnon,
  signOutUser,
  onAuthChange,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
};