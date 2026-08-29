'use client';
import { DashboardShell } from '@/components/DashboardShell';
import { citizenNav } from '@/lib/client/nav-items';
import { Card } from '@/components/Form';

const FAQS: [string, string][] = [
  ['How is my complaint prioritized?', 'CivicFlow looks at the category and keywords in your description to set an initial priority.'],
  ['What happens if the SLA is breached?', 'The complaint escalates to the Department Admin, and then to a higher authority if it remains unresolved.'],
  ['Can I reopen a resolved complaint?', 'Yes — if the fix wasn\u2019t actually done, use "No, reopen" on the verification screen with a short explanation.'],
];

export default function Page() {
  return (
    <DashboardShell items={citizenNav} allowedRole="CITIZEN">
      <div className="p-5 sm:p-8 max-w-[650px]">
        <h1 className="font-serif-display text-3xl mb-6">Help</h1>
        <div className="space-y-3">
          {FAQS.map(([q, a]) => (
            <Card key={q} className="p-5">
              <div className="font-medium mb-1.5">{q}</div>
              <div className="text-sm text-muted leading-relaxed">{a}</div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
