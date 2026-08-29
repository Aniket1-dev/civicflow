'use client';
import { useTheme } from '@/lib/client/theme';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster(props: ToasterProps) {
  const { theme } = useTheme();
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-center"
      style={
        {
          '--normal-bg': 'var(--surface)',
          '--normal-text': 'var(--ink)',
          '--normal-border': 'var(--line)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
