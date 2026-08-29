import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createDeptAdmin, listDeptAdmins, writeAuditLog } from '@/lib/queries';
import { newTempPassword } from '@/lib/ids';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  return NextResponse.json({ deptAdmins: await listDeptAdmins() });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Only the Super Admin can create Department Admin accounts.' }, { status: 403 });
  }
  try {
    const { name, email, departmentId } = await req.json();
    if (!name || !email || !departmentId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const tempPassword = newTempPassword();
    const user = await createDeptAdmin({ name, email, departmentId, password: tempPassword });
    await writeAuditLog({
      actorName: session.name, actorRole: session.role, action: 'Created Department Admin',
      entityType: 'user', entityId: user.id, newValue: email,
    });
    return NextResponse.json({ ok: true, tempPassword });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to create Department Admin.' }, { status: 400 });
  }
}
