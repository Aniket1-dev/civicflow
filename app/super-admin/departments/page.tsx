'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { superAdminNav } from '@/lib/client/nav-items';
import { Card } from '@/components/Form';

function Content() {
  const [departments, setDepartments] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/reference').then((r) => r.json()).then((d) => setDepartments(d.departments ?? []));
  }, []);

  return (
    <div className="p-5 sm:p-8 max-w-[1000px]">
      <h1 className="font-serif-display text-3xl mb-6">Departments</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {departments.map((d) => (
          <Card key={d.id} className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">{d.name}</div>
              <span className="font-mono text-xs text-muted">{d.code}</span>
            </div>
            <div className="text-sm text-muted">SLA window: {d.sla_hours}h</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardShell items={superAdminNav} allowedRole="SUPER_ADMIN">
      <Content />
    </DashboardShell>
  );
}
