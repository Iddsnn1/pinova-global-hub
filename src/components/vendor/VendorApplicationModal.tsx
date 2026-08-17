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
  Check
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
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeLogo, setStoreLogo] = useState('');
  const [storeBanner, setStoreBanner] = useState('');
  const [businessRegNumber, setBusinessRegNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [docType, setDocType] = useState<'national_id' | 'passport' | 'business_cert' | 'utility_bill'>('national_id');
  const [docNumber, setDocNumber] = useState('');
  const [docFileUrl, setDocFileUrl] = useState('');
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
          setStoreLogo(app.storeLogo || app.logoUrl || '');
          setStoreBanner(app.storeBanner || app.bannerUrl || '');
          setBusinessRegNumber(app.businessRegNumber || app.businessRegistrationNumber || '');
          setTaxId(app.taxId || '');
          const docs = app.requiredDocuments || app.documents;
          if (docs && docs.length > 0) {
            setDocType(docs[0].type || 'national_id');
            setDocNumber(docs[0].documentNumber || '');
            setDocFileUrl(docs[0].fileUrl || '');
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
    if (!agreedTerms) {
      setErrorMessage('You must agree to PiNova Merchant Governance & Escrow Rules.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

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
      storeLogo: storeLogo.trim() || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80',
      storeBanner: storeBanner.trim() || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      businessRegNumber: businessRegNumber.trim(),
      taxId: taxId.trim(),
      requiredDocuments: [
        {
          type: docType,
          name: docType === 'national_id' ? 'National Identity Card' : docType === 'passport' ? 'International Passport' : docType === 'business_cert' ? 'Business Incorporation Certificate' : 'Municipal Utility Bill',
          fileUrl: docFileUrl.trim() || 'https://pinova.hub/docs/verified_id.pdf',
          documentNumber: docNumber.trim() || 'DOC-VERIFIED'
        }
      ],
      returnPolicy: returnPolicy.trim(),
      deliveryTerms: deliveryTerms.trim()
    };

    try {
      const res = await fetch('/api/vendor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                  ? `Application requires revision: ${existingApplication.reviewNotes || 'Please update your verification credentials and resubmit.'}`
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
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Store Logo Image URL</label>
                  <input
                    type="url"
                    placeholder="https://.../logo.png"
                    value={storeLogo}
                    onChange={(e) => setStoreLogo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Leave empty to use automatic Pioneer avatar.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Store Banner Image URL</label>
                  <input
                    type="url"
                    placeholder="https://.../banner.jpg"
                    value={storeBanner}
                    onChange={(e) => setStoreBanner(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Leave empty for high-contrast default banner.</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Document Type *</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="national_id">National ID Card / NIN</option>
                    <option value="passport">International Passport</option>
                    <option value="business_cert">Business Incorporation Cert</option>
                    <option value="utility_bill">Municipal Utility Bill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Document Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9823481234"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Document File Reference</label>
                  <input
                    type="text"
                    placeholder="Doc Upload Reference or URL"
                    value={docFileUrl}
                    onChange={(e) => setDocFileUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
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
                {businessRegNumber && (
                  <div className="flex justify-between text-slate-300">
                    <span>Registration No:</span>
                    <span className="font-mono font-bold text-amber-300">{businessRegNumber}</span>
                  </div>
                )}
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
