'use client';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Btn } from '@/components/Button';
import { Field, Input } from '@/components/Form';
import { ThemeToggle } from '@/components/Feedback';
import { IconMapPin } from '@/components/Icons';
import { useSession } from '@/lib/client/session';

function AuthShell({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-[1240px] mx-auto w-full px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif-display text-lg">
          <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center"><IconMapPin size={12} /></span>CivicFlow
        </Link>
        <ThemeToggle />
      </div>
      <main id="main-content" className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[400px] reveal">
          <h1 className="font-serif-display text-3xl mb-2">{title}</h1>
          <p className="text-sm text-muted mb-8">{sub}</p>
          {children}
        </div>
      </main>
    </div>
  );
}

const HOME_FOR: Record<string, string> = {
  CITIZEN: '/citizen/dashboard',
  AUTHORITY: '/authority/dashboard',
  DEPT_ADMIN: '/dept-admin/overview',
  SUPER_ADMIN: '/super-admin/overview',
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const { refresh } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { const script=document.createElement('script'); script.src='https://accounts.google.com/gsi/client'; script.async=true; document.head.appendChild(script); return () => { script.remove(); }; }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Sign-in failed.');
        setLoading(false);
        return;
      }
      await refresh();
      if (data.user.role === 'CITIZEN' && next === 'report') router.push('/citizen/report');
      else router.push(HOME_FOR[data.user.role] ?? '/');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Sign in" sub="Sign in with your CivicFlow account.">
      <button type="button" onClick={()=>{const g=(window as any).google;if(!g||!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID){setError("Google Sign-In is not configured.");return;}g.accounts.id.initialize({client_id:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,callback:async(r:any)=>{try{const res=await fetch('/api/auth/google',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential:r.credential})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Google sign-in failed.');await refresh();router.push('/citizen/dashboard')}catch(e:any){setError(e.message)}}});g.accounts.id.prompt()}} className="mb-5 h-12 w-full rounded-full border border-line bg-surface text-sm font-semibold text-ink shadow-sm hover:bg-accentSoft">Continue with Google</button>
      <div className="mb-5 flex items-center gap-3"><span className="h-px flex-1 bg-line"/><span className="text-xs text-muted">or continue with email</span><span className="h-px flex-1 bg-line"/></div>
      <form className="space-y-4 mb-6" onSubmit={onSubmit}>
        <Field label="Email"><Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field label="Password"><Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
        {error && <div className="text-sm text-bad">{error}</div>}
        <Btn variant="accent" className="w-full" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Btn>
      </form>
      <p className="text-sm text-muted">New here? <Link href="/register" className="text-accent font-medium">Create a citizen account</Link></p>
      <p className="text-xs text-muted mt-6">
        Authority, department admin and super admin accounts can&rsquo;t be created here &mdash; they&rsquo;re issued internally
        by a Department Admin or Super Admin.
      </p>
    </AuthShell>
  );
}
