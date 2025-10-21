// src/api.js
import axios from 'axios';
import { auth } from './firebaseClient';
import { API_BASE_URL } from './config/appConfig';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(); // refresh géré par SDK
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error.config;

    if (status === 401 && auth.currentUser && !original?._retry) {
      try {
        original._retry = true;
        await auth.currentUser.getIdToken(true); // force refresh
        return api(original);
      } catch (_) {/* on enchaîne vers signOut */}
    }

    if (status === 401) {
      try { await auth.signOut(); } catch (_) {}
      window.location.href = '/admin/login';   // ✅ bonne route
    }
    return Promise.reject(error);
  }
);

export default api;
