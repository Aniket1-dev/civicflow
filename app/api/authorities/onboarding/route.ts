import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAuthorityByUserId, submitAuthorityOnboarding } from '@/lib/queries';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'AUTHORITY') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }
  const authority = await getAuthorityByUserId(session.sub);
  if (!authority) return NextResponse.json({ error: 'No authority profile found.' }, { status: 400 });
  if (authority.status !== 'PENDING_ONBOARDING') {
    return NextResponse.json({ error: 'Onboarding already submitted.' }, { status: 400 });
  }

  const { employeeId, docUrl } = await req.json();
  if (!employeeId || !docUrl) {
    return NextResponse.json({ error: 'Employee ID and document are required.' }, { status: 400 });
  }
  await submitAuthorityOnboarding(authority.id, employeeId, docUrl);
  return NextResponse.json({ ok: true });
}
