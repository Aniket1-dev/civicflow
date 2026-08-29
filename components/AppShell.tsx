'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { IconMapPin, IconMenu } from './Icons';

export interface SidebarItem {
  key: string;
  label: string;
  icon: ReactNode;
  href: string;
}

export function AppSidebar({
  items, footer, open, onClose, brand = 'CivicFlow',
}: { items: SidebarItem[]; footer?: ReactNode; open: boolean; onClose: () => void; brand?: string }) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;
    if (open) {
      gsap.set(overlayRef.current, { display: 'block' });
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
      gsap.fromTo(drawerRef.current, { x: '-100%' }, { x: '0%', duration: 0.35, ease: 'power3.out' });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power1.in' });
      gsap.to(drawerRef.current, {
        x: '-100%', duration: 0.3, ease: 'power3.in',
        onComplete: () => { if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' }); },
      });
    }
  }, [open]);

  const Body = (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-line shrink-0">
        <div className="flex items-center gap-2 font-serif-display text-lg">
          <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center"><IconMapPin size={12} /></span>
          {brand}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/');
          return (
            <Link
              key={it.key}
              href={it.href}
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] transition-colors ${
                active ? 'bg-accentSoft text-accent font-medium' : 'text-ink/70 hover:bg-line/50 hover:text-ink'
              }`}
            >
              {it.icon}{it.label}
            </Link>
          );
        })}
      </nav>
      {footer && <div className="p-3 border-t border-line shrink-0">{footer}</div>}
    </div>
  );
  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 border-r border-line h-screen sticky top-0 bg-surface">{Body}</aside>
      <div ref={overlayRef} className="fixed inset-0 z-[95] lg:hidden" style={{ display: 'none' }}>
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div ref={drawerRef} className="absolute left-0 top-0 bottom-0 w-72 bg-surface">{Body}</div>
      </div>
    </>
  );
}

export function TopBar({ onMenu, right, title }: { onMenu: () => void; right?: ReactNode; title?: string }) {
  return (
    <div className="h-16 border-b border-line flex items-center justify-between px-5 sm:px-8 sticky top-0 bg-bg/90 backdrop-blur z-40">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onMenu}><IconMenu size={20} /></button>
        {title && <div className="font-medium text-sm">{title}</div>}
      </div>
      <div className="flex items-center gap-3">{right}</div>
    </div>
  );
}
