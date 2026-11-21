import assert from 'node:assert/strict';
import { createEducationDirectoryV2Handler, type EducationDirectoryRepository } from '../src/server/routes/educationDirectoryV2';

function invoke(handler: ReturnType<typeof createEducationDirectoryV2Handler>, query: Record<string, unknown>) {
  const response: any = {
    statusCode: 200,
    body: undefined,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; }
  };
  const request: any = { query };
  return Promise.resolve(handler(request, response, () => undefined)).then(() => response);
}

async function run() {
  {
    let repositoryCalls = 0;
    const response = await invoke(createEducationDirectoryV2Handler(() => {
      repositoryCalls++;
      throw new Error('must not instantiate while disabled');
    }, () => false), {});
    assert.equal(response.statusCode, 503);
    assert.equal(response.body.error, 'EDUCATION_DIRECTORY_V2_DISABLED');
    assert.equal(repositoryCalls, 0);
  }

  {
    const calls: any[] = [];
    const repository: EducationDirectoryRepository = {
      async assertSchemaReady() { calls.push('schema'); },
      async listInstitutions(filters) { calls.push({ list: filters }); return [{ id: 'inst-1' }]; },
      async countInstitutions(filters) { calls.push({ count: filters }); return 237; }
    };
    const response = await invoke(createEducationDirectoryV2Handler(() => repository, () => true), {
      countryCode: 'NG', country: 'GB', state: 'Kano', tier: 'secondary',
      institutionType: 'secondary_school', isPublic: 'false',
      search: 'academy', verificationStatus: 'VERIFIED', limit: '25', offset: '50'
    });
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.count, 237);
    assert.equal(response.body.pagination.hasMore, true);
    assert.deepEqual(response.body.pagination, { limit: 25, offset: 50, total: 237, hasMore: true });
    assert.equal(calls[0], 'schema');
    assert.deepEqual(calls[1].list, {
      countryCode: 'NG', state: 'Kano', tier: 'secondary',
      institutionType: 'secondary_school', isPublic: false,
      search: 'academy', verificationStatus: 'VERIFIED', limit: 25, offset: 50
    });
    assert.deepEqual(calls[2].count, {
      countryCode: 'NG', state: 'Kano', tier: 'secondary',
      institutionType: 'secondary_school', isPublic: false,
      search: 'academy', verificationStatus: 'VERIFIED'
    });
  }

  for (const query of [
    { limit: '0' }, { limit: '101' }, { limit: '1.5' }, { limit: '-1' },
    { offset: '-1' }, { offset: '1.2' }, { isPublic: 'yes' },
    { search: 'x'.repeat(121) }, { tier: ['primary', 'secondary'] }
  ]) {
    let called = false;
    const response = await invoke(createEducationDirectoryV2Handler(() => {
      called = true;
      throw new Error('repository must not be called for invalid query');
    }, () => true), query);
    assert.equal(response.statusCode, 400, JSON.stringify(query));
    assert.equal(response.body.error, 'INVALID_DIRECTORY_QUERY');
    assert.equal(called, false);
  }

  {
    const repository: EducationDirectoryRepository = {
      async assertSchemaReady() { throw new Error('EDUCATION_NEON_SCHEMA_NOT_READY'); },
      async listInstitutions() { throw new Error('must not query after schema failure'); },
      async countInstitutions() { throw new Error('must not query after schema failure'); }
    };
    const response = await invoke(createEducationDirectoryV2Handler(() => repository, () => true), {});
    assert.equal(response.statusCode, 503);
    assert.equal(response.body.error, 'EDUCATION_DIRECTORY_SCHEMA_NOT_READY');
  }

  {
    const repository: EducationDirectoryRepository = {
      async assertSchemaReady() {},
      async listInstitutions() { throw new Error('connection timeout'); },
      async countInstitutions() { return 0; }
    };
    const response = await invoke(createEducationDirectoryV2Handler(() => repository, () => true), {});
    assert.equal(response.statusCode, 503);
    assert.equal(response.body.error, 'EDUCATION_DIRECTORY_UNAVAILABLE');
    assert.equal(JSON.stringify(response.body).includes('connection timeout'), false);
  }

  {
    const repository: EducationDirectoryRepository = {
      async assertSchemaReady() {},
      async listInstitutions() { return []; },
      async countInstitutions() { return 12; }
    };
    const response = await invoke(createEducationDirectoryV2Handler(() => repository, () => true), { offset: '12' });
    assert.equal(response.body.pagination.hasMore, false);
  }

  console.log('Education directory v2 route suite passed');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
