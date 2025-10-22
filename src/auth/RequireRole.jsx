// src/auth/RequireRole.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../api';

export default function RequireRole({ allow = [] }) {
  const [ready, setReady] = useState(false);
  const [ok, setOk]       = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/me'); // nécessite l'ID token (interceptor)
        if (!mounted) return;
        setOk(allow.length === 0 || allow.includes(data.role));
      } catch {
        if (!mounted) return;
        setOk(false);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => { mounted = false; };
  }, [allow]);

  if (!ready) return <div style={{height:'100vh',display:'grid',placeItems:'center'}}>Chargement…</div>;
  return ok ? <Outlet /> : <Navigate to="/login" replace />;
}
