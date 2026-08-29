'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/** Animates a numeric display value counting up to `target` whenever it changes. */
export function useCountUp(target: number, duration = 0.8) {
  const [display, setDisplay] = useState(0);
  const proxy = useRef({ val: 0 });

  useEffect(() => {
    const obj = proxy.current;
    const tween = gsap.to(obj, {
      val: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => setDisplay(Math.round(obj.val)),
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}
