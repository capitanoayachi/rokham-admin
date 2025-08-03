import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const current = supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (!session) return <Navigate to="/admin" replace />;
  return children;
}
