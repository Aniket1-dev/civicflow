'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Card } from '@/components/Form';
import { Btn } from '@/components/Button';
import { Modal } from '@/components/Feedback';
import { CityScene } from '@/components/CityScene';
import { IconChevronRight, IconPlay, IconUser, IconShield } from '@/components/Icons';
import { useScrollReveal, useEntranceTimeline } from '@/hooks/use-gsap-reveal';

const STEPS: [string, string, string][] = [
  ['01', 'Report a Problem', 'Add a description, pin the exact location and attach a photo or two.'],
  ['02', 'We Process It', 'CivicFlow categorizes the issue, checks for duplicates, and works out who should handle it.'],
  ['03', 'Action Is Taken', 'The correct verified authority in your zone receives it, with an SLA clock running.'],
  ['04', 'You Verify', "Once marked resolved, you confirm the fix — or reopen it if it isn't actually done."],
];

function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const steps = ['Citizen report', 'System analyzes', 'Category detected', 'Department identified', 'Verified authority assigned', 'Issue resolved', 'Citizen verifies'];
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-step]');
    const tl = gsap.timeline();
    tl.fromTo(items, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', stagger: 0.12 });
    return () => { tl.kill(); };
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="CivicFlow in 3D" width="max-w-2xl">
      <div className="aspect-video rounded-md bg-bg border border-line flex flex-col items-center justify-center gap-4 px-6">
        <div ref={listRef} className="grid grid-cols-1 gap-2 w-full max-w-sm">
          {steps.map((s, i) => (
            <div key={s} data-step className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-accentSoft text-accent flex items-center justify-center text-[11px] font-semibold shrink-0">{i + 1}</span>
              <span className="text-ink/80">{s}</span>
              {i < steps.length - 1 && <span className="flex-1 h-px bg-line ml-1" />}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted mt-3">A walkthrough animation would render here in production — shown here as a step sequence.</p>
    </Modal>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [videoOpen, setVideoOpen] = useState(false);
  const heroRef = useEntranceTimeline<HTMLElement>();
  const featureRef = useScrollReveal<HTMLElement>();
  const howRef = useScrollReveal<HTMLElement>();
  const audienceRef = useScrollReveal<HTMLElement>();
  const aboutRef = useScrollReveal<HTMLElement>();
  const cityCardRef = useRef<HTMLDivElement | null>(null);

  // Subtle continuous float on the city scene card, independent of scroll.
  useEffect(() => {
    if (!cityCardRef.current) return;
    const tween = gsap.to(cityCardRef.current, {
      y: -8,
      duration: 3.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
    return () => { tween.kill(); };
  }, []);

  return (
    <MarketingLayout>
      <section ref={heroRef} className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-8 grid lg:grid-cols-2 gap-12 items-center">
        <div data-enter>
          <div className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase mb-5">Smart Civic Infrastructure</div>
          <h1 className="font-serif-display text-[38px] sm:text-[52px] leading-[1.05] tracking-tight mb-6">
            Your city has problems.<br />Now there&rsquo;s a better way to solve them.
          </h1>
          <p className="text-[17px] text-muted max-w-md mb-8 leading-relaxed">
            Report civic issues, track their progress, and make sure the right people are actually working to solve them.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Btn variant="accent" size="lg" onClick={() => router.push('/signin?next=report')}>Report a Problem <IconChevronRight size={16} /></Btn>
            <a href="#how"><Btn variant="outline" size="lg">See How It Works</Btn></a>
          </div>
        </div>
        <div data-enter className="relative">
          <div ref={cityCardRef}>
            <Card className="p-4 sm:p-6">
              <CityScene />
              <button onClick={() => setVideoOpen(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-3 group">
                <span className="w-16 h-16 rounded-full bg-surface/90 border border-line flex items-center justify-center text-accent group-hover:scale-105 transition-transform shadow-sm">
                  <IconPlay size={22} />
                </span>
                <span className="text-xs font-semibold bg-surface/90 border border-line px-3 py-1.5 rounded-full">Watch CivicFlow in 3D</span>
              </button>
            </Card>
          </div>
        </div>
      </section>

      <section ref={featureRef} className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 border-t border-line mt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            ['Report', 'Submit civic issues in just a few taps.'],
            ['Track', 'Track real-time progress on an SLA clock.'],
            ['Resolve', 'Verified authorities take action.'],
            ['Verify', 'You confirm the resolution actually worked.'],
          ].map(([t, d], i) => (
            <div key={t} data-reveal className={i > 0 ? 'sm:border-l sm:border-line sm:pl-8' : ''}>
              <div className="font-serif-display text-xl mb-2">{t}</div>
              <div className="text-sm text-muted leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={howRef} id="how" className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 border-t border-line">
        <div data-reveal className="mb-12 max-w-lg">
          <div className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase mb-3">How it works</div>
          <h2 className="font-serif-display text-3xl sm:text-4xl">A short, traceable path from report to resolution.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {STEPS.map(([n, t, d]) => (
            <div key={n} data-reveal className="flex gap-5">
              <div className="font-serif-display text-3xl text-accent/70 w-12 shrink-0">{n}</div>
              <div>
                <div className="font-medium text-lg mb-1.5">{t}</div>
                <div className="text-sm text-muted leading-relaxed">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={audienceRef} className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 border-t border-line grid lg:grid-cols-2 gap-6">
        <Card id="citizens" data-reveal className="p-8">
          <IconUser size={22} className="text-accent mb-4" />
          <div className="font-serif-display text-2xl mb-2">For Citizens</div>
          <p className="text-sm text-muted mb-6 leading-relaxed">Report a problem in minutes, watch it move through a real SLA, and get the final say on whether it was actually fixed.</p>
          <Btn variant="outline" onClick={() => router.push('/signin')}>Sign in as a citizen</Btn>
        </Card>
        <Card id="authorities" data-reveal className="p-8">
          <IconShield size={22} className="text-accent mb-4" />
          <div className="font-serif-display text-2xl mb-2">For Authorities</div>
          <p className="text-sm text-muted mb-6 leading-relaxed">Authority accounts are issued by a Department Admin and verified before use &mdash; there is no public sign-up for this role.</p>
          <Btn variant="outline" onClick={() => router.push('/signin')}>Sign in as an authority</Btn>
        </Card>
      </section>

      <section ref={aboutRef} id="about" className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 border-t border-line">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <h2 data-reveal className="font-serif-display text-3xl sm:text-4xl leading-tight">Built so every report has an owner, a clock, and an answer.</h2>
          <p data-reveal id="contact" className="text-muted leading-relaxed">
            CivicFlow exists because most civic complaints disappear into a queue no one can see. Every report here is categorized,
            assigned to a verified authority, held to a visible SLA, and closed only once the citizen who filed it agrees it&rsquo;s
            actually fixed. Questions or partnership enquiries: <span className="text-ink">hello@civicflow.app</span>
          </p>
        </div>
      </section>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </MarketingLayout>
  );
}
