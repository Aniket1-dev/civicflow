import { NextRequest, NextResponse } from 'next/server';
import { createCitizen } from '@/lib/queries';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
    }
    if (String(password).length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    const user = await createCitizen({ name, email, phone, password });
    const token = await createSessionToken({ sub: user.id, role: 'CITIZEN', name: user.name, email: user.email });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: 'CITIZEN' } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Registration failed.' }, { status: 400 });
  }
}
