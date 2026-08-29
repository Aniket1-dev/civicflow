import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';
import { sql } from '@/lib/db';
import { newId } from '@/lib/ids';
import { hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

const DEPARTMENTS = [
  { name: 'Public Works Department', code: 'PWD', slaHours: 48 },
  { name: 'Sanitation Department', code: 'SAN', slaHours: 24 },
  { name: 'Electricity Department', code: 'ELE', slaHours: 24 },
  { name: 'Water Supply Department', code: 'WAT', slaHours: 36 },
];

const ZONES = ['Ghaziabad East', 'Ghaziabad West', 'Ghaziabad North', 'Ghaziabad South'];

const CATEGORIES: Record<string, { dept: string; subs: string[] }> = {
  'Road & Infrastructure': { dept: 'PWD', subs: ['Pothole', 'Broken Road', 'Footpath Damage', 'Broken Divider'] },
  Sanitation: { dept: 'SAN', subs: ['Garbage Overflow', 'Missed Collection', 'Open Dump', 'Public Toilet'] },
  Electricity: { dept: 'ELE', subs: ['Street Light', 'Power Pole', 'Exposed Wire', 'Transformer Fault'] },
  'Water Supply': { dept: 'WAT', subs: ['Water Leakage', 'No Water Supply', 'Contaminated Water', 'Pipe Burst'] },
};

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-setup-token');
  if (!process.env.SETUP_TOKEN || token !== process.env.SETUP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized. Provide the correct x-setup-token header.' }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not set yet. Connect the Neon integration first.' }, { status: 400 });
  }

  try {
    const schemaSql = readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf-8');
    const statements = schemaSql.split(';').map((s) => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await sql().query(stmt);
    }

    const existingDepts = await sql()`SELECT COUNT(*)::int as count FROM departments`;
    if (existingDepts[0].count > 0) {
      return NextResponse.json({ ok: true, message: 'Schema ensured. Reference data already seeded — skipped.' });
    }

    const deptIds: Record<string, string> = {};
    for (const d of DEPARTMENTS) {
      const id = newId();
      deptIds[d.code] = id;
      await sql()`INSERT INTO departments (id, name, code, sla_hours) VALUES (${id}, ${d.name}, ${d.code}, ${d.slaHours})`;
    }

    for (const z of ZONES) {
      await sql()`INSERT INTO zones (id, name) VALUES (${newId()}, ${z})`;
    }

    for (const [catName, def] of Object.entries(CATEGORIES)) {
      const catId = newId();
      await sql()`INSERT INTO categories (id, name, department_id) VALUES (${catId}, ${catName}, ${deptIds[def.dept]})`;
      for (const sub of def.subs) {
        await sql()`INSERT INTO subcategories (id, name, category_id) VALUES (${newId()}, ${sub}, ${catId})`;
      }
    }

    const superAdminEmail = 'admin@civicflow.app';
    const superAdminPassword = 'CF-' + Math.random().toString(36).slice(2, 10);
    const superAdminId = newId();
    const passwordHash = await hashPassword(superAdminPassword);
    await sql()`
      INSERT INTO users (id, email, password_hash, name, role)
      VALUES (${superAdminId}, ${superAdminEmail}, ${passwordHash}, 'Platform Administrator', 'SUPER_ADMIN')
    `;

    return NextResponse.json({
      ok: true,
      message: 'Database initialized and seeded.',
      superAdmin: { email: superAdminEmail, password: superAdminPassword },
      note: 'Save this password now — it will not be shown again. Sign in and create Department Admins from the Super Admin console.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}
