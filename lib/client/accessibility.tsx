'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const SCALE_STEPS = [1, 1.125, 1.25] as const; // Normal, Large, Larger
type ScaleStep = 0 | 1 | 2;

interface A11yCtxValue {
  scaleStep: ScaleStep;
  increaseText: () => void;
  decreaseText: () => void;
  resetText: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const A11yCtx = createContext<A11yCtxValue | null>(null);

function apply(scaleStep: ScaleStep, highContrast: boolean) {
  document.documentElement.style.setProperty('--font-scale', String(SCALE_STEPS[scaleStep]));
  document.documentElement.setAttribute('data-contrast', highContrast ? 'high' : 'normal');
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Always start at defaults so the first client render matches the server
  // markup — the blocking inline script in layout.tsx applies the saved
  // preference before paint, this just syncs React's own state afterwards.
  const [scaleStep, setScaleStep] = useState<ScaleStep>(0);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    try {
      const savedScale = Number(localStorage.getItem('civicflow-text-scale') ?? '0') as ScaleStep;
      const savedContrast = localStorage.getItem('civicflow-contrast') === 'high';
      if (savedScale === 0 || savedScale === 1 || savedScale === 2) setScaleStep(savedScale);
      setHighContrast(savedContrast);
    } catch {
      // localStorage unavailable (e.g. private browsing) — fall back to defaults.
    }
  }, []);

  useEffect(() => {
    apply(scaleStep, highContrast);
    try {
      localStorage.setItem('civicflow-text-scale', String(scaleStep));
      localStorage.setItem('civicflow-contrast', highContrast ? 'high' : 'normal');
    } catch {
      // Ignore storage failures — the preference still applies for this session.
    }
  }, [scaleStep, highContrast]);

  const value: A11yCtxValue = {
    scaleStep,
    increaseText: () => setScaleStep((s) => (s < 2 ? ((s + 1) as ScaleStep) : s)),
    decreaseText: () => setScaleStep((s) => (s > 0 ? ((s - 1) as ScaleStep) : s)),
    resetText: () => setScaleStep(0),
    highContrast,
    toggleHighContrast: () => setHighContrast((h) => !h),
  };

  return <A11yCtx.Provider value={value}>{children}</A11yCtx.Provider>;
}

export function useAccessibility(): A11yCtxValue {
  const ctx = useContext(A11yCtx);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
