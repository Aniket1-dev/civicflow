export interface ClassificationResult {
  category: string;
  subcategory: string;
  confidence: number;
}

const RULES: { k: string[]; cat: string; sub: string; conf: number }[] = [
  { k: ['pothole', 'crater', 'road damage'], cat: 'Road & Infrastructure', sub: 'Pothole', conf: 96 },
  { k: ['footpath', 'pavement'], cat: 'Road & Infrastructure', sub: 'Footpath Damage', conf: 91 },
  { k: ['streetlight', 'street light', 'pole', 'lamp'], cat: 'Electricity', sub: 'Street Light', conf: 94 },
  { k: ['wire', 'shock', 'spark'], cat: 'Electricity', sub: 'Exposed Wire', conf: 90 },
  { k: ['garbage', 'trash', 'waste', 'dump'], cat: 'Sanitation', sub: 'Garbage Overflow', conf: 93 },
  { k: ['leak', 'pipe', 'water supply', 'no water', 'tap'], cat: 'Water Supply', sub: 'Water Leakage', conf: 92 },
];

export function classify(text: string): ClassificationResult | null {
  const t = (text || '').toLowerCase();
  for (const r of RULES) {
    if (r.k.some((k) => t.includes(k))) return { category: r.cat, subcategory: r.sub, confidence: r.conf };
  }
  if (t.length > 8) return { category: 'Road & Infrastructure', subcategory: 'Broken Road', confidence: 74 };
  return null;
}

const HIGH_PRIORITY_SUBS = ['Pothole', 'Exposed Wire', 'Contaminated Water', 'No Water Supply', 'Pipe Burst', 'Transformer Fault'];

export function priorityFor(sub: string): 'HIGH' | 'MEDIUM' {
  return HIGH_PRIORITY_SUBS.includes(sub) ? 'HIGH' : 'MEDIUM';
}

export function slaRemaining(deadline: Date | string): { overdue: boolean; text: string } {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const ms = d.getTime() - Date.now();
  const overdue = ms < 0;
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  return { overdue, text: `${overdue ? 'Overdue by ' : ''}${h}h ${m}m${overdue ? '' : ' remaining'}` };
}

export function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  const dt = typeof d === 'string' ? new Date(d) : d;
  return (
    dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) +
    ' · ' +
    dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  );
}
