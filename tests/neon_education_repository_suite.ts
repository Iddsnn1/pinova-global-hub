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
    const mock = makeSql([[], []]);
    const repository = new NeonEducationRepository(mock.sql);
    await repository.listInstitutions({ countryCode: 'Nigeria', state: 'all' });
    await repository.listInstitutions({ countryCode: 'GLOBAL' });
    await repository.listInstitutions({ country: 'Nigeria' });
    assert.ok(mock.calls[0].values.includes('NG'), 'country names must normalize to ISO-2');
    assert.ok(mock.calls[0].values.includes(null), 'state=all must not filter the directory');
    assert.ok(mock.calls[1].values.includes(null), 'GLOBAL must not become a literal country filter');
    assert.ok(mock.calls[2].values.includes('NG'), 'legacy country alias must normalize to ISO-2');
  }

  {
    const record = {
      id: 'inst-global',
      name: 'International School',
      state: 'Kano',
      supportedTiers: ['primary', 'secondary'],
      isPublic: false
    };
    const mock = makeSql([[{ data: record }]]);
    const repository = new NeonEducationRepository(mock.sql);
    const result = await repository.listInstitutions({
      countryCode: 'NG',
      state: 'Kano',
      tier: 'secondary',
      isPublic: false,
      institutionType: 'secondary_school',
      verificationStatus: 'VERIFIED'
    });
    assert.deepEqual(result, [record]);
    assert.ok(mock.calls[0].query.includes("data->>'state'"));
    assert.ok(mock.calls[0].query.includes('ANY('), 'state filters must support canonical aliases');
    const stateAliases = mock.calls[0].values.find((value) => Array.isArray(value)) as string[];
    assert.ok(stateAliases.includes('kano'));
    assert.ok(stateAliases.includes('kano state'), 'legacy subdivision aliases must remain searchable');
    assert.ok(mock.calls[0].query.includes("data->'supportedTiers'"));
    assert.ok(mock.calls[0].query.includes("data->>'isPublic'"));
    for (const value of ['secondary', 'false', 'secondary_school', 'VERIFIED']) {
      assert.ok(mock.calls[0].values.includes(value), `expected bound filter: ${value}`);
    }
  }

  {
    const mock = makeSql([[{ data: { id: 'adm-2', institutionId: 'inst-2' } }]]);
    const repository = new NeonEducationRepository(mock.sql);
    const result = await repository.getAdmissionById('adm-2', { institutionId: 'inst-2' });
    assert.deepEqual(result, { id: 'adm-2', institutionId: 'inst-2' });
    assert.ok(mock.calls[0].query.includes('institution_id'));
    assert.deepEqual(mock.calls[0].values, ['adm-2', 'inst-2', 'inst-2', null, null]);
  }

  {
    const mock = makeSql([[]]);
    const repository = new NeonEducationRepository(mock.sql);
    assert.equal(await repository.getAdmissionById('adm-3', {}), null);
    assert.equal(
      await repository.getAdmissionById('adm-3', {
        institutionId: 'inst-3',
        applicantEmail: 'applicant@example.org'
      }),
      null,
      'ambiguous combined scopes must be rejected'
    );
    assert.equal(mock.calls.length, 0, 'unscoped or ambiguous admission lookup must not query Neon');
    const result = await repository.getAdmissionById('adm-3', { applicantEmail: 'APPLICANT@EXAMPLE.ORG' });
    assert.equal(result, null);
    assert.equal(mock.calls.length, 1);
    assert.ok(mock.calls[0].values.includes('applicant@example.org'));
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

  {
    const institution = {
      id: 'inst-hierarchy',
      faculties: [{
        id: 'fac-1',
        departments: [{
          id: 'dept-1',
          programmes: [{ id: 'prog-1', name: 'Computer Science' }]
        }]
      }]
    };
    const mock = makeSql([
      [{ data: institution }],
      [{ data: institution }],
      [{ data: institution }],
      [{ data: institution }]
    ]);
    const repository = new NeonEducationRepository(mock.sql);
    assert.equal((await repository.listFaculties('inst-hierarchy')).length, 1);
    assert.equal((await repository.listDepartments('inst-hierarchy', 'fac-1')).length, 1);
    assert.equal((await repository.listProgrammes('inst-hierarchy', 'fac-1', 'dept-1')).length, 1);
    assert.deepEqual(await repository.listInstitutionProgrammes('inst-hierarchy'), [
      { id: 'prog-1', name: 'Computer Science' }
    ]);
    assert.equal(mock.calls.length, 4);
  }

  {
    const institution = {
      id: 'inst-direct-programmes',
      programmes: [{ id: 'prog-direct', name: 'Basic Education' }],
      faculties: [{
        id: 'fac-1',
        departments: [{ id: 'dept-1', programmes: [{ id: 'prog-nested' }] }]
      }]
    };
    const mock = makeSql([[{ data: institution }]]);
    const repository = new NeonEducationRepository(mock.sql);
    assert.deepEqual(await repository.listInstitutionProgrammes('inst-direct-programmes'), [
      { id: 'prog-direct', name: 'Basic Education' }
    ], 'direct institution programmes take precedence over nested programmes');
  }

  {
    // Nigeria's FCT aliases must resolve in both parent-to-child directions.
    const mock = makeSql([[], []]);
    const repository = new NeonEducationRepository(mock.sql);
    await repository.listInstitutions({ countryCode: 'NG', state: 'Federal Capital Territory' });
    await repository.listInstitutions({ countryCode: 'NG', state: 'Abuja' });
    const parentAliases = mock.calls[0].values.find((value) => Array.isArray(value)) as string[];
    const childAliases = mock.calls[1].values.find((value) => Array.isArray(value)) as string[];
    for (const alias of ['federal capital territory', 'fct', 'abuja', 'f.c.t.']) {
      assert.ok(parentAliases.includes(alias), `FCT parent alias missing: ${alias}`);
    }
    assert.ok(childAliases.includes('federal capital territory'));
  }

  {
    // UK regional filters must include their counties and resolve a county back to its parent.
    const mock = makeSql([[], []]);
    const repository = new NeonEducationRepository(mock.sql);
    await repository.listInstitutions({ countryCode: 'GB', state: 'South East England' });
    await repository.listInstitutions({ countryCode: 'GB', state: 'Oxfordshire' });
    const regionAliases = mock.calls[0].values.find((value) => Array.isArray(value)) as string[];
    const countyAliases = mock.calls[1].values.find((value) => Array.isArray(value)) as string[];
    assert.ok(regionAliases.includes('oxfordshire'));
    assert.ok(regionAliases.includes('berkshire'));
    assert.ok(countyAliases.includes('south east england'));
  }

  {
    // Without a recognized country, subdivision matching deliberately stays exact.
    const mock = makeSql([[]]);
    const repository = new NeonEducationRepository(mock.sql);
    await repository.listInstitutions({ state: 'Kano' });
    const aliases = mock.calls[0].values.find((value) => Array.isArray(value)) as string[];
    assert.deepEqual(aliases, ['kano']);
  }

  console.log('Neon Education repository contract suite passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
