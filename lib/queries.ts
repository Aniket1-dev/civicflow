import { sql } from './db';
import { newId, newComplaintCode, newAuthorityCode } from './ids';
import { hashPassword } from './auth';
import { priorityFor } from './complaint-utils';

/* ============================= USERS ============================= */

export async function getUserByEmail(email: string) {
  const rows = await sql()`SELECT * FROM users WHERE email = ${email.toLowerCase()} LIMIT 1`;
  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  const rows = await sql()`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

export async function createCitizen(input: { name: string; email: string; phone?: string; password: string }) {
  const existing = await getUserByEmail(input.email);
  if (existing) throw new Error('An account with this email already exists.');
  const id = newId();
  const passwordHash = await hashPassword(input.password);
  await sql()`
    INSERT INTO users (id, email, password_hash, name, phone, role)
    VALUES (${id}, ${input.email.toLowerCase()}, ${passwordHash}, ${input.name}, ${input.phone ?? null}, 'CITIZEN')
  `;
  return getUserById(id);
}

export async function createDeptAdmin(input: { name: string; email: string; password: string; departmentId: string }) {
  const existing = await getUserByEmail(input.email);
  if (existing) throw new Error('An account with this email already exists.');
  const id = newId();
  const passwordHash = await hashPassword(input.password);
  await sql()`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES (${id}, ${input.email.toLowerCase()}, ${passwordHash}, ${input.name}, 'DEPT_ADMIN')
  `;
  await sql()`
    INSERT INTO dept_admin_profiles (id, user_id, department_id)
    VALUES (${newId()}, ${id}, ${input.departmentId})
  `;
  return getUserById(id);
}

export async function getDeptAdminProfile(userId: string) {
  const rows = await sql()`
    SELECT dap.*, d.name as department_name, d.code as department_code
    FROM dept_admin_profiles dap JOIN departments d ON d.id = dap.department_id
    WHERE dap.user_id = ${userId} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function listDeptAdmins() {
  return sql()`
    SELECT u.id, u.name, u.email, d.id as department_id, d.name as department_name, d.code as department_code
    FROM dept_admin_profiles dap
    JOIN users u ON u.id = dap.user_id
    JOIN departments d ON d.id = dap.department_id
    ORDER BY u.created_at DESC
  `;
}

/* ============================= REFERENCE DATA ============================= */

export async function listDepartments() {
  return sql()`SELECT * FROM departments ORDER BY name`;
}

export async function getDepartment(id: string) {
  const rows = await sql()`SELECT * FROM departments WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

export async function listZones() {
  return sql()`SELECT * FROM zones ORDER BY name`;
}

export async function listCategoriesWithSubs() {
  const cats = await sql()`SELECT * FROM categories ORDER BY name`;
  const subs = await sql()`SELECT * FROM subcategories ORDER BY name`;
  return cats.map((c: any) => ({
    ...c,
    subcategories: subs.filter((s: any) => s.category_id === c.id),
  }));
}

export async function getCategoryByName(name: string) {
  const rows = await sql()`SELECT * FROM categories WHERE name = ${name} LIMIT 1`;
  return rows[0] ?? null;
}

export async function getSubcategoryByName(categoryId: string, name: string) {
  const rows = await sql()`SELECT * FROM subcategories WHERE category_id = ${categoryId} AND name = ${name} LIMIT 1`;
  return rows[0] ?? null;
}

/* ============================= AUTHORITIES ============================= */

export async function createAuthority(input: {
  name: string; email: string; employeeId: string; designation: string; departmentId: string; zoneId: string; phone?: string; tempPassword: string;
}) {
  const existing = await getUserByEmail(input.email);
  if (existing) throw new Error('An account with this email already exists.');
  const dept = await getDepartment(input.departmentId);
  if (!dept) throw new Error('Unknown department.');

  const userId = newId();
  const passwordHash = await hashPassword(input.tempPassword);
  await sql()`
    INSERT INTO users (id, email, password_hash, name, phone, role)
    VALUES (${userId}, ${input.email.toLowerCase()}, ${passwordHash}, ${input.name}, ${input.phone ?? null}, 'AUTHORITY')
  `;

  const authorityId = newId();
  const authorityCode = newAuthorityCode(dept.code);
  await sql()`
    INSERT INTO authorities (id, authority_code, user_id, designation, employee_id, department_id, zone_id, status)
    VALUES (${authorityId}, ${authorityCode}, ${userId}, ${input.designation}, ${input.employeeId}, ${input.departmentId}, ${input.zoneId}, 'PENDING_ONBOARDING')
  `;
  return { authorityId, authorityCode, userId };
}

export async function getAuthorityByUserId(userId: string) {
  const rows = await sql()`
    SELECT a.*, d.name as department_name, d.code as department_code, z.name as zone_name
    FROM authorities a
    JOIN departments d ON d.id = a.department_id
    JOIN zones z ON z.id = a.zone_id
    WHERE a.user_id = ${userId} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getAuthorityById(id: string) {
  const rows = await sql()`
    SELECT a.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
           d.name as department_name, d.code as department_code, z.name as zone_name
    FROM authorities a
    JOIN users u ON u.id = a.user_id
    JOIN departments d ON d.id = a.department_id
    JOIN zones z ON z.id = a.zone_id
    WHERE a.id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function listAuthoritiesForDept(departmentId: string) {
  return sql()`
    SELECT a.*, u.name as user_name, u.email as user_email
    FROM authorities a JOIN users u ON u.id = a.user_id
    WHERE a.department_id = ${departmentId}
    ORDER BY a.created_at DESC
  `;
}

export async function submitAuthorityOnboarding(authorityId: string, employeeId: string, docUrl: string) {
  await sql()`
    UPDATE authorities SET employee_id = ${employeeId}, designation_doc_url = ${docUrl}, status = 'PENDING_VERIFICATION'
    WHERE id = ${authorityId}
  `;
}

export async function verifyAuthority(authorityId: string, status: 'VERIFIED' | 'REJECTED', reason?: string) {
  await sql()`
    UPDATE authorities SET status = ${status}, reject_reason = ${reason ?? null}
    WHERE id = ${authorityId}
  `;
}

/** Pick a verified authority for a department, preferring one in the given zone. */
export async function pickAuthorityForAssignment(departmentId: string, zoneId: string) {
  const inZone = await sql()`
    SELECT * FROM authorities WHERE department_id = ${departmentId} AND zone_id = ${zoneId} AND status = 'VERIFIED'
    ORDER BY created_at LIMIT 1
  `;
  if (inZone[0]) return inZone[0];
  const anyInDept = await sql()`
    SELECT * FROM authorities WHERE department_id = ${departmentId} AND status = 'VERIFIED'
    ORDER BY created_at LIMIT 1
  `;
  return anyInDept[0] ?? null;
}

/* ============================= COMPLAINTS ============================= */

export async function findDuplicateComplaints(subcategoryId: string, zoneId: string) {
  return sql()`
    SELECT id, code, title, status, created_at FROM complaints
    WHERE subcategory_id = ${subcategoryId} AND zone_id = ${zoneId} AND status NOT IN ('CLOSED')
    ORDER BY created_at DESC LIMIT 3
  `;
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  categoryName: string;
  subcategoryName: string;
  address: string;
  landmark?: string;
  ward?: string;
  zoneId: string;
  evidenceUrls: string[];
  reportedById: string;
}

export async function createComplaint(input: CreateComplaintInput) {
  const category = await getCategoryByName(input.categoryName);
  if (!category) throw new Error('Unknown category.');
  const subcategory = await getSubcategoryByName(category.id, input.subcategoryName);
  if (!subcategory) throw new Error('Unknown subcategory.');
  const department = await getDepartment(category.department_id);
  if (!department) throw new Error('Unknown department.');

  const authority = await pickAuthorityForAssignment(department.id, input.zoneId);
  const priority = priorityFor(input.subcategoryName);
  const slaHours = department.sla_hours;
  const slaDeadline = new Date(Date.now() + slaHours * 3600000);
  const id = newId();
  const code = newComplaintCode();
  const status = authority ? 'ASSIGNED' : 'SUBMITTED';

  await sql()`
    INSERT INTO complaints (
      id, code, title, description, category_id, subcategory_id, department_id, zone_id, authority_id,
      priority, status, address, landmark, ward, reported_by_id, sla_hours, sla_deadline, evidence_urls
    ) VALUES (
      ${id}, ${code}, ${input.title}, ${input.description}, ${category.id}, ${subcategory.id}, ${department.id}, ${input.zoneId},
      ${authority ? authority.id : null}, ${priority}, ${status}, ${input.address}, ${input.landmark ?? null}, ${input.ward ?? null},
      ${input.reportedById}, ${slaHours}, ${slaDeadline.toISOString()}, ${input.evidenceUrls}
    )
  `;

  await addTimelineEvent(id, 'Submitted');
  await addTimelineEvent(id, 'AI analyzed');
  if (authority) {
    await addTimelineEvent(id, `Assigned to ${department.name}`);
  }

  return getComplaintById(id);
}

export async function getComplaintById(id: string) {
  const rows = await sql()`
    SELECT c.*, cat.name as category_name, sub.name as subcategory_name, d.name as department_name,
           z.name as zone_name, u.name as reported_by_name,
           a.authority_code, au.name as authority_name
    FROM complaints c
    JOIN categories cat ON cat.id = c.category_id
    JOIN subcategories sub ON sub.id = c.subcategory_id
    JOIN departments d ON d.id = c.department_id
    JOIN zones z ON z.id = c.zone_id
    JOIN users u ON u.id = c.reported_by_id
    LEFT JOIN authorities a ON a.id = c.authority_id
    LEFT JOIN users au ON au.id = a.user_id
    WHERE c.id = ${id} OR c.code = ${id}
    LIMIT 1
  `;
  const complaint = rows[0] ?? null;
  if (!complaint) return null;
  complaint.timeline = await sql()`SELECT * FROM timeline_events WHERE complaint_id = ${complaint.id} ORDER BY at`;
  complaint.comments = await sql()`SELECT * FROM comments WHERE complaint_id = ${complaint.id} ORDER BY at`;
  return complaint;
}

export async function listComplaintsForCitizen(userId: string) {
  return sql()`
    SELECT c.*, cat.name as category_name, sub.name as subcategory_name, d.name as department_name, z.name as zone_name
    FROM complaints c
    JOIN categories cat ON cat.id = c.category_id
    JOIN subcategories sub ON sub.id = c.subcategory_id
    JOIN departments d ON d.id = c.department_id
    JOIN zones z ON z.id = c.zone_id
    WHERE c.reported_by_id = ${userId}
    ORDER BY c.created_at DESC
  `;
}

export async function listComplaintsForAuthority(authorityId: string) {
  return sql()`
    SELECT c.*, cat.name as category_name, sub.name as subcategory_name, d.name as department_name, z.name as zone_name
    FROM complaints c
    JOIN categories cat ON cat.id = c.category_id
    JOIN subcategories sub ON sub.id = c.subcategory_id
    JOIN departments d ON d.id = c.department_id
    JOIN zones z ON z.id = c.zone_id
    WHERE c.authority_id = ${authorityId}
    ORDER BY c.created_at DESC
  `;
}

export async function listComplaintsForDept(departmentId: string) {
  return sql()`
    SELECT c.*, cat.name as category_name, sub.name as subcategory_name, d.name as department_name, z.name as zone_name
    FROM complaints c
    JOIN categories cat ON cat.id = c.category_id
    JOIN subcategories sub ON sub.id = c.subcategory_id
    JOIN departments d ON d.id = c.department_id
    JOIN zones z ON z.id = c.zone_id
    WHERE c.department_id = ${departmentId}
    ORDER BY c.created_at DESC
  `;
}

export async function listAllComplaints() {
  return sql()`
    SELECT c.*, cat.name as category_name, sub.name as subcategory_name, d.name as department_name, z.name as zone_name
    FROM complaints c
    JOIN categories cat ON cat.id = c.category_id
    JOIN subcategories sub ON sub.id = c.subcategory_id
    JOIN departments d ON d.id = c.department_id
    JOIN zones z ON z.id = c.zone_id
    ORDER BY c.created_at DESC
  `;
}

export async function addTimelineEvent(complaintId: string, label: string) {
  await sql()`INSERT INTO timeline_events (id, complaint_id, label) VALUES (${newId()}, ${complaintId}, ${label})`;
}

export async function addComment(complaintId: string, authorName: string, text: string) {
  await sql()`INSERT INTO comments (id, complaint_id, author_name, text) VALUES (${newId()}, ${complaintId}, ${authorName}, ${text})`;
}

export async function updateComplaintStatus(complaintId: string, status: string) {
  await sql()`UPDATE complaints SET status = ${status} WHERE id = ${complaintId}`;
}

export async function resolveComplaint(complaintId: string, description: string, beforeUrl?: string, afterUrl?: string) {
  await sql()`
    UPDATE complaints SET status = 'RESOLVED', resolution_description = ${description},
      resolution_before_url = ${beforeUrl ?? null}, resolution_after_url = ${afterUrl ?? null}, resolved_at = now()
    WHERE id = ${complaintId}
  `;
  await addTimelineEvent(complaintId, 'Resolved');
}

/* ============================= AUDIT LOG ============================= */

export async function writeAuditLog(entry: {
  actorName: string; actorRole: string; action: string; entityType: string; entityId: string; previousValue?: string; newValue?: string;
}) {
  await sql()`
    INSERT INTO audit_logs (id, actor_name, actor_role, action, entity_type, entity_id, previous_value, new_value)
    VALUES (${newId()}, ${entry.actorName}, ${entry.actorRole}, ${entry.action}, ${entry.entityType}, ${entry.entityId}, ${entry.previousValue ?? null}, ${entry.newValue ?? null})
  `;
}

export async function listAuditLogs(limit = 100) {
  return sql()`SELECT * FROM audit_logs ORDER BY at DESC LIMIT ${limit}`;
}
