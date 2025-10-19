import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDTgTcfjnyS3dZDarsWe1a_9Lb3i7f4WSY",
  authDomain: "ynov-document.firebaseapp.com",
  projectId: "ynov-document",
  storageBucket: "ynov-document.firebasestorage.app",
  messagingSenderId: "613520945903",
  appId: "1:613520945903:web:eaacf58fcb641c759a211a",
  measurementId: "G-HLQVCZLJN2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
export const getIdToken = async () => {
  if (!auth.currentUser) {
    // Optionally: You could wait (onAuthStateChanged) if user is not set yet
    return null;
  }
  return await auth.currentUser.getIdToken(/*forceRefresh=*/true);
};