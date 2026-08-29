'use client';
import { type ReactNode } from 'react';
import { useTheme } from '@/lib/client/theme';
import { IconMoon, IconSun } from './Icons';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody } from './ui/dialog';

function statusMeta(s: string): { label: string; variant: 'muted' | 'warn' | 'ok' | 'bad' } {
  const map: Record<string, { label: string; variant: 'muted' | 'warn' | 'ok' | 'bad' }> = {
    SUBMITTED: { label: 'Submitted', variant: 'muted' },
    ASSIGNED: { label: 'Assigned', variant: 'warn' },
    ACCEPTED: { label: 'Accepted', variant: 'warn' },
    IN_PROGRESS: { label: 'In Progress', variant: 'warn' },
    RESOLVED: { label: 'Resolved · Awaiting your check', variant: 'ok' },
    CLOSED: { label: 'Closed', variant: 'ok' },
    REOPENED: { label: 'Reopened', variant: 'bad' },
  };
  return map[s] ?? { label: s, variant: 'muted' };
}

export function StatusBadge({ status }: { status: string }) {
  const m = statusMeta(status);
  const dotColor = { muted: 'var(--muted)', warn: 'var(--warn)', ok: 'var(--ok)', bad: 'var(--bad)' }[m.variant];
  return (
    <Badge variant={m.variant}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
      {m.label}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { variant: 'bad' | 'warn' | 'ok'; color: string }> = {
    HIGH: { variant: 'bad', color: 'var(--bad)' },
    MEDIUM: { variant: 'warn', color: 'var(--warn)' },
    LOW: { variant: 'ok', color: 'var(--ok)' },
  };
  const m = map[priority] ?? { variant: 'warn' as const, color: 'var(--muted)' };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: m.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
      {priority}
    </span>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink/70 hover:text-accent hover:border-accent transition-colors overflow-hidden"
    >
      <span key={theme} className="animate-[themePop_0.35s_ease-out]">
        {theme === 'light' ? <IconMoon size={16} /> : <IconSun size={16} />}
      </span>
    </button>
  );
}

export function Modal({
  open, onClose, title, children, width = 'max-w-lg',
}: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: string }) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className={width}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export function EmptyState({ icon, title, sub }: { icon: ReactNode; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 text-muted-foreground">
      <div className="w-12 h-12 rounded-full bg-accentSoft text-accent flex items-center justify-center mb-4">{icon}</div>
      <div className="text-foreground font-medium mb-1">{title}</div>
      <div className="text-sm max-w-sm">{sub}</div>
    </div>
  );
}
