'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Btn } from '@/components/Button';
import { Field, Input } from '@/components/Form';
import { ThemeToggle } from '@/components/Feedback';
import { IconMapPin } from '@/components/Icons';
import { useSession } from '@/lib/client/session';

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Registration failed.');
        setLoading(false);
        return;
      }
      await refresh();
      router.push('/citizen/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

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
          <h1 className="font-serif-display text-3xl mb-2">Create your account</h1>
          <p className="text-sm text-muted mb-8">Public registration always creates a citizen account.</p>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aniket Sharma" required /></Field>
            <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></Field>
            <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9xxxxxxxxx" /></Field>
            <Field label="Password" hint="At least 8 characters."><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required minLength={8} /></Field>
            {error && <div className="text-sm text-bad">{error}</div>}
            <Btn variant="accent" className="w-full" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</Btn>
          </form>
          <p className="text-sm text-muted mt-6">Already have an account? <Link href="/signin" className="text-accent font-medium">Sign in</Link></p>
        </div>
      </main>
    </div>
  );
}
