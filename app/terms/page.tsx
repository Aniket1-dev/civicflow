import { MarketingLayout } from '@/components/MarketingLayout';

const SECTIONS: [string, string][] = [
  ['Acceptance of terms', 'By creating an account or using CivicFlow, you agree to these Terms of Service and to our Privacy Policy. If you are using CivicFlow on behalf of a government department or authority, you confirm you are authorised to do so.'],
  ['Acceptable use', 'CivicFlow is for reporting genuine civic issues. Submitting knowingly false reports, harassing authority staff, or attempting to interfere with the platform\u2019s operation may result in account suspension.'],
  ['Accounts and roles', 'Citizen accounts can be created by anyone. Authority, Department Admin, and Super Admin accounts are issued internally and are not available through public registration. You are responsible for keeping your credentials confidential.'],
  ['Service levels', 'Complaints are assigned a Service Level Agreement (SLA) target based on category and priority. SLA targets are operational guidance, not a legally binding guarantee of resolution time.'],
  ['Content you submit', 'You retain ownership of photos and descriptions you submit, but grant CivicFlow and the relevant authority a licence to use them for the purpose of investigating and resolving the reported issue, and for anonymised public reporting.'],
  ['Availability', 'We aim for high availability but do not guarantee the service will be uninterrupted or error-free. Planned maintenance will be posted on the Status page where possible.'],
  ['Changes to these terms', 'We may update these terms from time to time. Material changes will be notified in-app before they take effect.'],
];

export default function TermsPage() {
  return (
    <MarketingLayout>
      <section className="max-w-[820px] mx-auto px-5 sm:px-8 pt-14 pb-24">
        <div className="editorial-label mb-3">Legal</div>
        <h1 className="font-serif-display text-4xl mb-4">Terms of Service</h1>
        <p className="text-xs text-muted mb-10">Last updated: 29 August 2026</p>

        <div className="space-y-8">
          {SECTIONS.map(([title, body]) => (
            <div key={title} className="editorial-rule pt-6 first:border-t-0 first:pt-0">
              <h2 className="font-serif-display text-lg mb-2">{title}</h2>
              <p className="text-sm text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 editorial-card p-6">
          <h2 className="font-serif-display text-lg mb-2">Questions about these terms</h2>
          <p className="text-sm text-muted leading-relaxed">
            Contact us at{' '}
            <a href="mailto:legal@civicflow.gov" className="text-accent font-medium">legal@civicflow.gov</a>.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
