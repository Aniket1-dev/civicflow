'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { superAdminNav } from '@/lib/client/nav-items';
import { Card } from '@/components/Form';
import { Metric, Bars } from '@/components/Metrics';

function Content() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [ref, setRef] = useState<any>(null);

  useEffect(() => {
    fetch('/api/complaints').then((r) => r.json()).then((d) => setComplaints(d.complaints ?? []));
    fetch('/api/reference').then((r) => r.json()).then(setRef);
  }, []);

  const resolved = complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
  const resolutionRate = complaints.length > 0 ? Math.round((resolved / complaints.length) * 100) : 0;

  const byDept: Record<string, number> = {};
  for (const c of complaints) byDept[c.department_name] = (byDept[c.department_name] ?? 0) + 1;

  return (
    <div className="p-5 sm:p-8 max-w-[1100px]">
      <h1 className="font-serif-display text-3xl mb-1">Platform Overview</h1>
      <p className="text-muted mb-8 text-sm">Across all departments and zones.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Metric label="Total Complaints" value={complaints.length} />
        <Metric label="Departments" value={ref?.departments?.length ?? 0} />
        <Metric label="Zones" value={ref?.zones?.length ?? 0} />
        <Metric label="Resolution Rate" value={`${resolutionRate}%`} tone="ok" />
      </div>
      <Card className="p-6">
        <div className="text-sm font-medium mb-5">Complaint Volume by Department</div>
        {Object.keys(byDept).length === 0 ? (
          <div className="text-sm text-muted">No complaints yet.</div>
        ) : (
          <Bars data={Object.entries(byDept).map(([label, value]) => ({ label: label.split(' ')[0], value }))} />
        )}
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardShell items={superAdminNav} allowedRole="SUPER_ADMIN" title="Super Admin">
      <Content />
    </DashboardShell>
  );
}
