import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  createComplaint, listComplaintsForCitizen, listComplaintsForAuthority,
  listComplaintsForDept, listAllComplaints, getAuthorityByUserId, getDeptAdminProfile,
} from '@/lib/queries';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  if (session.role === 'CITIZEN') {
    return NextResponse.json({ complaints: await listComplaintsForCitizen(session.sub) });
  }
  if (session.role === 'AUTHORITY') {
    const authority = await getAuthorityByUserId(session.sub);
    if (!authority) return NextResponse.json({ complaints: [] });
    return NextResponse.json({ complaints: await listComplaintsForAuthority(authority.id) });
  }
  if (session.role === 'DEPT_ADMIN') {
    const profile = await getDeptAdminProfile(session.sub);
    if (!profile) return NextResponse.json({ complaints: [] });
    return NextResponse.json({ complaints: await listComplaintsForDept(profile.department_id) });
  }
  if (session.role === 'SUPER_ADMIN') {
    return NextResponse.json({ complaints: await listAllComplaints() });
  }
  return NextResponse.json({ complaints: [] });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'CITIZEN') {
    return NextResponse.json({ error: 'Only citizens can file complaints.' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { title, description, categoryName, subcategoryName, address, landmark, ward, zoneId, evidenceUrls } = body;
    if (!title || !description || !categoryName || !subcategoryName || !address || !zoneId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const complaint = await createComplaint({
      title, description, categoryName, subcategoryName, address, landmark, ward, zoneId,
      evidenceUrls: evidenceUrls ?? [], reportedById: session.sub,
    });
    return NextResponse.json({ ok: true, complaint });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to submit complaint.' }, { status: 400 });
  }
}
