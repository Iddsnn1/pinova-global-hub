import assert from 'node:assert/strict';
import { resolveEducationPaymentHistoryAccess } from '../src/server/routes/educationPaymentHistoryAccess';

const invoice = { institutionId: 'school-a', guardianId: 'guardian-1', studentId: 'student-1', studentName: 'Student One' };

function run() {
  assert.equal(resolveEducationPaymentHistoryAccess({ roles: ['PLATFORM_ADMIN'], invoice }).allowed, true);
  assert.equal(resolveEducationPaymentHistoryAccess({ roles: ['BURSAR'], institutionId: 'school-a', invoice }).allowed, true);
  assert.equal(resolveEducationPaymentHistoryAccess({ roles: ['FINANCE_ADMIN'], institutionId: 'school-b', invoice }).allowed, false);
  assert.equal(resolveEducationPaymentHistoryAccess({ roles: ['INSTITUTION_ADMIN'], invoice }).allowed, false);
  assert.equal(resolveEducationPaymentHistoryAccess({ roles: ['GUARDIAN'], guardianId: 'guardian-1', invoice }).allowed, true);
  assert.equal(resolveEducationPaymentHistoryAccess({ roles: ['STUDENT'], studentId: 'student-1', invoice }).allowed, true);
  assert.equal(resolveEducationPaymentHistoryAccess({ roles: ['STUDENT'], studentId: 'student-2', invoice }).allowed, false);
  assert.equal(resolveEducationPaymentHistoryAccess({ roles: ['BURSAR'], institutionId: 'school-a', username: 'someone-else', invoice: { ...invoice, guardianId: 'someone-else' } }).allowed, true);
  console.log('Education payment history access suite passed');
}

run();
