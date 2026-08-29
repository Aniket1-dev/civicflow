import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getAuthorityByUserId, getDeptAdminProfile } from '@/lib/queries';
import { verifyPassword, createSessionToken, setSessionCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await createSessionToken({ sub: user.id, role: user.role, name: user.name, email: user.email });
    await setSessionCookie(token);

    let extra: any = {};
    if (user.role === 'AUTHORITY') {
      const authority = await getAuthorityByUserId(user.id);
      extra = { authorityStatus: authority?.status, authorityId: authority?.id };
    } else if (user.role === 'DEPT_ADMIN') {
      const profile = await getDeptAdminProfile(user.id);
      extra = { departmentId: profile?.department_id, departmentName: profile?.department_name };
    }

    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, ...extra } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Login failed.' }, { status: 500 });
  }
}
