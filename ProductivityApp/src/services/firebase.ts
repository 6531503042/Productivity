import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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

export default app; 