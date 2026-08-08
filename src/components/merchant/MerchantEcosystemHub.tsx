import React, { useState } from 'react';
import { 
  Store, 
  Building2, 
  ShieldCheck, 
  Plus, 
  Package, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Tag, 
  Settings, 
  Edit3, 
  Trash2, 
  QrCode, 
  Barcode, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles,
  ChevronRight,
  UserCheck,
  Award,
  FileText,
  ArrowRightLeft,
  PieChart,
  Megaphone,
  Briefcase,
  FileSpreadsheet,
  BarChart3,
  Lock,
  HelpCircle,
  Receipt,
  Key,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { FinanceAnalyticsView } from '../views/FinanceAnalyticsView';
import { 
  Product, 
  Order, 
  Vendor, 
  Coupon, 
  MerchantStore, 
  MerchantStoreType, 
  MerchantVerificationLevel, 
  StaffRole, 
  StaffMember, 
  Warehouse, 
  InventoryRecord, 
  StockTransfer, 
  CrmCustomer, 
  VerificationDoc 
} from '../../types';
import { 
  INITIAL_MERCHANT_STORES, 
  INITIAL_INVENTORY_RECORDS, 
  INITIAL_STOCK_TRANSFERS, 
  INITIAL_CRM_CUSTOMERS 
} from '../../data/merchantData';

interface MerchantEcosystemHubProps {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  vendorProfile: Vendor;
  onAddProduct: (newProduct: Product) => void;
  onUpdateFulfillment: (orderId: string, trackingNumber: string, carrier: string) => void;
  onCreateCoupon: (newCoupon: Coupon) => void;
}

export const MerchantEcosystemHub: React.FC<MerchantEcosystemHubProps> = ({
  products,
  orders,
  coupons,
  vendorProfile,
  onAddProduct,
  onUpdateFulfillment,
  onCreateCoupon
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    | 'overview' 
    | 'multi_store' 
    | 'catalog' 
    | 'inventory' 
    | 'bulk_ops'
    | 'finance'
    | 'analytics'
    | 'staff' 
    | 'crm' 
    | 'marketing' 
    | 'verification' 
    | 'security'
    | 'support'
    | 'profile'
  >('overview');

  // Multi-Store State
  const [stores, setStores] = useState<MerchantStore[]>(INITIAL_MERCHANT_STORES);
  const [activeStoreId, setActiveStoreId] = useState<string>(INITIAL_MERCHANT_STORES[0].id);
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreType, setNewStoreType] = useState<MerchantStoreType>('business');
  const [newStoreDesc, setNewStoreDesc] = useState('');

  // Active Store Reference
  const currentStore = stores.find(s => s.id === activeStoreId) || stores[0];

  // Inventory State
  const [inventory, setInventory] = useState<InventoryRecord[]>(INITIAL_INVENTORY_RECORDS);
  const [transfers, setTransfers] = useState<StockTransfer[]>(INITIAL_STOCK_TRANSFERS);
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedBarcodeItem, setSelectedBarcodeItem] = useState<InventoryRecord | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferSku, setTransferSku] = useState('');
  const [transferQty, setTransferQty] = useState<number>(10);
  const [transferFromWh, setTransferFromWh] = useState('wh-01');
  const [transferToWh, setTransferToWh] = useState('wh-02');

  // Staff Management State
  const [staffList, setStaffList] = useState<StaffMember[]>(currentStore.staff || []);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('manager');

  // CRM State
  const [customers, setCustomers] = useState<CrmCustomer[]>(INITIAL_CRM_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<CrmCustomer | null>(null);
  const [crmSearch, setCrmSearch] = useState('');
  const [newNoteInput, setNewNoteInput] = useState('');

  // Business Verification State
  const [verificationDocs, setVerificationDocs] = useState<VerificationDoc[]>(currentStore.verificationDocs || []);
  const [docTypeInput, setDocTypeInput] = useState<VerificationDoc['docType']>('business_license');
  const [docFileName, setDocFileName] = useState('');

  // Catalog Add Product State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(15);
  const [newProdCat, setNewProdCat] = useState<Product['category']>('physical');
  const [newProdSubcat, setNewProdSubcat] = useState('Electronics');
  const [newProdStock, setNewProdStock] = useState<number>(50);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Marketing State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [newMinSpend, setNewMinSpend] = useState<number>(20);
  const [announcementBanner, setAnnouncementBanner] = useState('⚡ Flash Sale: Enjoy 15% discount on all IoT products paid via Pi SDK v2!');

  // Bulk CSV & Export State
  const [csvStatusMessage, setCsvStatusMessage] = useState<string | null>(null);

  // Security Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-101', action: 'STORE_SETTINGS_UPDATE', actor: 'Sarah Chen (Owner)', ip: '192.168.1.104', timestamp: '2026-08-04 05:42:10 UTC', status: 'SUCCESS' },
    { id: 'log-102', action: 'STAFF_PERMISSION_GRANTED', actor: 'Sarah Chen (Owner)', ip: '192.168.1.104', timestamp: '2026-08-03 14:20:05 UTC', status: 'SUCCESS' },
    { id: 'log-103', action: 'API_SECRET_KEY_REGENERATED', actor: 'David Rodriguez (Manager)', ip: '10.0.4.12', timestamp: '2026-08-01 09:12:44 UTC', status: 'SUCCESS' },
    { id: 'log-104', action: 'STOCK_TRANSFER_INITIATED', actor: 'Alex Mercer (Warehouse)', ip: '172.16.0.44', timestamp: '2026-07-28 11:05:18 UTC', status: 'SUCCESS' },
  ]);

  // Support Tickets State
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TICK-8801', subject: 'Custom Invoice Tax Identifier Assistance', category: 'Finance & Invoicing', status: 'RESOLVED', priority: 'Medium', date: '2026-07-20' },
    { id: 'TICK-9012', subject: 'Multi-Warehouse API Endpoint Rate Limits', category: 'Technical API', status: 'IN_PROGRESS', priority: 'High', date: '2026-08-02' },
  ]);

  // Analytics Sample Data
  const revenueChartData = [
    { month: 'Jan', piRevenue: 1250, orders: 42 },
    { month: 'Feb', piRevenue: 1890, orders: 58 },
    { month: 'Mar', piRevenue: 2400, orders: 76 },
    { month: 'Apr', piRevenue: 3100, orders: 94 },
    { month: 'May', piRevenue: 2850, orders: 88 },
    { month: 'Jun', piRevenue: 4200, orders: 130 },
    { month: 'Jul', piRevenue: 5400, orders: 165 },
  ];

  // Store Creation Handler
  const handleCreateStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName) return;
    const newStore: MerchantStore = {
      id: `store-${Date.now()}`,
      sellerUsername: currentStore.sellerUsername,
      storeName: newStoreName,
      storeType: newStoreType,
      description: newStoreDesc || 'New PiNova Merchant Store.',
      logoImage: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=300&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      email: `info@${newStoreName.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: '+1 (555) 000-1122',
      businessHours: 'Mon - Fri: 09:00 - 18:00 UTC',
      location: { address: '100 Global Plaza', city: 'Silicon Valley', country: 'United States', postalCode: '94025' },
      verificationLevel: newStoreType === 'brand' ? 'official_brand' : 'registered_business',
      rating: 5.0,
      reviewsCount: 0,
      followersCount: 1,
      totalSalesPi: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      shippingCountries: ['Worldwide'],
      warehouses: [],
      staff: [],
      verificationDocs: []
    };

    setStores([...stores, newStore]);
    setActiveStoreId(newStore.id);
    setShowCreateStoreModal(false);
    setNewStoreName('');
    setNewStoreDesc('');
  };

  // Create Product Handler
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle || newProdPrice <= 0) return;
    const prod: Product = {
      id: `prod-${Date.now()}`,
      title: newProdTitle,
      description: newProdDesc || 'Official quality product available on PiNova Global Marketplace.',
      pricePi: Number(newProdPrice),
      category: newProdCat,
      subcategory: newProdSubcat,
      images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'],
      stock: Number(newProdStock),
      rating: 5.0,
      reviewsCount: 0,
      sellerId: currentStore.id,
      sellerName: currentStore.storeName,
      sellerVerified: currentStore.verificationLevel !== 'individual',
      features: ['Official Pi Platform Order Protection', 'Express Courier Delivery', 'Quality Guaranteed'],
      tags: [newProdCat, newProdSubcat, 'Merchant Featured']
    };
    onAddProduct(prod);
    setShowAddProductModal(false);
    setNewProdTitle('');
    setNewProdDesc('');
  };

  // Staff Addition Handler
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      permissions: newStaffRole === 'admin' ? ['ALL_PERMISSIONS'] : ['PROCESS_ORDERS', 'VIEW_ANALYTICS'],
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setStaffList([...staffList, newStaff]);
    setShowAddStaffModal(false);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  // Stock Transfer Handler
  const handleStockTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferSku || transferQty <= 0) return;
    const item = inventory.find(i => i.sku === transferSku);
    const fromWh = currentStore.warehouses.find(w => w.id === transferFromWh)?.name || 'Primary Warehouse';
    const toWh = currentStore.warehouses.find(w => w.id === transferToWh)?.name || 'Secondary Depot';

    const newTransfer: StockTransfer = {
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      fromWarehouse: fromWh,
      toWarehouse: toWh,
      sku: transferSku,
      productTitle: item?.productTitle || transferSku,
      quantity: Number(transferQty),
      status: 'IN_TRANSIT',
      transferredBy: 'Store Administrator',
      date: new Date().toISOString().split('T')[0]
    };

    setTransfers([newTransfer, ...transfers]);
    setShowTransferModal(false);
  };

  // Verification Doc Upload Handler
  const handleUploadDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFileName) return;
    const doc: VerificationDoc = {
      id: `doc-${Date.now()}`,
      docType: docTypeInput,
      fileName: docFileName,
      status: 'PENDING_REVIEW',
      uploadedAt: new Date().toISOString().split('T')[0],
      note: 'Under active review by PiNova Enterprise Compliance Verification Engine'
    };
    setVerificationDocs([...verificationDocs, doc]);
    setDocFileName('');
  };

  // Format Helper for Store Type Badges
  const renderStoreTypeBadge = (type: MerchantStoreType) => {
    const map: Record<MerchantStoreType, { label: string; color: string }> = {
      individual: { label: 'Individual Store', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
      business: { label: 'Business Store', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' },
      brand: { label: 'Official Brand Store', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' },
      enterprise: { label: 'Enterprise Store', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' },
      franchise: { label: 'Franchise Hub', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' },
      wholesale: { label: 'Wholesale B2B Depot', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' },
      distributor: { label: 'Authorized Distributor', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' }
    };
    const b = map[type] || map.business;
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${b.color}`}>{b.label}</span>;
  };

  // Verification Level Format Helper
  const renderVerificationBadge = (level: MerchantVerificationLevel) => {
    const map: Record<MerchantVerificationLevel, { label: string; icon: any; color: string }> = {
      individual: { label: 'Individual Seller', icon: UserCheck, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
      registered_business: { label: 'Registered Business', icon: ShieldCheck, color: 'text-blue-500 bg-blue-500/10' },
      verified_business: { label: 'Verified Business', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-500/10' },
      premium_merchant: { label: 'Premium Merchant', icon: Award, color: 'text-purple-500 bg-purple-500/10' },
      enterprise_merchant: { label: 'Enterprise Merchant', icon: Building2, color: 'text-amber-500 bg-amber-500/10' },
      official_brand: { label: 'Official Brand', icon: Sparkles, color: 'text-purple-400 bg-purple-950 border border-purple-500/30' },
      authorized_distributor: { label: 'Authorized Distributor', icon: Briefcase, color: 'text-rose-500 bg-rose-500/10' }
    };
    const item = map[level] || map.verified_business;
    const IconComp = item.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${item.color}`}>
        <IconComp className="w-3.5 h-3.5" />
        {item.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24">
      
      {/* Top Banner & Multi-Store Switcher Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-2xl border border-purple-800/40">
        <img
          src={currentStore.bannerImage}
          alt="store banner"
          referrerPolicy="no-referrer"
          className="w-full h-44 object-cover opacity-25"
        />

        <div className="p-6 sm:p-8 relative -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="flex items-center gap-5">
            <img
              src={currentStore.logoImage}
              alt="logo"
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-900 shadow-xl bg-slate-800"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{currentStore.storeName}</h1>
                {renderStoreTypeBadge(currentStore.storeType)}
                {renderVerificationBadge(currentStore.verificationLevel)}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2">
                {currentStore.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {currentStore.location.city}, {currentStore.location.country}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-purple-400" /> {currentStore.email}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-400" /> {currentStore.businessHours}</span>
              </div>
            </div>
          </div>

          {/* Multi-Store Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-lg">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Active Store</span>
              <select
                value={activeStoreId}
                onChange={(e) => setActiveStoreId(e.target.value)}
                className="bg-slate-800 text-white text-xs font-bold rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {stores.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.storeName} ({st.storeType.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowCreateStoreModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Module Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Ecosystem Dashboard', icon: PieChart },
          { id: 'multi_store', label: 'Multi-Store Manager', icon: Building2 },
          { id: 'catalog', label: 'Products & Catalog', icon: Package },
          { id: 'inventory', label: 'Inventory & Warehouses', icon: Layers },
          { id: 'bulk_ops', label: 'Bulk CSV Tools', icon: FileSpreadsheet },
          { id: 'finance', label: 'Financials & Invoices', icon: Receipt },
          { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
          { id: 'staff', label: 'Staff & Team (RBAC)', icon: Users },
          { id: 'crm', label: 'Customer CRM', icon: UserCheck },
          { id: 'marketing', label: 'Marketing & Promos', icon: Megaphone },
          { id: 'verification', label: 'Business Verification', icon: ShieldCheck },
          { id: 'security', label: 'Security & Audit Logs', icon: Lock },
          { id: 'support', label: 'Merchant Support', icon: HelpCircle },
          { id: 'profile', label: 'Branding & Settings', icon: Settings },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-300'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Total Pi Sales Volume</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {currentStore.totalSalesPi.toLocaleString('en-US', { minimumFractionDigits: 2 })} π
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24.8% from last month
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Total Store Orders</span>
                <Package className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {orders.length + 142}
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                PSTP Verified Payments
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Fulfillment Warehouses</span>
                <Layers className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {currentStore.warehouses.length > 0 ? currentStore.warehouses.length : 2} Active Hubs
              </div>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                Multi-Warehouse Allocation
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Store Rating & Trust</span>
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                ⭐ {currentStore.rating} / 5.0
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                {currentStore.followersCount.toLocaleString()} Verified Followers
              </p>
            </div>
          </div>

          {/* Revenue & Growth Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Pi Revenue Growth Analytics</h3>
                <p className="text-xs text-slate-500">Official Pi Network server-verified settlement metrics</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                Live Data Stream
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }} />
                  <Area type="monotone" dataKey="piRevenue" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-STORE MANAGER */}
      {activeTab === 'multi_store' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Multi-Store Enterprise Architecture</h2>
              <p className="text-xs text-slate-500">Manage all your independent stores, brands, and franchises from one account.</p>
            </div>
            <button
              onClick={() => setShowCreateStoreModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Store
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(st => (
              <div
                key={st.id}
                className={`p-6 rounded-2xl border transition-all space-y-4 bg-white dark:bg-slate-900 ${
                  st.id === activeStoreId
                    ? 'border-purple-500 shadow-xl ring-2 ring-purple-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <img
                    src={st.logoImage}
                    alt="logo"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                  {renderStoreTypeBadge(st.storeType)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{st.storeName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{st.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Volume</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{st.totalSalesPi.toLocaleString()} π</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Rating</span>
                    <span className="font-bold text-amber-500">⭐ {st.rating} ({st.reviewsCount})</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStoreId(st.id)}
                  disabled={st.id === activeStoreId}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    st.id === activeStoreId
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                      : 'bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {st.id === activeStoreId ? 'Active Selected Store' : 'Switch to Store'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS & CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Product Catalog & Inventory Listing</h2>
              <p className="text-xs text-slate-500">Manage all items offered under {currentStore.storeName}</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create New Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(prod => (
              <div key={prod.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {prod.category}
                    </span>
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                      {prod.pricePi} π
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{prod.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <span>Stock: <strong className="text-slate-900 dark:text-white">{prod.stock} units</strong></span>
                  <span>⭐ {prod.rating} ({prod.reviewsCount})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY & WAREHOUSES */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Enterprise Multi-Warehouse Inventory Control</h2>
              <p className="text-xs text-slate-500">Track SKUs, batch numbers, reserved stock, low-stock reorder thresholds, and barcodes.</p>
            </div>
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <ArrowRightLeft className="w-4 h-4" /> Initiate Stock Transfer
            </button>
          </div>

          {/* Warehouses Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStore.warehouses.map(wh => (
              <div key={wh.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{wh.name}</h3>
                  </div>
                  {wh.isPrimary && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[10px] font-bold">
                      Primary Hub
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500"><MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />{wh.location}, {wh.country}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${(wh.currentStockUnits / wh.capacityUnits) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Capacity: {wh.currentStockUnits.toLocaleString()} / {wh.capacityUnits.toLocaleString()} units</span>
                  <span>Manager: {wh.managerName || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Inventory Items Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">SKU Batch & Inventory Ledger</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">SKU Code</th>
                    <th className="py-3 px-3">Product Title</th>
                    <th className="py-3 px-3">Warehouse</th>
                    <th className="py-3 px-3">On Hand</th>
                    <th className="py-3 px-3">Reserved</th>
                    <th className="py-3 px-3">Batch ID</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {inventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">{item.sku}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{item.productTitle}</td>
                      <td className="py-3 px-3 text-slate-500">{item.warehouseName}</td>
                      <td className="py-3 px-3 font-bold">
                        {item.stockOnHand}
                        {item.stockOnHand <= item.reorderPoint && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 text-[9px] font-bold">Low</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{item.reservedStock}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{item.batchNumber}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedBarcodeItem(item)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <Barcode className="w-3.5 h-3.5" /> Barcode
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STAFF & TEAM (RBAC) */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Staff & Team Management (Role-Based Access Control)</h2>
              <p className="text-xs text-slate-500">Configure team roles, permission matrix, and access controls for your organization.</p>
            </div>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Invite Staff Member
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Permissions</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {staffList.map(st => (
                    <tr key={st.id}>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{st.name}</td>
                      <td className="py-3 px-3 text-slate-500">{st.email}</td>
                      <td className="py-3 px-3 uppercase text-[10px] font-bold text-purple-600 dark:text-purple-400">{st.role}</td>
                      <td className="py-3 px-3 text-slate-400 text-[10px]">
                        {st.permissions.join(', ')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                          {st.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMER CRM */}
      {activeTab === 'crm' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Customer Relationship Management (CRM)</h2>
            <p className="text-xs text-slate-500">Track customer spending, order histories, VIP Pioneer tiers, and notes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-3">
              {customers.map(cust => (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 bg-white dark:bg-slate-900 ${
                    selectedCustomer?.id === cust.id
                      ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={cust.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{cust.username}</h4>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[9px] font-bold">{cust.tier}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{cust.totalOrders} Orders</span>
                    <span className="font-bold text-emerald-600">{cust.totalSpentPi} π</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              {selectedCustomer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <img src={selectedCustomer.avatarUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedCustomer.username}</h3>
                      <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                      <span className="mt-1 inline-block px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold text-xs">
                        {selectedCustomer.tier}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase text-slate-400">Internal Merchant Notes</h4>
                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      {selectedCustomer.notes}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-12">Select a customer from the directory to view details.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: BULK CSV & OPERATIONS */}
      {activeTab === 'bulk_ops' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Bulk Data Management & CSV Operations</h2>
              <p className="text-xs text-slate-500">Import/export large catalog files, mass update product prices, stock levels, and category assignments.</p>
            </div>
          </div>

          {csvStatusMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between">
              <span>{csvStatusMessage}</span>
              <button onClick={() => setCsvStatusMessage(null)}><X className="w-4 h-4" /></button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                <Upload className="w-5 h-5" /> Bulk CSV Catalog Import
              </div>
              <p className="text-xs text-slate-500">
                Upload a structured CSV spreadsheet to import hundreds of products, SKUs, and inventory allocations simultaneously.
              </p>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-3 bg-slate-50 dark:bg-slate-950">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-purple-600">Click to upload CSV</span> or drag and drop
                </div>
                <p className="text-[10px] text-slate-400">Supported columns: SKU, Title, PricePi, Stock, Category, WarehouseID</p>
                <button
                  onClick={() => setCsvStatusMessage('Successfully processed catalog CSV file: 128 products updated/created.')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl"
                >
                  Simulate Catalog CSV Processing
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <Download className="w-5 h-5" /> Enterprise Export Center
              </div>
              <p className="text-xs text-slate-500">Export complete business datasets for accounting, ERP integration, and offline analysis.</p>
              
              <div className="space-y-2">
                {[
                  { name: 'Product Catalog CSV', desc: 'All SKUs, prices, stock levels, and categories' },
                  { name: 'Inventory & Warehouse Stock Ledger', desc: 'Batch IDs, reserved items, reorder thresholds' },
                  { name: 'Sales & Completed Orders CSV', desc: 'Order details, buyer IDs, payment settlement hashes' },
                  { name: 'Customer CRM Directory CSV', desc: 'Pioneer usernames, lifetime spend, purchase counts' }
                ].map((exp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{exp.name}</span>
                      <span className="text-[10px] text-slate-400">{exp.desc}</span>
                    </div>
                    <button
                      onClick={() => setCsvStatusMessage(`Export generated successfully for ${exp.name}.`)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold rounded-lg text-[11px] flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> CSV
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FINANCIAL DASHBOARD & INVOICES */}
      {(activeTab === 'finance' || activeTab === 'analytics') && (
        <FinanceAnalyticsView
          products={products}
          orders={orders}
        />
      )}

      {/* TAB: SECURITY & AUDIT LOGS */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Enterprise Security, RBAC & Audit Trails</h2>
            <p className="text-xs text-slate-500">Monitor access logs, staff permissions, active sessions, and Pi Platform API credentials authorization.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" /> Security Audit Log
              </h3>
              <span className="text-xs text-slate-400 font-mono">Immutable Log Stream</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Event Action</th>
                    <th className="py-3 px-3">Actor (User)</th>
                    <th className="py-3 px-3">IP Address</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-3 px-3 font-bold text-purple-600 dark:text-purple-400">{log.action}</td>
                      <td className="py-3 px-3 text-slate-900 dark:text-white font-sans">{log.actor}</td>
                      <td className="py-3 px-3 text-slate-400">{log.ip}</td>
                      <td className="py-3 px-3 text-slate-400">{log.timestamp}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold font-sans">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MERCHANT SUPPORT CENTER */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Merchant Knowledge & Support Center</h2>
            <p className="text-xs text-slate-500">Access seller documentation, submit technical tickets, and request Merchant Success Advisor assistance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <HelpCircle className="w-8 h-8 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Official Seller Guides</h3>
              <p className="text-xs text-slate-500">Detailed docs on Pi SDK v2 integration, warehouse inventory batching, and verified badges.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <Mail className="w-8 h-8 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Support Tickets</h3>
              <p className="text-xs text-slate-500">Submit requests for custom tax integration, staff RBAC configuration, or wholesale catalog setup.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <Award className="w-8 h-8 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Merchant Success Advisor</h3>
              <p className="text-xs text-slate-500">Enterprise merchants get 1-on-1 advisor consultations for cross-border expansion.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: MARKETING CENTER */}
      {activeTab === 'marketing' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Marketing & Promotional Center</h2>
            <p className="text-xs text-slate-500">Create discount coupons, store announcement banners, and promotional campaigns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Store Announcement Banner</h3>
              <input
                type="text"
                value={announcementBanner}
                onChange={(e) => setAnnouncementBanner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">This banner displays dynamically across your storefront for all visiting Pioneers.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Promotional Coupons</h3>
              <div className="space-y-2">
                {coupons.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{c.code}</span>
                    <span className="font-bold text-emerald-600">{c.discountPercent}% OFF (Min {c.minSpendPi} π)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: BUSINESS VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white border border-purple-800/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-5 h-5" /> Official Pi Platform Business Verification
            </div>
            <h2 className="text-xl font-black">Enterprise Merchant Status</h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Submit business verification records to unlock Verified Merchant, Official Brand, or Authorized Distributor badges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Submit Compliance Document</h3>
            <form onSubmit={handleUploadDocSubmit} className="flex flex-col sm:flex-row gap-3">
              <select
                value={docTypeInput}
                onChange={(e) => setDocTypeInput(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                <option value="business_license">Business License / Reg</option>
                <option value="tax_id">Tax ID / EIN Verification</option>
                <option value="identity_proof">Merchant Identity Proof</option>
                <option value="brand_auth">Brand Authorization Letter</option>
                <option value="domain_verify">Domain Ownership Certificate</option>
              </select>

              <input
                type="text"
                placeholder="Document File Name (e.g. License_2026.pdf)"
                value={docFileName}
                onChange={(e) => setDocFileName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload Document
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {verificationDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{doc.fileName}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{doc.docType.replace('_', ' ')} • {doc.uploadedAt}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    doc.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: BRANDING & SETTINGS */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Store Branding & Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-500 font-bold block mb-1">Store Name</label>
              <input type="text" defaultValue={currentStore.storeName} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border" />
            </div>
            <div>
              <label className="text-slate-500 font-bold block mb-1">Contact Email</label>
              <input type="text" defaultValue={currentStore.email} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE STORE */}
      {showCreateStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Create New Independent Merchant Store</h3>
              <button onClick={() => setShowCreateStoreModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateStoreSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Store Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PiNova Luxury Watch Boutique"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Store Architecture Type</label>
                <select
                  value={newStoreType}
                  onChange={(e) => setNewStoreType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold text-slate-900 dark:text-white"
                >
                  <option value="individual">Individual Seller Store</option>
                  <option value="business">Business Store</option>
                  <option value="brand">Official Brand Store</option>
                  <option value="enterprise">Enterprise Store</option>
                  <option value="franchise">Franchise Hub</option>
                  <option value="wholesale">Wholesale B2B Depot</option>
                  <option value="distributor">Authorized Distributor</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Store Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your business and catalog focus..."
                  value={newStoreDesc}
                  onChange={(e) => setNewStoreDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Launch Store
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BARCODE / QR GENERATOR */}
      {selectedBarcodeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Product Barcode & QR</h4>
              <button onClick={() => setSelectedBarcodeItem(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3">
              <Barcode className="w-36 h-12 mx-auto text-slate-900 dark:text-white" />
              <div className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400">{selectedBarcodeItem.barcode}</div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedBarcodeItem.productTitle}</p>
            </div>
            <button
              onClick={() => setSelectedBarcodeItem(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close Ledger Barcode
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
