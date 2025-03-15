import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInAnonymously, AuthError } from 'firebase/auth';
import { auth } from '../services/firebase';
import { initializeDefaultCategories } from '../services/firestore';
import { Alert, Platform } from 'react-native';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signInAnonymouslyWithRetry: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  error: null,
  signInAnonymouslyWithRetry: async () => {},
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to display error messages
  const showError = (message: string) => {
    console.error(message);
    if (Platform.OS !== 'web') {
      Alert.alert('Authentication Error', message);
    }
  };

  // Function to sign in anonymously with retry logic
  const signInAnonymouslyWithRetry = async (retries = 3): Promise<void> => {
    try {
      console.log('Attempting anonymous sign-in...');
      await signInAnonymously(auth);
      console.log('Anonymous sign-in successful');
      setError(null);
    } catch (err) {
      const authError = err as AuthError;
      console.error('Error signing in anonymously:', authError.code, authError.message);
      
      // Handle specific error codes
      if (authError.code === 'auth/operation-not-allowed') {
        const errorMsg = 'Anonymous authentication is not enabled in Firebase. Please enable it in the Firebase console.';
        showError(errorMsg);
        setError(new Error(errorMsg));
      } else if (authError.code === 'auth/network-request-failed') {
        const errorMsg = 'Network error. Please check your internet connection.';
        showError(errorMsg);
        if (retries > 0) {
          const delay = Math.pow(2, 4 - retries) * 1000;
          console.log(`Retrying anonymous sign-in in ${delay}ms...`);
          setTimeout(() => signInAnonymouslyWithRetry(retries - 1), delay);
        } else {
          setError(authError);
        }
      } else if (retries > 0) {
        // Retry with exponential backoff for other errors
        const delay = Math.pow(2, 4 - retries) * 1000;
        console.log(`Retrying anonymous sign-in in ${delay}ms...`);
        setTimeout(() => signInAnonymouslyWithRetry(retries - 1), delay);
      } else {
        const errorMsg = `Authentication failed: ${authError.message}`;
        showError(errorMsg);
        setError(authError);
      }
    }
  };

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        console.log('Initializing Firebase...');
        
        // Initialize default categories
        await initializeDefaultCategories().catch(err => {
          console.warn('Error initializing default categories:', err);
          // Continue even if categories initialization fails
        });
        
        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            console.log('Auth state changed:', user ? 'User signed in' : 'No user');
            setUser(user);
            setLoading(false);
          },
          (error) => {
            console.error('Auth state change error:', error);
            setError(error);
            setLoading(false);
          }
        );

        // If no user is signed in, sign in anonymously
        if (!auth.currentUser) {
          console.log('No current user, attempting anonymous sign-in');
          await signInAnonymouslyWithRetry();
        }

        return unsubscribe;
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setError(error as Error);
        setLoading(false);
      }
    };

    initializeFirebase();
  }, []);

  const value = {
    user,
    loading,
    error,
    signInAnonymouslyWithRetry,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext; 