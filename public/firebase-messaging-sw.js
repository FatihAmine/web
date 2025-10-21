/* public/firebase-messaging-sw.js */
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyABctd_A2aiT5mRGcoYkTHNO8XiBTOggFE',
  projectId: 'myc-docs',
  appId: '1:850912217509:web:3d6199e9d60fead9e1004c',
  messagingSenderId: '850912217509'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Notification';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icon.png' // ⚠️ assure-toi que ce fichier existe dans /public
  };
  self.registration.showNotification(title, options);
});
