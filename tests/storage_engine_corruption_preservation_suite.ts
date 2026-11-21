import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { StorageEngine } from '../src/server/db/StorageEngine';

const originalDataDir = process.env.PINOVA_DATA_DIR;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pinova-storage-engine-'));
process.env.PINOVA_DATA_DIR = tempDir;

try {
  const corruptPath = path.join(tempDir, 'corrupt_collection.json');
  const corruptContents = '{ this is not valid JSON';
  fs.writeFileSync(corruptPath, corruptContents, 'utf8');
  assert.throws(
    () => new StorageEngine('corrupt_collection', 'id', [{ id: 'seed-record' }]),
    /Refusing to overwrite existing data file/
  );
  assert.equal(fs.readFileSync(corruptPath, 'utf8'), corruptContents,
    'corrupted source must remain byte-for-byte unchanged');

  const invalidShapePath = path.join(tempDir, 'invalid_shape_collection.json');
  const invalidShapeContents = '{"unexpected":"object"}';
  fs.writeFileSync(invalidShapePath, invalidShapeContents, 'utf8');
  assert.throws(
    () => new StorageEngine('invalid_shape_collection', 'id', [{ id: 'seed-record' }]),
    /Refusing to overwrite existing data file/
  );
  assert.equal(fs.readFileSync(invalidShapePath, 'utf8'), invalidShapeContents,
    'invalid-shape source must remain byte-for-byte unchanged');

  const emptyPath = path.join(tempDir, 'empty_collection.json');
  fs.writeFileSync(emptyPath, '', 'utf8');
  assert.throws(
    () => new StorageEngine('empty_collection', 'id', [{ id: 'seed-record' }]),
    /Refusing to overwrite existing data file/
  );
  assert.equal(fs.readFileSync(emptyPath, 'utf8'), '',
    'empty existing source must remain unchanged');

  const missingKeyPath = path.join(tempDir, 'missing_key_collection.json');
  const missingKeyContents = '[{"id":"valid-record"},{"name":"record-without-key"}]';
  fs.writeFileSync(missingKeyPath, missingKeyContents, 'utf8');
  assert.throws(
    () => new StorageEngine('missing_key_collection', 'id', [{ id: 'seed-record' }]),
    /Refusing to overwrite existing data file/
  );
  assert.equal(fs.readFileSync(missingKeyPath, 'utf8'), missingKeyContents,
    'records without keys must not be silently dropped from the source');

  const duplicateKeyPath = path.join(tempDir, 'duplicate_key_collection.json');
  const duplicateKeyContents = '[{"id":"duplicate"},{"id":"duplicate"}]';
  fs.writeFileSync(duplicateKeyPath, duplicateKeyContents, 'utf8');
  assert.throws(
    () => new StorageEngine('duplicate_key_collection', 'id', [{ id: 'seed-record' }]),
    /Refusing to overwrite existing data file/
  );
  assert.equal(fs.readFileSync(duplicateKeyPath, 'utf8'), duplicateKeyContents,
    'duplicate keys must not silently collapse distinct source records');

  const seeded = new StorageEngine<{ id: string; value?: string }>('new_collection', 'id', [{ id: 'seed-record' }]);
  assert.equal(seeded.get('seed-record')?.id, 'seed-record',
    'first-time initialization must still seed a genuinely missing collection');

  const failedSeedPath = path.join(tempDir, 'failed_seed_collection.json');
  const originalRenameSyncForSeed = fs.renameSync;
  const mutableFsForSeed = fs as unknown as { renameSync: typeof fs.renameSync };
  try {
    mutableFsForSeed.renameSync = (() => { throw new Error('simulated initial seed commit failure'); }) as typeof fs.renameSync;
    assert.throws(
      () => new StorageEngine('failed_seed_collection', 'id', [{ id: 'seed-record' }]),
      /Refusing to overwrite existing data file/
    );
    assert.equal(fs.existsSync(failedSeedPath), false,
      'failed first-time seed must not create a falsely initialized collection file');
    assert.equal(
      fs.readdirSync(tempDir).some((name) => name.startsWith('failed_seed_collection.json.tmp.')),
      false,
      'failed initial seed must clean up its incomplete temporary file'
    );
  } finally {
    mutableFsForSeed.renameSync = originalRenameSyncForSeed;
  }

  const mutableFs = fs as unknown as { renameSync: typeof fs.renameSync };
  const originalRenameSync = fs.renameSync;
  try {
    mutableFs.renameSync = (() => { throw new Error('simulated disk commit failure'); }) as typeof fs.renameSync;
    assert.equal(seeded.set('seed-record', { id: 'seed-record', value: 'uncommitted' }), false,
      'set must report persistence failure');
    assert.equal(seeded.get('seed-record')?.value, undefined,
      'set must roll back its in-memory mutation when persistence fails');

    assert.equal(seeded.unshift({ id: 'unshifted-record' }), false,
      'unshift must report persistence failure');
    assert.equal(seeded.get('unshifted-record'), null,
      'unshift must roll back its in-memory mutation when persistence fails');

    assert.equal(seeded.delete('seed-record'), false,
      'delete must report persistence failure');
    assert.equal(seeded.get('seed-record')?.id, 'seed-record',
      'delete must restore the in-memory record when persistence fails');
  } finally {
    mutableFs.renameSync = originalRenameSync;
  }
  console.log('STORAGE ENGINE CORRUPTION PRESERVATION CONTRACT: PASS');
} finally {
  if (originalDataDir === undefined) delete process.env.PINOVA_DATA_DIR;
  else process.env.PINOVA_DATA_DIR = originalDataDir;
  fs.rmSync(tempDir, { recursive: true, force: true });
}
