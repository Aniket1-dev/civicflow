'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { citizenNav } from '@/lib/client/nav-items';
import { ComplaintListView } from '@/components/ComplaintListView';

function Content() {
  const [complaints, setComplaints] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/complaints').then((r) => r.json()).then((d) => setComplaints(d.complaints ?? []));
  }, []);
  return <ComplaintListView complaints={complaints} basePath="/citizen/complaints" title="My Complaints" />;
}

export default function Page() {
  return (
    <DashboardShell items={citizenNav} allowedRole="CITIZEN">
      <Content />
    </DashboardShell>
  );
}
