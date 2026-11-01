import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { Vendor } from '../../../types';
import { vendorAuthenticatedFetch, getVendorAuthHeaders } from '../../../lib/vendorAuthBridge';

interface StoreBrandingTabProps {
  userUsername: string;
  vendorProfile: Vendor;
  onBrandingUpdated: (newLogo: string | null, newBanner: string | null) => void;
  onOpenStorefrontPreview: () => void;
}

export const StoreBrandingTab: React.FC<StoreBrandingTabProps> = ({
  userUsername,
  vendorProfile,
  onBrandingUpdated,
  onOpenStorefrontPreview
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(vendorProfile.logoImage || null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(vendorProfile.bannerImage || null);

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch verified branding status from server on mount
  useEffect(() => {
    let isMounted = true;
    async function loadBrandingStatus() {
      try {
        const res = await vendorAuthenticatedFetch('/api/vendor/branding-status');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            if (data.storeLogo) setLogoUrl(data.storeLogo);
            if (data.storeBanner) setBannerUrl(data.storeBanner);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch branding status:', err);
      }
    }
    loadBrandingStatus();
    return () => { isMounted = false; };
  }, []);

  const handleUploadAsset = async (file: File, assetType: 'logo' | 'banner') => {
    // 1. Validation: 5 MB ceiling
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setMessage({ type: 'error', text: 'Image file exceeds maximum allowed size of 5 MB.' });
      return;
    }

    // 2. Validation: Allowed formats
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Allowed image formats are PNG, JPEG, and WebP.' });
      return;
    }

    if (assetType === 'logo') setIsUploadingLogo(true);
    else setIsUploadingBanner(true);
    setMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const authHeaders = getVendorAuthHeaders();

      const res = await fetch('/api/vendor/branding-upload', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': file.type,
          'X-Asset-Type': assetType === 'logo' ? 'storeLogo' : 'storeBanner',
          'X-Filename': encodeURIComponent(file.name)
        },
        body: buffer
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        if (assetType === 'logo') {
          setLogoUrl(data.url);
          onBrandingUpdated(data.url, bannerUrl);
        } else {
          setBannerUrl(data.url);
          onBrandingUpdated(logoUrl, data.url);
        }
        setMessage({
          type: 'success',
          text: `${assetType === 'logo' ? 'Store logo' : 'Store banner'} uploaded to verified cloud storage successfully.`
        });
      } else {
        setMessage({
          type: 'error',
          text: data.message || data.error || 'Failed to upload branding image.'
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error during image upload.' });
    } finally {
      if (assetType === 'logo') setIsUploadingLogo(false);
      else setIsUploadingBanner(false);
    }
  };

  const handleRemoveAsset = async (assetType: 'logo' | 'banner') => {
    if (assetType === 'logo') {
      setLogoUrl(null);
      onBrandingUpdated(null, bannerUrl);
    } else {
      setBannerUrl(null);
      onBrandingUpdated(logoUrl, null);
    }
    setMessage({
      type: 'success',
      text: `${assetType === 'logo' ? 'Store logo' : 'Store banner'} removed.`
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="seller-store-branding-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Storefront Visual Branding
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure your official logo and showcase banner for buyers on PiNova Global Marketplace
          </p>
        </div>
        <button
          onClick={onOpenStorefrontPreview}
          className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Eye className="w-4 h-4 text-purple-600" />
          Preview Storefront
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
            : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {message.text}
        </div>
      )}

      {/* Grid for Logo and Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Logo Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                Store Logo
              </h4>
              <span className="text-[11px] text-neutral-500 font-medium">1:1 Square recommended</span>
            </div>

            {/* Logo Preview */}
            <div className="w-28 h-28 mx-auto my-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 overflow-hidden flex items-center justify-center relative group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Store Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-2 text-neutral-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px] block">No Logo</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-neutral-500 text-center mb-4">
              Supported formats: PNG, JPG, WebP (Max 5 MB). Validated via magic bytes.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <label className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
              {isUploadingLogo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading Logo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {logoUrl ? 'Replace Logo' : 'Upload Logo'}
                </>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={isUploadingLogo}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadAsset(file, 'logo');
                }}
                className="hidden"
              />
            </label>

            {logoUrl && (
              <button
                onClick={() => handleRemoveAsset('logo')}
                className="w-full py-2 px-4 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Logo
              </button>
            )}
          </div>
        </div>

        {/* Store Banner Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Store Showcase Banner
              </h4>
              <span className="text-[11px] text-neutral-500 font-medium">16:9 Landscape</span>
            </div>

            {/* Banner Preview */}
            <div className="w-full h-28 my-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 overflow-hidden flex items-center justify-center relative">
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt="Store Banner"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-2 text-neutral-400">
                  <Sparkles className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px] block">No Banner Image</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-neutral-500 text-center mb-4">
              Supported formats: PNG, JPG, WebP (Max 5 MB). Displayed across store header.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <label className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
              {isUploadingBanner ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading Banner...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {bannerUrl ? 'Replace Banner' : 'Upload Banner'}
                </>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={isUploadingBanner}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadAsset(file, 'banner');
                }}
                className="hidden"
              />
            </label>

            {bannerUrl && (
              <button
                onClick={() => handleRemoveAsset('banner')}
                className="w-full py-2 px-4 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Banner
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Storefront Preview Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-600" />
          Buyer Storefront Header Preview
        </h4>
        <p className="text-xs text-neutral-500 mb-4">
          This is exactly how buyers view your merchant card on the marketplace
        </p>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50 dark:bg-neutral-950">
          {/* Banner */}
          <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 relative">
            {bannerUrl && (
              <img
                src={bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Store Info Row */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 relative z-10">
            <div className="flex items-end gap-3.5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-neutral-800 border-4 border-white dark:border-neutral-900 shadow-md overflow-hidden shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white font-bold text-xl">
                    {vendorProfile.storeName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {vendorProfile.storeName || 'Pioneer Store'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  @{userUsername} • {vendorProfile.country || 'Global'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenStorefrontPreview}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit Full Storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
