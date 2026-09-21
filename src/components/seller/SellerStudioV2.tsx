import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Boxes,
  ShoppingBag, 
  FileSpreadsheet,
  CreditCard, 
  BarChart3,
  Users, 
  UserCheck,
  Tag,
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Lock, 
  HelpCircle, 
  Menu, 
  X, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Plus, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Building2
} from 'lucide-react';
import { PiUser as User, Product, Order, Vendor } from '../../types';
import { vendorAuthenticatedFetch } from '../../lib/vendorAuthBridge';

// Import Tabs
import { OverviewTab } from './tabs/OverviewTab';
import { StoreProfileTab } from './tabs/StoreProfileTab';
import { MultiStoreTab } from './tabs/MultiStoreTab';
import { ProductsTab } from './tabs/ProductsTab';
import { InventoryWarehousesTab } from './tabs/InventoryWarehousesTab';
import { OrdersTab } from './tabs/OrdersTab';
import { BulkCsvToolsTab } from './tabs/BulkCsvToolsTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { SalesAnalyticsTab } from './tabs/SalesAnalyticsTab';
import { StaffTeamTab } from './tabs/StaffTeamTab';
import { CustomersTab } from './tabs/CustomersTab';
import { MarketingPromosTab } from './tabs/MarketingPromosTab';
import { KycVerificationTab } from './tabs/KycVerificationTab';
import { StoreBrandingTab } from './tabs/StoreBrandingTab';
import { PoliciesTab } from './tabs/PoliciesTab';
import { SecurityTab } from './tabs/SecurityTab';
import { HelpSupportTab } from './tabs/HelpSupportTab';

// Import Onboarding Wizard
import { SellerOnboardingWizard } from './onboarding/SellerOnboardingWizard';

export type SellerStudioTabId = 
  | 'overview'
  | 'multi_store'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'bulk_csv'
  | 'payments'
  | 'analytics'
  | 'staff'
  | 'customers'
  | 'marketing'
  | 'kyc'
  | 'branding'
  | 'policies'
  | 'security'
  | 'help';

