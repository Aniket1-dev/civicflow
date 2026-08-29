'use client';
import Link from 'next/link';
import { useAccessibility } from '@/lib/client/accessibility';

export function AccessibilityBar() {
  const { scaleStep, increaseText, decreaseText, resetText, highContrast, toggleHighContrast } = useAccessibility();

  return (
    <div className="bg-ink text-bg text-xs relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[999] bg-accent text-white px-4 py-2 rounded-md font-semibold"
      >
        Skip to main content
      </a>
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-8 flex items-center justify-end gap-4">
        <span className="hidden sm:inline opacity-70">A citizen-services platform for local government</span>
        <div className="flex items-center gap-1" role="group" aria-label="Text size">
          <span className="opacity-70 mr-1 hidden xs:inline">Text</span>
          <button
            onClick={decreaseText}
            disabled={scaleStep === 0}
            aria-label="Decrease text size"
            className="w-5 h-5 grid place-items-center rounded hover:bg-bg/20 disabled:opacity-30 font-mono"
          >
            A-
          </button>
          <button
            onClick={resetText}
            aria-label="Reset text size"
            className="w-5 h-5 grid place-items-center rounded hover:bg-bg/20 font-mono"
          >
            A
          </button>
          <button
            onClick={increaseText}
            disabled={scaleStep === 2}
            aria-label="Increase text size"
            className="w-5 h-5 grid place-items-center rounded hover:bg-bg/20 disabled:opacity-30 font-mono"
          >
            A+
          </button>
        </div>
        <button
          onClick={toggleHighContrast}
          aria-pressed={highContrast}
          className="hover:underline underline-offset-2"
        >
          {highContrast ? 'Standard contrast' : 'High contrast'}
        </button>
        <Link href="/accessibility" className="hover:underline underline-offset-2 hidden sm:inline">
          Screen Reader Access
        </Link>
      </div>
    </div>
  );
}
