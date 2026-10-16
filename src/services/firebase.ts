import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  initializeFirestore,
  Firestore,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import { FEATURES } from '../config/environment';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

export function initializeFirebase(): void {
  if (!FEATURES.enableFirebase || app) {
    return;
  }

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    db = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      ignoreUndefinedProperties: true,
    });

    storage = getStorage(app);

    console.log('[Firebase] Initialized successfully');
  } catch (error) {
    app = undefined;
    auth = undefined;
    db = undefined;
    storage = undefined;

    console.error('[Firebase] Initialization failed:', error);
    throw error;
  }
}

export function getApp(): FirebaseApp {
  if (!FEATURES.enableFirebase) {
    throw new Error('Firebase is disabled');
  }

  if (!app) {
    throw new Error('Firebase has not been initialized');
  }

  return app;
}

export function getAuthService(): Auth {
  if (!FEATURES.enableFirebase) {
    throw new Error('Firebase is disabled');
  }

  if (!auth) {
    throw new Error('Firebase has not been initialized');
  }

  return auth;
}

export function getDb(): Firestore {
  if (!FEATURES.enableFirebase) {
    throw new Error('Firebase is disabled');
  }

  if (!db) {
    throw new Error('Firebase has not been initialized');
  }

  return db;
}

export function getStorageService(): FirebaseStorage {
  if (!FEATURES.enableFirebase) {
    throw new Error('Firebase is disabled');
  }

  if (!storage) {
    throw new Error('Firebase has not been initialized');
  }

  return storage;
}

export function getFirebaseServices(): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
} {
  if (!app || !auth || !db || !storage) {
    throw new Error('Firebase has not been initialized');
  }

  return {
    app,
    auth,
    db,
    storage,
  };
}