// src/auth/RequireAuth.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth, waitForAuthInit } from '../firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

export default function RequireAuth() {
  const [ready, setReady] = useState(false);
  const [user, setUser]   = useState(null);

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      // ⭐ attend la réhydratation Firebase au premier chargement
      await waitForAuthInit();
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u || null);
        setReady(true);
      });
    })();
    return () => unsub && unsub();
  }, []);

  if (!ready) return <div style={{height:'100vh',display:'grid',placeItems:'center'}}>Chargement…</div>;
  if (!user)   return <Navigate to="/login" replace />;
  return <Outlet />;
}
