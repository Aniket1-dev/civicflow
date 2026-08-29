'use client';
import { useState } from 'react';
import { ComplaintCard } from './Complaint';
import { EmptyState } from './Feedback';
import { IconList } from './Icons';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { useScrollReveal } from '@/hooks/use-gsap-reveal';

export function ComplaintListView({ complaints, basePath, title }: { complaints: any[]; basePath: string; title: string }) {
  const [filter, setFilter] = useState('all');
  const tabs: [string, string][] = [['all', 'All'], ['IN_PROGRESS', 'Active'], ['RESOLVED', 'Awaiting Verification'], ['CLOSED', 'Closed']];
  const filtered = filter === 'all' ? complaints : complaints.filter((c) => c.status === filter);
  const gridRef = useScrollReveal<HTMLDivElement>([filter, filtered.length]);

  return (
    <div className="p-5 sm:p-8 max-w-[1100px]">
      <h1 className="font-serif-display text-3xl mb-6">{title}</h1>
      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="overflow-x-auto scrollbar-none flex-nowrap">
          {tabs.map(([k, l]) => (
            <TabsTrigger key={k} value={k} className="whitespace-nowrap">{l}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {filtered.length === 0 ? (
        <EmptyState icon={<IconList size={20} />} title="No complaints here" sub="Nothing matches this filter yet." />
      ) : (
        <div ref={gridRef} className="grid sm:grid-cols-2 gap-4">{filtered.map((c) => <ComplaintCard key={c.id} c={c} basePath={basePath} />)}</div>
      )}
    </div>
  );
}
