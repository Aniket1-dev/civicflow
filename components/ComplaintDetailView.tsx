'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { fmtDate, slaRemaining } from '@/lib/complaint-utils';
import { useSession } from '@/lib/client/session';
import { Card, Field, Input, Textarea } from './Form';
import { Btn } from './Button';
import { StatusBadge, PriorityBadge, Modal } from './Feedback';
import { Timeline } from './Complaint';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import {
  IconArrowLeft, IconCamera, IconCheck, IconCheckCircle, IconX, IconTriangleAlert, IconUpload,
} from './Icons';

export function ComplaintDetailView({ code, backPath }: { code: string; backPath: string }) {
  const router = useRouter();
  const { user } = useSession();
  const [complaint, setComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<'overview' | 'timeline' | 'comments'>('overview');
  const tabContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!tabContentRef.current) return;
    gsap.fromTo(tabContentRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  }, [tab]);
  const [reopenOpen, setReopenOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [comment, setComment] = useState('');
  const [resolveOpen, setResolveOpen] = useState(false);
  const [resDesc, setResDesc] = useState('');
  const [beforeUrl, setBeforeUrl] = useState<string | undefined>();
  const [afterUrl, setAfterUrl] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/complaints/${code}`);
    const data = await res.json();
    if (res.ok) setComplaint(data.complaint);
    else setError(data.error ?? 'Failed to load complaint.');
    setLoading(false);
  }

  useEffect(() => { load(); }, [code]);

  async function act(action: string, payload?: any) {
    setBusy(true);
    const res = await fetch(`/api/complaints/${complaint.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) setComplaint(data.complaint);
    else setError(data.error ?? 'Action failed.');
  }

  async function uploadFile(file: File): Promise<string | undefined> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    return res.ok ? data.url : undefined;
  }

  if (loading) return <div className="p-8 text-sm text-muted">Loading…</div>;
  if (error || !complaint) {
    return (
      <div className="p-8">
        <p className="mb-4 text-sm text-bad">{error ?? 'Complaint not found.'}</p>
        <Btn variant="outline" onClick={() => router.push(backPath)}>Back</Btn>
      </div>
    );
  }

  const sla = slaRemaining(complaint.sla_deadline);
  const role = user?.role;

  return (
    <div className="p-5 sm:p-8 max-w-[880px]">
      <button onClick={() => router.push(backPath)} className="flex items-center gap-2 text-sm text-muted hover:text-ink mb-6"><IconArrowLeft size={16} />Back</button>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="font-mono text-xs text-muted mb-1.5">{complaint.code}</div>
          <h1 className="font-serif-display text-2xl sm:text-3xl mb-3">{complaint.title}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>
        {!['RESOLVED', 'CLOSED'].includes(complaint.status) && (
          <div className={`text-right ${sla.overdue ? 'text-bad' : 'text-ink'}`}>
            <div className="text-xs text-muted mb-1">SLA</div>
            <div className="font-serif-display text-xl">{sla.text}</div>
          </div>
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="mb-6">
          {(['overview', 'timeline', 'comments'] as const).map((t) => (
            <TabsTrigger key={t} value={t}>{t}</TabsTrigger>
          ))}
        </TabsList>

        <div ref={tabContentRef}>
        <TabsContent value="overview">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="text-sm leading-relaxed mb-5">{complaint.description}</div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                ['Category', `${complaint.category_name} · ${complaint.subcategory_name}`],
                ['Department', complaint.department_name],
                ['Authority', complaint.authority_name ? `${complaint.authority_name} (${complaint.authority_code})` : 'Unassigned'],
                ['Location', `${complaint.address}${complaint.landmark ? ' · ' + complaint.landmark : ''}`],
                ['Reported by', complaint.reported_by_name],
                ['SLA window', `${complaint.sla_hours} hours`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted">{k}</span><span className="font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          {complaint.evidence_urls?.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-3">Evidence</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {complaint.evidence_urls.map((url: string) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer" className="aspect-square rounded-md bg-line/40 border border-line flex items-center justify-center text-muted overflow-hidden">
                    <img src={url} alt="evidence" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {role === 'AUTHORITY' && !['RESOLVED', 'CLOSED'].includes(complaint.status) && (
            <Card className="p-5">
              <div className="text-sm font-medium mb-4">Actions</div>
              <div className="flex flex-wrap gap-3">
                {complaint.status === 'ASSIGNED' && <Btn variant="accent" disabled={busy} onClick={() => act('accept')}>Accept</Btn>}
                {complaint.status === 'ACCEPTED' && <Btn variant="accent" disabled={busy} onClick={() => act('start')}>Start Work</Btn>}
                {complaint.status === 'IN_PROGRESS' && <Btn variant="accent" disabled={busy} onClick={() => setResolveOpen(true)}>Mark Resolved</Btn>}
                <Btn variant="outline" disabled={busy} onClick={() => act('reassign')}>Request Reassignment</Btn>
              </div>
            </Card>
          )}

          {role === 'CITIZEN' && complaint.status === 'RESOLVED' && (
            <Card className="p-5">
              <div className="font-serif-display text-lg mb-3">Was the problem actually fixed?</div>
              {complaint.resolution_description && (
                <div className="mb-4 text-sm text-muted leading-relaxed">
                  <div className="mb-3">{complaint.resolution_description}</div>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    {[complaint.resolution_before_url, complaint.resolution_after_url].map((url, i) => (
                      <div key={i}>
                        <div className="aspect-video rounded-md bg-line/40 border border-line overflow-hidden mb-1">
                          {url && <img src={url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="text-xs text-center">{i === 0 ? 'Before' : 'After'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Btn variant="accent" disabled={busy} onClick={() => act('verify-yes')}><IconCheck size={15} />Yes, issue resolved</Btn>
                <Btn variant="danger" disabled={busy} onClick={() => setReopenOpen(true)}><IconX size={15} />No, reopen</Btn>
              </div>
            </Card>
          )}
          {complaint.status === 'CLOSED' && (
            <div className="flex items-center gap-2 text-ok text-sm"><IconCheckCircle size={16} />Verified resolved and closed by citizen.</div>
          )}
          {complaint.status === 'REOPENED' && (
            <div className="flex items-center gap-2 text-bad text-sm"><IconTriangleAlert size={16} />Reopened — back with the department.</div>
          )}
        </div>
        </TabsContent>

      <TabsContent value="timeline">
        <Card className="p-6">
          <Timeline items={complaint.timeline.map((t: any) => ({ label: t.label, at: t.at }))} />
        </Card>
      </TabsContent>

      <TabsContent value="comments">
        <Card className="p-5">
          <div className="space-y-4 mb-5">
            {complaint.comments.length === 0 && <div className="text-sm text-muted">No comments yet.</div>}
            {complaint.comments.map((c: any) => (
              <div key={c.id} className="text-sm">
                <div className="font-medium">{c.author_name}</div>
                <div className="text-ink/80">{c.text}</div>
                <div className="text-xs text-muted mt-0.5">{fmtDate(c.at)}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
            <Btn variant="accent" disabled={busy} onClick={async () => {
              if (comment.trim()) { await act('comment', { text: comment }); setComment(''); }
            }}>Post</Btn>
          </div>
        </Card>
      </TabsContent>
        </div>
      </Tabs>

      <Modal open={reopenOpen} onClose={() => setReopenOpen(false)} title="Reopen this complaint">
        <Field label="What still isn't fixed?"><Textarea rows={4} value={reopenReason} onChange={(e) => setReopenReason(e.target.value)} placeholder="Explain what's still wrong..." /></Field>
        <div className="flex justify-end gap-3 mt-6">
          <Btn variant="ghost" onClick={() => setReopenOpen(false)}>Cancel</Btn>
          <Btn variant="danger" disabled={!reopenReason.trim() || busy} onClick={async () => { await act('reopen', { reason: reopenReason }); setReopenOpen(false); }}>Reopen Complaint</Btn>
        </div>
      </Modal>

      <Modal open={resolveOpen} onClose={() => setResolveOpen(false)} title="Mark as Resolved">
        <Field label="Resolution description"><Textarea rows={3} value={resDesc} onChange={(e) => setResDesc(e.target.value)} placeholder="What was done to fix this?" /></Field>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <label className="border border-dashed border-line rounded-md flex flex-col items-center justify-center gap-1.5 py-6 cursor-pointer text-xs text-muted hover:border-accent">
            <IconUpload size={16} />{beforeUrl ? 'Before image ✓' : 'Before image'}
            <input type="file" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setBeforeUrl(await uploadFile(f)); }} />
          </label>
          <label className="border border-dashed border-line rounded-md flex flex-col items-center justify-center gap-1.5 py-6 cursor-pointer text-xs text-muted hover:border-accent">
            <IconUpload size={16} />{afterUrl ? 'After image ✓' : 'After image'}
            <input type="file" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setAfterUrl(await uploadFile(f)); }} />
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Btn variant="ghost" onClick={() => setResolveOpen(false)}>Cancel</Btn>
          <Btn variant="accent" disabled={!resDesc.trim() || busy} onClick={async () => { await act('resolve', { description: resDesc, beforeUrl, afterUrl }); setResolveOpen(false); }}>Submit Resolution</Btn>
        </div>
      </Modal>
    </div>
  );
}
