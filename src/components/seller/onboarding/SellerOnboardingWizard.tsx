import React, { useRef, useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Upload, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  Lock,
  Globe,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { ensureServerSession, vendorAuthenticatedFetch } from '../../../lib/vendorAuthBridge';
import { getAuthenticatedPiUser, PiSdkManager } from '../../../lib/piSdk';
import { MARKETPLACE_CATEGORIES, resolveMarketplaceCategory } from '../../../data/categoryData';
import { ALL_GLOBAL_COUNTRIES } from '../../../data/countriesData';

interface SellerOnboardingWizardProps {
  userUsername: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (applicationData: any) => void;
}

export const SellerOnboardingWizard: React.FC<SellerOnboardingWizardProps> = ({
  userUsername,
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Business Info
  const [storeName, setStoreName] = useState('');
  const [storeBio, setStoreBio] = useState('');
  const [category, setCategory] = useState('');
  const [sellerType, setSellerType] = useState<'individual' | 'business'>('individual');
  const [countryCode, setCountryCode] = useState('');
  const [country, setCountry] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [city, setCity] = useState('');

  const countryOptions = React.useMemo(() => {
    return ALL_GLOBAL_COUNTRIES
      .map((country) => [country.code, country.name] as [string, string])
      .sort((a, b) => a[1].localeCompare(b[1]));
  }, []);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const stepOneFormRef = useRef<HTMLDivElement>(null);

  // Step 2: Branding
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [brandingError, setBrandingError] = useState<string | null>(null);

  // Step 3: KYC
  const [docType, setDocType] = useState<'national_id' | 'passport' | 'business_cert' | 'utility_bill'>('national_id');
  const [docNumber, setDocNumber] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<Array<{
    docType: string;
    fileName: string;
    fileUrl: string;
    sizeBytes: number;
    documentNumber?: string;
  }>>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingKyc, setIsUploadingKyc] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);

  // Step 4: Policies
  const [returnPolicy, setReturnPolicy] = useState('');
  const [shippingPolicy, setShippingPolicy] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [authenticatingPioneer, setAuthenticatingPioneer] = useState(false);
  const [serverSessionReady, setServerSessionReady] = useState(false);

  if (!isOpen) return null;

  // Handle Branding Upload
  const handleUploadBranding = async (file: File, assetType: 'logo' | 'banner') => {
    if (file.size > 5 * 1024 * 1024) {
      setBrandingError('File exceeds 5 MB limit.');
      return;
    }
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setBrandingError('Allowed formats are PNG, JPEG, and WebP.');
      return;
    }

    if (assetType === 'logo') setIsUploadingLogo(true);
    else setIsUploadingBanner(true);
    setBrandingError(null);

    try {
      // Branding uploads are protected by the same server-authoritative session
      // used for merchant submission. Establish it before sending any bytes.
      const authenticated = await ensureOnboardingAuthentication();
      if (!authenticated) {
        setBrandingError('Pioneer authentication is required before uploading merchant branding. Please authenticate in Pi Browser and try again.');
        return;
      }

      const buffer = await file.arrayBuffer();
      const res = await vendorAuthenticatedFetch('/api/vendor/branding-upload', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          'X-Asset-Type': assetType === 'logo' ? 'storeLogo' : 'storeBanner',
          'X-Filename': encodeURIComponent(file.name)
        },
        body: buffer
      });

      const rawResponse = await res.text();
      let data: any = {};
      try {
        data = rawResponse ? JSON.parse(rawResponse) : {};
      } catch {
        data = { message: rawResponse || `Server returned HTTP ${res.status}` };
      }
      if (res.ok && data.success && data.url) {
        if (assetType === 'logo') setLogoUrl(data.url);
        else setBannerUrl(data.url);
      } else {
        setBrandingError(data.message || data.error || `Branding upload failed (HTTP ${res.status}).`);
      }
    } catch (err: any) {
      setBrandingError(err.message || 'Network error during upload.');
    } finally {
      if (assetType === 'logo') setIsUploadingLogo(false);
      else setIsUploadingBanner(false);
    }
  };

  // Handle KYC Document Upload
  const handleUploadKycDoc = async () => {
    if (!selectedFile) {
      setKycError('Please select a document file.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setKycError('Document exceeds maximum size of 5 MB.');
      return;
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(selectedFile.type)) {
      setKycError('Allowed formats are PDF, JPEG, and PNG.');
      return;
    }

    setIsUploadingKyc(true);
    setKycError(null);

    try {
      // KYC uploads also require an authenticated server session; never send
      // protected documents without server verification.
      const authenticated = await ensureOnboardingAuthentication();
      if (!authenticated) {
        setKycError('Pioneer authentication is required before uploading verification documents. Please authenticate in Pi Browser and try again.');
        return;
      }

      const buffer = await selectedFile.arrayBuffer();
      const res = await vendorAuthenticatedFetch('/api/vendor/document-upload', {
        method: 'POST',
        headers: {
          'Content-Type': selectedFile.type,
          'X-Filename': encodeURIComponent(selectedFile.name),
          'X-Document-Type': docType,
          'X-Document-Number': docNumber.trim() || 'UNSPECIFIED'
        },
        body: buffer
      });

      const data = await res.json();
      if (res.ok && data.success && data.reference) {
        setUploadedDocs(prev => [
          ...prev,
          {
            docType,
            fileName: selectedFile.name,
            fileUrl: data.reference,
            sizeBytes: selectedFile.size,
            documentNumber: docNumber.trim() || undefined
          }
        ]);
        setSelectedFile(null);
        setDocNumber('');
      } else {
        setKycError(data.message || data.error || 'Failed to upload document.');
      }
    } catch (err: any) {
      setKycError(err.message || 'Network error during document upload.');
    } finally {
      setIsUploadingKyc(false);
    }
  };

  const validatePolicies = () => {
    const missing: string[] = [];
    if (!returnPolicy.trim()) missing.push('Return/refund policy');
    if (!shippingPolicy.trim()) missing.push('Delivery/shipping policy');
    if (!termsAccepted) missing.push('PSTP agreement');

    if (missing.length) {
      setSubmitError(`${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required before review.`);
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const validateBeforeSubmit = () => {
    const missing: string[] = [];
    if (!storeName.trim()) missing.push('Store name');
    if (!email.trim()) missing.push('Contact email');
    if (!countryCode) missing.push('Country');
    if (!category) missing.push('Category');
    if (!returnPolicy.trim()) missing.push('Return/refund policy');
    if (!shippingPolicy.trim()) missing.push('Delivery/shipping policy');
    if (!termsAccepted) missing.push('PSTP agreement');

    if (missing.length) {
      setSubmitError(`${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required.`);
      if (!storeName.trim() || !email.trim() || !countryCode || !category) setCurrentStep(1);
      else setCurrentStep(4);
      return false;
    }
    return true;
  };

  // Final Step: Submit Application
  const ensureOnboardingAuthentication = async (): Promise<boolean> => {
    if (authenticatingPioneer) return false;

    setAuthenticatingPioneer(true);
    setSubmitError(null);

    try {
      const existingUser = getAuthenticatedPiUser();
      const user = existingUser || await PiSdkManager.authenticate(
        ['username', 'payments'],
        undefined,
        false
      );

      if (!user?.accessToken || !user.username) {
        setServerSessionReady(false);
        setSubmitError('Pi authentication was not completed. Please authenticate your Pioneer session in Pi Browser and try again.');
        return false;
      }

      // Reuse the server session negotiated from the authenticated Pi user first.
      // Force-refresh is reserved for an actual expired/invalid session; calling it
      // here can trigger a second native authentication cycle in Pi Browser.
      let sessionToken = await ensureServerSession(false);
      if (!sessionToken) {
        sessionToken = await ensureServerSession(true);
      }
      if (!sessionToken) {
        setServerSessionReady(false);
        setSubmitError('Pi authentication succeeded, but the secure server session could not be established. Please try again.');
        return false;
      }

      setServerSessionReady(true);
      return true;
    } catch (err: any) {
      setServerSessionReady(false);
      setSubmitError(err?.message || 'Pi authentication could not be completed. Please try again in Pi Browser.');
      return false;
    } finally {
      setAuthenticatingPioneer(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateBeforeSubmit()) return;

    const authenticated = await ensureOnboardingAuthentication();
    if (!authenticated) return;
    if (uploadedDocs.length === 0) {
      setSubmitError('At least one verification document is required for KYC compliance.');
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        pioneerUsername: userUsername,
        storeName: storeName.trim(),
        storeDescription: storeBio.trim(),
        sellerType,
        country,
        countryCode,
        stateRegion: stateRegion.trim(),
        city: city.trim(),
        contactEmail: email.trim(),
        contactPhone: phone.trim(),
        storeLogo: logoUrl || undefined,
        storeBanner: bannerUrl || undefined,
        categoriesToSell: [category],
        documents: uploadedDocs.map(d => ({
          docType: d.docType,
          fileName: d.fileName,
          fileUrl: d.fileUrl,
          documentNumber: d.documentNumber
        })),
        policies: {
          returnRefundPolicy: returnPolicy.trim(),
          deliveryShippingPolicy: shippingPolicy.trim(),
          cancellationPolicy: cancellationPolicy.trim()
        },
        pstpAgreementAccepted: termsAccepted
      };

      const res = await vendorAuthenticatedFetch('/api/vendor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const rawResponse = await res.text();
      let data: any;
      try { data = rawResponse ? JSON.parse(rawResponse) : {}; } catch { data = { error: rawResponse || `Server returned HTTP ${res.status}` }; }
      if (res.ok && data.success) {
        onComplete(data.application || payload);
        onClose();
      } else {
        setSubmitError(data.message || data.error || 'Failed to submit merchant application.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Network error submitting application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStepOne = () => {
    const root = stepOneFormRef.current;
    const storeNameValue = root?.querySelector<HTMLInputElement>('[name="storeName"]')?.value ?? storeName;
    const emailValue = root?.querySelector<HTMLInputElement>('[name="contactEmail"]')?.value ?? email;
    const categoryValue = root?.querySelector<HTMLSelectElement>('[name="category"]')?.value ?? category;
    const countryValue = root?.querySelector<HTMLSelectElement>('[name="countryCode"]')?.value ?? countryCode;
    const normalizedStoreName = storeNameValue.trim();
    const normalizedEmail = emailValue.trim();
    const normalizedCategory = categoryValue ? resolveMarketplaceCategory(categoryValue) : '';
    const normalizedCountryCode = countryValue.trim();
    setStoreName(normalizedStoreName);
    setEmail(normalizedEmail);
    setCategory(normalizedCategory);
    setCountryCode(normalizedCountryCode);
    setCountry(countryOptions.find(([code]) => code === normalizedCountryCode)?.[1] || '');
    const missing: string[] = [];
    if (!normalizedStoreName) missing.push('Store name');
    if (!normalizedEmail) missing.push('Contact email');
    if (!normalizedCategory) missing.push('Category');
    if (!normalizedCountryCode) missing.push('Country');
    if (missing.length) {
      setSubmitError(`${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required.`);
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const steps = [
    { num: 1, title: 'Store Details' },
    { num: 2, title: 'Branding' },
    { num: 3, title: 'KYC Identity' },
    { num: 4, title: 'Policies' },
    { num: 5, title: 'Review & Submit' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              Pioneer Merchant Onboarding
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Step {currentStep} of 5 — {steps[currentStep - 1].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="px-5 sm:px-6 py-3 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800/80 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[400px]">
            {steps.map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div key={step.num} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-purple-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                  }`}>
                    {isDone ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ${
                    isCurrent ? 'text-purple-600 dark:text-purple-400' : 'text-neutral-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div ref={stepOneFormRef} className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {submitError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {submitError}
            </div>
          )}

          {/* STEP 1: Store & Business Details */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={storeName}
                    onInput={(e) => setStoreName(e.currentTarget.value)}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Apex Tech Enterprise"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Seller Type
                  </label>
                  <select
                    value={sellerType}
                    onChange={(e) => setSellerType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="individual">Individual Pioneer</option>
                    <option value="business">Registered Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Store Bio
                </label>
                <textarea
                  rows={2}
                  value={storeBio}
                  onChange={(e) => setStoreBio(e.target.value)}
                  placeholder="Describe your products and merchant commitments..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value ? resolveMarketplaceCategory(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="">Select category</option>
                    {MARKETPLACE_CATEGORIES.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Country *
                  </label>
                  <select
                    name="countryCode"
                    value={countryCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setCountryCode(code);
                      setCountry(countryOptions.find(([value]) => value === code)?.[1] || '');
                    }}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="">Select country</option>
                    {countryOptions.map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    placeholder="e.g. Kano State, Ontario"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kano, Lagos, Toronto"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={email}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0192"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Store Branding */}
          {currentStep === 2 && (
            <div className="space-y-5 text-xs">
              {brandingError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {brandingError}
                </div>
              )}

              {/* Logo Upload */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex items-center justify-center shrink-0">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-neutral-100">
                      Store Logo
                    </h5>
                    <p className="text-neutral-500 text-[11px]">
                      Square image (PNG, JPG, WebP max 5 MB)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer">
                    {isUploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {logoUrl ? 'Replace' : 'Upload'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={isUploadingLogo}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadBranding(file, 'logo');
                      }}
                      className="hidden"
                    />
                  </label>
                  {logoUrl && (
                    <button
                      onClick={() => setLogoUrl(null)}
                      className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Banner Upload */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-neutral-100">
                      Store Banner
                    </h5>
                    <p className="text-neutral-500 text-[11px]">
                      Showcase banner (16:9 ratio, max 5 MB)
                    </p>
                  </div>
                  <label className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer">
                    {isUploadingBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {bannerUrl ? 'Replace' : 'Upload'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={isUploadingBanner}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadBranding(file, 'banner');
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="h-24 w-full rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex items-center justify-center">
                  {bannerUrl ? (
                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-neutral-400 text-[11px]">No Banner Uploaded (Optional)</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: KYC Document Upload */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 text-neutral-600 dark:text-neutral-400 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  Documents are encrypted via AES-256-GCM. Filenames and signatures are validated. No public URLs are generated.
                </span>
              </div>

              {kycError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {kycError}
                </div>
              )}

              {/* Upload control */}
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Document Type *
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="national_id">National ID / NIN</option>
                      <option value="passport">International Passport</option>
                      <option value="business_cert">Business Certificate / CAC</option>
                      <option value="utility_bill">Municipal Utility Bill</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Document Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      placeholder="e.g. A09283419"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Choose Document File (PDF, JPEG, PNG, max 5 MB) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="onboarding-kyc-file"
                      accept=".pdf,image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedFile(file);
                      }}
                      className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-neutral-700 dark:file:text-neutral-200"
                    />
                    <button
                      type="button"
                      disabled={isUploadingKyc || !selectedFile}
                      onClick={handleUploadKycDoc}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold shrink-0 flex items-center gap-1.5"
                    >
                      {isUploadingKyc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      Encrypt & Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents Preview */}
              <div>
                <h6 className="font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Uploaded Verification Credentials ({uploadedDocs.length})
                </h6>
                {uploadedDocs.length === 0 ? (
                  <p className="text-neutral-500 italic">
                    No documents uploaded yet. At least one document is required.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {uploadedDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <div>
                            <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                              {doc.fileName}
                            </span>
                            <span className="text-[11px] text-neutral-500">
                              {doc.docType} • {(doc.sizeBytes / 1024).toFixed(1)} KB • Encrypted
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setUploadedDocs(prev => prev.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Store Policies */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Returns & Refunds Policy *
                </label>
                <textarea
                  rows={2}
                  value={returnPolicy}
                  onChange={(e) => setReturnPolicy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Delivery & Shipping Policy *
                </label>
                <textarea
                  rows={2}
                  value={shippingPolicy}
                  onChange={(e) => setShippingPolicy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Cancellation Policy
                </label>
                <textarea
                  rows={2}
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600"
                />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  I agree to abide by the Pioneer Seller Trust Protocol (PSTP) and allow smart cryptographic escrow handling for customer payments.
                </span>
              </label>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <h5 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                  Application Summary
                </h5>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <span className="text-neutral-500 block">Store Name:</span>
                    <strong className="text-neutral-900 dark:text-neutral-100">{storeName}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Category:</span>
                    <strong className="text-neutral-900 dark:text-neutral-100 capitalize">{MARKETPLACE_CATEGORIES.find((item) => item.id === category)?.name || category}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Location:</span>
                    <strong className="text-neutral-900 dark:text-neutral-100">{[city, stateRegion, country].filter(Boolean).join(', ') || 'Not provided'}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Email:</span>
                    <strong className="text-neutral-900 dark:text-neutral-100">{email}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Store Logo:</span>
                    <strong className="text-neutral-900 dark:text-neutral-100">{logoUrl ? 'Uploaded ✓' : 'Not uploaded'}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">KYC Documents:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{uploadedDocs.length} Document(s) Encrypted ✓</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-500 block">Return/Refund Policy</span>
                  <strong className={returnPolicy.trim() ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                    {returnPolicy.trim() ? 'Provided ✓' : 'Required'}
                  </strong>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-500 block">Delivery/Shipping Policy</span>
                  <strong className={shippingPolicy.trim() ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                    {shippingPolicy.trim() ? 'Provided ✓' : 'Required'}
                  </strong>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 sm:col-span-2">
                  <span className="text-neutral-500 block">PSTP Agreement</span>
                  <strong className={termsAccepted ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                    {termsAccepted ? 'Accepted ✓' : 'Required'}
                  </strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Review your required merchant policies and PSTP agreement before submitting. No policy text is pre-filled; these fields must contain your own merchant terms.
                </span>
              </div>

              <div className={`p-4 rounded-2xl border ${serverSessionReady ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-purple-500/10 border-purple-500/30'}`}>
                <div className="flex items-start gap-3">
                  {serverSessionReady ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-neutral-900 dark:text-neutral-100">
                      {serverSessionReady ? 'Pioneer session authenticated' : 'Pioneer authentication required'}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                      {serverSessionReady
                        ? 'Your Pi identity has an active server-verified session. You can submit this merchant application.'
                        : 'Authenticate your Pioneer session in Pi Browser before submitting. The server will issue the protected merchant session.'}
                    </p>
                    {!serverSessionReady && (
                      <button
                        type="button"
                        onClick={ensureOnboardingAuthentication}
                        disabled={authenticatingPioneer}
                        className="mt-3 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold flex items-center gap-2"
                      >
                        {authenticatingPioneer ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Authenticating Pioneer...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Authenticate Pioneer
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="p-5 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-950">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              onClick={() => {
                if (currentStep === 1 && !validateStepOne()) return;
                if (currentStep === 4 && !validatePolicies()) return;
                setCurrentStep(prev => prev + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="submit-onboarding-btn"
              disabled={isSubmitting || authenticatingPioneer}
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
