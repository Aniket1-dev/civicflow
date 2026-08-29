'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { DashboardShell } from '@/components/DashboardShell';
import { citizenNav } from '@/lib/client/nav-items';
import { classify, priorityFor } from '@/lib/complaint-utils';
import { Card, Field, Input, Textarea, Select } from '@/components/Form';
import { Btn } from '@/components/Button';
import { Progress } from '@/components/ui/progress';
import {
  IconArrowLeft, IconChevronRight, IconCheck, IconCheckCircle, IconMapPin,
  IconUpload, IconCamera, IconTrash, IconTriangleAlert,
} from '@/components/Icons';

interface RefData {
  departments: { id: string; name: string; code: string; sla_hours: number }[];
  zones: { id: string; name: string }[];
  categories: { id: string; name: string; department_id: string; subcategories: { id: string; name: string }[] }[];
}

function Wizard() {
  const router = useRouter();
  const [ref, setRef] = useState<RefData | null>(null);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [suggestion, setSuggestion] = useState<ReturnType<typeof classify>>(null);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [address, setAddress] = useState('Raj Nagar, Ghaziabad, Uttar Pradesh');
  const [landmark, setLandmark] = useState('');
  const [ward, setWard] = useState('Ward 14');
  const [zoneId, setZoneId] = useState('');
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [showDup, setShowDup] = useState(false);
  const [checks, setChecks] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const stepContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!stepContentRef.current) return;
    gsap.fromTo(stepContentRef.current, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
  }, [step]);

  useEffect(() => {
    fetch('/api/reference').then((r) => r.json()).then((d) => {
      setRef(d);
      if (d.zones?.[0]) setZoneId(d.zones[0].id);
    });
  }, []);

  useEffect(() => {
    if (desc.length > 6) {
      const s = classify(desc);
      setSuggestion(s);
      if (s) { setCategory(s.category); setSubcategory(s.subcategory); }
    } else {
      setSuggestion(null);
    }
  }, [desc]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setUploading(true);
    for (const f of selected) {
      const form = new FormData();
      form.append('file', f);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) setFiles((prev) => [...prev, { name: f.name, url: data.url }]);
    }
    setUploading(false);
  }

  const categoryDef = ref?.categories.find((c) => c.name === category);
  const department = ref?.departments.find((d) => d.id === categoryDef?.department_id);
  const slaHours = department?.sla_hours ?? 48;
  const priority = subcategory ? priorityFor(subcategory) : 'MEDIUM';
  const zoneName = ref?.zones.find((z) => z.id === zoneId)?.name ?? '';

  async function goReview() {
    setStep(4);
  }

  async function checkDuplicatesAndAnalyze() {
    setStep(5);
    setAnalyzing(true);
    setChecks(0);
    let i = 0;
    const iv = setInterval(() => { i++; setChecks(i); if (i >= 5) clearInterval(iv); }, 450);

    const params = new URLSearchParams({ category, subcategory, zoneId });
    const res = await fetch(`/api/complaints/duplicates?${params}`);
    const data = await res.json();

    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      if (data.duplicates?.length > 0) {
        setDuplicates(data.duplicates);
        setShowDup(true);
      }
    }, 2400);
  }

  async function finalSubmit() {
    setSubmitError(null);
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description: desc, categoryName: category, subcategoryName: subcategory,
        address, landmark, ward, zoneId, evidenceUrls: files.map((f) => f.url),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setSubmitError(data.error ?? 'Failed to submit complaint.');
      return;
    }
    setSubmittedCode(data.complaint.code);
  }

  if (!ref) return <div className="p-8 text-sm text-muted">Loading…</div>;

  const stepLabels = ['Details', 'Location', 'Evidence', 'Review'];

  return (
    <div className="p-5 sm:p-8 max-w-[760px]">
      <div className="flex items-center gap-2 mb-8">
        <button onClick={() => router.push('/citizen/dashboard')} className="text-muted hover:text-ink"><IconArrowLeft size={18} /></button>
        <h1 className="font-serif-display text-2xl">Report a Problem</h1>
      </div>

      {step <= 4 && (
        <div className="mb-10 space-y-4">
          <Progress value={(step / 4) * 100} />
          <div className="flex items-center gap-3">
            {stepLabels.map((s, i) => (
              <Fragment key={s}>
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${step > i + 1 ? 'bg-ok text-white' : step === i + 1 ? 'bg-accent text-white' : 'bg-line text-muted'}`}>
                    {step > i + 1 ? <IconCheck size={13} /> : i + 1}
                  </span>
                  <span className={`text-sm hidden sm:block ${step === i + 1 ? 'text-ink font-medium' : 'text-muted'}`}>{s}</span>
                </div>
                {i < stepLabels.length - 1 && <span className="flex-1 h-px bg-line" />}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      <div ref={stepContentRef}>
      {step === 1 && (
        <Card className="p-6 space-y-5 reveal">
          <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Large pothole near college gate" /></Field>
          <Field label="Description" hint="Describe what you see — CivicFlow will suggest a category as you type.">
            <Textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="There is a large pothole near the college gate..." />
          </Field>
          {suggestion && (
            <div className="border border-accent/30 bg-accentSoft/40 rounded-md p-4 reveal">
              <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">Suggested classification</div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <div><span className="text-muted">Category: </span><span className="font-medium">{suggestion.category}</span></div>
                <div><span className="text-muted">Subcategory: </span><span className="font-medium">{suggestion.subcategory}</span></div>
                <div><span className="text-muted">Confidence: </span><span className="font-medium">{suggestion.confidence}%</span></div>
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <Select value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory(''); }}>
                <option value="">Select category</option>
                {ref.categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Sub-category">
              <Select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} disabled={!category}>
                <option value="">Select sub-category</option>
                {categoryDef?.subcategories.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </Select>
            </Field>
          </div>
          <div className="flex justify-end pt-2">
            <Btn variant="accent" disabled={!title || !desc || !category || !subcategory} onClick={() => setStep(2)}>Continue <IconChevronRight size={15} /></Btn>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6 space-y-5 reveal">
          <div className="rounded-md overflow-hidden border border-line bg-bg h-44 flex items-center justify-center text-muted text-sm relative">
            <svg viewBox="0 0 300 120" className="w-full h-full absolute inset-0">
              <rect width="300" height="120" fill="var(--bg)" />
              {Array.from({ length: 10 }).map((_, i) => <line key={'h' + i} x1="0" y1={i * 13} x2="300" y2={i * 13} stroke="var(--line)" strokeWidth="1" />)}
              {Array.from({ length: 16 }).map((_, i) => <line key={'v' + i} x1={i * 20} y1="0" x2={i * 20} y2="120" stroke="var(--line)" strokeWidth="1" />)}
            </svg>
            <div className="relative flex flex-col items-center gap-1">
              <IconMapPin size={26} className="text-accent" />
              <span className="text-xs">Interactive map preview</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-ok"><IconCheckCircle size={15} />Current location detected</div>
          <Field label="Address"><Input value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Landmark"><Input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near DPS Main Gate" /></Field>
            <Field label="Ward"><Input value={ward} onChange={(e) => setWard(e.target.value)} /></Field>
            <Field label="Zone">
              <Select value={zoneId} onChange={(e) => setZoneId(e.target.value)}>{ref.zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}</Select>
            </Field>
          </div>
          <div className="flex justify-between pt-2">
            <Btn variant="ghost" onClick={() => setStep(1)}>Back</Btn>
            <Btn variant="accent" onClick={() => setStep(3)}>Continue <IconChevronRight size={15} /></Btn>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="p-6 space-y-5 reveal">
          <label className="border border-dashed border-line rounded-md flex flex-col items-center justify-center gap-2 py-10 cursor-pointer hover:border-accent transition-colors">
            <IconUpload size={22} className="text-muted" />
            <div className="text-sm">{uploading ? 'Uploading…' : 'Click to upload photos, videos or documents'}</div>
            <div className="text-xs text-muted">JPG, PNG, MP4, PDF up to 10MB</div>
            <input type="file" multiple className="hidden" onChange={handleFileSelect} disabled={uploading} />
          </label>
          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {files.map((f, i) => (
                <div key={i} className="border border-line rounded-md p-3 flex items-center gap-2 text-xs">
                  <IconCamera size={15} className="text-accent shrink-0" /><span className="truncate">{f.name}</span>
                  <button className="ml-auto text-muted hover:text-bad" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}><IconTrash size={13} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between pt-2">
            <Btn variant="ghost" onClick={() => setStep(2)}>Back</Btn>
            <Btn variant="accent" onClick={goReview}>Continue <IconChevronRight size={15} /></Btn>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card className="p-6 space-y-4 reveal">
          <div className="text-sm font-semibold uppercase tracking-wide text-muted mb-1">Review before submitting</div>
          {[
            ['Problem', title],
            ['Location', `${address}${landmark ? ' · ' + landmark : ''}`],
            ['Category', `${category} → ${subcategory}`],
            ['Department', department?.name ?? '—'],
            ['Zone', zoneName],
            ['Priority', priority],
            ['Estimated SLA', `${slaHours} hours`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm py-2 border-b border-line last:border-0">
              <span className="text-muted">{k}</span><span className="font-medium text-right max-w-[60%]">{v}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3">
            <Btn variant="ghost" onClick={() => setStep(3)}>Back</Btn>
            <Btn variant="accent" onClick={checkDuplicatesAndAnalyze}>Submit Complaint</Btn>
          </div>
        </Card>
      )}

      {step === 5 && (
        <Card className="p-8 reveal">
          {analyzing && <div className="text-center text-sm text-muted mb-6">Analyzing complaint…</div>}
          <div className="space-y-3 max-w-sm mx-auto mb-8">
            {['Category detected', 'Duplicate check completed', 'Severity calculated', 'Department identified', 'Zone identified'].map((s, i) => (
              <div key={s} className={`flex items-center gap-3 text-sm ${checks > i ? 'opacity-100' : 'opacity-30'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${checks > i ? 'bg-ok text-white' : 'bg-line'}`}>{checks > i && <IconCheck size={12} />}</span>
                {s}
              </div>
            ))}
          </div>

          {analyzed && showDup && (
            <div className="reveal border border-warn/30 bg-warn/10 rounded-md p-5">
              <div className="flex items-center gap-2 text-warn font-medium mb-3"><IconTriangleAlert size={16} />We found {duplicates.length} similar report{duplicates.length > 1 ? 's' : ''} nearby.</div>
              <div className="space-y-2 mb-4">
                {duplicates.map((d) => (
                  <div key={d.id} className="bg-surface border border-line rounded-md p-4 text-sm flex flex-wrap gap-x-6 gap-y-1">
                    <div><span className="text-muted">ID: </span><span className="font-mono">{d.code}</span></div>
                    <div><span className="text-muted">Status: </span>{d.status}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Btn variant="outline" onClick={() => router.push(`/citizen/complaints/${duplicates[0].code}`)}>View Existing</Btn>
                <Btn variant="accent" onClick={() => setShowDup(false)}>Report Anyway</Btn>
              </div>
            </div>
          )}

          {analyzed && !showDup && !submittedCode && (
            <div className="reveal">
              <div className="flex items-center justify-center gap-2 text-sm mb-6 flex-wrap text-center">
                {[category, subcategory, department?.name, zoneName].filter(Boolean).map((t, i, arr) => (
                  <Fragment key={i}>
                    <span className="font-medium">{t}</span>
                    {i < arr.length - 1 && <IconChevronRight size={14} className="text-muted" />}
                  </Fragment>
                ))}
              </div>
              {submitError && <div className="text-sm text-bad text-center mb-4">{submitError}</div>}
              <div className="flex justify-center">
                <Btn variant="accent" size="lg" onClick={finalSubmit}>Confirm & Submit <IconChevronRight size={15} /></Btn>
              </div>
            </div>
          )}

          {submittedCode && (
            <div className="reveal text-center">
              <div className="flex items-center justify-center gap-1.5 text-ok text-sm font-medium mb-6"><IconCheckCircle size={15} />Complaint {submittedCode} submitted</div>
              <Btn variant="accent" size="lg" onClick={() => router.push(`/citizen/complaints/${submittedCode}`)}>View My Complaint <IconChevronRight size={15} /></Btn>
            </div>
          )}
        </Card>
      )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardShell items={citizenNav} allowedRole="CITIZEN">
      <Wizard />
    </DashboardShell>
  );
}
