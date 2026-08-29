import { MarketingLayout } from '@/components/MarketingLayout';

const SECTIONS: [string, string][] = [
  ['Information we collect', 'When you create an account we collect your name, email address, phone number, and password (stored as a salted hash). When you file a report we collect the description, category, photos, and the location you pin — location data is only ever used to route and display your report.'],
  ['How we use it', 'Your information is used to operate the platform: authenticating you, routing complaints to the correct authority, sending status notifications, and producing anonymised, aggregate statistics for department dashboards. We do not sell personal data to third parties.'],
  ['Who can see your reports', 'The authority assigned to a complaint can see the details needed to resolve it, including your contact information for follow-up. Department admins and super admins can see complaints within their jurisdiction for oversight and escalation.'],
  ['Data retention', 'Complaint records are retained for as long as your account is active and for a further period afterwards as required for public-record and audit purposes. You can request deletion of your account data at any time, subject to those retention requirements.'],
  ['Your rights', 'You can access, correct, or request export of your personal data from your Profile page at any time. To request deletion, contact us using the details below.'],
  ['Cookies', 'We use strictly necessary cookies to keep you signed in and to remember your theme and accessibility preferences. We do not use third-party advertising or tracking cookies.'],
  ['Security', 'Passwords are hashed, all traffic is encrypted in transit, and access to production data is restricted to authorised personnel on a need-to-know basis.'],
];

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <section className="max-w-[820px] mx-auto px-5 sm:px-8 pt-14 pb-24">
        <div className="editorial-label mb-3">Legal</div>
        <h1 className="font-serif-display text-4xl mb-4">Privacy Policy</h1>
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
          <h2 className="font-serif-display text-lg mb-2">Questions about this policy</h2>
          <p className="text-sm text-muted leading-relaxed">
            Contact our Data Protection Officer at{' '}
            <a href="mailto:privacy@civicflow.gov" className="text-accent font-medium">privacy@civicflow.gov</a>.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
