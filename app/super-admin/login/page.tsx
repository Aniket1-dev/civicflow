"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SuperAdminLogin() {
  const router = useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(e:FormEvent){
    e.preventDefault(); setError(""); setLoading(true);
    try{
      const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error||"Unable to sign in.");
      if(d.user?.role!=="SUPER_ADMIN") throw new Error("This account does not have Super Admin access.");
      router.push("/super-admin/overview");
    }catch(err:any){setError(err.message||"Unable to sign in.");}
    finally{setLoading(false);}
  }
  return <main className="min-h-screen bg-bg text-ink">
    <header className="mx-auto flex h-[76px] max-w-[1240px] items-center border-b border-line px-5 sm:px-8">
      <Link href="/" className="flex items-center gap-3 text-[23px] font-bold tracking-[-.055em]">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#4d8dff] via-[#6255f5] to-[#9a55ef]"><span className="h-2.5 w-2.5 rounded-full bg-white"/></span>CivicFlow
      </Link>
    </header>
    <section id="main-content" className="flex min-h-[calc(100vh-76px)] items-center justify-center px-5 py-16">
      <div className="reveal w-full max-w-[420px]">
        <div className="mb-8 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accentSoft text-accent">◆</div><div className="mt-6 text-[10px] font-semibold uppercase tracking-[.16em] text-accent">Restricted access</div><h1 className="mt-2 text-[40px] font-bold tracking-[-.055em]">Super Admin</h1><p className="mt-3 text-sm leading-6 text-muted">Sign in to manage CivicFlow at the system level.</p></div>
        <form onSubmit={submit} className="space-y-4 rounded-[24px] border border-line bg-surface p-6 shadow-[0_20px_60px_rgba(16,24,40,.06)]">
          <label className="block text-sm font-medium">Email<input className="mt-2 h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required/></label>
          <label className="block text-sm font-medium">Password<input className="mt-2 h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/></label>
          {error&&<div className="rounded-xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">{error}</div>}
          <button disabled={loading} className="h-12 w-full rounded-full bg-gradient-to-r from-[#5367ff] to-[#7840ef] text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60">{loading?"Signing in…":"Continue →"}</button>
        </form>
        <p className="mt-6 text-center text-xs text-muted">Super Admin access is intentionally hidden from public sign-in.</p>
      </div>
    </section>
  </main>;
}
