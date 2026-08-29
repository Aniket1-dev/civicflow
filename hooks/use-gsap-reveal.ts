'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
function ensureRegistered() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/**
 * Fades + rises children of the container that carry [data-reveal] as they
 * scroll into view, staggered in document order. Attach the returned ref to
 * the container element.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(deps: React.DependencyList = []) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ensureRegistered();
    const container = ref.current;
    if (!container) return;
    const targets = container.querySelectorAll<HTMLElement>('[data-reveal]');
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      targets.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: (i % 6) * 0.06,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/** One-shot entrance timeline for hero-style sections (no scroll trigger, plays on mount). */
export function useEntranceTimeline<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const targets = container.querySelectorAll<HTMLElement>('[data-enter]');
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return ref;
}