interface SellerStudioV2Props {
  user: User;
  products: Product[];
  orders: Order[];
  vendors?: Vendor[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateOrderStatus?: (orderId: string, status: Order['pstpStatus'], trackingNumber?: string, carrier?: string) => void;
  onViewStorefront?: (vendorId: string) => void;
  onNavigateHome?: () => void;
}

interface NavItem {
  id: SellerStudioTabId;
  label: string;
  icon: any;
  category: 'operations' | 'finance' | 'trust';
  count?: number;
}

export const SellerStudioV2: React.FC<SellerStudioV2Props> = ({
  user,
  products,
  orders,
  vendors = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onViewStorefront,
  onNavigateHome
}) => {
  // Read initial tab from URL query params if present, default to 'overview'
  const getInitialTab = (): SellerStudioTabId => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = (params.get('tab') || params.get('module')) as SellerStudioTabId;
      const validTabs: SellerStudioTabId[] = [
        'overview', 'multi_store', 'products', 'inventory', 'orders', 'bulk_csv',
        'payments', 'analytics', 'staff', 'customers', 'marketing', 'kyc',
        'branding', 'policies', 'security', 'help'
      ];
      if (tabParam && validTabs.includes(tabParam)) {
        return tabParam;
      }
    }
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<SellerStudioTabId>(getInitialTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileModuleSheetOpen, setIsMobileModuleSheetOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Synchronize browser history and back navigation
  const handleSelectTab = useCallback((newTab: SellerStudioTabId, pushHistory = true) => {
    setActiveTab(newTab);
    setIsMobileMenuOpen(false);
    setIsMobileModuleSheetOpen(false);

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', newTab);
        if (pushHistory) {
          window.history.pushState({ sellerTab: newTab }, '', url.toString());
        }
      } catch (_) {}
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (_) {}
    }
  }, []);

  // Listen for browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.sellerTab) {
        setActiveTab(e.state.sellerTab as SellerStudioTabId);
      } else if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tabParam = (params.get('tab') || params.get('module')) as SellerStudioTabId;
        if (tabParam) {
          setActiveTab(tabParam);
        } else {
          setActiveTab('overview');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Authoritative Server Status State
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [serverStatus, setServerStatus] = useState<{
    status: string;
    verified: boolean;
    pstpAuthorized: boolean;
    sellerLifecycle: string;
    storeName: string | null;
  }>({
    status: 'UNREGISTERED',
    verified: false,
    pstpAuthorized: false,
    sellerLifecycle: 'INACTIVE',
    storeName: null
  });

  const [applicationData, setApplicationData] = useState<any>(null);

  // Find matching vendor profile or build fallback
  const userUsername = (user?.username || '').toLowerCase();
  const existingVendor = vendors.find(v => 
    v.id.toLowerCase() === userUsername || 
    (v.sellerUsername || '').toLowerCase() === userUsername
  );

  const [vendorProfile, setVendorProfile] = useState<Vendor>(
    existingVendor || {
      id: userUsername || 'vendor_current',
      sellerUsername: userUsername,
      storeName: serverStatus.storeName || 'Merchant Store',
      bio: '',
      rating: 0,
      reviewsCount: 0,
      verified: false,
      totalSalesPi: 0,
      bannerImage: '',
      logoImage: '',
      joinedDate: '',
      shippingCountries: []
    }
  );

  // Load authoritative server status on mount
  const fetchAuthoritativeStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const res = await vendorAuthenticatedFetch('/api/vendor/status');
      if (res.ok) {
        const data = await res.json();
        setServerStatus({
          status: data.status || 'UNREGISTERED',
          verified: !!data.verified,
          pstpAuthorized: !!data.pstpAuthorized,
          sellerLifecycle: data.sellerLifecycle || (data.verified ? 'ACTIVE' : 'INACTIVE'),
          storeName: data.storeName || null
        });

        if (data.application) {
          setApplicationData(data.application);
          if (data.application.storeName) {
            setVendorProfile(prev => ({
              ...prev,
              storeName: data.application.storeName,
              bio: data.application.storeDescription || prev.bio,
              logoImage: data.application.storeLogo || prev.logoImage,
              bannerImage: data.application.storeBanner || prev.bannerImage
            }));
          }
        }
      }
    } catch (err) {
      console.warn('[SellerStudioV2] Failed to fetch server status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  }, [userUsername]);

  useEffect(() => {
    fetchAuthoritativeStatus();
  }, [fetchAuthoritativeStatus]);

  // Handle Order Fulfillment Action
  const handleUpdateFulfillment = (orderId: string, trackingNumber: string, carrier: string) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, 'Shipped', trackingNumber, carrier);
    }
  };

  // Status Badge Component
  const renderStatusBadge = () => {
    const s = serverStatus.status;
    if (s === 'APPROVED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified Merchant</span>
        </span>
      );
    }
    if (s === 'PENDING_REVIEW' || s === 'UNDER_REVIEW') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center gap-1.5 border border-blue-500/20">
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Review</span>
        </span>
      );
    }
    if (s === 'ACTION_REQUIRED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center gap-1.5 border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Action Required</span>
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400 flex items-center gap-1.5 border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5" />
          <span>Declined</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
        Unregistered
      </span>
    );
  };

  // Complete 16 Modules Scope (14 required modules + orders + policies)
  const navItems: NavItem[] = useMemo(() => [
    // Operations & Catalog
    { id: 'overview', label: 'Ecosystem Dashboard', icon: LayoutDashboard, category: 'operations' },
    { id: 'multi_store', label: 'Multi-Store Manager', icon: Store, category: 'operations' },
    { id: 'products', label: 'Products & Catalog', icon: Package, category: 'operations', count: products.length },
    { id: 'inventory', label: 'Inventory & Warehouses', icon: Boxes, category: 'operations' },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag, category: 'operations', count: orders.length },
    { id: 'bulk_csv', label: 'Bulk CSV Tools', icon: FileSpreadsheet, category: 'operations' },

    // Finance & Growth
    { id: 'payments', label: 'Financials & Invoices', icon: CreditCard, category: 'finance' },
    { id: 'analytics', label: 'Sales Analytics', icon: BarChart3, category: 'finance' },
    { id: 'customers', label: 'Customer CRM', icon: Users, category: 'finance' },
    { id: 'marketing', label: 'Marketing & Promos', icon: Tag, category: 'finance' },

    // Trust & Administration
    { id: 'kyc', label: 'Business Verification', icon: ShieldCheck, category: 'trust' },
    { id: 'branding', label: 'Branding & Store Management', icon: Sparkles, category: 'trust' },
    { id: 'staff', label: 'Staff & Team (RBAC)', icon: UserCheck, category: 'trust' },
    { id: 'policies', label: 'Store Policies', icon: FileText, category: 'trust' },
    { id: 'security', label: 'Security & Audit Logs', icon: Lock, category: 'trust' },
    { id: 'help', label: 'Merchant Support', icon: HelpCircle, category: 'trust' }
  ], [products.length, orders.length]);

  const currentTabItem = navItems.find(item => item.id === activeTab) || navItems[0];
  const CurrentIcon = currentTabItem.icon;

  const categories = [
    { key: 'operations', label: 'Operations & Catalog' },
    { key: 'finance', label: 'Finance & Growth' },
    { key: 'trust', label: 'Trust & Governance' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50/80 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-16" id="seller-studio-v2">
      {/* Top Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Identity & Back to Marketplace */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              id="seller-back-home-btn"
              onClick={onNavigateHome}
              className="p-2 sm:p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Return to Marketplace"
              aria-label="Return to Marketplace"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                S2
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-base font-bold text-neutral-900 dark:text-neutral-100 leading-tight flex items-center gap-1 sm:gap-2 truncate">
                  <span>Seller Studio</span>
                  <span className="hidden md:inline text-[11px] font-medium text-neutral-400">
                    • {vendorProfile.storeName || 'Merchant Center'}
                  </span>
                </h1>
                <span className="text-[10px] sm:text-[11px] text-neutral-500 block truncate -mt-0.5">
                  @{userUsername || 'merchant'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Status badge & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="hidden sm:block">
              {renderStatusBadge()}
            </div>

            {onViewStorefront && (
              <button
                id="seller-view-storefront-btn"
                onClick={() => onViewStorefront(vendorProfile.id)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors min-h-[40px]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                <span>Storefront</span>
              </button>
            )}

            {serverStatus.status === 'UNREGISTERED' && (
              <button
                id="seller-complete-onboarding-btn"
                onClick={() => setIsOnboardingOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs min-h-[40px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Complete Onboarding</span>
                <span className="xs:hidden">Verify</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button (Drawer) */}
            <button
              id="seller-mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Seller Studio navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-purple-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE SAFE NAVIGATION BAR (No overflow-x-auto scrolling reliance!) */}
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Active Module Indicator */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                <CurrentIcon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold block leading-tight">
                  Active Module
                </span>
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate block">
                  {currentTabItem.label}
                </span>
              </div>
            </div>

            {/* Expand / Switch Module Button with >=44px Touch Target */}
            <button
              id="seller-mobile-module-switcher-btn"
              onClick={() => setIsMobileModuleSheetOpen(!isMobileModuleSheetOpen)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors min-h-[44px] shrink-0"
              aria-expanded={isMobileModuleSheetOpen}
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>All Modules (16)</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobileModuleSheetOpen ? 'rotate-180 text-purple-600' : ''}`} />
            </button>
          </div>

          {/* Collapsible Mobile Module Directory (Responsive Grid/List) */}
          {isMobileModuleSheetOpen && (
            <div 
              id="seller-mobile-module-directory"
              className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-4 animate-in fade-in duration-150"
            >
              {categories.map(cat => {
                const catItems = navItems.filter(i => i.category === cat.key);
                return (
                  <div key={cat.key} className="space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">
                      {cat.label}
                    </span>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5">
                      {catItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            id={`mobile-module-btn-${item.id}`}
                            onClick={() => handleSelectTab(item.id)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all min-h-[48px] text-left ${
                              isActive
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-neutral-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.count !== undefined && item.count > 0 && (
                              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-1.5 ${
                                isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                              }`}>
                                {item.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER (When hamburger menu is pressed) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-xs h-full p-4 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    S2
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      Seller Studio
                    </h3>
                    <span className="text-[11px] text-neutral-400 block">
                      @{userUsername}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Display in Drawer */}
              <div className="my-3">
                {renderStatusBadge()}
              </div>

              {/* Navigation Categories & Modules */}
              <div className="space-y-4 mt-2">
                {categories.map(cat => {
                  const catItems = navItems.filter(i => i.category === cat.key);
                  return (
                    <div key={cat.key} className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2">
                        {cat.label}
                      </span>
                      <div className="space-y-0.5">
                        {catItems.map(item => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              id={`drawer-module-btn-${item.id}`}
                              onClick={() => handleSelectTab(item.id)}
                              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors min-h-[44px] ${
                                isActive
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className="truncate">{item.label}</span>
                              </div>
                              {item.count !== undefined && item.count > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                }`}>
                                  {item.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              {onViewStorefront && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onViewStorefront(vendorProfile.id);
                  }}
                  className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px]"
                >
                  <ExternalLink className="w-4 h-4 text-purple-600" />
                  <span>View Public Storefront</span>
                </button>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateHome) onNavigateHome();
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Marketplace</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sticky Sidebar Navigation */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 shadow-xs sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Seller Operations
              </div>

              {categories.map(cat => {
                const catItems = navItems.filter(i => i.category === cat.key);
                return (
                  <div key={cat.key} className="mb-4">
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      {cat.label}
                    </span>
                    <nav className="space-y-0.5">
                      {catItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                          <button
                            key={item.id}
                            id={`desktop-sidebar-btn-${item.id}`}
                            onClick={() => handleSelectTab(item.id)}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors min-h-[38px] ${
                              isActive
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.count !== undefined && item.count > 0 && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive ? 'bg-white/25 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                              }`}>
                                {item.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                );
              })}

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 px-3">
                <div className="text-[11px] text-neutral-500 font-mono">
                  PSTP Protected • v2.1
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Workspace */}
          <main className="flex-1 min-w-0">
            {/* 1. Ecosystem Dashboard */}
            {activeTab === 'overview' && (
              <OverviewTab
                userUsername={userUsername}
                serverStatus={serverStatus}
                vendorProfile={vendorProfile}
                products={products}
                orders={orders}
                onNavigateTab={(tab) => handleSelectTab(tab as SellerStudioTabId)}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                onAddProduct={() => handleSelectTab('products')}
                onOpenStorefrontPreview={() => {
                  if (onViewStorefront) onViewStorefront(vendorProfile.id);
                }}
              />
            )}

            {/* 2. Multi-Store Manager */}
            {activeTab === 'multi_store' && (
              <MultiStoreTab
                vendorProfile={vendorProfile}
                userUsername={userUsername}
                serverStatus={serverStatus}
                onOpenStorefront={onViewStorefront}
                onNavigateTab={(tab) => handleSelectTab(tab as SellerStudioTabId)}
              />
            )}

            {/* 3. Products & Catalog */}
            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                onOpenAddProduct={() => handleSelectTab('products')}
                onEditProduct={(prod) => {
                  if (onUpdateProduct) onUpdateProduct(prod);
                }}
                onDeleteProduct={(id) => {
                  if (onDeleteProduct) onDeleteProduct(id);
                }}
              />
            )}

            {/* 4. Inventory & Warehouses */}
            {activeTab === 'inventory' && (
              <InventoryWarehousesTab
                products={products}
                onUpdateProduct={onUpdateProduct}
              />
            )}

            {/* 5. Orders & Fulfillment */}
            {activeTab === 'orders' && (
              <OrdersTab
                orders={orders}
                onUpdateFulfillment={handleUpdateFulfillment}
              />
            )}

            {/* 6. Bulk CSV Tools */}
            {activeTab === 'bulk_csv' && (
              <BulkCsvToolsTab
                products={products}
                onAddProduct={onAddProduct}
              />
            )}

            {/* 7. Financials & Invoices */}
            {activeTab === 'payments' && (
              <PaymentsTab
                orders={orders}
                serverPstpAuthorized={serverStatus.pstpAuthorized}
              />
            )}

            {/* 8. Sales Analytics */}
            {activeTab === 'analytics' && (
              <SalesAnalyticsTab
                orders={orders}
                products={products}
              />
            )}

            {/* 9. Staff & Team (RBAC) */}
            {activeTab === 'staff' && (
              <StaffTeamTab
                user={user}
                serverStatus={serverStatus}
              />
            )}

            {/* 10. Customer CRM */}
            {activeTab === 'customers' && (
              <CustomersTab orders={orders} />
            )}

            {/* 11. Marketing & Promos */}
            {activeTab === 'marketing' && (
              <MarketingPromosTab
                userUsername={userUsername}
              />
            )}

            {/* 12. Business Verification */}
            {activeTab === 'kyc' && (
              <KycVerificationTab
                userUsername={userUsername}
                serverStatus={serverStatus}
                application={applicationData}
                onRefreshStatus={fetchAuthoritativeStatus}
              />
            )}

            {/* 13. Branding & Store Management */}
            {activeTab === 'branding' && (
              <StoreBrandingTab
                userUsername={userUsername}
                vendorProfile={vendorProfile}
                onBrandingUpdated={(newLogo, newBanner) => {
                  setVendorProfile(prev => ({
                    ...prev,
                    logoImage: newLogo || undefined,
                    bannerImage: newBanner || undefined
                  }));
                }}
                onOpenStorefrontPreview={() => {
                  if (onViewStorefront) onViewStorefront(vendorProfile.id);
                }}
              />
            )}

            {/* 14. Store Policies */}
            {activeTab === 'policies' && (
              <PoliciesTab
                userUsername={userUsername}
                initialApplication={applicationData}
                onPoliciesUpdated={(updatedPolicies) => {
                  setApplicationData((prev: any) => ({
                    ...prev,
                    policies: updatedPolicies
                  }));
                }}
              />
            )}

            {/* 15. Security & Audit Logs */}
            {activeTab === 'security' && (
              <SecurityTab
                userUsername={userUsername}
                serverStatus={serverStatus}
              />
            )}

            {/* 16. Merchant Support */}
            {activeTab === 'help' && (
              <HelpSupportTab userUsername={userUsername} />
            )}
          </main>
        </div>
      </div>

      {/* Onboarding Wizard Modal */}
      {isOnboardingOpen && (
        <SellerOnboardingWizard
          userUsername={userUsername}
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={(newApp) => {
            setApplicationData(newApp);
            fetchAuthoritativeStatus();
            handleSelectTab('overview');
          }}
        />
      )}
    </div>
  );
};
