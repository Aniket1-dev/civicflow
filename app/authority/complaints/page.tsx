'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { AuthorityGate } from '@/components/AuthorityGate';
import { authorityNav } from '@/lib/client/nav-items';
import { ComplaintListView } from '@/components/ComplaintListView';

function Content() {
  const [complaints, setComplaints] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/complaints').then((r) => r.json()).then((d) => setComplaints(d.complaints ?? []));
  }, []);
  return <ComplaintListView complaints={complaints} basePath="/authority/complaints" title="My Assigned" />;
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
