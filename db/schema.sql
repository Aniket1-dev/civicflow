-- CivicFlow production schema (PostgreSQL / Neon)

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT,
  role          TEXT NOT NULL CHECK (role IN ('CITIZEN','AUTHORITY','DEPT_ADMIN','SUPER_ADMIN')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS departments (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  code       TEXT UNIQUE NOT NULL,
  sla_hours  INT NOT NULL DEFAULT 48,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS zones (
  id         TEXT PRIMARY KEY,
  name       TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  department_id TEXT NOT NULL REFERENCES departments(id),
  UNIQUE(name, department_id)
);

CREATE TABLE IF NOT EXISTS subcategories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  UNIQUE(name, category_id)
);

CREATE TABLE IF NOT EXISTS dept_admin_profiles (
  id            TEXT PRIMARY KEY,
  user_id       TEXT UNIQUE NOT NULL REFERENCES users(id),
  department_id TEXT NOT NULL REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS authorities (
  id                   TEXT PRIMARY KEY,
  authority_code       TEXT UNIQUE NOT NULL,
  user_id              TEXT UNIQUE NOT NULL REFERENCES users(id),
  designation          TEXT NOT NULL,
  employee_id          TEXT NOT NULL,
  department_id        TEXT NOT NULL REFERENCES departments(id),
  zone_id              TEXT NOT NULL REFERENCES zones(id),
  status               TEXT NOT NULL DEFAULT 'PENDING_ONBOARDING'
                         CHECK (status IN ('PENDING_ONBOARDING','PENDING_VERIFICATION','VERIFIED','REJECTED','SUSPENDED')),
  designation_doc_url  TEXT,
  reject_reason        TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS complaints (
  id                       TEXT PRIMARY KEY,
  code                     TEXT UNIQUE NOT NULL,
  title                    TEXT NOT NULL,
  description              TEXT NOT NULL,
  category_id              TEXT NOT NULL REFERENCES categories(id),
  subcategory_id           TEXT NOT NULL REFERENCES subcategories(id),
  department_id            TEXT NOT NULL REFERENCES departments(id),
  zone_id                  TEXT NOT NULL REFERENCES zones(id),
  authority_id             TEXT REFERENCES authorities(id),
  priority                 TEXT NOT NULL CHECK (priority IN ('HIGH','MEDIUM','LOW')),
  status                   TEXT NOT NULL DEFAULT 'ASSIGNED'
                             CHECK (status IN ('SUBMITTED','ASSIGNED','ACCEPTED','IN_PROGRESS','RESOLVED','CLOSED','REOPENED')),
  address                  TEXT NOT NULL,
  landmark                 TEXT,
  ward                     TEXT,
  reported_by_id           TEXT NOT NULL REFERENCES users(id),
  sla_hours                INT NOT NULL,
  sla_deadline             TIMESTAMPTZ NOT NULL,
  evidence_urls            TEXT[] NOT NULL DEFAULT '{}',
  resolution_description   TEXT,
  resolution_before_url    TEXT,
  resolution_after_url     TEXT,
  resolved_at              TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id           TEXT PRIMARY KEY,
  complaint_id TEXT NOT NULL REFERENCES complaints(id),
  label        TEXT NOT NULL,
  at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id           TEXT PRIMARY KEY,
  complaint_id TEXT NOT NULL REFERENCES complaints(id),
  author_name  TEXT NOT NULL,
  text         TEXT NOT NULL,
  at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id             TEXT PRIMARY KEY,
  actor_name     TEXT NOT NULL,
  actor_role     TEXT NOT NULL,
  action         TEXT NOT NULL,
  entity_type    TEXT NOT NULL,
  entity_id      TEXT NOT NULL,
  previous_value TEXT,
  new_value      TEXT,
  at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_complaints_reported_by ON complaints(reported_by_id);
CREATE INDEX IF NOT EXISTS idx_complaints_authority ON complaints(authority_id);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_timeline_complaint ON timeline_events(complaint_id);
CREATE INDEX IF NOT EXISTS idx_comments_complaint ON comments(complaint_id);
