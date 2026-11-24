import { AdmissionDocument } from '../types/education';

export const educationDocumentService = {
  async list(applicationId?: string): Promise<AdmissionDocument[]> {
    const query = applicationId ? `?applicationId=${encodeURIComponent(applicationId)}` : '';
    const res = await fetch(`/api/education/admissions/documents${query}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || 'Academic document listing is unavailable');
    return Array.isArray(data.documents) ? data.documents : [];
  },

  async download(documentId: string): Promise<Blob> {
    const res = await fetch(`/api/education/admissions/documents/${encodeURIComponent(documentId)}/download`);
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
      headers: {
        'Content-Type': input.file.type,
        'X-Document-Type': input.documentType,
        'X-File-Name': input.file.name,
        ...(input.applicationId ? { 'X-Application-Id': input.applicationId } : {})
      },
      body: input.file
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Academic document upload failed');
    return data.document;
  }
};
