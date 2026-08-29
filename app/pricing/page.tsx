'use client';
import { useRouter } from 'next/navigation';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Card } from '@/components/Form';
import { Btn } from '@/components/Button';
import { IconCheck } from '@/components/Icons';
import { useScrollReveal, useEntranceTimeline } from '@/hooks/use-gsap-reveal';

const TIERS: {
  name: string;
  price: string;
  unit: string;
  tagline: string;
  cta: string;
  featured?: boolean;
  features: string[];
}[] = [
  {
    name: 'Ward',
    price: '\u20b90',
    unit: '/month',
    tagline: 'For a single ward or small municipality piloting digital grievance redressal.',
    cta: 'Start free',
    features: [
      'Up to 500 complaints / month',
      '1 department, up to 5 authority seats',
      'Citizen web reporting with photo + geotag',
      'SLA tracking & basic escalation',
      'Email support',
    ],
  },
  {
    name: 'City',
    price: '\u20b924,999',
    unit: '/month',
    tagline: 'For a city corporation running multiple departments at scale.',
    cta: 'Talk to sales',
    featured: true,
    features: [
      'Unlimited complaints',
      'Unlimited departments & authority seats',
      'Duplicate detection & auto-routing',
      'Department Admin & Super Admin oversight',
      'Audit logs & data export',
      'Priority support with SLA',
    ],
  },
  {
    name: 'State',
    price: 'Custom',
    unit: '',
    tagline: 'For state-level deployments spanning many cities and departments.',
    cta: 'Contact us',
    features: [
      'Everything in City',
      'Multi-city rollout & central dashboard',
      'Custom integrations (SSO, existing ERP)',
      'Dedicated onboarding & training',
      'Uptime SLA with named support contact',
    ],
  },
];

const FEATURE_ROWS: [string, boolean[]][] = [
  ['Citizen reporting app', [true, true, true]],
  ['SLA tracking', [true, true, true]],
  ['Duplicate detection', [false, true, true]],
  ['Multi-department routing', [false, true, true]],
  ['Audit logs', [false, true, true]],
  ['Custom integrations', [false, false, true]],
  ['Dedicated support contact', [false, false, true]],
];

export default function PricingPage() {
  const router = useRouter();
  const heroRef = useEntranceTimeline<HTMLElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();
  const tableRef = useScrollReveal<HTMLDivElement>();

  return (
    <MarketingLayout>
      <section ref={heroRef} className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-10 text-center">
        <div data-enter className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase mb-4">Pricing</div>
        <h1 data-enter className="font-serif-display text-[36px] sm:text-[48px] leading-[1.05] tracking-tight mb-4">
          Priced for public budgets.
        </h1>
        <p data-enter className="text-[17px] text-muted max-w-lg mx-auto leading-relaxed">
          Start free for a single ward, scale to a full city corporation. No per-citizen fees, ever.
        </p>
      </section>

      <div ref={gridRef} className="max-w-[1080px] mx-auto px-5 sm:px-8 grid md:grid-cols-3 gap-6 pb-16">
        {TIERS.map((tier) => (
          <Card
            key={tier.name}
            data-reveal
            className={`p-6 sm:p-7 flex flex-col ${tier.featured ? 'border-accent ring-1 ring-accent/40 relative' : ''}`}
          >
            {tier.featured && (
              <span className="absolute -top-3 left-6 bg-accent text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                Most popular
              </span>
            )}
            <div className="font-serif-display text-xl mb-1">{tier.name}</div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-bold tracking-tight">{tier.price}</span>
              <span className="text-sm text-muted">{tier.unit}</span>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-6">{tier.tagline}</p>
            <ul className="space-y-2.5 mb-8 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-ok/15 text-ok"><IconCheck size={10} /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Btn
              variant={tier.featured ? 'accent' : 'outline'}
              className="w-full"
              onClick={() => router.push(tier.name === 'Ward' ? '/register' : '/signin?next=report')}
            >
              {tier.cta}
            </Btn>
          </Card>
        ))}
      </div>

      <section ref={tableRef} className="max-w-[900px] mx-auto px-5 sm:px-8 pb-24">
        <div data-reveal className="editorial-card overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="p-4 font-medium text-muted">Compare features</th>
                {TIERS.map((t) => (
                  <th key={t.name} className="p-4 font-medium">{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map(([label, cells]) => (
                <tr key={label} className="border-b border-line last:border-0">
                  <td className="p-4 text-ink/80">{label}</td>
                  {cells.map((included, i) => (
                    <td key={i} className="p-4">
                      {included ? (
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-ok/15 text-ok"><IconCheck size={11} /></span>
                      ) : (
                        <span className="text-muted">&mdash;</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted text-center mt-6">
          Government and non-profit municipal bodies may qualify for reduced pricing.{' '}
          <a href="mailto:sales@civicflow.gov" className="text-accent font-medium">Contact sales</a> to discuss your city.
        </p>
      </section>
    </MarketingLayout>
  );
}
