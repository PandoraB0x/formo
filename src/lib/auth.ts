'use client';

import { useEffect, useState } from 'react';

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
  window.dispatchEvent(new Event('formo:auth'));
  return user;
}

export function logout(): void {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('formo:auth'));
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
    window.addEventListener('formo:auth', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('formo:auth', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { user, ready };
}
