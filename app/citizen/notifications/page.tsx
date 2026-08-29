'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { citizenNav } from '@/lib/client/nav-items';
import { Card } from '@/components/Form';
import { fmtDate } from '@/lib/complaint-utils';
import { IconBell } from '@/components/Icons';

function Content() {
  const [items, setItems] = useState<{ text: string; at: string }[]>([]);
  useEffect(() => {
    fetch('/api/complaints').then((r) => r.json()).then((d) => {
      const events: { text: string; at: string }[] = [];
      for (const c of d.complaints ?? []) {
        events.push({ text: `${c.title} (${c.code}) is currently ${c.status.replace('_', ' ').toLowerCase()}.`, at: c.created_at });
      }
      events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
      setItems(events.slice(0, 10));
    });
  }, []);

  return (
    <div className="p-5 sm:p-8 max-w-[750px]">
      <h1 className="font-serif-display text-3xl mb-6">Notifications</h1>
      <div className="space-y-3">
        {items.length === 0 && <div className="text-sm text-muted">Nothing yet — updates on your complaints will show up here.</div>}
        {items.map((it, i) => (
          <Card key={i} className="p-4 flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-accentSoft text-accent flex items-center justify-center shrink-0"><IconBell size={15} /></span>
            <div className="flex-1">
              <div className="text-sm">{it.text}</div>
              <div className="text-xs text-muted mt-1">{fmtDate(it.at)}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardShell items={citizenNav} allowedRole="CITIZEN">
      <Content />
    </DashboardShell>
  );
}
