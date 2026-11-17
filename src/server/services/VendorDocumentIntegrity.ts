import crypto from 'crypto';

export interface VendorDocumentIntegrityMetadata {
  id?: unknown;
  owner?: unknown;
  iv?: unknown;
  authTag?: unknown;
  encryptedByteLength?: unknown;
  originalSize?: unknown;
}

/**
 * Verifies ownership metadata and AES-256-GCM authenticity for an encrypted KYC object.
 * Returns false for malformed metadata, mismatched ownership, truncated data, or tampering.
 */
export function verifyVendorDocumentIntegrity(input: {
  id: string;
  owner: string;
  metadata: VendorDocumentIntegrityMetadata;
  encryptedBytes: Uint8Array;
  encryptionKey: Buffer;
}): boolean {
  const id = String(input.id || '').trim().toLowerCase();
  const owner = String(input.owner || '').trim().toLowerCase();
  const metadata = input.metadata;
  const ciphertext = Buffer.from(input.encryptedBytes || []);
  const key = input.encryptionKey;

  if (!/^[a-f0-9]{32}$/.test(id) || !owner || !Buffer.isBuffer(key) || key.length !== 32) return false;
  if (String(metadata?.id || '').toLowerCase() !== id) return false;
  if (String(metadata?.owner || '').trim().toLowerCase() !== owner) return false;
  if (!/^[a-f0-9]{24}$/i.test(String(metadata?.iv || ''))) return false;
  if (!/^[a-f0-9]{32}$/i.test(String(metadata?.authTag || ''))) return false;
  if (Number(metadata?.encryptedByteLength) !== ciphertext.length || ciphertext.length === 0) return false;

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(String(metadata.iv), 'hex'));
    decipher.setAuthTag(Buffer.from(String(metadata.authTag), 'hex'));
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext.length > 0 && Number(metadata?.originalSize) === plaintext.length;
  } catch {
    return false;
  }
}
