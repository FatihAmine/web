// src/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { FIREBASE_CONFIG, VAPID_PUBLIC_KEY } from './config/appConfig';

export const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export { signInWithEmailAndPassword, signOut };

// Enregistre le SW FCM et retourne un token (ou null)
export async function setupFCM() {
  const supported = await isSupported();
  if (!supported) return { supported: false, token: null };

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return { supported: true, token: null };

  // Enregistrer explicitement le SW
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: VAPID_PUBLIC_KEY,
    serviceWorkerRegistration: registration
  });

  return { supported: true, token };
}

export function onForegroundMessage(cb) {
  isSupported().then((yes) => {
    if (!yes) return;
    const messaging = getMessaging(app);
    onMessage(messaging, cb);
  });
}
