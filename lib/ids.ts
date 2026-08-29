export function newId(): string {
  return crypto.randomUUID();
}

/** e.g. CMP-2026-004821 */
export function newComplaintCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `CMP-${year}-${rand}`;
}

/** e.g. PWD-GZB-00421 */
export function newAuthorityCode(deptCode: string): string {
  const rand = Math.floor(100 + Math.random() * 900);
  return `${deptCode}-GZB-${String(rand).padStart(5, '0')}`;
}

export function newTempPassword(): string {
  return 'Cf' + Math.random().toString(36).slice(2, 8) + Math.floor(Math.random() * 10);
}
