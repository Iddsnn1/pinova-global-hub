import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  isValidEducationAdmissionDocumentId,
  safeEducationAdmissionDocumentFileName
} from '../src/server/services/EducationDocumentStorage';

function run() {
  assert.equal(
    isValidEducationAdmissionDocumentId('edu-doc-123e4567-e89b-12d3-a456-426614174000'),
    true,
    'valid generated document identifiers are accepted'
  );
  assert.equal(isValidEducationAdmissionDocumentId('../private/document.pdf'), false);
  assert.equal(isValidEducationAdmissionDocumentId('edu-doc-not-a-uuid'), false);
  assert.equal(isValidEducationAdmissionDocumentId(''), false);

  assert.equal(
    safeEducationAdmissionDocumentFileName('../../private/passport.pdf'),
    'passport.pdf',
    'download filenames must not preserve directory traversal segments'
  );
  assert.equal(
    safeEducationAdmissionDocumentFileName('passport\r\nX-Injected: yes.pdf'),
    'passport_X-Injected_yes.pdf',
    'download filenames must strip header control characters'
  );
  assert.ok(
    safeEducationAdmissionDocumentFileName('a'.repeat(200) + '.pdf').length <= 120,
    'download filenames must be length bounded'
  );

  const storageSource = fs.readFileSync(
    path.join(process.cwd(), 'src/server/services/EducationDocumentStorage.ts'),
    'utf8'
  );
  assert.ok(
    storageSource.includes('WHERE document_id = ${id} AND owner_username = ${owner}'),
    'document metadata lookup must bind both document ID and normalized owner'
  );

  const serverSource = fs.readFileSync(path.join(process.cwd(), 'server.ts'), 'utf8');
  const routeStart = serverSource.indexOf("app.get('/api/education/admissions/documents/:documentId/download'");
  const routeEnd = serverSource.indexOf("app.post(", routeStart);
  const route = serverSource.slice(routeStart, routeEnd);
  assert.ok(route.includes('authenticate'), 'download endpoint must require an authenticated session');
  assert.ok(route.includes('getEducationAdmissionDocument(username, req.params.documentId)'), 'download endpoint must retrieve only the authenticated owner document');
  assert.ok(route.includes("'Cache-Control', 'private, no-store'"), 'download response must not be publicly cached');
  assert.ok(route.includes('body.pipe(res)'), 'download endpoint must stream the private object body');
  const documentListRouteStart = serverSource.indexOf("app.get('/api/education/admissions/documents'");
  const documentListRouteEnd = serverSource.indexOf("app.get('/api/education/admissions/documents/:documentId/download'");
  const documentListRoute = serverSource.slice(documentListRouteStart, documentListRouteEnd);
  assert.ok(documentListRoute.includes("['PLATFORM_ADMIN', 'COMPLIANCE_OFFICER', 'COMPLIANCE_ADMIN'].includes(r)"), 'document listing must recognize the same global compliance roles as admissions review');

  console.log('Education document download security suite passed');
}

run();
