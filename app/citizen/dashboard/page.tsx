'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/DashboardShell';
import { citizenNav } from '@/lib/client/nav-items';
import { useSession } from '@/lib/client/session';
import { Metric } from '@/components/Metrics';
import { ComplaintCard } from '@/components/Complaint';
import { useScrollReveal } from '@/hooks/use-gsap-reveal';

function DashboardContent() {
  const { user } = useSession();
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useScrollReveal<HTMLDivElement>([loading]);

  useEffect(() => {
    fetch('/api/complaints').then((r) => r.json()).then((d) => { setComplaints(d.complaints ?? []); setLoading(false); });
  }, []);

  const counts = {
    active: complaints.filter((c) => c.status !== 'CLOSED').length,
    progress: complaints.filter((c) => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
    awaiting: complaints.filter((c) => c.status === 'RESOLVED').length,
  };

  return (
    <div className="p-5 sm:p-8 max-w-[1100px]">
      <h1 className="font-serif-display text-3xl mb-1">Good to see you, {user?.name?.split(' ')[0]}.</h1>
      <p className="text-muted mb-8">Here&rsquo;s where things stand across your reports.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Metric label="Active Complaints" value={counts.active} />
        <Metric label="In Progress" value={counts.progress} tone="warn" />
        <Metric label="Resolved" value={counts.resolved} tone="ok" />
        <Metric label="Awaiting Verification" value={counts.awaiting} tone="accent" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif-display text-xl">My Complaints</h2>
        <button className="text-sm text-accent font-medium" onClick={() => router.push('/citizen/complaints')}>View all</button>
      </div>
      {loading ? (
        <div className="text-sm text-muted">Loading…</div>
      ) : complaints.length === 0 ? (
        <div className="text-sm text-muted">No complaints yet — file your first report to get started.</div>
      ) : (
        <div ref={gridRef} className="grid sm:grid-cols-2 gap-4">
          {complaints.slice(0, 4).map((c) => <ComplaintCard key={c.id} c={c} basePath="/citizen/complaints" />)}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <DashboardShell items={citizenNav} allowedRole="CITIZEN">
      <DashboardContent />
    </DashboardShell>
  );
}
