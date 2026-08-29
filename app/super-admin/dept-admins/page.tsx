'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { superAdminNav } from '@/lib/client/nav-items';
import { Card, Field, Input, Select } from '@/components/Form';
import { Btn } from '@/components/Button';
import { Modal } from '@/components/Feedback';
import { IconPlus, IconCheckCircle } from '@/components/Icons';

function Content() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ tempPassword: string } | null>(null);

  async function load() {
    const [a, r] = await Promise.all([
      fetch('/api/dept-admins').then((res) => res.json()),
      fetch('/api/reference').then((res) => res.json()),
    ]);
    setAdmins(a.deptAdmins ?? []);
    setDepartments(r.departments ?? []);
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/dept-admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fd.get('name'), email: fd.get('email'), departmentId: fd.get('departmentId') }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error ?? 'Failed to create.'); return; }
    setCreated(data);
    load();
  }

  return (
    <div className="p-5 sm:p-8 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif-display text-3xl">Department Admins</h1>
        <Btn variant="accent" onClick={() => setOpen(true)}><IconPlus size={15} />Add Department Admin</Btn>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {admins.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="font-medium mb-1">{a.name}</div>
            <div className="text-sm text-muted">{a.department_name}</div>
            <div className="text-xs text-muted mt-1">{a.email}</div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => { setOpen(false); setCreated(null); setError(null); }} title="Add Department Admin">
        {!created ? (
          <form className="space-y-4" onSubmit={create}>
            <Field label="Full Name"><Input name="name" required /></Field>
            <Field label="Official Email"><Input name="email" type="email" required /></Field>
            <Field label="Department"><Select name="departmentId" required>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select></Field>
            {error && <div className="text-sm text-bad">{error}</div>}
            <Btn variant="accent" className="w-full" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create Account'}</Btn>
          </form>
        ) : (
          <div className="reveal">
            <div className="flex items-center gap-2 text-ok mb-4"><IconCheckCircle size={18} /><span className="font-medium">Department Admin created</span></div>
            <div className="bg-bg border border-line rounded-md p-4 text-sm mb-4 flex justify-between">
              <span className="text-muted">Temporary Password</span><span className="font-mono">{created.tempPassword}</span>
            </div>
            <Btn variant="outline" className="w-full" onClick={() => { setOpen(false); setCreated(null); }}>Done</Btn>
          </div>
        )}
      </Modal>
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
