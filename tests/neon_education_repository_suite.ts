import assert from 'node:assert/strict';
import { NeonEducationRepository } from '../src/server/db/repositories/NeonEducationRepository';

type MockRow = Record<string, unknown>;
function makeSql(responses: unknown[]) {
  const calls: Array<{ query: string; values: unknown[] }> = [];
  const sql = async (parts: TemplateStringsArray, ...values: unknown[]) => {
    calls.push({ query: parts.join('?'), values });
    return (responses.shift() ?? []) as any;
  };
  return { sql: sql as any, calls };
}

async function run() {
  {
    const mock = makeSql([[
      { institutions: 'education_institutions', students: 'education_students', invoices: 'education_invoices', admissions: 'education_admissions' }
    ]]);
    const repository = new NeonEducationRepository(mock.sql);
    await repository.assertSchemaReady();
    assert.equal(mock.calls.length, 1);
    assert.match(mock.calls[0].query, /to_regclass/);
  }

  {
    const mock = makeSql([[{ institutions: 'education_institutions', students: null, invoices: null, admissions: null }]]);
    const repository = new NeonEducationRepository(mock.sql);
    await assert.rejects(repository.assertSchemaReady(), /EDUCATION_NEON_SCHEMA_NOT_READY/);
  }

  {
    const record = { id: 'inst-1', name: 'Global University', countryCode: 'NG' };
    const mock = makeSql([[{ data: record }]]);
    const repository = new NeonEducationRepository(mock.sql);
    const result = await repository.listInstitutions({ countryCode: 'ng', search: 'Global', limit: 500 });
    assert.deepEqual(result, [record]);
    assert.ok(mock.calls[0].values.includes('NG'));
    assert.ok(mock.calls[0].values.includes(100), 'limit must be capped at 100');
  }

  {
    // Neon FullQueryResults mode wraps returned rows in a rows property.
    const record = { id: 'inst-2', name: 'International Academy' };
    const mock = makeSql([{ rows: [{ data: record }], fields: [], rowCount: 1 }]);
    const repository = new NeonEducationRepository(mock.sql);
    assert.deepEqual(await repository.listInstitutions(), [record]);
  }

  {
    const mock = makeSql([{ unexpected: true }]);
    const repository = new NeonEducationRepository(mock.sql);
    await assert.rejects(
      repository.listInstitutions(),
      /EDUCATION_NEON_QUERY_RESULT_INVALID/
    );
  }

  {
    const mock = makeSql([[]]);
    const repository = new NeonEducationRepository(mock.sql);
    assert.equal(await repository.getStudentById('student-1', ''), null);
    assert.equal(mock.calls.length, 0, 'missing institution scope must not issue a query');
    await assert.rejects(
      repository.listInvoices({ institutionId: '  ' }),
      /EDUCATION_INSTITUTION_SCOPE_REQUIRED/
    );
    await assert.rejects(
      repository.listAdmissions({ institutionId: '' }),
      /EDUCATION_INSTITUTION_SCOPE_REQUIRED/
    );
    assert.equal(mock.calls.length, 0, 'missing institution scope must not issue a query');
  }

  {
    const mock = makeSql([[{ data: { id: 'inv-1', institutionId: 'inst-1' } }]]);
    const repository = new NeonEducationRepository(mock.sql);
    const result = await repository.getInvoiceById('inv-1', 'inst-1');
    assert.deepEqual(result, { id: 'inv-1', institutionId: 'inst-1' });
    assert.deepEqual(mock.calls[0].values, ['inv-1', 'inst-1']);
    assert.match(mock.calls[0].query, /institution_id/);
  }

  {
    const mock = makeSql([[{ data: { id: 'adm-1', institutionId: 'inst-9' } }]]);
    const repository = new NeonEducationRepository(mock.sql);
    const result = await repository.listAdmissions({
      institutionId: 'inst-9',
      applicantEmail: 'STUDENT@EXAMPLE.ORG',
      limit: 20
    });
    assert.deepEqual(result, [{ id: 'adm-1', institutionId: 'inst-9' }]);
    assert.ok(mock.calls[0].query.includes('institution_id = ?'));
    assert.ok(mock.calls[0].values.includes('student@example.org'));
  }

  console.log('Neon Education repository contract suite passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
