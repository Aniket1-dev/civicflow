'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar, TopBar, type SidebarItem } from './AppShell';
import { ThemeToggle } from './Feedback';
import { IconLogOut } from './Icons';
import { useSession } from '@/lib/client/session';

export function DashboardShell({
  items, allowedRole, title, children,
}: { items: SidebarItem[]; allowedRole: string; title?: string; children: ReactNode }) {
  const { user, loading, logout } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== allowedRole)) {
      router.replace('/signin');
    }
  }, [loading, user, allowedRole, router]);

  if (loading || !user || user.role !== allowedRole) {
    return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Loading…</div>;
  }

  const footer = (
    <button
      onClick={async () => { await logout(); router.push('/'); }}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-ink/70 hover:bg-line/50"
    >
      <IconLogOut size={16} />Logout
    </button>
  );

  return (
    <div className="flex">
      <AppSidebar items={items} footer={footer} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <TopBar onMenu={() => setSidebarOpen(true)} title={title} right={<ThemeToggle />} />
        <main id="main-content">{children}</main>
      </div>
    </div>
  );
}
