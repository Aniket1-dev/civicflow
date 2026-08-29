import * as React from 'react';
import { Label } from './label';
import { cn } from '@/lib/utils';

function Field({
  label, hint, className, children,
}: { label?: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('block space-y-1.5', className)}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export { Field };
