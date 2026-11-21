-- PiNova Global Hub — Education relational integrity, Preview-first
-- Version: 2026-11-21-education-relations-v1
-- Apply only to the isolated Preview Neon branch after reviewing this file.
-- This migration adds constraints/indexes only; it does not insert, rewrite, or delete records.
-- Production must not receive this migration without a separate reviewed release approval.

BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS education_students_id_institution_uq
  ON public.education_students (id, institution_id);

CREATE UNIQUE INDEX IF NOT EXISTS education_invoices_id_institution_student_uq
  ON public.education_invoices (id, institution_id, student_id);

CREATE UNIQUE INDEX IF NOT EXISTS education_payments_id_invoice_uq
  ON public.education_payments (id, invoice_id);

CREATE INDEX IF NOT EXISTS education_admissions_institution_created_idx
  ON public.education_admissions (institution_id, created_at DESC);

CREATE INDEX IF NOT EXISTS education_invoices_student_status_idx
  ON public.education_invoices (student_id, status);

CREATE INDEX IF NOT EXISTS education_payments_student_verified_idx
  ON public.education_payments (student_id, verified_at DESC);

CREATE INDEX IF NOT EXISTS education_audit_logs_actor_created_idx
  ON public.education_audit_logs (actor_username, created_at DESC);

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'education_students_institution_fk') THEN
    ALTER TABLE public.education_students
      ADD CONSTRAINT education_students_institution_fk
      FOREIGN KEY (institution_id)
      REFERENCES public.education_institutions (id)
      ON UPDATE CASCADE ON DELETE RESTRICT
      NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'education_admissions_institution_fk') THEN
    ALTER TABLE public.education_admissions
      ADD CONSTRAINT education_admissions_institution_fk
      FOREIGN KEY (institution_id)
      REFERENCES public.education_institutions (id)
      ON UPDATE CASCADE ON DELETE RESTRICT
      NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'education_guardian_children_student_institution_fk') THEN
    ALTER TABLE public.education_guardian_children
      ADD CONSTRAINT education_guardian_children_student_institution_fk
      FOREIGN KEY (student_id, institution_id)
      REFERENCES public.education_students (id, institution_id)
      ON UPDATE CASCADE ON DELETE RESTRICT
      NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'education_invoices_student_institution_fk') THEN
    ALTER TABLE public.education_invoices
      ADD CONSTRAINT education_invoices_student_institution_fk
      FOREIGN KEY (student_id, institution_id)
      REFERENCES public.education_students (id, institution_id)
      ON UPDATE CASCADE ON DELETE RESTRICT
      NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'education_payments_invoice_scope_fk') THEN
    ALTER TABLE public.education_payments
      ADD CONSTRAINT education_payments_invoice_scope_fk
      FOREIGN KEY (invoice_id, institution_id, student_id)
      REFERENCES public.education_invoices (id, institution_id, student_id)
      ON UPDATE CASCADE ON DELETE RESTRICT
      NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'education_receipts_payment_invoice_fk') THEN
    ALTER TABLE public.education_receipts
      ADD CONSTRAINT education_receipts_payment_invoice_fk
      FOREIGN KEY (payment_id, invoice_id)
      REFERENCES public.education_payments (id, invoice_id)
      ON UPDATE CASCADE ON DELETE RESTRICT
      NOT VALID;
  END IF;
END
$migration$;

ALTER TABLE public.education_students
  VALIDATE CONSTRAINT education_students_institution_fk;
ALTER TABLE public.education_admissions
  VALIDATE CONSTRAINT education_admissions_institution_fk;
ALTER TABLE public.education_guardian_children
  VALIDATE CONSTRAINT education_guardian_children_student_institution_fk;
ALTER TABLE public.education_invoices
  VALIDATE CONSTRAINT education_invoices_student_institution_fk;
ALTER TABLE public.education_payments
  VALIDATE CONSTRAINT education_payments_invoice_scope_fk;
ALTER TABLE public.education_receipts
  VALIDATE CONSTRAINT education_receipts_payment_invoice_fk;

COMMIT;
