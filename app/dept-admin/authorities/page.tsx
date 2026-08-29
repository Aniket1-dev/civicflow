'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { deptAdminNav } from '@/lib/client/nav-items';
import { Card, Field, Input, Select, Textarea } from '@/components/Form';
import { Btn } from '@/components/Button';
import { Modal } from '@/components/Feedback';
import { IconPlus, IconCheckCircle, IconFile } from '@/components/Icons';

interface RefData { zones: { id: string; name: string }[] }

function Content() {
  const [authorities, setAuthorities] = useState<any[]>([]);
  const [ref, setRef] = useState<RefData | null>(null);
  const [tab, setTab] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [createdInfo, setCreatedInfo] = useState<{ authorityCode: string; tempPassword: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const [a, r] = await Promise.all([
      fetch('/api/authorities').then((res) => res.json()),
      fetch('/api/reference').then((res) => res.json()),
    ]);
    setAuthorities(a.authorities ?? []);
    setRef(r);
  }
  useEffect(() => { load(); }, []);

  const tabs: [string, string][] = [['all', 'All'], ['PENDING_VERIFICATION', 'Pending Verification'], ['VERIFIED', 'Verified'], ['REJECTED', 'Rejected']];
  const filtered = tab === 'all' ? authorities : authorities.filter((a) => a.status === tab);

  async function createAuthority(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/authorities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'), email: fd.get('email'), employeeId: fd.get('employeeId'),
        designation: fd.get('designation'), zoneId: fd.get('zoneId'), phone: fd.get('phone'),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setFormError(data.error ?? 'Failed to create authority.'); return; }
    setCreatedInfo(data);
    load();
  }

  async function verify(status: 'VERIFIED' | 'REJECTED') {
    if (!verifyTarget) return;
    setBusy(true);
    await fetch(`/api/authorities/${verifyTarget.id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason: rejectReason || undefined }),
    });
    setBusy(false);
    setVerifyTarget(null);
    setRejectReason('');
    load();
  }

  return (
    <div className="p-5 sm:p-8 max-w-[1100px]">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-serif-display text-3xl">Authorities</h1>
        <Btn variant="accent" onClick={() => setAddOpen(true)}><IconPlus size={15} />Add Authority</Btn>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-full text-sm border whitespace-nowrap ${tab === k ? 'bg-ink text-bg border-ink' : 'border-line text-ink/70'}`}>
            {l} {k !== 'all' && `(${authorities.filter((a) => a.status === k).length})`}
          </button>
        ))}
      </div>

      <div className="hidden sm:block">
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted uppercase tracking-wide border-b border-line">
                {['Authority ID', 'Name', 'Designation', 'Status', ''].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-mono text-xs">{a.authority_code}</td>
                  <td className="px-5 py-3">{a.user_name}</td>
                  <td className="px-5 py-3 text-muted">{a.designation}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${a.status === 'VERIFIED' ? 'text-ok' : a.status === 'PENDING_VERIFICATION' ? 'text-warn' : a.status === 'REJECTED' ? 'text-bad' : 'text-muted'}`}>{a.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-5 py-3">
                    {a.status === 'PENDING_VERIFICATION' && <button className="text-accent text-xs font-medium" onClick={() => setVerifyTarget(a)}>Review</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Modal open={addOpen} onClose={() => { setAddOpen(false); setCreatedInfo(null); setFormError(null); }} title="Add Authority">
        {!createdInfo ? (
          <form className="space-y-4" onSubmit={createAuthority}>
            <Field label="Full Name"><Input name="name" required /></Field>
            <Field label="Official Email"><Input name="email" type="email" required /></Field>
            <Field label="Employee ID"><Input name="employeeId" required /></Field>
            <Field label="Designation"><Input name="designation" required /></Field>
            <Field label="Zone"><Select name="zoneId" required>{ref?.zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}</Select></Field>
            <Field label="Phone"><Input name="phone" /></Field>
            {formError && <div className="text-sm text-bad">{formError}</div>}
            <Btn variant="accent" className="w-full" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create Authority Account'}</Btn>
          </form>
        ) : (
          <div className="reveal">
            <div className="flex items-center gap-2 text-ok mb-4"><IconCheckCircle size={18} /><span className="font-medium">Authority account created</span></div>
            <div className="bg-bg border border-line rounded-md p-4 space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-muted">Authority ID</span><span className="font-mono">{createdInfo.authorityCode}</span></div>
              <div className="flex justify-between"><span className="text-muted">Temporary Password</span><span className="font-mono">{createdInfo.tempPassword}</span></div>
            </div>
            <div className="text-xs text-warn bg-warn/10 border border-warn/30 rounded-md p-3">Share these credentials securely. The authority must upload their designation document on first login.</div>
            <Btn variant="outline" className="w-full mt-4" onClick={() => { setAddOpen(false); setCreatedInfo(null); }}>Done</Btn>
          </div>
        )}
      </Modal>

      <Modal open={!!verifyTarget} onClose={() => { setVerifyTarget(null); setRejectReason(''); }} title="Verify Authority">
        {verifyTarget && (
          <div>
            <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
              <div className="text-muted">Name</div><div className="font-medium text-right">{verifyTarget.user_name}</div>
              <div className="text-muted">Designation</div><div className="font-medium text-right">{verifyTarget.designation}</div>
              <div className="text-muted">Employee ID</div><div className="font-medium text-right">{verifyTarget.employee_id}</div>
              <div className="text-muted">Authority ID</div><div className="font-mono text-xs text-right">{verifyTarget.authority_code}</div>
            </div>
            {verifyTarget.designation_doc_url && (
              <a href={verifyTarget.designation_doc_url} target="_blank" rel="noreferrer" className="border border-line rounded-md p-4 flex items-center gap-3 mb-4 hover:border-accent">
                <IconFile size={18} className="text-muted" />
                <span className="text-sm">View uploaded document</span>
              </a>
            )}
            <Field label="Rejection reason (only needed if rejecting)"><Textarea rows={2} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></Field>
            <div className="flex gap-3 mt-5">
              <Btn variant="danger" disabled={!rejectReason.trim() || busy} onClick={() => verify('REJECTED')}>Reject</Btn>
              <Btn variant="accent" disabled={busy} onClick={() => verify('VERIFIED')}>Approve</Btn>
            </div>
          </div>
        )}
      </Modal>
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
