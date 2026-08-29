import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button as UIButton } from './ui/button';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

// Old variant/size names -> real shadcn/ui Button variant/size names.
const VARIANT_MAP = {
  primary: 'default',
  accent: 'accent',
  outline: 'outline',
  ghost: 'ghost',
  danger: 'destructive',
} as const;
const SIZE_MAP = { sm: 'sm', md: 'default', lg: 'lg' } as const;

export function Btn({ children, variant = 'primary', size = 'md', ...props }: BtnProps) {
  return (
    <UIButton variant={VARIANT_MAP[variant]} size={SIZE_MAP[size]} {...props}>
      {children}
    </UIButton>
  );
}
