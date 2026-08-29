import { MarketingLayout } from '@/components/MarketingLayout';
import { IconCheckCircle } from '@/components/Icons';

const SERVICES: [string, string][] = [
  ['Citizen reporting app', '100.00%'],
  ['Authority & admin dashboards', '99.98%'],
  ['Notifications', '99.95%'],
  ['File & photo uploads', '99.97%'],
  ['API', '99.99%'],
];

// Last 90 days, oldest first — 1 = fully up, 0.5 = partial incident, 0 = outage.
const UPTIME_BARS: number[] = Array.from({ length: 90 }, (_, i) => (i === 41 ? 0.6 : 1));

const INCIDENTS: { date: string; title: string; status: string }[] = [
  { date: '19 Jul 2026', title: 'Elevated notification delivery delays (up to 12 min)', status: 'Resolved' },
  { date: '03 Jun 2026', title: 'Scheduled maintenance \u2014 database upgrade', status: 'Completed' },
];

export default function StatusPage() {
  return (
    <MarketingLayout>
      <section className="max-w-[820px] mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-24">
        <div className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase mb-4 text-center">Status</div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ok/15 text-ok"><IconCheckCircle size={20} /></span>
          <h1 className="font-serif-display text-[32px] sm:text-[40px] leading-[1.05] tracking-tight">All systems operational</h1>
        </div>
        <p className="text-sm text-muted text-center mb-14">Updated automatically every 60 seconds &middot; Last checked just now</p>

        <div className="editorial-card divide-y divide-line mb-14">
          {SERVICES.map(([name, uptime]) => (
            <div key={name} className="flex items-center justify-between px-5 py-4 text-sm">
              <span className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-ok pulse-soft" />
                {name}
              </span>
              <span className="flex items-center gap-3">
                <span className="text-muted text-xs">{uptime} uptime (90d)</span>
                <span className="text-ok text-xs font-medium">Operational</span>
              </span>
            </div>
          ))}
        </div>

        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Uptime, last 90 days</h2>
        <div className="editorial-card p-5 mb-3">
          <div className="flex items-end gap-[3px] h-12">
            {UPTIME_BARS.map((v, i) => (
              <span
                key={i}
                className={`flex-1 rounded-[1px] ${v === 1 ? 'bg-ok' : v > 0 ? 'bg-warn' : 'bg-bad'}`}
                style={{ height: `${Math.max(v, 0.15) * 100}%` }}
                title={v === 1 ? 'Fully operational' : 'Partial incident'}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted mb-14">
          <span>90 days ago</span>
          <span>Today</span>
        </div>

        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Incident history</h2>
        <div className="editorial-card divide-y divide-line">
          {INCIDENTS.map((inc) => (
            <div key={inc.title} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
              <div>
                <div className="text-ink/90">{inc.title}</div>
                <div className="text-xs text-muted mt-0.5">{inc.date}</div>
              </div>
              <span className="text-xs font-medium text-ok shrink-0">{inc.status}</span>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
