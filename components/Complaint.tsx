'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { fmtDate, slaRemaining } from '@/lib/complaint-utils';
import { Card } from './Form';
import { StatusBadge, PriorityBadge } from './Feedback';
import { IconClock } from './Icons';

export function ComplaintCard({ c, basePath }: { c: any; basePath: string }) {
  const router = useRouter();
  const sla = slaRemaining(c.sla_deadline);
  const cardRef = useRef<HTMLDivElement | null>(null);

  function onEnter() {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { y: -3, boxShadow: '0 10px 24px -12px rgba(23,23,23,0.18)', duration: 0.25, ease: 'power2.out' });
  }
  function onLeave() {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.3, ease: 'power2.out' });
  }

  return (
    <Card
      ref={cardRef}
      data-reveal
      className="p-5 border-accent/0 hover:border-accent/50 transition-colors cursor-pointer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={() => router.push(`${basePath}/${c.id}`)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-mono text-[11px] text-muted mb-1">{c.code}</div>
          <div className="font-medium">{c.title}</div>
        </div>
        <PriorityBadge priority={c.priority} />
      </div>
      <div className="text-sm text-muted mb-3">{c.category_name} · {c.address}</div>
      <div className="flex items-center justify-between">
        <StatusBadge status={c.status} />
        {!['RESOLVED', 'CLOSED'].includes(c.status) && (
          <span className={`text-xs font-medium flex items-center gap-1 ${sla.overdue ? 'text-bad' : 'text-muted'}`}>
            <IconClock size={13} />{sla.text}
          </span>
        )}
      </div>
    </Card>
  );
}

export function Timeline({ items }: { items: { label: string; at: string | null }[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const dots = ref.current.querySelectorAll('[data-dot]');
    const rows = ref.current.querySelectorAll('[data-row]');
    const tl = gsap.timeline();
    tl.fromTo(dots, { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(2)', stagger: 0.09 }, 0);
    tl.fromTo(rows, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', stagger: 0.09 }, 0);
    return () => { tl.kill(); };
  }, [items]);

  return (
    <div ref={ref} className="space-y-0">
      {items.map((it, i) => (
        <div key={i} data-row className="flex gap-4">
          <div className="flex flex-col items-center">
            <span data-dot className={`w-3 h-3 rounded-full mt-1 ${it.at ? 'bg-accent' : 'bg-line'}`} />
            {i < items.length - 1 && <span className="w-px flex-1 bg-line my-1" />}
          </div>
          <div className="pb-6">
            <div className={`text-sm font-medium ${!it.at && 'text-muted'}`}>{it.label}</div>
            <div className="text-xs text-muted mt-0.5">{it.at ? fmtDate(it.at) : 'Pending'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
