import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createAuthority, listAuthoritiesForDept, getDeptAdminProfile, writeAuditLog } from '@/lib/queries';
import { newTempPassword } from '@/lib/ids';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'DEPT_ADMIN') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const profile = await getDeptAdminProfile(session.sub);
  if (!profile) return NextResponse.json({ authorities: [] });
  return NextResponse.json({ authorities: await listAuthoritiesForDept(profile.department_id) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'DEPT_ADMIN') {
    return NextResponse.json({ error: 'Only a Department Admin can create authority accounts.' }, { status: 403 });
  }
  const profile = await getDeptAdminProfile(session.sub);
  if (!profile) return NextResponse.json({ error: 'No department profile found.' }, { status: 400 });

  try {
    const body = await req.json();
    const { name, email, employeeId, designation, zoneId, phone } = body;
    if (!name || !email || !employeeId || !designation || !zoneId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const tempPassword = newTempPassword();
    const result = await createAuthority({
      name, email, employeeId, designation, zoneId, phone, departmentId: profile.department_id, tempPassword,
    });
    await writeAuditLog({
      actorName: session.name, actorRole: session.role, action: 'Created authority account',
      entityType: 'authority', entityId: result.authorityId, newValue: result.authorityCode,
    });
    return NextResponse.json({ ok: true, authorityCode: result.authorityCode, tempPassword });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to create authority.' }, { status: 400 });
  }
}
