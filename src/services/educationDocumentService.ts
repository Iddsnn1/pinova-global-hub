import { AdmissionDocument } from '../types/education';

export const educationDocumentService = {
  async list(applicationId?: string): Promise<AdmissionDocument[]> {
    const query = applicationId ? `?applicationId=${encodeURIComponent(applicationId)}` : '';
    const res = await fetch(`/api/education/admissions/documents${query}`);
    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    return Array.isArray(data.documents) ? data.documents : [];
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
