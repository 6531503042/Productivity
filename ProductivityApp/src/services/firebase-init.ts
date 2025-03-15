import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWnf98y6vTWY-F9auJOAnhzY9HIBjTO30",
  authDomain: "productivity-bengi.firebaseapp.com",
  projectId: "productivity-bengi",
  storageBucket: "productivity-bengi.firebasestorage.app",
  messagingSenderId: "783325549598",
  appId: "1:783325549598:web:063729197846d45080ca0f",
  measurementId: "G-JNPFERMX6G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable offline persistence for Firestore
const enablePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.log('Firestore persistence enabled');
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firestore persistence unavailable - multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support persistence
      console.warn('Firestore persistence unavailable - unsupported browser');
    } else {
      console.error('Error enabling Firestore persistence:', err);
    }
  }
};

// Use emulators in development
const useEmulators = () => {
  if (__DEV__) {
    try {
      // Uncomment these lines to use Firebase emulators
      // connectAuthEmulator(auth, 'http://localhost:9099');
      // connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('Firebase emulators connected');
    } catch (err) {
      console.error('Error connecting to Firebase emulators:', err);
    }
  }
};

// Initialize Firebase features
const initializeFirebase = async () => {
  try {
    await enablePersistence();
    useEmulators();
    console.log('Firebase initialized successfully');
  } catch (err) {
    console.error('Error initializing Firebase:', err);
  }
};

// Call initialization
initializeFirebase();

export default app;