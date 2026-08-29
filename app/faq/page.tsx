import { MarketingLayout } from '@/components/MarketingLayout';
import { IconChevronRight } from '@/components/Icons';

const FAQS: [string, [string, string][]][] = [
  ['For citizens', [
    ['Is CivicFlow free to use?', 'Yes. Reporting a civic issue and tracking it through to resolution is always free for citizens, regardless of which pricing tier your city is on.'],
    ['Do I need to create an account?', 'Yes, a free citizen account lets us send you status updates and lets you verify when an issue has actually been fixed.'],
    ['What happens after I submit a report?', 'CivicFlow checks for duplicate reports nearby, categorizes the issue, and routes it to the verified authority responsible for that zone. You\u2019ll see status updates in your dashboard as it moves from Submitted through to Resolved.'],
    ['What if the fix isn\u2019t actually done?', 'When an authority marks a complaint Resolved, you\u2019re asked to verify it. If it isn\u2019t actually fixed, you can reopen it and it gets escalated.'],
  ]],
  ['For departments & authorities', [
    ['How do authority accounts get created?', 'Authority, Department Admin, and Super Admin accounts are issued internally by a Department Admin or Super Admin \u2014 they can\u2019t be created through public registration, for security.'],
    ['How does routing work?', 'Each complaint category maps to a responsible department and zone. CivicFlow auto-assigns new complaints to the correct verified authority and starts an SLA clock.'],
    ['What happens if an SLA is breached?', 'Complaints approaching or past their SLA deadline are automatically flagged for escalation to the Department Admin.'],
  ]],
  ['Billing & plans', [
    ['Which plan is right for us?', 'Ward is a good fit for a single ward or small municipality piloting the platform. City fits a full city corporation running several departments. State is for multi-city rollouts \u2014 see the Pricing page for a full comparison.'],
    ['Do you offer reduced pricing for government bodies?', 'Yes \u2014 government and non-profit municipal bodies may qualify for reduced pricing. Contact sales to discuss your city\u2019s specific needs.'],
    ['Can we change plans later?', 'Yes, you can move between tiers at any time as your rollout grows; we\u2019ll help migrate your data.'],
  ]],
  ['Security & data', [
    ['Where is our data stored?', 'Data is stored in encrypted, access-controlled infrastructure. See our Privacy Policy for full details on data handling.'],
    ['Can we export our data?', 'Yes, City and State tier customers can export complaint and audit data at any time.'],
    ['Is CivicFlow accessible?', 'Yes \u2014 see our Accessibility Statement for our WCAG 2.1 AA conformance details and the accessibility bar available on every page.'],
  ]],
];

export default function FaqPage() {
  return (
    <MarketingLayout>
      <section className="max-w-[820px] mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-24">
        <div className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase mb-4 text-center">FAQ</div>
        <h1 className="font-serif-display text-[36px] sm:text-[44px] leading-[1.05] tracking-tight mb-4 text-center">
          Frequently asked questions.
        </h1>
        <p className="text-[17px] text-muted max-w-lg mx-auto leading-relaxed text-center mb-14">
          Can&rsquo;t find what you&rsquo;re looking for? Reach us at{' '}
          <a href="mailto:support@civicflow.gov" className="text-accent font-medium">support@civicflow.gov</a>.
        </p>

        <div className="space-y-10">
          {FAQS.map(([group, items]) => (
            <div key={group}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">{group}</h2>
              <div className="editorial-card divide-y divide-line">
                {items.map(([q, a]) => (
                  <details key={q} className="group p-5">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-sm">
                      {q}
                      <IconChevronRight size={16} className="shrink-0 text-muted transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="text-sm text-muted leading-relaxed mt-3">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
