import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  getComplaintById, addTimelineEvent, addComment, updateComplaintStatus, resolveComplaint,
  getAuthorityByUserId, getDeptAdminProfile, writeAuditLog,
} from '@/lib/queries';

export const runtime = 'nodejs';

async function authorizeAccess(complaint: any, session: any) {
  if (session.role === 'SUPER_ADMIN') return true;
  if (session.role === 'CITIZEN') return complaint.reported_by_id === session.sub;
  if (session.role === 'AUTHORITY') {
    const authority = await getAuthorityByUserId(session.sub);
    return authority && complaint.authority_id === authority.id;
  }
  if (session.role === 'DEPT_ADMIN') {
    const profile = await getDeptAdminProfile(session.sub);
    return profile && complaint.department_id === profile.department_id;
  }
  return false;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  const { id } = await params;
  const complaint = await getComplaintById(id);
  if (!complaint) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  if (!(await authorizeAccess(complaint, session))) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }
  return NextResponse.json({ complaint });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  const { id } = await params;
  const complaint = await getComplaintById(id);
  if (!complaint) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  if (!(await authorizeAccess(complaint, session))) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const body = await req.json();
  const { action, payload } = body;

  try {
    switch (action) {
      case 'accept': {
        if (session.role !== 'AUTHORITY') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        if (complaint.status !== 'ASSIGNED') return NextResponse.json({ error: 'Complaint is not awaiting acceptance.' }, { status: 400 });
        await updateComplaintStatus(complaint.id, 'ACCEPTED');
        await addTimelineEvent(complaint.id, 'Accepted');
        break;
      }
      case 'start': {
        if (session.role !== 'AUTHORITY') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        if (!['ACCEPTED', 'ASSIGNED'].includes(complaint.status)) return NextResponse.json({ error: 'Cannot start work from current status.' }, { status: 400 });
        await updateComplaintStatus(complaint.id, 'IN_PROGRESS');
        await addTimelineEvent(complaint.id, 'Work started');
        break;
      }
      case 'resolve': {
        if (session.role !== 'AUTHORITY') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        if (complaint.status !== 'IN_PROGRESS') return NextResponse.json({ error: 'Complaint must be in progress to resolve.' }, { status: 400 });
        await resolveComplaint(complaint.id, payload?.description ?? '', payload?.beforeUrl, payload?.afterUrl);
        break;
      }
      case 'reassign': {
        if (session.role !== 'AUTHORITY') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        await addTimelineEvent(complaint.id, 'Reassignment requested by authority');
        break;
      }
      case 'verify-yes': {
        if (session.role !== 'CITIZEN') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        if (complaint.status !== 'RESOLVED') return NextResponse.json({ error: 'Complaint is not awaiting verification.' }, { status: 400 });
        await updateComplaintStatus(complaint.id, 'CLOSED');
        await addTimelineEvent(complaint.id, 'Citizen verified resolution — closed');
        break;
      }
      case 'reopen': {
        if (session.role !== 'CITIZEN') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        if (complaint.status !== 'RESOLVED') return NextResponse.json({ error: 'Complaint is not awaiting verification.' }, { status: 400 });
        await updateComplaintStatus(complaint.id, 'REOPENED');
        await addTimelineEvent(complaint.id, `Reopened: ${payload?.reason ?? 'no reason given'}`);
        break;
      }
      case 'comment': {
        await addComment(complaint.id, session.name, payload?.text ?? '');
        break;
      }
      default:
        return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
    }

    await writeAuditLog({
      actorName: session.name, actorRole: session.role, action, entityType: 'complaint', entityId: complaint.id,
      previousValue: complaint.status, newValue: action,
    });

    const updated = await getComplaintById(complaint.id);
    return NextResponse.json({ ok: true, complaint: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Action failed.' }, { status: 400 });
  }
}
