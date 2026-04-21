'use client';

import { useEffect, useState } from 'react';
import { emit, on } from './events';

const KEY = 'formo:user';

export interface AuthUser {
  email: string;
  name: string;
  loggedInAt: string;
}

function read(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function loginAs(email: string, name?: string): AuthUser {
  const user: AuthUser = {
    email: email.trim().toLowerCase(),
    name: (name?.trim() || email.split('@')[0] || 'Õpetaja'),
    loggedInAt: new Date().toISOString(),
  };
  window.localStorage.setItem(KEY, JSON.stringify(user));
  emit('formo:auth');
  return user;
}

export function logout(): void {
  window.localStorage.removeItem(KEY);
  emit('formo:auth');
}

export function useAuth(): { user: AuthUser | null; ready: boolean } {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(read());
    setReady(true);
    function sync() {
      setUser(read());
    }
    const off = on('formo:auth', sync);
    window.addEventListener('storage', sync);
    return () => {
      off();
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { user, ready };
}
