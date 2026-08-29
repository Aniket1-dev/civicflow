'use client';
import { use } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { AuthorityGate } from '@/components/AuthorityGate';
import { authorityNav } from '@/lib/client/nav-items';
import { ComplaintDetailView } from '@/components/ComplaintDetailView';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthorityGate>
      <DashboardShell items={authorityNav} allowedRole="AUTHORITY">
        <ComplaintDetailView code={id} backPath="/authority/complaints" />
      </DashboardShell>
    </AuthorityGate>
  );
}
