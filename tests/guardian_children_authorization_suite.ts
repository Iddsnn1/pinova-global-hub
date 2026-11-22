import assert from 'node:assert/strict';
import { createGuardianChildrenHandler, type GuardianChildrenRepository } from '../src/server/routes/guardianChildren';

async function invoke(
  handler: ReturnType<typeof createGuardianChildrenHandler>,
  user: any,
  id = ''
) {
  const response: any = {
    statusCode: 200,
    body: undefined,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; }
  };
  const request: any = { user, params: { id } };
  await handler(request, response, () => undefined);
  return response;
}

async function run() {
  const calls: Array<{ guardianId: string; institutionId?: string }> = [];
  const repository: GuardianChildrenRepository = {
    async listGuardianChildrenSummaries(guardianId, institutionId) {
      calls.push({ guardianId, institutionId });
      return [{ id: 'child-1' }];
    }
  };
  const getRepository = () => repository;

  let response = await invoke(createGuardianChildrenHandler(getRepository, 'self'), null);
  assert.equal(response.statusCode, 401);
  assert.equal(calls.length, 0);

  response = await invoke(createGuardianChildrenHandler(getRepository, 'self'), {
    id: 'user-1', username: 'guardian@example.test', roles: ['GUARDIAN']
  });
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error, 'GUARDIAN_IDENTITY_REQUIRED');
  assert.equal(calls.length, 0);

  response = await invoke(createGuardianChildrenHandler(getRepository, 'self'), {
    id: 'user-1', username: 'not-the-guardian', guardianId: 'guardian-1', roles: ['GUARDIAN']
  });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(calls.at(-1), { guardianId: 'guardian-1', institutionId: undefined });

  response = await invoke(createGuardianChildrenHandler(getRepository, 'scoped'), {
    guardianId: 'guardian-1', roles: ['GUARDIAN']
  }, 'guardian-2');
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error, 'FORBIDDEN');

  response = await invoke(createGuardianChildrenHandler(getRepository, 'scoped'), {
    roles: ['INSTITUTION_ADMIN'], institutionId: 'school-1'
  }, 'guardian-2');
  assert.equal(response.statusCode, 200);
  assert.deepEqual(calls.at(-1), { guardianId: 'guardian-2', institutionId: 'school-1' });

  response = await invoke(createGuardianChildrenHandler(getRepository, 'scoped'), {
    roles: ['INSTITUTION_ADMIN']
  }, 'guardian-2');
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error, 'INSTITUTION_SCOPE_REQUIRED');

  response = await invoke(createGuardianChildrenHandler(getRepository, 'scoped'), {
    roles: ['PLATFORM_ADMIN']
  }, 'guardian-2');
  assert.equal(response.statusCode, 200);
  assert.deepEqual(calls.at(-1), { guardianId: 'guardian-2', institutionId: undefined });

  response = await invoke(createGuardianChildrenHandler(getRepository, 'scoped'), {
    roles: ['COMPLIANCE_OFFICER']
  }, 'guardian-2');
  assert.equal(response.statusCode, 403);

  console.log('Guardian children authorization suite passed');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
