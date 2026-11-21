-- PiNova Education core records: additive Preview-first durable schema.
-- No legacy records are copied or deleted by this migration.
-- Institution hierarchy (faculties/departments/programmes) remains inside the
-- institution JSON document so it is committed atomically with its parent.
CREATE TABLE IF NOT EXISTS education_institutions (
  id TEXT PRIMARY KEY,
  country_code TEXT NOT NULL,
  institution_type TEXT NOT NULL,
  verification_status TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS education_institutions_country_status_idx
  ON education_institutions (country_code, verification_status);
CREATE INDEX IF NOT EXISTS education_institutions_type_idx
  ON education_institutions (institution_type);

CREATE TABLE IF NOT EXISTS education_students (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL,
  guardian_id TEXT,
  status TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS education_students_institution_idx
  ON education_students (institution_id);
CREATE INDEX IF NOT EXISTS education_students_guardian_idx
  ON education_students (guardian_id);

CREATE TABLE IF NOT EXISTS education_guardian_children (
  student_id TEXT PRIMARY KEY,
  guardian_id TEXT NOT NULL,
  institution_id TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS education_guardian_children_guardian_idx
  ON education_guardian_children (guardian_id);

CREATE TABLE IF NOT EXISTS education_admissions (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL,
  status TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS education_admissions_institution_status_idx
  ON education_admissions (institution_id, status);
CREATE INDEX IF NOT EXISTS education_admissions_applicant_idx
  ON education_admissions (applicant_email);

CREATE TABLE IF NOT EXISTS education_scholarships (
  id TEXT PRIMARY KEY,
  sponsor_type TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS education_scholarships_deadline_idx
  ON education_scholarships (deadline);

INSERT INTO pinova_schema_migrations (migration_id)
VALUES ('20261120_education_core_records')
ON CONFLICT (migration_id) DO NOTHING;
