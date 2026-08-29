'use client';
import Link from 'next/link';
import { Btn } from '@/components/Button';
import { IconMapPin } from '@/components/Icons';
import { useEntranceTimeline } from '@/hooks/use-gsap-reveal';

export default function NotFound() {
  const ref = useEntranceTimeline<HTMLDivElement>();

  return (
    <main className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center px-5 text-center">
      <div ref={ref}>
        <div data-enter className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-accentSoft text-accent drift">
          <IconMapPin size={24} />
        </div>
        <div data-enter className="editorial-label mb-2">404</div>
        <h1 data-enter className="font-serif-display text-3xl sm:text-4xl mb-3">Wrong turn.</h1>
        <p data-enter className="text-sm text-muted max-w-[360px] mx-auto mb-8">
          This page doesn&rsquo;t exist, or it may have moved. Let&rsquo;s get you back somewhere useful.
        </p>
        <div data-enter className="flex items-center justify-center gap-3">
          <Link href="/">
            <Btn variant="accent">Back to home</Btn>
          </Link>
          <Link href="/signin">
            <Btn variant="outline">Sign in</Btn>
          </Link>
        </div>
      </div>
    </main>
  );
}
