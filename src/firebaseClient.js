// src/firebaseClient.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  signOut as _signOut,
} from 'firebase/auth';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from 'firebase/messaging';
import { FIREBASE_CONFIG, VAPID_PUBLIC_KEY } from './config/appConfig';

export const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);

// 🔐 rester connecté après F5
setPersistence(auth, browserLocalPersistence);

// ✅ promesse qui se résout au **premier** onAuthStateChanged (réhydratation)
let _resolved = false;
let _resolveInit;
const _authInit = new Promise((res) => { _resolveInit = res; });

onAuthStateChanged(auth, () => {
  if (!_resolved) {
    _resolved = true;
    _resolveInit(true);
  }
});

// à utiliser partout où tu dois attendre l’hydratation
export const waitForAuthInit = () => _authInit;

// helpers login/logout
export const signInWithEmailAndPassword = (auth, email, password) =>
  _signInWithEmailAndPassword(auth, email, password);
export const signOut = () => _signOut(auth);

// --- FCM utils (inchangé) ---
export async function setupFCM() {
  const supported = await isSupported();
  if (!supported) return { supported: false, token: null };

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return { supported: true, token: null };

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
