import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - replace with your own Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyBJRJ2-vMYo0Nhtq0LXDUlK10ZTv2mWVRk",
  authDomain: "personal-finance-tracker-ed1a4.firebaseapp.com",
  projectId: "personal-finance-tracker-ed1a4",
  storageBucket: "personal-finance-tracker-ed1a4.firebasestorage.app",
  messagingSenderId: "174294241564",
  appId: "1:174294241564:web:0fd939edc87d0eff836ad9",
  measurementId: "G-2R1XN7YYW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
