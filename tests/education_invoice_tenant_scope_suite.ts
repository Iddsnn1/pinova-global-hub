import assert from 'node:assert/strict';
import { resolveEducationInvoiceListScope } from '../src/server/routes/educationInvoiceAccess';

function run() {
  {
    const result = resolveEducationInvoiceListScope({
      roles: ['INSTITUTION_ADMIN'],
      institutionId: 'school-a',
      query: {}
    });
    assert.equal(result.allowed, true);
    assert.deepEqual(result.filter, { institutionId: 'school-a' },
      'institution admins must be pinned to their authenticated institution when no query filter is supplied');
  }

  {
    const result = resolveEducationInvoiceListScope({
      roles: ['INSTITUTION_ADMIN'],
      institutionId: 'school-a',
      query: { institutionId: 'school-b' }
    });
    assert.equal(result.allowed, false);
    assert.equal(result.error, 'FORBIDDEN');
    assert.deepEqual(result.filter, {});
  }

  {
    const result = resolveEducationInvoiceListScope({
      roles: ['INSTITUTION_ADMIN'],
      query: {}
    });
    assert.equal(result.allowed, false);
    assert.equal(result.error, 'INSTITUTION_SCOPE_REQUIRED');
  }

  {
    const result = resolveEducationInvoiceListScope({
      roles: ['PLATFORM_ADMIN'],
      query: { institutionId: 'school-b', status: 'PENDING' }
    });
    assert.equal(result.allowed, true);
    assert.deepEqual(result.filter, { institutionId: 'school-b', status: 'PENDING' });
  }

  {
    const result = resolveEducationInvoiceListScope({
      roles: ['GUARDIAN'],
      username: 'guardian@example.test',
      guardianId: 'guardian-1',
      query: { guardianId: 'guardian-1', institutionId: 'school-a' }
    });
    assert.equal(result.allowed, true);
    assert.deepEqual(result.filter, { institutionId: 'school-a', guardianId: 'guardian-1' });
  }

  {
    const result = resolveEducationInvoiceListScope({
      roles: ['GUARDIAN'],
      username: 'guardian@example.test',
      guardianId: 'guardian-1',
      query: { guardianId: 'guardian-2' }
    });
    assert.equal(result.allowed, false);
    assert.equal(result.error, 'FORBIDDEN');
  }

  console.log('Education invoice tenant scope suite passed');
}

run();
