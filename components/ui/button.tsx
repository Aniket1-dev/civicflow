import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:opacity-90 border border-foreground',
        accent: 'bg-primary text-primary-foreground hover:brightness-105 border border-primary',
        outline: 'bg-transparent text-foreground border border-border hover:border-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:brightness-95 border border-transparent',
        ghost: 'bg-transparent text-foreground/70 hover:text-foreground border border-transparent',
        destructive: 'bg-transparent text-destructive border border-destructive/40 hover:bg-destructive/10',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2.5 text-sm',
        sm: 'h-8 px-3.5 py-1.5 text-[13px]',
        lg: 'h-12 px-6 py-3.5 text-[15px]',
        icon: 'size-9 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className, variant, size, asChild = false, ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
