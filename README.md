# CivicFlow — production build

Real backend: Next.js App Router + Postgres (Neon serverless driver, no native
binaries) + JWT session auth (httpOnly cookies) + Vercel Blob file storage.

## One-time setup after deploying

1. **Connect Neon Postgres** to this Vercel project (Storage tab → Connect
   Database → Neon). This injects `DATABASE_URL` automatically.
2. **Connect Vercel Blob** the same way (Storage tab → Blob) to enable file
   uploads (evidence photos, designation documents). Without it, uploads
   return a clear error but everything else still works.
3. Set two more env vars in Vercel Project Settings:
   - `JWT_SECRET` — any long random string (`openssl rand -base64 32`)
   - `SETUP_TOKEN` — any password you choose, used once below
4. Redeploy so the new env vars take effect.
5. Initialize the database (creates tables + seeds departments, zones,
   categories, and one Super Admin account):
   ```
   curl -X POST https://<your-domain>/api/setup \
     -H "x-setup-token: <the SETUP_TOKEN you set>"
   ```
   The response includes the Super Admin email + a generated password —
   **save it, it's shown once.**
6. Sign in as that Super Admin → create Department Admins → they create and
   verify Authorities → citizens register normally and file complaints.

## What's real here (vs. the earlier mock version)

- Postgres tables for users, departments, zones, categories, complaints,
  timeline events, comments, authorities, audit logs.
- Passwords hashed with bcrypt; sessions are signed JWTs in httpOnly cookies;
  every role-scoped API route checks the session server-side, not just the UI.
- Route protection enforced in `proxy.ts` (Next's edge middleware) *and*
  again inside every API route — a hidden URL alone can't expose data.
- File uploads go to Vercel Blob and are stored as real URLs on the complaint.
- Duplicate-complaint detection queries real nearby complaints.
- Audit log is written on every state-changing action and is real.

## Known simplifications (by design, not oversight)

- **Feedback** page doesn't persist to a table yet (no `feedback` model) —
  it's a UI-only form. Trivial to add a table + endpoint if you want it kept.
- **Notifications** page derives from complaint status rather than a
  dedicated notifications/webhook system.
- **Email delivery** for authority/dept-admin credentials isn't wired up —
  credentials are shown once on-screen, per your instruction. Add Resend (or
  similar) to `lib/queries.ts`'s account-creation calls when you're ready.
- **Zone/category management UI** isn't built — they're seeded once via
  `/api/setup`. The schema supports adding more; only the admin UI for it
  doesn't exist yet.
