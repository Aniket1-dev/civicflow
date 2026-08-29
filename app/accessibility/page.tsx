import { MarketingLayout } from '@/components/MarketingLayout';
import { IconCheck } from '@/components/Icons';

const COMMITMENTS = [
  'All pages are navigable using only a keyboard, including menus, forms, and dialogs.',
  'A "Skip to main content" link is available at the top of every page for keyboard and screen-reader users.',
  'Text size can be increased in two steps from the accessibility bar without breaking layout.',
  'A high-contrast display mode is available from the accessibility bar for low-vision users.',
  'Colour is never used as the only way to convey status — every status also has a text label.',
  'Interactive elements have visible focus outlines and descriptive aria-labels.',
  'The site respects your operating system\u2019s "reduce motion" setting and disables animation accordingly.',
];

export default function AccessibilityPage() {
  return (
    <MarketingLayout>
      <section className="max-w-[820px] mx-auto px-5 sm:px-8 pt-14 pb-24">
        <div className="editorial-label mb-3">Accessibility Statement</div>
        <h1 className="font-serif-display text-4xl mb-4">Built to work for everyone.</h1>
        <p className="text-muted leading-relaxed mb-2">
          CivicFlow is committed to ensuring digital accessibility for people of all abilities. We are
          actively working to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA,
          consistent with the standards expected of public-facing government service platforms.
        </p>
        <p className="text-xs text-muted mb-10">Last reviewed: 29 August 2026</p>

        <div className="editorial-card p-6 sm:p-8 mb-10">
          <h2 className="font-serif-display text-xl mb-4">What we&rsquo;ve implemented</h2>
          <ul className="space-y-3">
            {COMMITMENTS.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ok/15 text-ok"><IconCheck size={12} /></span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <h2 className="font-serif-display text-xl mb-3">Using the accessibility bar</h2>
        <p className="text-sm text-muted leading-relaxed mb-6">
          Every page has a thin bar at the very top with controls for text size (A-, A, A+), a
          high-contrast toggle, and this Screen Reader Access page. Your preferences are saved to this
          device and applied automatically the next time you visit.
        </p>

        <h2 className="font-serif-display text-xl mb-3">Screen reader compatibility</h2>
        <p className="text-sm text-muted leading-relaxed mb-6">
          CivicFlow is tested against NVDA and VoiceOver. Forms use associated labels, status changes are
          announced via live regions, and all icon-only buttons include a text alternative.
        </p>

        <h2 className="font-serif-display text-xl mb-3">Let us know</h2>
        <p className="text-sm text-muted leading-relaxed">
          If you encounter any barrier while using CivicFlow, please contact our accessibility team at{' '}
          <a href="mailto:accessibility@civicflow.gov" className="text-accent font-medium">accessibility@civicflow.gov</a>{' '}
          with the page URL and a description of the issue. We aim to respond within 3 business days.
        </p>
      </section>
    </MarketingLayout>
  );
}
