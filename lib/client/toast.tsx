'use client';
import { toast as sonnerToast } from 'sonner';

/** Preserves the old `const toast = useToast(); toast('message')` call shape, now backed by sonner. */
export function useToast(): (msg: string) => void {
  return (msg: string) => sonnerToast(msg);
}
