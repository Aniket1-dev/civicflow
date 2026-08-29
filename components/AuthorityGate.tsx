'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/client/session';
import { Card, Field, Input } from './Form';
import { Btn } from './Button';
import { IconShield, IconFile, IconClock } from './Icons';

function AuthorityOnboarding({ onDone }: { onDone: () => void }) {
  const [empId, setEmpId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!empId || !file) return;
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.append('file', file);
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: form });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      setError(uploadData.error ?? 'Upload failed.');
      setBusy(false);
      return;
    }
    const res = await fetch('/api/authorities/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: empId, docUrl: uploadData.url }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error ?? 'Submission failed.'); return; }
    onDone();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 reveal">
        <IconShield size={26} className="text-accent mb-4" />
        <h1 className="font-serif-display text-2xl mb-2">Verify your designation</h1>
        <p className="text-sm text-muted mb-6">Before accessing authority tools, please verify your official designation. A Department Admin will review your document.</p>
        <div className="space-y-4">
          <Field label="Employee ID"><Input value={empId} onChange={(e) => setEmpId(e.target.value)} placeholder="ELE30512" /></Field>
          <label className="border border-dashed border-line rounded-md flex flex-col items-center justify-center gap-2 py-8 cursor-pointer hover:border-accent">
            <IconFile size={20} className="text-muted" />
            <span className="text-sm">{file?.name ?? 'Upload designation document'}</span>
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {error && <div className="text-sm text-bad mt-3">{error}</div>}
        <Btn variant="accent" className="w-full mt-6" disabled={!file || !empId || busy} onClick={submit}>
          {busy ? 'Submitting…' : 'Submit for Verification'}
        </Btn>
      </Card>
    </div>
  );
}

function AuthorityPendingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center reveal">
        <div className="w-12 h-12 rounded-full bg-warn/15 text-warn flex items-center justify-center mx-auto mb-4"><IconClock size={22} /></div>
        <h1 className="font-serif-display text-2xl mb-2">Verification Pending</h1>
        <p className="text-sm text-muted">Your document has been submitted and is awaiting review by your Department Admin. You&rsquo;ll get access to complaint tools once approved.</p>
      </Card>
    </div>
  );
}

function AuthorityRejectedScreen({ reason }: { reason?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center reveal">
        <h1 className="font-serif-display text-2xl mb-2">Verification Rejected</h1>
        <p className="text-sm text-muted mb-2">Your Department Admin rejected your verification.</p>
        {reason && <p className="text-sm text-bad">&ldquo;{reason}&rdquo;</p>}
        <p className="text-xs text-muted mt-4">Contact your Department Admin to resolve this.</p>
      </Card>
    </div>
  );
}

export function AuthorityGate({ children }: { children: ReactNode }) {
  const { user, loading, refresh } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'AUTHORITY')) router.replace('/signin');
  }, [loading, user, router]);

  if (loading || !user || user.role !== 'AUTHORITY') {
    return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Loading…</div>;
  }

  if (user.authorityStatus === 'PENDING_ONBOARDING') return <AuthorityOnboarding onDone={refresh} />;
  if (user.authorityStatus === 'PENDING_VERIFICATION') return <AuthorityPendingScreen />;
  if (user.authorityStatus === 'REJECTED') return <AuthorityRejectedScreen />;

  return <>{children}</>;
}
