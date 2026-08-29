import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'File storage is not configured yet. Add the Vercel Blob integration to enable uploads.' },
      { status: 400 }
    );
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 });

  const blob = await put(`${session.sub}/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return NextResponse.json({ ok: true, url: blob.url });
}
