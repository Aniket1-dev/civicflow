'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Card } from './Form';
import { useCountUp } from '@/hooks/use-count-up';

export function Metric({ label, value, tone }: { label: string; value: string | number; tone?: 'ok' | 'warn' | 'bad' | 'accent' }) {
  const toneColor = tone ? `var(--${tone})` : 'var(--ink)';
  const isNumeric = typeof value === 'number';
  const animated = useCountUp(isNumeric ? value : 0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  }, []);

  return (
    <Card ref={cardRef} className="p-5">
      <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">{label}</div>
      <div className="font-serif-display text-3xl" style={{ color: toneColor }}>
        {isNumeric ? animated : value}
      </div>
    </Card>
  );
}

export function Bars({ data, max }: { data: { label: string; value: number }[]; max?: number }) {
  const m = max ?? Math.max(...data.map((d) => d.value), 1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const bars = containerRef.current.querySelectorAll<HTMLElement>('[data-bar]');
    const tween = gsap.fromTo(
      bars,
      { scaleY: 0 },
      { scaleY: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06, transformOrigin: 'bottom' }
    );
    return () => { tween.kill(); };
  }, [data]);

  return (
    <div ref={containerRef} className="flex items-end gap-2.5 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div data-bar className="w-full rounded-t-sm bg-accent/70" style={{ height: `${(d.value / m) * 100}%`, minHeight: 4 }} />
          <div className="text-[10px] text-muted">{d.label}</div>
        </div>
      ))}
    </div>
  );
}
