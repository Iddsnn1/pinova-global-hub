import assert from 'node:assert/strict';
import { getInstitutionPage, EducationDirectoryV2Error } from '../src/services/educationDirectoryV2Client';

const originalFetch = globalThis.fetch;

async function run() {
  try {
    {
      let requestedUrl = '';
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        requestedUrl = String(input);
        return new Response(JSON.stringify({
          success: true,
          count: 2,
          institutions: [{ id: 'inst-1' }, { id: 'inst-2' }],
          pagination: { limit: 2, offset: 0, total: 2, hasMore: false }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }) as typeof fetch;

      const page = await getInstitutionPage({
        countryCode: 'NG', state: 'Kano', search: '  academy  ', isPublic: false
      }, { limit: 2, offset: 0 });
      assert.equal(page.institutions.length, 2);
      assert.equal(page.pagination.total, 2);
      assert.equal(page.pagination.hasMore, false);
      assert.match(requestedUrl, /countryCode=NG/);
      assert.match(requestedUrl, /state=Kano/);
      assert.match(requestedUrl, /search=academy/);
      assert.match(requestedUrl, /isPublic=false/);
      assert.match(requestedUrl, /limit=2/);
    }

    for (const pagination of [{ limit: 0 }, { limit: 101 }, { limit: 1.5 }, { offset: -1 }, { offset: 1.2 }]) {
      let called = false;
      globalThis.fetch = (async () => { called = true; return new Response('{}'); }) as typeof fetch;
      await assert.rejects(
        () => getInstitutionPage({}, pagination),
        (error: unknown) => error instanceof EducationDirectoryV2Error && error.code === 'INVALID_DIRECTORY_QUERY'
      );
      assert.equal(called, false);
    }

    {
      globalThis.fetch = (async () => new Response(JSON.stringify({
        success: false, error: 'EDUCATION_DIRECTORY_V2_DISABLED'
      }), { status: 503, headers: { 'Content-Type': 'application/json' } })) as typeof fetch;
      await assert.rejects(
        () => getInstitutionPage(),
        (error: unknown) => error instanceof EducationDirectoryV2Error &&
          error.status === 503 && error.code === 'EDUCATION_DIRECTORY_V2_DISABLED'
      );
    }

    {
      globalThis.fetch = (async () => new Response(JSON.stringify({
        success: true, count: 2, institutions: [{ id: 'inst-1' }],
        pagination: { limit: 50, offset: 0, total: 3, hasMore: true }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })) as typeof fetch;
      await assert.rejects(
        () => getInstitutionPage(),
        (error: unknown) => error instanceof EducationDirectoryV2Error && error.code === 'EDUCATION_DIRECTORY_RESPONSE_INVALID'
      );
    }

    {
      globalThis.fetch = (async () => new Response(JSON.stringify({
        success: true, count: 3, institutions: [{ id: 'inst-1' }],
        pagination: { limit: 50, offset: 0, total: 3, hasMore: false }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })) as typeof fetch;
      await assert.rejects(
        () => getInstitutionPage(),
        (error: unknown) => error instanceof EducationDirectoryV2Error && error.code === 'EDUCATION_DIRECTORY_RESPONSE_INVALID'
      );
    }

    {
      globalThis.fetch = (async () => { throw new Error('network down'); }) as typeof fetch;
      await assert.rejects(() => getInstitutionPage(), /network down/);
    }

    console.log('Education directory v2 client suite passed');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
