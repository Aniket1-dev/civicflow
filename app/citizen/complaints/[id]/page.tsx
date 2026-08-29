'use client';
import { use } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { citizenNav } from '@/lib/client/nav-items';
import { ComplaintDetailView } from '@/components/ComplaintDetailView';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <DashboardShell items={citizenNav} allowedRole="CITIZEN">
      <ComplaintDetailView code={id} backPath="/citizen/complaints" />
    </DashboardShell>
  );
}
