import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText,
  Save
} from 'lucide-react';
import { Vendor } from '../../../types';
import { vendorAuthenticatedFetch } from '../../../lib/vendorAuthBridge';
import { MARKETPLACE_CATEGORIES, resolveMarketplaceCategory } from '../../../data/categoryData';

interface StoreProfileTabProps {
  userUsername: string;
  vendorProfile: Vendor;
  initialApplication: any;
  onProfileUpdated: (updatedApp: any) => void;
}

export const StoreProfileTab: React.FC<StoreProfileTabProps> = ({
  userUsername,
  vendorProfile,
  initialApplication,
  onProfileUpdated
}) => {
  const [storeName, setStoreName] = useState(initialApplication?.storeName || vendorProfile.storeName || '');
  const [storeDescription, setStoreDescription] = useState(
    initialApplication?.storeDescription || vendorProfile.bio || ''
  );
  const [sellerType, setSellerType] = useState<'individual' | 'business'>(
    initialApplication?.sellerType || 'individual'
  );
  const [category, setCategory] = useState(
    resolveMarketplaceCategory(initialApplication?.categoriesToSell?.[0] || 'electronics')
  );
  const [country, setCountry] = useState(
    initialApplication?.country || vendorProfile.country || 'Global'
  );
  const [stateRegion, setStateRegion] = useState(
    initialApplication?.stateRegion || ''
  );
  const [city, setCity] = useState(
    initialApplication?.city || ''
  );
  const [contactEmail, setContactEmail] = useState(
    initialApplication?.contactEmail || vendorProfile.contactEmail || `${userUsername}@pinova.network`
  );
  const [contactPhone, setContactPhone] = useState(
    initialApplication?.contactPhone || vendorProfile.contactPhone || ''
  );
  const [contactTelegram, setContactTelegram] = useState(
    initialApplication?.contactTelegram || ''
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    initialApplication?.websiteUrl || vendorProfile.websiteUrl || ''
  );
  const [businessReg, setBusinessReg] = useState(
    initialApplication?.businessRegistrationNumber || ''
  );
  const [taxId, setTaxId] = useState(
    initialApplication?.taxId || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !contactEmail.trim()) {
      setSaveError('Store name and contact email are required.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const payload = {
        pioneerUsername: userUsername,
        storeName: storeName.trim(),
        sellerType,
        country,
        countryCode: country.slice(0, 2).toUpperCase(),
        stateRegion,
        city,
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        contactTelegram: contactTelegram.trim(),
        storeDescription: storeDescription.trim(),
        websiteUrl: websiteUrl.trim(),
        categoriesToSell: [category],
        businessRegistrationNumber: businessReg.trim(),
        taxId: taxId.trim(),
        // Preserve existing documents & policies
        documents: initialApplication?.documents || [],
        policies: initialApplication?.policies || {
          returnRefundPolicy: 'Standard 7-Day return under PSTP Escrow guidelines.',
          deliveryShippingPolicy: 'Prompt tracked dispatch within 48 hours.'
        },
        pstpAgreementAccepted: true
      };

      const res = await vendorAuthenticatedFetch('/api/vendor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess('Store profile successfully saved to authoritative merchant repository.');
        onProfileUpdated(data.application || payload);
        setTimeout(() => setSaveSuccess(null), 5000);
      } else {
        setSaveError(data.message || data.error || 'Failed to update store profile.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Network error updating store profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="seller-store-profile-tab">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Store Information & Profile
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Public merchant identity displayed across PiNova Global Marketplace
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
            @{userUsername}
          </span>
        </div>

        {saveSuccess && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {saveSuccess}
          </div>
        )}

        {saveError && (
          <div className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {saveError}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          {/* Section 1: Basic Store Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Store Name *
              </label>
              <input
                id="profile-store-name"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Apex Electronics Kenya"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Seller Entity Type
              </label>
              <select
                value={sellerType}
                onChange={(e) => setSellerType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                <option value="individual">Individual Pioneer (Independent Seller)</option>
                <option value="business">Registered Business / Enterprise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Store Bio & Description
            </label>
            <textarea
              rows={3}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              placeholder="Tell Pioneers about your store, products, and fulfillment standards..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Primary Product Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(resolveMarketplaceCategory(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                {MARKETPLACE_CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Website / Portfolio (Optional)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & Region */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Store Base Location
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Kenya, Nigeria, USA"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  State / Region
                </label>
                <input
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="e.g. Nairobi, Lagos, California"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Westlands, Ikeja"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact Channels */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Official Contact Channels
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  placeholder="merchant@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 555-0192"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Telegram Username
                </label>
                <input
                  type="text"
                  value={contactTelegram}
                  onChange={(e) => setContactTelegram(e.target.value)}
                  placeholder="@merchant_channel"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Business Registrations (If Business) */}
          {sellerType === 'business' && (
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Corporate Identifiers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Business Registration / RC Number
                  </label>
                  <input
                    type="text"
                    value={businessReg}
                    onChange={(e) => setBusinessReg(e.target.value)}
                    placeholder="e.g. RC-982341-B"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Tax Identification Number (TIN / VAT)
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="e.g. TIN-8921-99"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              id="save-store-profile-btn"
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Store Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
