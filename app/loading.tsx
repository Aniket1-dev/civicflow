export default function Loading() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 reveal">
        <span className="relative flex h-10 w-10 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-line" />
          <span className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="w-3 h-3 rounded-full bg-accent pulse-soft" />
        </span>
        <span className="text-sm text-muted">Loading…</span>
      </div>
    </main>
  );
}
