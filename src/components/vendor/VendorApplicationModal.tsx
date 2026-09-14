import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  Building2, 
  User, 
  ShieldCheck, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  Info,
  Lock,
  RefreshCw,
  Award,
  Check,
  Trash2
} from 'lucide-react';
import { VendorApplication, SellerType, VendorApplicationStatus } from '../../types';

interface VendorApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pioneerUsername: string;
  onApplicationSubmitted?: (application: VendorApplication) => void;
}

export const VendorApplicationModal: React.FC<VendorApplicationModalProps> = ({
  isOpen,
  onClose,
  pioneerUsername,
  onApplicationSubmitted
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingExisting, setFetchingExisting] = useState<boolean>(true);
  const [existingApplication, setExistingApplication] = useState<VendorApplication | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [storeName, setStoreName] = useState('');
  const [sellerType, setSellerType] = useState<SellerType>('individual');
  const [country, setCountry] = useState('Nigeria');
  const [stateRegion, setStateRegion] = useState('');
  const [city, setCity] = useState('');
  const DEFAULT_PIONEER_AVATAR = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80';
  const DEFAULT_STORE_BANNER = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';

  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeLogo, setStoreLogo] = useState('');
  const [storeBanner, setStoreBanner] = useState('');

  // Branding upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement | null>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const bannerInputRef = React.useRef<HTMLInputElement | null>(null);

  const [businessRegNumber, setBusinessRegNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [docType, setDocType] = useState<'national_id' | 'passport' | 'business_cert' | 'utility_bill'>('national_id');
  const [docNumber, setDocNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedDocRef, setUploadedDocRef] = useState<string>('');
  const [returnPolicy, setReturnPolicy] = useState('Standard 7-Day Return for defective items under PSTP Escrow Protection.');
  const [deliveryTerms, setDeliveryTerms] = useState('Dispatched within 24-48 business hours with verified tracking number.');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Check if pioneer already has an application
  useEffect(() => {
    if (!isOpen || !pioneerUsername) return;

    let active = true;
    setFetchingExisting(true);
    setErrorMessage(null);

    fetch(`/api/vendor/application/${encodeURIComponent(pioneerUsername)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && (data.application || data.data)) {
          const app: any = data.application || data.data;
          setExistingApplication(app);
          // Populate fields
          setStoreName(app.storeName || '');
          setSellerType(app.sellerType || 'individual');
          setCountry(app.country || 'Nigeria');
          setStateRegion(app.stateRegion || '');
          setCity(app.city || '');
          setContactEmail(app.contactEmail || '');
          setContactPhone(app.contactPhone || '');
          setSocialHandle(app.socialHandle || app.contactTelegram || '');
          setStoreDescription(app.storeDescription || '');
          const existingLogo = app.storeLogo || app.logoUrl || '';
          const existingBanner = app.storeBanner || app.bannerUrl || '';
          setStoreLogo(existingLogo);
          setLogoPreview(existingLogo);
          setStoreBanner(existingBanner);
          setBannerPreview(existingBanner);
          setBusinessRegNumber(app.businessRegNumber || app.businessRegistrationNumber || '');
          setTaxId(app.taxId || '');
          const docs = app.requiredDocuments || app.documents;
          if (docs && docs.length > 0) {
            const firstDoc = docs[0];
            const rawType = firstDoc.type || firstDoc.docType;
            if (rawType === 'business_cert' || rawType === 'business_registration') {
              setDocType('business_cert');
            } else if (rawType === 'utility_bill' || rawType === 'address_proof') {
              setDocType('utility_bill');
            } else if (rawType === 'passport') {
              setDocType('passport');
            } else {
              setDocType('national_id');
            }
            setDocNumber(firstDoc.documentNumber || '');
            if (firstDoc.fileUrl && firstDoc.fileUrl.startsWith('private://vendor-documents/')) {
              setUploadedDocRef(firstDoc.fileUrl);
              setUploadStatus('uploaded');
            }
          }
          if (app.policies?.returnRefundPolicy) {
            setReturnPolicy(app.policies.returnRefundPolicy);
          } else if (app.returnPolicy) {
            setReturnPolicy(app.returnPolicy);
          }
          if (app.policies?.deliveryShippingPolicy) {
            setDeliveryTerms(app.policies.deliveryShippingPolicy);
          } else if (app.deliveryTerms) {
            setDeliveryTerms(app.deliveryTerms);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not fetch existing application:', err);
      })
      .finally(() => {
        if (active) setFetchingExisting(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, pioneerUsername]);

  if (!isOpen) return null;

  const uploadDocumentFile = async (file: File, currentDocType: string) => {
    setUploadStatus('uploading');
    setUploadError(null);

    try {
      let resolvedMime = file.type || '';
      if (!resolvedMime) {
        if (/\.pdf$/i.test(file.name)) resolvedMime = 'application/pdf';
        else if (/\.png$/i.test(file.name)) resolvedMime = 'image/png';
        else if (/\.jpe?g$/i.test(file.name)) resolvedMime = 'image/jpeg';
        else resolvedMime = 'application/pdf';
      }

      const headers: Record<string, string> = {
        'Content-Type': resolvedMime,
        'X-Filename': encodeURIComponent(file.name),
        'X-Document-Type': currentDocType
      };

      const token = localStorage.getItem('auth_token') || localStorage.getItem('pi_auth_token') || localStorage.getItem('pinova_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const fileBuffer = await file.arrayBuffer();

      const res = await fetch('/api/vendor/document-upload', {
        method: 'POST',
        headers,
        body: fileBuffer
      });

      const data = await res.json();
      if (data.success && data.reference && data.reference.startsWith('private://vendor-documents/')) {
        setUploadedDocRef(data.reference);
        setUploadStatus('uploaded');
      } else {
        setUploadStatus('error');
        setUploadError(data.message || data.error || 'Failed to securely upload verification document.');
      }
    } catch (err: any) {
      setUploadStatus('error');
      setUploadError(err.message || 'Network error occurred while uploading document.');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
    const isAllowedMime = allowedMimes.includes(file.type.toLowerCase()) || /\.(pdf|jpe?g|png)$/i.test(file.name);
    if (!isAllowedMime) {
      setUploadError('Invalid file format. Only PDF, JPG, and PNG files are accepted.');
      setSelectedFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(`File is too large (${sizeMb} MB). Maximum allowed size is 5 MB.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    await uploadDocumentFile(file, docType);
  };

  /**
   * Uploads a store branding image (logo or banner) to the public branding endpoint.
   */
  const uploadBrandingAsset = async (file: File, type: 'logo' | 'banner'): Promise<string> => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('pi_auth_token') || localStorage.getItem('pinova_token');
    const headers: Record<string, string> = {
      'Content-Type': file.type || (file.name.endsWith('.png') ? 'image/png' : file.name.endsWith('.webp') ? 'image/webp' : 'image/jpeg'),
      'X-Branding-Type': type,
      'X-Filename': encodeURIComponent(file.name),
      'X-Pioneer-Username': pioneerUsername || ''
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/vendor/branding-upload', {
      method: 'POST',
      headers,
      body: file
    });

    if (!response.ok) {
      let errMsg = `Failed to upload ${type} image (${response.status})`;
      try {
        const errorJson = await response.json();
        if (errorJson.message) errMsg = errorJson.message;
      } catch {}
      throw new Error(errMsg);
    }

    const result = await response.json();
    if (!result.success || !result.url) {
      throw new Error(result.message || `Failed to process ${type} image.`);
    }

    return result.url;
  };

  /**
   * Validates client-side file requirements: PNG, JPG/JPEG, WebP, 5 MB limit.
   */
  const validateBrandingFile = (file: File | undefined | null): string | null => {
    if (!file) return 'Please select a valid image file.';
    if (file.size === 0) return 'The selected file is empty.';
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return `File size is ${sizeMb} MB. Maximum allowed size is 5 MB.`;
    }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['png', 'jpg', 'jpeg', 'webp'];
    if (!allowedTypes.includes(file.type.toLowerCase()) && (!ext || !allowedExts.includes(ext))) {
      return 'Invalid format. Supported formats are PNG, JPG, and WebP.';
    }
    return null;
  };

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;

    setLogoError(null);
    const error = validateBrandingFile(file);
    if (error) {
      setLogoError(error);
      return;
    }

    setLogoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);

    setLogoUploading(true);
    try {
      const serverAssetUrl = await uploadBrandingAsset(file, 'logo');
      setStoreLogo(serverAssetUrl);
      setLogoPreview(serverAssetUrl);
    } catch (err: any) {
      setLogoError(err.message || 'Failed to upload store logo.');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (storeLogo && storeLogo.startsWith('/api/vendor/branding-asset/')) {
      const assetId = storeLogo.split('/').pop();
      if (assetId) {
        try {
          const token = localStorage.getItem('auth_token') || localStorage.getItem('pi_auth_token') || localStorage.getItem('pinova_token');
          await fetch(`/api/vendor/branding-asset/${assetId}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              'X-Pioneer-Username': pioneerUsername || ''
            }
          });
        } catch {}
      }
    }
    setLogoFile(null);
    setLogoPreview('');
    setStoreLogo('');
    setLogoError(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;

    setBannerError(null);
    const error = validateBrandingFile(file);
    if (error) {
      setBannerError(error);
      return;
    }

    setBannerFile(file);
    const objectUrl = URL.createObjectURL(file);
    setBannerPreview(objectUrl);

    setBannerUploading(true);
    try {
      const serverAssetUrl = await uploadBrandingAsset(file, 'banner');
      setStoreBanner(serverAssetUrl);
      setBannerPreview(serverAssetUrl);
    } catch (err: any) {
      setBannerError(err.message || 'Failed to upload store banner.');
    } finally {
      setBannerUploading(false);
    }
  };

  const handleRemoveBanner = async () => {
    if (storeBanner && storeBanner.startsWith('/api/vendor/branding-asset/')) {
      const assetId = storeBanner.split('/').pop();
      if (assetId) {
        try {
          const token = localStorage.getItem('auth_token') || localStorage.getItem('pi_auth_token') || localStorage.getItem('pinova_token');
          await fetch(`/api/vendor/branding-asset/${assetId}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              'X-Pioneer-Username': pioneerUsername || ''
            }
          });
        } catch {}
      }
    }
    setBannerFile(null);
    setBannerPreview('');
    setStoreBanner('');
    setBannerError(null);
    if (bannerInputRef.current) bannerInputRef.current.value = '';
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) {
      setErrorMessage('Please enter a Store / Merchant Name.');
      setStep(1);
      return;
    }
    if (!contactEmail.trim() || !contactPhone.trim()) {
      setErrorMessage('Please enter valid contact information (email & phone).');
      setStep(1);
      return;
    }
    if (!storeDescription.trim()) {
      setErrorMessage('Please write a brief store description.');
      setStep(2);
      return;
    }
    if (!docNumber.trim()) {
      setErrorMessage('Please enter your official Document Number in Step 3.');
      setStep(3);
      return;
    }
    if (!uploadedDocRef || !uploadedDocRef.startsWith('private://vendor-documents/')) {
      setErrorMessage('A securely uploaded verification document is required. Please upload your document in Step 3.');
      setStep(3);
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('You must agree to PiNova Merchant Governance & Escrow Rules.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const docNameMap: Record<string, string> = {
      national_id: 'National ID Card / NIN',
      passport: 'International Passport',
      business_cert: 'Business Incorporation Certificate',
      utility_bill: 'Municipal Utility Bill'
    };

    const payload = {
      pioneerUsername: pioneerUsername || 'Pioneer_User',
      storeName: storeName.trim(),
      sellerType,
      country,
      stateRegion: stateRegion.trim(),
      city: city.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      socialHandle: socialHandle.trim(),
      storeDescription: storeDescription.trim(),
      storeLogo: storeLogo.trim() || DEFAULT_PIONEER_AVATAR,
      storeBanner: storeBanner.trim() || DEFAULT_STORE_BANNER,
      logoUrl: storeLogo.trim() || DEFAULT_PIONEER_AVATAR,
      bannerUrl: storeBanner.trim() || DEFAULT_STORE_BANNER,
      businessRegNumber: businessRegNumber.trim(),
      taxId: taxId.trim(),
      requiredDocuments: [
        {
          type: docType,
          name: docNameMap[docType] || 'Identity Verification Document',
          fileUrl: uploadedDocRef,
          documentNumber: docNumber.trim()
        }
      ],
      returnPolicy: returnPolicy.trim(),
      deliveryTerms: deliveryTerms.trim()
    };

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('auth_token') || localStorage.getItem('pi_auth_token') || localStorage.getItem('pinova_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/vendor/apply', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && (data.application || data.data)) {
        const app = data.application || data.data;
        setExistingApplication(app);
        setSuccessMessage('Your Vendor Application has been submitted to PiNova Governance for verification review!');
        if (onApplicationSubmitted) {
          onApplicationSubmitted(app);
        }
      } else {
        setErrorMessage(data.message || 'Failed to submit application. Please check your entries.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden text-white my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Store className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">Become a Verified Vendor</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Seller Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">Join PiNova Merchant Network & Sell for Pi Cryptocurrency</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Application Status Banner */}
        {existingApplication && (
          <div className={`p-4 mx-5 mt-5 rounded-2xl border flex items-start gap-3 ${
            existingApplication.status === 'APPROVED'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : existingApplication.status === 'REJECTED'
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
          }`}>
            {existingApplication.status === 'APPROVED' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : existingApplication.status === 'REJECTED' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-black uppercase tracking-wider flex items-center gap-2">
                <span>Application Status: {existingApplication.status.replace('_', ' ')}</span>
                <span className="text-[10px] lowercase font-normal opacity-80">
                  (Ref: {existingApplication.id})
                </span>
              </div>
              <p className="text-slate-300">
                {existingApplication.status === 'APPROVED'
                  ? 'Congratulations! Your merchant account is verified. You have full access to Seller Studio and product listings.'
                  : existingApplication.status === 'REJECTED'
                  ? `Application requires revision: ${existingApplication.adminReviewNotes || 'Please update your verification credentials and resubmit.'}`
                  : 'Your application is currently under review by PiNova Merchant Governance. Expected turnaround is 2-4 hours.'}
              </p>
            </div>
          </div>
        )}

        {/* Success / Error Banners */}
        {successMessage && (
          <div className="p-4 mx-5 mt-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 mx-5 mt-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step Indicator Tabs */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-800 overflow-x-auto text-xs font-bold text-slate-400 gap-2">
          {[
            { num: 1, label: 'Store Info' },
            { num: 2, label: 'Branding' },
            { num: 3, label: 'Verification' },
            { num: 4, label: 'Policies' },
            { num: 5, label: 'Review' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
                step === s.num
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'hover:text-slate-200 bg-slate-800/60'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                step === s.num ? 'bg-white text-purple-700' : 'bg-slate-700 text-slate-300'
              }`}>
                {s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitApplication} className="p-5 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          
          {/* STEP 1: Basic Store Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-purple-400" />
                  <span>Merchant & Business Identity</span>
                </h3>
                <p className="text-xs text-slate-400">Specify your seller classification and contact coordinates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Pioneer Username (Pi ID)</label>
                  <input
                    type="text"
                    disabled
                    value={pioneerUsername}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Store / Merchant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Tech Nexus"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Seller Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Seller Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSellerType('individual')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      sellerType === 'individual'
                        ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/30'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <User className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-white">Individual Pioneer</div>
                      <p className="text-[10px] text-slate-400">Selling personal goods, crafts, or digital assets.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSellerType('business')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      sellerType === 'business'
                        ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/30'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-white">Registered Business / Enterprise</div>
                      <p className="text-[10px] text-slate-400">Registered company with retail inventory or official brand.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Country & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Nigeria">Nigeria 🇳🇬</option>
                    <option value="Kenya">Kenya 🇰🇪</option>
                    <option value="United States">United States 🇺🇸</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="United Arab Emirates">UAE 🇦🇪</option>
                    <option value="Ghana">Ghana 🇬🇭</option>
                    <option value="South Africa">South Africa 🇿🇦</option>
                    <option value="Saudi Arabia">Saudi Arabia 🇸🇦</option>
                    <option value="Philippines">Philippines 🇵🇭</option>
                    <option value="Indonesia">Indonesia 🇮🇩</option>
                    <option value="Vietnam">Vietnam 🇻🇳</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">State / Province</label>
                  <input
                    type="text"
                    placeholder="e.g. Kano or Lagos"
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Ikeja"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="merchant@pinova.hub"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Social / Telegram</label>
                  <input
                    type="text"
                    placeholder="@merchant_handle"
                    value={socialHandle}
                    onChange={(e) => setSocialHandle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Branding & Description */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Store Branding & Profile</span>
                </h3>
                <p className="text-xs text-slate-400">Customize how your storefront appears to buyers across PiNova.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Store Bio & Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your goods, specialty, authentic sourcing, and customer commitment..."
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Store Logo Upload */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-200">Store Logo</label>
                      <span className="text-[11px] text-slate-400">PNG, JPG, or WebP (max 5 MB)</span>
                    </div>
                    {logoUploading && (
                      <span className="text-[11px] text-purple-400 font-semibold flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </span>
                    )}
                    {!logoUploading && (logoPreview || storeLogo) && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Logo Attached</span>
                      </span>
                    )}
                  </div>

                  {/* Hidden real file input */}
                  <input
                    ref={logoInputRef}
                    id="store-logo-file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleLogoSelect}
                  />

                  {/* Preview or Empty State */}
                  {(logoPreview || storeLogo) ? (
                    <div className="flex items-center gap-3 bg-slate-900/90 border border-purple-500/30 rounded-xl p-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border-2 border-purple-500/40 flex-shrink-0">
                        <img
                          src={logoPreview || storeLogo}
                          alt="Store Logo Preview"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = DEFAULT_PIONEER_AVATAR;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-xs font-bold text-white truncate">
                          {logoFile?.name || (storeLogo.includes('/api/vendor/branding-asset/') ? 'Custom Store Logo' : 'Uploaded Logo')}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {logoFile ? `${(logoFile.size / 1024).toFixed(0)} KB • Ready for storefront` : 'Active on public storefront'}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5">
                          <button
                            type="button"
                            id="change-store-logo-btn"
                            disabled={logoUploading}
                            onClick={() => logoInputRef.current?.click()}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-purple-500/30 transition-all flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Change</span>
                          </button>
                          <button
                            type="button"
                            id="remove-store-logo-btn"
                            disabled={logoUploading}
                            onClick={handleRemoveLogo}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-xl p-4 bg-slate-900/40 flex flex-col items-center justify-center text-center transition-colors">
                      <div className="w-9 h-9 rounded-full bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-300 mb-2">
                        <Store className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        id="upload-store-logo-btn"
                        disabled={logoUploading}
                        onClick={() => logoInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-900/30 transition-all flex items-center gap-1.5 mb-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Logo</span>
                      </button>
                      <span className="text-[10px] text-slate-400">Leave empty to use automatic Pioneer avatar.</span>
                    </div>
                  )}

                  {logoError && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{logoError}</span>
                    </div>
                  )}
                </div>

                {/* Store Banner Upload */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-200">Store Banner</label>
                      <span className="text-[11px] text-slate-400">PNG, JPG, or WebP (max 5 MB)</span>
                    </div>
                    {bannerUploading && (
                      <span className="text-[11px] text-purple-400 font-semibold flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </span>
                    )}
                    {!bannerUploading && (bannerPreview || storeBanner) && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Banner Attached</span>
                      </span>
                    )}
                  </div>

                  {/* Hidden real file input */}
                  <input
                    ref={bannerInputRef}
                    id="store-banner-file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleBannerSelect}
                  />

                  {/* Preview or Empty State */}
                  {(bannerPreview || storeBanner) ? (
                    <div className="space-y-2 bg-slate-900/90 border border-purple-500/30 rounded-xl p-3">
                      <div className="relative w-full h-16 rounded-lg overflow-hidden bg-slate-950 border border-purple-500/40">
                        <img
                          src={bannerPreview || storeBanner}
                          alt="Store Banner Preview"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = DEFAULT_STORE_BANNER;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {bannerFile?.name || (storeBanner.includes('/api/vendor/branding-asset/') ? 'Custom Store Banner' : 'Uploaded Banner')}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {bannerFile ? `${(bannerFile.size / 1024).toFixed(0)} KB • Ready for storefront` : 'Active on public storefront'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            id="change-store-banner-btn"
                            disabled={bannerUploading}
                            onClick={() => bannerInputRef.current?.click()}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-purple-500/30 transition-all flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Change</span>
                          </button>
                          <button
                            type="button"
                            id="remove-store-banner-btn"
                            disabled={bannerUploading}
                            onClick={handleRemoveBanner}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-xl p-4 bg-slate-900/40 flex flex-col items-center justify-center text-center transition-colors">
                      <div className="w-9 h-9 rounded-full bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-300 mb-2">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        id="upload-store-banner-btn"
                        disabled={bannerUploading}
                        onClick={() => bannerInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-900/30 transition-all flex items-center gap-1.5 mb-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Banner</span>
                      </button>
                      <span className="text-[10px] text-slate-400">Leave empty for high-contrast default banner.</span>
                    </div>
                  )}

                  {bannerError && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{bannerError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Verification & Legal Credentials */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Merchant Compliance & Verification</span>
                </h3>
                <p className="text-xs text-slate-400">KYC verification ensures buyer trust and PSTP escrow protection.</p>
              </div>

              {sellerType === 'business' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">Business Registration / CAC Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. RC-1928472"
                      value={businessRegNumber}
                      onChange={(e) => setBusinessRegNumber(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">Tax ID / TIN (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. TIN-892348"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Document Type *</label>
                  <select
                    value={docType}
                    onChange={(e) => {
                      const newType = e.target.value as any;
                      setDocType(newType);
                      if (selectedFile) {
                        uploadDocumentFile(selectedFile, newType);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="national_id">National ID Card / NIN</option>
                    <option value="passport">International Passport</option>
                    <option value="business_cert">Business Incorporation Certificate</option>
                    <option value="utility_bill">Municipal Utility Bill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Document Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Official NIN, Passport No, RC No"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Secure Document File Upload Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    Verification Document File *
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Max 5 MB (PDF, JPG, PNG)</span>
                </div>

                {/* Upload Zone */}
                <div className={`relative p-5 rounded-2xl border-2 border-dashed transition-all ${
                  uploadStatus === 'uploaded'
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : uploadStatus === 'error'
                    ? 'bg-rose-950/20 border-rose-500/50'
                    : uploadStatus === 'uploading'
                    ? 'bg-purple-950/20 border-purple-500/50'
                    : 'bg-slate-800/60 border-slate-700 hover:border-purple-500/60'
                }`}>
                  <input
                    type="file"
                    id="vendorDocUploadInput"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    onChange={handleFileSelect}
                    disabled={uploadStatus === 'uploading'}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                  />

                  <div className="flex flex-col items-center justify-center text-center space-y-2 py-2">
                    {uploadStatus === 'uploading' ? (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-purple-300">Uploading verification document securely…</p>
                          {selectedFile && (
                            <p className="text-[11px] text-slate-400 font-mono">{selectedFile.name}</p>
                          )}
                        </div>
                      </>
                    ) : uploadStatus === 'uploaded' ? (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-emerald-300">Document uploaded securely.</p>
                          {selectedFile ? (
                            <p className="text-[11px] text-slate-300 font-mono">{selectedFile.name}</p>
                          ) : uploadedDocRef ? (
                            <p className="text-[11px] text-slate-400 font-mono">{uploadedDocRef}</p>
                          ) : null}
                        </div>
                        <p className="text-[10px] text-slate-400">Click or drop a new file to replace</p>
                      </>
                    ) : uploadStatus === 'error' ? (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-rose-300">Upload failed</p>
                          {uploadError && (
                            <p className="text-[11px] text-rose-400 max-w-sm">{uploadError}</p>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">Click or drop a file to retry</p>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white">
                            Click to select document or drag and drop
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Accepted: PDF / JPG / JPEG / PNG • Maximum: 5 MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Stored Protection Notice */}
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <div className="leading-relaxed">
                    <span className="font-semibold text-slate-300">Protected Server-Side Storage: </span>
                    KYC files are stored with AES-256-GCM server-side encryption under strict governance control. Public URLs and plaintext files are strictly prohibited.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Store Policies & Fulfillment Terms */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Store Policies & Delivery SLA</span>
                </h3>
                <p className="text-xs text-slate-400">Define clear customer expectations for returns and logistics.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Return & Refund Policy *</label>
                <textarea
                  rows={3}
                  required
                  value={returnPolicy}
                  onChange={(e) => setReturnPolicy(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Shipping, Delivery & Fulfillment SLA *</label>
                <textarea
                  rows={3}
                  required
                  value={deliveryTerms}
                  onChange={(e) => setDeliveryTerms(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Final Review & Submission */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Review Application & Governance Agreement</span>
                </h3>
                <p className="text-xs text-slate-400">Confirm all details before submitting to PiNova Merchant Governance.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Merchant Store Name:</span>
                  <span className="font-bold text-white">{storeName || '—'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Seller Type:</span>
                  <span className="font-bold text-purple-300 capitalize">{sellerType}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Location:</span>
                  <span className="font-bold text-white">{city ? `${city}, ` : ''}{stateRegion ? `${stateRegion}, ` : ''}{country}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Contact:</span>
                  <span className="font-bold text-white">{contactEmail} ({contactPhone})</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Store Logo:</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={logoPreview || storeLogo || DEFAULT_PIONEER_AVATAR}
                      alt="Store Logo"
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-md object-cover border border-purple-500/40"
                    />
                    <span className="font-bold text-white text-[11px]">
                      {(logoPreview || storeLogo) ? 'Custom Attached' : 'Automatic Avatar'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Store Banner:</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={bannerPreview || storeBanner || DEFAULT_STORE_BANNER}
                      alt="Store Banner"
                      referrerPolicy="no-referrer"
                      className="w-10 h-5 rounded object-cover border border-purple-500/40"
                    />
                    <span className="font-bold text-white text-[11px]">
                      {(bannerPreview || storeBanner) ? 'Custom Attached' : 'Default Banner'}
                    </span>
                  </div>
                </div>
                {businessRegNumber && (
                  <div className="flex justify-between text-slate-300">
                    <span>Registration No:</span>
                    <span className="font-mono font-bold text-amber-300">{businessRegNumber}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>KYC Document Type:</span>
                  <span className="font-bold text-white">
                    {docType === 'national_id' ? 'National ID Card / NIN' : docType === 'passport' ? 'International Passport' : docType === 'business_cert' ? 'Business Incorporation Certificate' : 'Municipal Utility Bill'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Document Number:</span>
                  <span className="font-mono font-bold text-white">{docNumber || '—'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>KYC Security Status:</span>
                  <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                    {uploadedDocRef.startsWith('private://vendor-documents/') ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Encrypted (AES-256-GCM)</span>
                      </>
                    ) : (
                      <span className="text-rose-400">Missing Upload</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeVendorTerms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-800 border-slate-700"
                />
                <label htmlFor="agreeVendorTerms" className="text-xs text-purple-200 leading-relaxed cursor-pointer select-none">
                  I agree to operate within the <strong>PiNova Merchant Code of Conduct</strong>, accept <strong>PSTP Escrow-governed Pi payments</strong>, fulfill orders within stated SLAs, and maintain verified customer support standards.
                </label>
              </div>
            </div>
          )}

          {/* Navigation Controls inside Form */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !agreedTerms}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:opacity-95 disabled:opacity-50 text-white text-xs font-black flex items-center gap-2 shadow-xl transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Submit for Review</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
