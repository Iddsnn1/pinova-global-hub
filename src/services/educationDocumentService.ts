import { AdmissionDocument } from '../types/education';
import { getVendorAuthToken } from '../lib/vendorAuthBridge';

function educationAuthHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers = { ...extra };
  const token = getVendorAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export const educationDocumentService = {
  async list(applicationId?: string): Promise<AdmissionDocument[]> {
    const query = applicationId ? `?applicationId=${encodeURIComponent(applicationId)}` : '';
    const res = await fetch(`/api/education/admissions/documents${query}`, { credentials: 'same-origin', headers: educationAuthHeaders() });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || 'Academic document listing is unavailable');
    return Array.isArray(data.documents) ? data.documents : [];
  },

  async download(documentId: string): Promise<Blob> {
    const res = await fetch(`/api/education/admissions/documents/${encodeURIComponent(documentId)}/download`, { credentials: 'same-origin', headers: educationAuthHeaders() });
    if (!res.ok) throw new Error('Academic document download failed');
    return res.blob();
  },

  async upload(input: {
    file: File;
    documentType: AdmissionDocument['type'];
    applicationId?: string;
  }): Promise<AdmissionDocument> {
    const res = await fetch('/api/education/admissions/documents/upload', {
      method: 'POST',
      headers: educationAuthHeaders({
        'Content-Type': input.file.type,
        'X-Document-Type': input.documentType,
        'X-File-Name': input.file.name,
        ...(input.applicationId ? { 'X-Application-Id': input.applicationId } : {})
      }),
      credentials: 'same-origin',
      body: input.file
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Academic document upload failed');
    return data.document;
  }
};
