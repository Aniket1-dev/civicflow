import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide w-fit whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground',
        outline: 'border border-border text-foreground',
        ok: 'text-ok bg-ok/15',
        warn: 'text-warn bg-warn/15',
        bad: 'text-bad bg-bad/15',
        muted: 'text-muted-foreground bg-muted-foreground/10',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
