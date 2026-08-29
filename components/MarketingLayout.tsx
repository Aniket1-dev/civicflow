'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Btn } from './Button';
import { ThemeToggle } from './Feedback';
import { IconMapPin, IconMenu, IconX, IconShield } from './Icons';

const LINKS: [string, string][] = [
  ['How It Works', '#how'], ['For Citizens', '#citizens'], ['For Authorities', '#authorities'], ['Pricing', '/pricing'], ['About', '#about'],
];

function SuperAdminSearchGate() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handler = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
      if (!target || typeof target.value !== 'string') return;
      const value = target.value.trim().toLowerCase();
      if (value === 'super-admin' || value === 'superadmin') setOpen(true);
    };
    document.addEventListener('input', handler, true);
    return () => document.removeEventListener('input', handler, true);
  }, []);
  if (!open) return null;
  return <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40 p-5 backdrop-blur-md" role="dialog" aria-modal="true">
    <div className="w-full max-w-[420px] rounded-[26px] border border-line bg-surface p-7 text-ink shadow-[0_30px_100px_rgba(16,24,40,.22)] animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accentSoft text-accent"><IconShield size={22}/></div>
        <button type="button" onClick={()=>setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted">×</button>
      </div>
      <div className="mt-6 text-[10px] font-semibold uppercase tracking-[.16em] text-accent">Restricted access</div>
      <h2 className="mt-2 text-2xl font-bold tracking-[-.04em]">Super Admin</h2>
      <p className="mt-2 text-sm leading-6 text-muted">Administrative access is protected separately from citizen and authority sign-in.</p>
      <button type="button" onClick={()=>router.push('/super-admin/login')} className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#5367ff] to-[#7840ef] text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5">Continue to Super Admin →</button>
    </div>
  </div>;
}

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur border-b border-line">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif-display text-[19px] tracking-tight">
          <span className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center"><IconMapPin size={14} /></span>
          CivicFlow
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-[13.5px] font-medium text-ink/70">
          {LINKS.map(([label, id]) => (
            <a key={id} href={id} className="hover:text-ink transition-colors">{label}</a>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Btn variant="ghost" size="sm" onClick={() => router.push('/signin')}>Sign in</Btn>
          <Btn variant="accent" size="sm" onClick={() => router.push('/signin?next=report')}>Report a Problem</Btn>
        </div>
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(true)} className="w-9 h-9 flex items-center justify-center"><IconMenu size={20} /></button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[90] bg-bg lg:hidden">
          <div className="flex items-center justify-between px-5 h-16 border-b border-line">
            <span className="font-serif-display text-lg">Menu</span>
            <button onClick={() => setOpen(false)}><IconX size={22} /></button>
          </div>
          <div className="p-6 flex flex-col gap-5 text-lg">
            {LINKS.map(([label, id]) => (
              <a key={id} href={id} onClick={() => setOpen(false)}>{label}</a>
            ))}
            <div className="h-px bg-line my-2" />
            <button className="text-left" onClick={() => { setOpen(false); router.push('/signin'); }}>Sign in</button>
            <Btn variant="accent" onClick={() => { setOpen(false); router.push('/signin?next=report'); }}>Report a Problem</Btn>
          </div>
        </div>
      )}
      <SuperAdminSearchGate />
    </header>
  );
}

export function MarketingFooter() {
  const router = useRouter();
  const groups: [string, [string, string][]][] = [
    ['Platform', [['How it works', '#how'], ['For citizens', '#citizens'], ['For authorities', '#authorities'], ['Pricing', '/pricing'], ['System status', '/status']]],
    ['Company', [['About', '#about'], ['Contact', '#contact'], ['FAQ', '/faq']]],
    ['Access', [['Sign in', '/signin'], ['Report a problem', '/signin?next=report']]],
    ['Legal', [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Accessibility Statement', '/accessibility'], ['Sitemap', '/sitemap']]],
  ];
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 font-serif-display text-lg mb-3">
            <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center"><IconMapPin size={12} /></span>
            CivicFlow
          </div>
          <p className="text-sm text-muted max-w-[220px] mb-4">Better cities, one problem at a time.</p>
          <p className="text-xs text-muted max-w-[220px]">
            Grievance Redressal Officer:{' '}
            <a href="mailto:grievance@civicflow.gov" className="text-accent">grievance@civicflow.gov</a> · Helpline 1800-CIVIC-00
          </p>
        </div>
        {groups.map(([h, items]) => (
          <div key={h}>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">{h}</div>
            <div className="flex flex-col gap-2 text-sm">
              {items.map(([label, id]) =>
                id.startsWith('#') ? (
                  <a key={label} href={id} className="text-ink/70 hover:text-ink">{label}</a>
                ) : (
                  <button key={label} onClick={() => router.push(id)} className="text-left text-ink/70 hover:text-ink">{label}</button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        CivicFlow, 2026. Content last reviewed 29 August 2026.
      </div>
    </footer>
  );
}

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MarketingNav />
      <main id="main-content">{children}</main>
      <MarketingFooter />
    </div>
  );
}
