'use client';
import { DashboardShell } from '@/components/DashboardShell';
import { citizenNav } from '@/lib/client/nav-items';
import { useSession } from '@/lib/client/session';
import { Card, Field, Input } from '@/components/Form';
import { Btn } from '@/components/Button';
import { IconUser } from '@/components/Icons';

function Content() {
  const { user } = useSession();
  if (!user) return null;
  return (
    <div className="p-5 sm:p-8 max-w-[560px]">
      <h1 className="font-serif-display text-3xl mb-6">Profile</h1>
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accentSoft text-accent flex items-center justify-center"><IconUser size={22} /></div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted">Citizen</div>
          </div>
        </div>
        <div className="h-px bg-line" />
        <Field label="Full name"><Input defaultValue={user.name} disabled /></Field>
        <Field label="Email"><Input defaultValue={user.email} disabled /></Field>
        <p className="text-xs text-muted">Profile editing isn&rsquo;t wired up yet — this shows your real account data from the database.</p>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardShell items={citizenNav} allowedRole="CITIZEN">
      <Content />
    </DashboardShell>
  );
}
