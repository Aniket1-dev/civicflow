import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { verifyAuthority, getAuthorityById, getDeptAdminProfile, writeAuditLog } from '@/lib/queries';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'DEPT_ADMIN') {
    return NextResponse.json({ error: 'Only a Department Admin can verify authorities.' }, { status: 403 });
  }
  const { id } = await params;
  const authority = await getAuthorityById(id);
  if (!authority) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const profile = await getDeptAdminProfile(session.sub);
  if (!profile || profile.department_id !== authority.department_id) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const { status, reason } = await req.json();
  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }
  if (status === 'REJECTED' && !reason) {
    return NextResponse.json({ error: 'A rejection reason is required.' }, { status: 400 });
  }

  await verifyAuthority(id, status, reason);
  await writeAuditLog({
    actorName: session.name, actorRole: session.role, action: `Authority ${status.toLowerCase()}`,
    entityType: 'authority', entityId: id, previousValue: authority.status, newValue: status,
  });

  return NextResponse.json({ ok: true });
}
