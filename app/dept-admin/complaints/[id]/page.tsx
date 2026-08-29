'use client';
import { use } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { deptAdminNav } from '@/lib/client/nav-items';
import { ComplaintDetailView } from '@/components/ComplaintDetailView';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <DashboardShell items={deptAdminNav} allowedRole="DEPT_ADMIN">
      <ComplaintDetailView code={id} backPath="/dept-admin/complaints" />
    </DashboardShell>
  );
}
