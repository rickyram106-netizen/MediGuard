import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  User
} from 'firebase/auth';
import { getAuthService, getDb } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types';
import { createDefaultUserProfile } from '../utils/userDefaults';

export const setupRecaptcha = (containerId: string) => {
  if (!(window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(getAuthService(), containerId, {
      size: 'invisible',
      callback: () => {}
    });
  }
};

export const sendOTP = async (phone: string) => {
  const fullPhone = `+91${phone}`;
  const verifier = (window as any).recaptchaVerifier;
  const confirmationResult = await signInWithPhoneNumber(getAuthService(), fullPhone, verifier);
  return confirmationResult;
};

export const loginAnonymously = () => signInAnonymously(getAuthService());

export const logout = () => signOut(getAuthService());

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(getAuthService(), callback);
};

export const getUserData = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(getDb(), 'users', uid));
  if (snap.exists()) return snap.data() as UserProfile;
  return null;
};

export const createInitialUser = async (user: User): Promise<UserProfile> => {
  const profile = createDefaultUserProfile(
    user.uid,
    user.phoneNumber || '',
    '',
    { createdAt: serverTimestamp() }
  );
  await setDoc(doc(getDb(), 'users', user.uid), profile);
  return profile;
};
