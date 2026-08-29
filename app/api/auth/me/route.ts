import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAuthorityByUserId, getDeptAdminProfile } from '@/lib/queries';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  let extra: any = {};
  if (session.role === 'AUTHORITY') {
    const authority = await getAuthorityByUserId(session.sub);
    extra = {
      authorityStatus: authority?.status,
      authorityId: authority?.id,
      authorityCode: authority?.authority_code,
      designation: authority?.designation,
      departmentName: authority?.department_name,
      departmentId: authority?.department_id,
      zoneName: authority?.zone_name,
    };
  } else if (session.role === 'DEPT_ADMIN') {
    const profile = await getDeptAdminProfile(session.sub);
    extra = { departmentId: profile?.department_id, departmentName: profile?.department_name };
  }

  return NextResponse.json({
    user: { id: session.sub, name: session.name, email: session.email, role: session.role, ...extra },
  });
}
