import Link from 'next/link';
import { MarketingLayout } from '@/components/MarketingLayout';

const GROUPS: [string, [string, string][]][] = [
  ['General', [
    ['Home', '/'],
    ['Sign in', '/signin'],
    ['Create citizen account', '/register'],
    ['Pricing', '/pricing'],
    ['FAQ', '/faq'],
    ['System status', '/status'],
  ]],
  ['Citizen', [
    ['Dashboard', '/citizen/dashboard'],
    ['My Complaints', '/citizen/complaints'],
    ['Report a Problem', '/citizen/report'],
    ['Notifications', '/citizen/notifications'],
    ['Feedback', '/citizen/feedback'],
    ['Profile', '/citizen/profile'],
    ['Help', '/citizen/help'],
  ]],
  ['Authority', [
    ['Dashboard', '/authority/dashboard'],
    ['My Assigned Complaints', '/authority/complaints'],
    ['Profile', '/authority/profile'],
  ]],
  ['Department Admin', [
    ['Overview', '/dept-admin/overview'],
    ['Complaints', '/dept-admin/complaints'],
    ['Authorities', '/dept-admin/authorities'],
    ['Escalations', '/dept-admin/escalations'],
  ]],
  ['Super Admin', [
    ['Sign in', '/super-admin/login'],
    ['Overview', '/super-admin/overview'],
    ['Departments', '/super-admin/departments'],
    ['Department Admins', '/super-admin/dept-admins'],
    ['Audit Logs', '/super-admin/audit'],
  ]],
  ['Legal & Accessibility', [
    ['Privacy Policy', '/privacy'],
    ['Terms of Service', '/terms'],
    ['Accessibility Statement', '/accessibility'],
  ]],
];

export default function SitemapPage() {
  return (
    <MarketingLayout>
      <section className="max-w-[960px] mx-auto px-5 sm:px-8 pt-14 pb-24">
        <div className="editorial-label mb-3">Navigation</div>
        <h1 className="font-serif-display text-4xl mb-4">Sitemap</h1>
        <p className="text-sm text-muted leading-relaxed mb-10 max-w-lg">
          Every page on CivicFlow, grouped by who it&rsquo;s for. Role-specific pages require signing in with
          the corresponding account type.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {GROUPS.map(([group, links]) => (
            <div key={group}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">{group}</h2>
              <ul className="space-y-2">
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-ink/80 hover:text-accent transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
