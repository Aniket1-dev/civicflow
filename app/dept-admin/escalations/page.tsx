'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { deptAdminNav } from '@/lib/client/nav-items';
import { Card } from '@/components/Form';
import { Metric } from '@/components/Metrics';
import { slaRemaining } from '@/lib/complaint-utils';

function Content() {
  const [complaints, setComplaints] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/complaints').then((r) => r.json()).then((d) => setComplaints((d.complaints ?? []).filter((c: any) => !['RESOLVED', 'CLOSED'].includes(c.status))));
  }, []);

  const withSla = complaints.map((c) => ({ ...c, sla: slaRemaining(c.sla_deadline) }));
  const breached = withSla.filter((c) => c.sla.overdue);
  const atRisk = withSla.filter((c) => !c.sla.overdue && new Date(c.sla_deadline).getTime() - Date.now() < 6 * 3600000);
  const critical = withSla.filter((c) => c.priority === 'HIGH' && !c.sla.overdue && !atRisk.includes(c));

  return (
    <div className="p-5 sm:p-8 max-w-[1000px]">
      <h1 className="font-serif-display text-3xl mb-6">Escalations</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Metric label="Breached" value={breached.length} tone="bad" />
        <Metric label="At Risk" value={atRisk.length} tone="warn" />
        <Metric label="Critical" value={critical.length} tone="accent" />
      </div>
      {([['Breached SLA', breached], ['At Risk (within 6h)', atRisk], ['Critical Priority', critical]] as const).map(([label, list]) => (
        <div key={label} className="mb-8">
          <div className="text-sm font-medium mb-3">{label}</div>
          {list.length === 0 ? (
            <div className="text-sm text-muted">None right now.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {list.map((c) => (
                <Card key={c.id} className="p-4">
                  <div className="font-mono text-[11px] text-muted mb-1">{c.code}</div>
                  <div className="font-medium text-sm">{c.title}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <DashboardShell items={deptAdminNav} allowedRole="DEPT_ADMIN">
      <Content />
    </DashboardShell>
  );
}
