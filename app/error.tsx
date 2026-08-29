'use client';
import { useEffect } from 'react';
import { Btn } from '@/components/Button';
import { IconTriangleAlert } from '@/components/Icons';
import { useEntranceTimeline } from '@/hooks/use-gsap-reveal';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const ref = useEntranceTimeline<HTMLDivElement>();

  useEffect(() => {
    // Errors here still land in the server/console logs via digest; this just
    // keeps a client-side breadcrumb during development.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center px-5 text-center">
      <div ref={ref}>
        <div data-enter className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-bad/10 text-bad animate-[wiggle_0.5s_ease-in-out_1]">
          <IconTriangleAlert size={24} />
        </div>
        <div data-enter className="editorial-label mb-2">Something broke</div>
        <h1 data-enter className="font-serif-display text-3xl sm:text-4xl mb-3">That wasn&rsquo;t supposed to happen.</h1>
        <p data-enter className="text-sm text-muted max-w-[380px] mx-auto mb-8">
          An unexpected error occurred while loading this page. You can try again, or head back to safety.
        </p>
        <div data-enter className="flex items-center justify-center gap-3">
          <Btn variant="accent" onClick={() => reset()}>Try again</Btn>
          <Btn variant="outline" onClick={() => { window.location.href = '/'; }}>Back to home</Btn>
        </div>
      </div>
    </main>
  );
}
