import { NextResponse } from 'next/server';
import { listDepartments, listZones, listCategoriesWithSubs } from '@/lib/queries';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const [departments, zones, categories] = await Promise.all([
      listDepartments(),
      listZones(),
      listCategoriesWithSubs(),
    ]);
    return NextResponse.json({ departments, zones, categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to load reference data.' }, { status: 500 });
  }
}
