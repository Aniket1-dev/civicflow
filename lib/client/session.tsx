'use client';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'CITIZEN' | 'AUTHORITY' | 'DEPT_ADMIN' | 'SUPER_ADMIN';
  authorityStatus?: string;
  authorityId?: string;
  authorityCode?: string;
  designation?: string;
  departmentId?: string;
  departmentName?: string;
  zoneName?: string;
}

interface SessionCtxValue {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionCtx = createContext<SessionCtxValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    setUser(data.user);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return <SessionCtx.Provider value={{ user, loading, refresh, logout }}>{children}</SessionCtx.Provider>;
}

export function useSession(): SessionCtxValue {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
