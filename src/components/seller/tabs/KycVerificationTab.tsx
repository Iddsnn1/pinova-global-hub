import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Upload, 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Loader2, 
  EyeOff,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { vendorAuthenticatedFetch, getVendorAuthHeaders } from '../../../lib/vendorAuthBridge';

interface KycVerificationTabProps {
  userUsername: string;
  serverStatus: {
    status: string;
    verified: boolean;
    pstpAuthorized: boolean;
    sellerLifecycle: string;
    storeName: string | null;
  };
  application: any;
  onRefreshStatus: () => Promise<void> | void;
  isRefreshingStatus?: boolean;
}

export const KycVerificationTab: React.FC<KycVerificationTabProps> = ({
  userUsername,
  serverStatus,
  application,
  onRefreshStatus,
  isRefreshingStatus = false
}) => {
  // Document Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<'national_id' | 'passport' | 'business_cert' | 'utility_bill'>('national_id');
  const [docNumber, setDocNumber] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Local list of uploaded documents (synced with application.documents)
  const existingDocs: any[] = application?.documents || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5 MB
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError('Document file exceeds maximum allowed size of 5 MB.');
      setSelectedFile(null);
      return;
    }

    // Check MIME type
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) {
      setUploadError('Allowed document formats are PDF, JPEG, and PNG.');
      setSelectedFile(null);
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a document file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const authHeaders = getVendorAuthHeaders();

      const response = await fetch('/api/vendor/document-upload', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': selectedFile.type,
          'X-Filename': encodeURIComponent(selectedFile.name),
          'X-Document-Type': docType,
          'X-Document-Number': docNumber.trim() || 'UNSPECIFIED'
        },
        body: buffer
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUploadSuccess(`Document "${selectedFile.name}" encrypted with AES-256-GCM and submitted securely.`);
        setSelectedFile(null);
        setDocNumber('');
        // Refresh server status to display newly registered document
        onRefreshStatus();
      } else {
        setUploadError(data.message || data.error || 'Failed to upload verification document.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Network error uploading document.');
    } finally {
      setIsUploading(false);
    }
  };

  const status = serverStatus.status || 'UNREGISTERED';

  const getStatusBadge = () => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified & Approved
          </span>
        );
      case 'PENDING_REVIEW':
      case 'UNDER_REVIEW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Under Review by Compliance
          </span>
        );
      case 'ACTION_REQUIRED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Action Required
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Verification Declined
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Not Started / Unregistered
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="seller-kyc-tab">
      {/* Header & Status Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              KYC & Identity Verification Center
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Authoritative server-governed merchant compliance and encrypted identity validation
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {getStatusBadge()}
            <button
              id="kyc-refresh-status-btn"
              type="button"
              onClick={() => void onRefreshStatus()}
              disabled={isRefreshingStatus}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-wait"
              title="Refresh authoritative compliance status"
              aria-label="Refresh authoritative compliance status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingStatus ? 'animate-spin' : ''}`} />
              <span>{isRefreshingStatus ? 'Refreshing…' : 'Refresh Status'}</span>
            </button>
          </div>
        </div>

        {/* Compliance Notes if present */}
        {application?.adminReviewNotes && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
            <strong className="block mb-1">Compliance Review Feedback:</strong>
            {application.adminReviewNotes}
          </div>
        )}

        {/* Verification Summary Info */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-500 block mb-0.5">Pioneer Identity</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono">
              @{userUsername}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-500 block mb-0.5">Merchant Lifecycle</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {serverStatus.sellerLifecycle || 'INACTIVE'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-500 block mb-0.5">PSTP Settlement State</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {serverStatus.pstpAuthorized ? 'Escrow Authorized' : 'Pending Authorization'}
            </span>
          </div>
        </div>
      </div>

      {/* Security Protocol Banner */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 md:p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
            Private AES-256-GCM Encrypted Storage
          </h4>
          <p>
            All verification credentials, passports, and utility bills are encrypted with military-grade AES-256-GCM authenticated cipher with 12-byte initialization vectors and 16-byte authentication tags. Stored files are written with POSIX 0600 private permissions and cannot be accessed via public web links.
          </p>
          <div className="flex items-center gap-3 pt-1 font-mono text-[11px] text-purple-600 dark:text-purple-400">
            <span>• Magic-byte signature verification</span>
            <span>• 5 MB upload ceiling</span>
            <span>• Identity-bound access control</span>
          </div>
        </div>
      </div>

      {/* Upload Document Form */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Upload Verification Document
        </h4>
        <p className="text-xs text-neutral-500 mb-5">
          Supported documents: National ID / NIN, International Passport, Business Incorporation Certificate, or Utility Bill
        </p>

        {uploadSuccess && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {uploadSuccess}
          </div>
        )}

        {uploadError && (
          <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {uploadError}
          </div>
        )}

        <form onSubmit={handleUploadDocument} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Document Type *
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                <option value="national_id">National ID / NIN Card</option>
                <option value="passport">International Passport</option>
                <option value="business_cert">Business Incorporation / CAC Certificate</option>
                <option value="utility_bill">Municipal Utility Bill (Address Proof)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Document Identifier Number (Optional)
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. A09283419"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          </div>

          {/* Real File Input Container */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Select Document File *
            </label>
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-2xl p-6 text-center transition-colors">
              <input
                type="file"
                id="kyc-doc-file-input"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="kyc-doc-file-input" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
                    </p>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      Click or drag to select document
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      PDF, JPEG, or PNG up to 5 MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              id="upload-kyc-doc-btn"
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Encrypting & Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Secure Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Submitted Documents */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Registered Verification Documents
        </h4>
        <p className="text-xs text-neutral-500 mb-4">
          Authoritative records attached to this merchant profile
        </p>

        {existingDocs.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No verification documents submitted yet. Upload your proof of identity above to begin verification.
          </div>
        ) : (
          <div className="space-y-3">
            {existingDocs.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <span>{doc.docType || doc.fileName || 'Verification Document'}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        AES-256-GCM
                      </span>
                    </div>
                    <div className="text-neutral-500 text-[11px] mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>Ref: <code className="font-mono text-neutral-700 dark:text-neutral-300">{doc.fileUrl ? doc.fileUrl.replace('private://vendor-documents/', 'doc_') : (doc.id || 'registered')}</code></span>
                      {doc.documentNumber && (
                        <span>• ID: <code className="font-mono text-neutral-700 dark:text-neutral-300">••••{doc.documentNumber.slice(-4)}</code></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    Encrypted Storage (0600)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
