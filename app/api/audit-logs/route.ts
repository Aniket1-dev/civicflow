import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { listAuditLogs } from '@/lib/queries';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  return NextResponse.json({ logs: await listAuditLogs() });
}
