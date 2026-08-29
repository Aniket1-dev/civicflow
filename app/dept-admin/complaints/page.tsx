'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/DashboardShell';
import { deptAdminNav } from '@/lib/client/nav-items';
import { Card } from '@/components/Form';
import { StatusBadge, PriorityBadge } from '@/components/Feedback';
import { ComplaintCard } from '@/components/Complaint';
import { slaRemaining } from '@/lib/complaint-utils';

function Content() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetch('/api/complaints').then((r) => r.json()).then((d) => setComplaints(d.complaints ?? []));
  }, []);

  return (
    <div className="p-5 sm:p-8 max-w-[1100px]">
      <h1 className="font-serif-display text-3xl mb-6">Complaints</h1>
      <div className="hidden sm:block">
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted uppercase tracking-wide border-b border-line">
                {['ID', 'Problem', 'Zone', 'Priority', 'Status', 'SLA'].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => {
                const sla = slaRemaining(c.sla_deadline);
                return (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-line/20 cursor-pointer" onClick={() => router.push(`/dept-admin/complaints/${c.id}`)}>
                    <td className="px-5 py-3 font-mono text-xs">{c.code}</td>
                    <td className="px-5 py-3">{c.title}</td>
                    <td className="px-5 py-3 text-muted">{c.zone_name}</td>
                    <td className="px-5 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className={`px-5 py-3 ${sla.overdue ? 'text-bad' : 'text-muted'}`}>{['RESOLVED', 'CLOSED'].includes(c.status) ? '—' : sla.text}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="sm:hidden grid gap-4">
        {complaints.map((c) => <ComplaintCard key={c.id} c={c} basePath="/dept-admin/complaints" />)}
      </div>
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
