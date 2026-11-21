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

  const seeded = new StorageEngine('new_collection', 'id', [{ id: 'seed-record' }]);
  assert.equal(seeded.get('seed-record')?.id, 'seed-record',
    'first-time initialization must still seed a genuinely missing collection');
  console.log('STORAGE ENGINE CORRUPTION PRESERVATION CONTRACT: PASS');
} finally {
  if (originalDataDir === undefined) delete process.env.PINOVA_DATA_DIR;
  else process.env.PINOVA_DATA_DIR = originalDataDir;
  fs.rmSync(tempDir, { recursive: true, force: true });
}
