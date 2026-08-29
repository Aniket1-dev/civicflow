'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { DashboardShell } from '@/components/DashboardShell';
import { deptAdminNav } from '@/lib/client/nav-items';
import { useSession } from '@/lib/client/session';
import { Card } from '@/components/Form';
import { Metric, Bars } from '@/components/Metrics';
import { slaRemaining } from '@/lib/complaint-utils';

function Content() {
  const { user } = useSession();
  const [complaints, setComplaints] = useState<any[]>([]);
  const ringRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    fetch('/api/complaints').then((r) => r.json()).then((d) => setComplaints(d.complaints ?? []));
  }, []);

  const counts = {
    Total: complaints.length,
    Pending: complaints.filter((c) => c.status === 'ASSIGNED').length,
    'In Progress': complaints.filter((c) => c.status === 'IN_PROGRESS').length,
    Resolved: complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
    Overdue: complaints.filter((c) => !['RESOLVED', 'CLOSED'].includes(c.status) && slaRemaining(c.sla_deadline).overdue).length,
  };

  const byCategory: Record<string, number> = {};
  for (const c of complaints) byCategory[c.category_name] = (byCategory[c.category_name] ?? 0) + 1;

  const slaOk = complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status) && !slaRemaining(c.sla_deadline).overdue).length;
  const slaTotal = complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
  const slaPct = slaTotal > 0 ? Math.round((slaOk / slaTotal) * 100) : 100;

  useEffect(() => {
    if (!ringRef.current) return;
    gsap.fromTo(
      ringRef.current,
      { strokeDasharray: '0 100' },
      { strokeDasharray: `${slaPct} ${100 - slaPct}`, duration: 1, ease: 'power2.out', delay: 0.15 }
    );
  }, [slaPct]);

  return (
    <div className="p-5 sm:p-8 max-w-[1100px]">
      <h1 className="font-serif-display text-3xl mb-1">{user?.departmentName}</h1>
      <p className="text-muted mb-8 text-sm">Department Admin overview</p>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {Object.entries(counts).map(([k, v]) => (
          <Metric key={k} label={k} value={v} tone={k === 'Overdue' ? 'bad' : k === 'Resolved' ? 'ok' : undefined} />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium mb-5">Complaints by Category</div>
          {Object.keys(byCategory).length === 0 ? (
            <div className="text-sm text-muted">No complaints yet.</div>
          ) : (
            <Bars data={Object.entries(byCategory).map(([label, value]) => ({ label: label.split(' ')[0], value }))} />
          )}
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium mb-5">SLA Compliance</div>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--line)" strokeWidth="3" />
                <circle ref={ringRef} cx="18" cy="18" r="15.5" fill="none" stroke="var(--ok)" strokeWidth="3"
                  strokeDasharray="0 100" pathLength={100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-serif-display text-xl">{slaPct}%</div>
            </div>
            <div className="text-sm text-muted">of resolved complaints in {user?.departmentName} finished within SLA.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardShell items={deptAdminNav} allowedRole="DEPT_ADMIN" title="Department Admin">
      <Content />
    </DashboardShell>
  );
}
