'use client';
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-2', className)} {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn('inline-flex items-center gap-1 border-b border-border', className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'px-4 py-2.5 text-sm capitalize border-b-2 -mb-px border-transparent text-muted-foreground transition-colors',
        'data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-medium',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-t-sm',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('outline-none', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
