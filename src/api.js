// src/api.js
import axios from 'axios';
import { auth } from './firebaseClient';
import { API_BASE_URL } from './config/appConfig';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
