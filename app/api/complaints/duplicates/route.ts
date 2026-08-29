import { NextRequest, NextResponse } from 'next/server';
import { getSubcategoryByName, getCategoryByName, findDuplicateComplaints } from '@/lib/queries';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryName = searchParams.get('category');
  const subcategoryName = searchParams.get('subcategory');
  const zoneId = searchParams.get('zoneId');
  if (!categoryName || !subcategoryName || !zoneId) {
    return NextResponse.json({ duplicates: [] });
  }
  const category = await getCategoryByName(categoryName);
  if (!category) return NextResponse.json({ duplicates: [] });
  const subcategory = await getSubcategoryByName(category.id, subcategoryName);
  if (!subcategory) return NextResponse.json({ duplicates: [] });
  const duplicates = await findDuplicateComplaints(subcategory.id, zoneId);
  return NextResponse.json({ duplicates });
}
