'use client';
import { useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { citizenNav } from '@/lib/client/nav-items';
import { Card, Field, Textarea } from '@/components/Form';
import { Btn } from '@/components/Button';
import { EmptyState } from '@/components/Feedback';
import { useToast } from '@/lib/client/toast';
import { IconCheckCircle, IconStar } from '@/components/Icons';

function Content() {
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);

  return (
    <div className="p-5 sm:p-8 max-w-[560px]">
      <h1 className="font-serif-display text-3xl mb-2">Feedback</h1>
      <p className="text-muted mb-8 text-sm">Tell us how CivicFlow is working for you.</p>
      {sent ? (
        <EmptyState icon={<IconCheckCircle size={20} />} title="Thanks for the feedback" sub="It helps us improve routing and response time." />
      ) : (
        <Card className="p-6">
          <div className="text-sm font-medium mb-3">Overall experience</div>
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)}>
                <IconStar size={26} className={n <= rating ? 'text-accent' : 'text-line'} style={n <= rating ? { fill: 'currentColor' } : {}} />
              </button>
            ))}
          </div>
          <Field label="Comments (optional)"><Textarea rows={4} placeholder="What went well, what could be faster..." /></Field>
          <Btn variant="accent" className="mt-4" onClick={() => { setSent(true); toast('Feedback submitted'); }}>Submit Feedback</Btn>
        </Card>
      )}
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
