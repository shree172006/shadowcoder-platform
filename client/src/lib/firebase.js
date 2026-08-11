import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

// Firebase configuration using Vite environment variables with production shadowcoder-app fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA4FL5IDhwUdOnPulF6bZZDAyqzZcE_ob8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shadowcoder-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shadowcoder-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shadowcoder-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "838518515968",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:838518515968:web:f81c7532a23a4b2f09abe5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Enforce Google Account selector dialog
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const signUpWithEmail = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signInWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};
