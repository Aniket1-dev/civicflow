'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
interface ThemeCtxValue { theme: Theme; toggle: () => void; }
const ThemeCtx = createContext<ThemeCtxValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start at 'light' so the first client render matches the server-rendered
  // markup (no hydration mismatch). The blocking inline script in layout.tsx has
  // already set the correct data-theme attribute pre-paint, so page colors (which
  // are driven by that attribute via CSS, not by this state) never flash — only
  // theme-aware React output (like the toggle icon) syncs a moment after mount.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as Theme | null;
    if (current === 'dark' || current === 'light') setTheme(current);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('civicflow-theme', theme);
    // Keep the browser chrome (mobile address bar / status bar) in sync with
    // the user's actual chosen theme, not just their OS preference. Next.js
    // renders one <meta name="theme-color"> per media query in the viewport
    // config, so override all of them and drop the media condition — the
    // user's explicit choice should win over prefers-color-scheme.
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    metas.forEach((meta) => {
      meta.setAttribute('content', theme === 'dark' ? '#090b12' : '#ffffff');
      meta.removeAttribute('media');
    });
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme(): ThemeCtxValue {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
