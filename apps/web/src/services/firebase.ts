/**
 * Firebase Configuration
 * Used for file storage (photos, voice messages, videos)
 *
 * Setup instructions:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Go to Storage → Get Started → choose a region → Start in test mode (for now)
 * 4. Go to Project Settings (gear icon) → Your apps → Add app → Web (</>)
 * 5. Copy the firebaseConfig values into your .env file
 */

import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Prevent duplicate initialization in hot-reload dev environments
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const storage = getStorage(app);
export default app;
