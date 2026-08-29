'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { AuthorityGate } from '@/components/AuthorityGate';
import { authorityNav } from '@/lib/client/nav-items';
import { useSession } from '@/lib/client/session';
import { Metric } from '@/components/Metrics';
import { ComplaintCard } from '@/components/Complaint';
import { EmptyState } from '@/components/Feedback';
import { IconCheckCircle, IconList } from '@/components/Icons';
import { slaRemaining } from '@/lib/complaint-utils';
import { useScrollReveal } from '@/hooks/use-gsap-reveal';

function Content() {
  const { user } = useSession();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useScrollReveal<HTMLDivElement>([loading]);

  useEffect(() => {
    fetch('/api/complaints').then((r) => r.json()).then((d) => { setComplaints(d.complaints ?? []); setLoading(false); });
  }, []);

  const counts = {
    New: complaints.filter((c) => c.status === 'ASSIGNED').length,
    'In Progress': complaints.filter((c) => c.status === 'IN_PROGRESS').length,
    Resolved: complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
    Overdue: complaints.filter((c) => !['RESOLVED', 'CLOSED'].includes(c.status) && slaRemaining(c.sla_deadline).overdue).length,
  };

  return (
    <div className="p-5 sm:p-8 max-w-[1100px]">
      <h1 className="font-serif-display text-3xl mb-1">Good to see you, {user?.name?.split(' ')[0]}.</h1>
      <p className="text-muted mb-1 text-sm">{user?.designation} · {user?.departmentName}</p>
      <div className="flex items-center gap-2 mb-8">
        <span className="flex items-center gap-1 text-ok text-sm font-medium"><IconCheckCircle size={14} />Verified Authority</span>
        <span className="font-mono text-xs text-muted">{user?.authorityCode}</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Object.entries(counts).map(([k, v]) => (
          <Metric key={k} label={k} value={v} tone={k === 'Overdue' ? 'bad' : k === 'Resolved' ? 'ok' : k === 'In Progress' ? 'warn' : undefined} />
        ))}
      </div>
      <h2 className="font-serif-display text-xl mb-4">My Assigned Complaints</h2>
      {loading ? <div className="text-sm text-muted">Loading…</div> : (
        <div ref={gridRef} className="grid sm:grid-cols-2 gap-4">
          {complaints.length === 0 && <EmptyState icon={<IconList size={20} />} title="Nothing assigned yet" sub="New complaints routed to you will show up here." />}
          {complaints.map((c) => <ComplaintCard key={c.id} c={c} basePath="/authority/complaints" />)}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <AuthorityGate>
      <DashboardShell items={authorityNav} allowedRole="AUTHORITY">
        <Content />
      </DashboardShell>
    </AuthorityGate>
  );
}
