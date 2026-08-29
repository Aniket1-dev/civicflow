'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { superAdminNav } from '@/lib/client/nav-items';
import { Card } from '@/components/Form';
import { fmtDate } from '@/lib/complaint-utils';

function Content() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/audit-logs').then((r) => r.json()).then((d) => setLogs(d.logs ?? []));
  }, []);

  return (
    <div className="p-5 sm:p-8 max-w-[1100px]">
      <h1 className="font-serif-display text-3xl mb-6">Audit Logs</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-xs text-muted uppercase tracking-wide border-b border-line">
              {['Timestamp', 'Actor', 'Action', 'Entity', 'Change'].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-6 text-muted text-center">No activity yet.</td></tr>
            )}
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-muted whitespace-nowrap">{fmtDate(l.at)}</td>
                <td className="px-5 py-3">{l.actor_name} <span className="text-muted">({l.actor_role})</span></td>
                <td className="px-5 py-3">{l.action}</td>
                <td className="px-5 py-3 font-mono text-xs">{l.entity_id}</td>
                <td className="px-5 py-3 text-muted">{l.previous_value} → {l.new_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
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
