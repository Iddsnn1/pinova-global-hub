import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ShoppingBag, 
  Package, 
  Download, 
  Smartphone, 
  Gift, 
  TrendingUp, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  Star,
  Award,
  Clock,
  Flame,
  ChevronRight,
  Store
} from 'lucide-react';

import { Product, Order, OrderItem, Vendor, Review, Coupon, Notification, Message, PiUser, ProductCategory, PstpOrderStatus, UserRole } from './types';
import { INITIAL_PRODUCTS, MOCK_VENDORS, MOCK_REVIEWS, MOCK_COUPONS, SAMPLE_ORDERS } from './data/mockData';
import { initAndAuthenticateProactively, subscribePiSdkState } from './lib/piSdk';

import { MainSection, MarketplaceCategory, UtilityCategory, BreadcrumbItem, VisitedCategory } from './types/navigation';
import { MARKETPLACE_CATEGORIES, UTILITY_CATEGORIES } from './data/categoryData';

import { FullScreenNavHeader } from './components/navigation/FullScreenNavHeader';
import { FullScreenMobileBottomNav } from './components/navigation/FullScreenMobileBottomNav';
import { QRScannerModal } from './components/QRScannerModal';
import { ScanToPayModal } from './components/ScanToPayModal';

import { HomeView } from './components/views/HomeView';
import { MarketplaceView } from './components/views/MarketplaceView';
import { UtilitiesView } from './components/views/UtilitiesView';
import { ServicesView } from './components/views/ServicesView';
import { AiSearchView } from './components/views/AiSearchView';
import { CartView } from './components/views/CartView';
import { OrdersView } from './components/views/OrdersView';
import { ProfileView } from './components/views/ProfileView';
import { FinanceAnalyticsView } from './components/views/FinanceAnalyticsView';
import { PlatformAdminView } from './components/views/PlatformAdminView';
import { EnterpriseSecurityView } from './components/views/EnterpriseSecurityView';
import { DeveloperPlatformView } from './components/views/DeveloperPlatformView';

import { UniversalSearchModal } from './components/UniversalSearchModal';
import { PiBrowserBanner } from './components/PiBrowserBanner';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuickViewModal } from './components/QuickViewModal';
import { EscrowCheckoutModal } from './components/EscrowCheckoutModal';
import { MessagingModal } from './components/MessagingModal';
import { NotificationCenter } from './components/NotificationCenter';
import { PstpShieldCenter } from './components/PstpShieldCenter';
import { SellerStorefrontModal } from './components/SellerStorefrontModal';
import { SocialCommunityHub } from './components/social/SocialCommunityHub';

import { PiConversionConfig, ConversionRateLog } from './types/utility';
import { INITIAL_PI_CONVERSION_CONFIG, INITIAL_CONVERSION_RATE_LOGS } from './data/utilityData';

import { LanguageProvider } from './context/LanguageContext';
import { LanguageSelectorModal } from './components/i18n/LanguageSelectorModal';
import { MerchantEcosystemHub } from './components/merchant/MerchantEcosystemHub';
import { VendorApplicationModal } from './components/vendor/VendorApplicationModal';

function MainAppContent() {
  // Dark mode
  const [darkMode, setDarkMode] = useState(true);

  // Full-Screen Navigation Section State (Default to 'home' as central command center)
  const [activeSection, setActiveSection] = useState<MainSection>('home');
  const [selectedMarketplaceCategory, setSelectedMarketplaceCategory] = useState<MarketplaceCategory>('all');
  const [selectedUtilityCategory, setSelectedUtilityCategory] = useState<string>('airtime');
  
  // Back navigation stack & History tracking
  const [navigationStack, setNavigationStack] = useState<{ section: MainSection; category: MarketplaceCategory }[]>([
    { section: 'home', category: 'all' }
  ]);
  const [recentlyVisitedCategories, setRecentlyVisitedCategories] = useState<VisitedCategory[]>([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);

  // Universal Search Engine Modal State
  const [searchQuery, setSearchQuery] = useState('');
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState(false);
  const [universalSearchInitialQuery, setUniversalSearchInitialQuery] = useState('');

  // Language Modal
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Utility Conversion Engine State
  const [utilityConfig, setUtilityConfig] = useState<PiConversionConfig>(INITIAL_PI_CONVERSION_CONFIG);
  const [utilityRateLogs, setUtilityRateLogs] = useState<ConversionRateLog[]>(INITIAL_CONVERSION_RATE_LOGS);

  // User & Wallet State
  const [user, setUser] = useState<PiUser>({
    username: 'Pi_Pioneer_01',
    uid: 'user-uid-892341',
    walletAddress: 'GD5X...PINOVA_KEY',
    authenticated: true,
    role: 'buyer'
  });
  const [userBalancePi, setUserBalancePi] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pinova_user_balance');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val)) return val;
      }
    } catch (e) {
      // fallback
    }
    return 250.00;
  });

  // Data Collections
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('pinova_user_orders') || localStorage.getItem('pinova_orders_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return SAMPLE_ORDERS;
  });
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-001',
      title: 'Payment Authorized & Order Protection Active',
      message: 'Your order ORD-PI-892341 was authorized and confirmed via official Pi Network platform API.',
      type: 'order_protection',
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isVendorApplicationOpen, setIsVendorApplicationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPstpShieldOpen, setIsPstpShieldOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isScanToPayOpen, setIsScanToPayOpen] = useState(false);
  const [scanToPayRawQr, setScanToPayRawQr] = useState<string>('');
  const [checkoutAppliedCoupon, setCheckoutAppliedCoupon] = useState<Coupon | undefined>();
  const [checkoutShippingCountry, setCheckoutShippingCountry] = useState<string>('United States');
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | undefined>();
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string | undefined>();
  const [selectedTrackingSubTab, setSelectedTrackingSubTab] = useState<'details' | 'tracking' | 'digital' | 'receipt' | 'return' | 'dispute'>('tracking');

  // Persistence Sync Side Effects
  useEffect(() => {
    try {
      localStorage.setItem('pinova_user_orders', JSON.stringify(orders));
      localStorage.setItem('pinova_orders_cache', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to cache orders:', e);
    }
  }, [orders]);

  // Handle Track Order navigation
  const handleTrackOrder = (orderId?: string, subTab: 'details' | 'tracking' | 'digital' | 'receipt' | 'return' | 'dispute' = 'tracking') => {
    if (orderId) {
      setSelectedTrackingOrderId(orderId);
    }
    setSelectedTrackingSubTab(subTab);
    handleNavigateSection('orders');
  };

  // Canonical order update synchronizer
  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === updatedOrder.id);
      let next: Order[];
      if (idx > -1) {
        next = [...prev];
        next[idx] = updatedOrder;
      } else {
        next = [updatedOrder, ...prev];
      }
      try {
        localStorage.setItem('pinova_user_orders', JSON.stringify(next));
        localStorage.setItem('pinova_orders_cache', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to persist orders:', e);
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('pinova_user_balance', userBalancePi.toString());
    } catch (e) {
      console.warn('Failed to cache balance:', e);
    }
  }, [userBalancePi]);

  // Dark Mode side effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Proactive Pi Browser Authentication on Application Load (Controlled Lifecycle)
  useEffect(() => {
    let active = true;

    initAndAuthenticateProactively().then((piUser) => {
      if (active && piUser) {
        setUser((prev) => ({
          ...prev,
          username: piUser.username,
          authenticated: true
        }));
      }
    });

    const unsubscribe = subscribePiSdkState((state) => {
      if (active && state.username && state.userState === 'authenticated') {
        setUser((prev) => ({
          ...prev,
          username: state.username!,
          authenticated: true
        }));
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Open Universal Search Modal
  const handleOpenUniversalSearch = (query?: string) => {
    setUniversalSearchInitialQuery(query || searchQuery || '');
    setIsUniversalSearchOpen(true);
  };

  // Navigate to Section Handler with Stack Push
  const handleNavigateSection = (newSection: MainSection, newCategory: MarketplaceCategory | string = 'all') => {
    setActiveSection(newSection);
    if (newSection === 'marketplace') {
      setSelectedMarketplaceCategory(newCategory as MarketplaceCategory);
    } else if (newSection === 'utilities') {
      setSelectedUtilityCategory((newCategory && newCategory !== 'all' ? newCategory : 'airtime') as string);
    }
    
    // Push onto navigation history stack if distinct
    setNavigationStack((prev) => {
      const top = prev[prev.length - 1];
      if (top && top.section === newSection && top.category === newCategory) return prev;
      return [...prev, { section: newSection, category: newCategory }];
    });
  };

  // Select Marketplace Category Handler
  const handleSelectMarketplaceCategory = (cat: MarketplaceCategory) => {
    setSelectedMarketplaceCategory(cat);
    setActiveSection('marketplace');

    if (cat !== 'all') {
      const found = MARKETPLACE_CATEGORIES.find((c) => c.id === cat);
      if (found) {
        setRecentlyVisitedCategories((prev) => {
          const filtered = prev.filter((item) => item.id !== cat);
          return [
            {
              id: cat,
              name: found.name,
              type: 'marketplace',
              iconName: found.iconName,
              timestamp: new Date().toISOString()
            },
            ...filtered
          ].slice(0, 5);
        });
      }
    }

    setNavigationStack((prev) => [...prev, { section: 'marketplace', category: cat }]);
  };

  // Back Navigation Handler
  const handleGoBack = () => {
    if (navigationStack.length <= 1) return;
    const newStack = [...navigationStack];
    newStack.pop(); // remove current
    const previous = newStack[newStack.length - 1];
    setNavigationStack(newStack);
    if (previous) {
      setActiveSection(previous.section);
      setSelectedMarketplaceCategory(previous.category);
    }
  };

  // Select Product Handler (with recently viewed tracking)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewedProducts((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1, customDetails?: any) => {
    setCartItems((prev) => {
      const variantId = customDetails?.variant?.id;
      const existingIdx = prev.findIndex((item) => {
        const itemVariantId = item.customDetails?.variant?.id;
        return item.product.id === product.id && itemVariantId === variantId;
      });
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (customDetails) updated[existingIdx].customDetails = customDetails;
        return updated;
      }
      return [...prev, { product, quantity, customDetails }];
    });
    // Jump to dedicated Cart view
    handleNavigateSection('cart');
  };

  const handleInstantBuy = (product: Product, quantity: number = 1, customDetails?: any) => {
    setCartItems([{ product, quantity, customDetails }]);
    setCheckoutAppliedCoupon(undefined);
    setCheckoutShippingCountry('United States');
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  // Open Storefront by seller name
  const handleOpenStorefrontByName = (sellerName: string) => {
    const targetName = (sellerName || '').toLowerCase().trim();
    let foundVendor = vendors.find(
      (v) => (v.storeName || '').toLowerCase() === targetName || (v.sellerUsername || '').toLowerCase() === targetName || (v.id || '').toLowerCase() === targetName
    );

    if (!foundVendor) {
      const matchingProduct = products.find(
        (p) => (p.sellerName || '').toLowerCase() === targetName || (p.sellerId || '').toLowerCase() === targetName
      );
      foundVendor = {
        id: matchingProduct?.sellerId || `ven-${Date.now()}`,
        sellerUsername: matchingProduct?.sellerName?.toLowerCase().replace(/\s+/g, '_') || sellerName,
        storeName: matchingProduct?.sellerName || sellerName,
        bio: matchingProduct ? `Official Pioneer Storefront for ${matchingProduct.sellerName} on PiNova Global Hub.` : 'Pioneer Merchant on Pi Network.',
        rating: matchingProduct?.rating || 4.8,
        reviewsCount: matchingProduct?.reviewsCount || 24,
        verified: Boolean(matchingProduct?.sellerVerified),
        verificationStatus: matchingProduct?.sellerVerified ? 'Verified' : 'Standard',
        totalSalesPi: 1250.00,
        bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        logoImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        joinedDate: '2024-06-01',
        shippingCountries: ['Worldwide']
      };
    }

    setSelectedVendor(foundVendor);
  };

  // Checkout Payment Callback
  const handlePaymentSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setUserBalancePi((prev) => Math.max(0, prev - newOrder.totalPi));
    setCartItems([]);
    setSelectedTrackingOrderId(newOrder.id);
    setSelectedTrackingSubTab('tracking');

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Payment Verified & Order Confirmed',
        message: `Order ${newOrder.id} for ${newOrder.totalPi.toFixed(2)} π successfully authorized and verified via official Pi Network platform API.`,
        type: 'order_protection',
        timestamp: new Date().toISOString(),
        read: false
      },
      ...prev
    ]);

    handleNavigateSection('orders');
  };

  // Confirm Receipt & Complete Order
  const handleConfirmReceipt = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, escrowStatus: 'released', pstpStatus: 'Completed', updatedAt: new Date().toISOString() } : o))
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Order Completed',
        message: `Order ${orderId} has been confirmed received and funds released to seller. Thank you!`,
        type: 'order_protection',
        timestamp: new Date().toISOString(),
        read: false
      },
      ...prev
    ]);
  };

  // Request Return
  const handleRequestReturn = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, pstpStatus: 'Disputed', updatedAt: new Date().toISOString() } : o))
    );
  };

  // Open Dispute
  const handleOpenDispute = (orderId: string, statement: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, pstpStatus: 'Disputed', updatedAt: new Date().toISOString() } : o))
    );
  };

  // Resolve Dispute
  const handleResolveDispute = (orderId: string, resolution: 'buyer_refund' | 'seller_payout', note: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              escrowStatus: resolution === 'buyer_refund' ? 'refunded' : 'released',
              pstpStatus: resolution === 'buyer_refund' ? 'Refunded' : 'Completed',
              updatedAt: new Date().toISOString()
            }
          : o
      )
    );
  };

  // Update Order Lifecycle Status
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: PstpOrderStatus,
    noteOrExtra?: string | { trackingNumber?: string; carrier?: string; note?: string }
  ) => {
    const noteText = typeof noteOrExtra === 'string' ? noteOrExtra : (noteOrExtra?.note || `Order status updated to ${newStatus}`);
    const extraTracking = typeof noteOrExtra === 'object' ? noteOrExtra.trackingNumber : undefined;
    const extraCarrier = typeof noteOrExtra === 'object' ? noteOrExtra.carrier : undefined;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const existingTimeline = o.timeline || [];
        const newLog = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          actor: user.username,
          actorRole: user.role,
          note: noteText
        };
        return {
          ...o,
          pstpStatus: newStatus,
          trackingNumber: extraTracking || o.trackingNumber,
          carrier: extraCarrier || o.carrier,
          timeline: [...existingTimeline, newLog],
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Add Review
  const handleAddReview = (productId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      username: user.username,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      helpfulCount: 0
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  // Send Message
  const handleSendMessage = (recipientUsername: string, text: string, orderId?: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderUsername: user.username,
      recipientUsername,
      text,
      orderId,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Build breadcrumbs for header following Hub -> Module -> Category hierarchy
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    switch (activeSection) {
      case 'home':
        return [{ label: 'Home', section: 'home' }];
      case 'marketplace': {
        const items: BreadcrumbItem[] = [{ label: 'Marketplace', section: 'marketplace' }];
        if (selectedMarketplaceCategory !== 'all') {
          const catDef = MARKETPLACE_CATEGORIES.find((c) => c.id === selectedMarketplaceCategory);
          items.push({
            label: catDef?.name || selectedMarketplaceCategory,
            section: 'marketplace',
            category: selectedMarketplaceCategory
          });
        }
        return items;
      }
      case 'utilities': {
        const items: BreadcrumbItem[] = [{ label: 'Utilities', section: 'utilities' }];
        if (selectedUtilityCategory) {
          const utilDef = UTILITY_CATEGORIES.find((u) => u.id === selectedUtilityCategory);
          items.push({
            label: utilDef?.name || selectedUtilityCategory,
            section: 'utilities',
            category: selectedUtilityCategory as any
          });
        }
        return items;
      }
      case 'services':
        return [{ label: 'Services', section: 'services' }];
      case 'ai_search':
        return [{ label: 'AI Concierge', section: 'ai_search' }];
      case 'cart':
        return [
          { label: 'Marketplace', section: 'marketplace' },
          { label: 'Cart & Checkout', section: 'cart' }
        ];
      case 'orders':
        return [{ label: 'Orders & Escrow Hub', section: 'orders' }];
      case 'community':
        return [{ label: 'Community Hub', section: 'community' }];
      case 'profile':
        return [{ label: 'Pioneer Profile', section: 'profile' }];
      case 'finance_analytics':
        return [{ label: 'Finance & Analytics', section: 'finance_analytics' }];
      case 'admin_governance':
        return [{ label: 'Platform Administration', section: 'admin_governance' }];
      case 'security_trust':
        return [{ label: 'Enterprise Security & Trust', section: 'security_trust' }];
      case 'developer_platform':
        return [{ label: 'Developer Platform', section: 'developer_platform' }];
      default:
        return [{ label: String(activeSection), section: activeSection }];
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-16 md:pb-0">
      
      {/* Enterprise Full-Screen Navigation Header */}
      <FullScreenNavHeader
        activeSection={activeSection}
        onNavigateSection={(sec) => handleNavigateSection(sec)}
        breadcrumbs={getBreadcrumbs()}
        canGoBack={navigationStack.length > 1}
        onGoBack={handleGoBack}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenUniversalSearch={handleOpenUniversalSearch}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        unreadNotifsCount={unreadNotifsCount}
        user={user}
        userBalancePi={userBalancePi}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenPstpShield={() => setIsPstpShieldOpen(true)}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        recentlyVisitedCategories={recentlyVisitedCategories}
        onSelectVisitedCategory={(visited) => handleSelectMarketplaceCategory(visited.id as MarketplaceCategory)}
        onOpenVendorApplication={() => setIsVendorApplicationOpen(true)}
      />

      {/* Dedicated View Rendering */}
      <main className="flex-1 mt-4">
        
        {activeSection === 'home' && (
          <HomeView
            user={user}
            userBalancePi={userBalancePi}
            products={products}
            vendors={vendors}
            activeOrders={orders}
            recentlyViewedProducts={recentlyViewedProducts}
            wishlistProducts={wishlist}
            onNavigateSection={handleNavigateSection}
            onOpenUniversalSearch={handleOpenUniversalSearch}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onInstantBuy={(p) => handleInstantBuy(p, 1)}
            onToggleWishlist={handleToggleWishlist}
            onOpenPstpShield={() => setIsPstpShieldOpen(true)}
            onOpenQrScanner={() => setIsQrScannerOpen(true)}
            onOpenStorefrontByName={handleOpenStorefrontByName}
            onConfirmReceipt={handleConfirmReceipt}
            onTrackOrder={handleTrackOrder}
            onOpenVendorApplication={() => setIsVendorApplicationOpen(true)}
          />
        )}

        {activeSection === 'marketplace' && (
          <MarketplaceView
            selectedCategory={selectedMarketplaceCategory}
            onSelectCategory={handleSelectMarketplaceCategory}
            products={products}
            vendors={vendors}
            wishlistProductIds={wishlist.map((w) => w.id)}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p, qty) => handleAddToCart(p, qty)}
            onInstantBuy={(p, qty) => handleInstantBuy(p, qty)}
            onToggleWishlist={handleToggleWishlist}
            onOpenStorefront={handleOpenStorefrontByName}
            onQuickView={(p) => setQuickViewProduct(p)}
            onOpenAiSearch={() => handleNavigateSection('ai_search')}
            onOpenUniversalSearch={handleOpenUniversalSearch}
            recentlyViewedProducts={recentlyViewedProducts}
          />
        )}

        {activeSection === 'utilities' && (
          <UtilitiesView
            selectedUtilityCategory={selectedUtilityCategory}
            utilityConfig={utilityConfig}
            userBalancePi={userBalancePi}
            buyerUsername={user.username}
            onTransactionSuccess={(receipt) => {
              const transactionId = receipt.transactionId || `UTIL-TX-${Date.now()}`;
              const orderId = transactionId.startsWith('ORD-') ? transactionId : `ORD-${transactionId}`;
              
              const providerTitle = receipt.providerName || 'Utility Service';
              const categoryName = (receipt.category || 'utility').toUpperCase();
              const pkgTitle = receipt.packageName ? ` (${receipt.packageName})` : '';

              const newUtilityOrder: Order = {
                id: orderId,
                buyerUsername: user.username,
                items: [
                  {
                    product: {
                      id: `prod-util-${providerTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
                      title: `${providerTitle}${pkgTitle}`,
                      description: `Utility fulfillment for account ${receipt.accountNumber} via ${providerTitle}. Category: ${categoryName}.`,
                      pricePi: receipt.piAmount,
                      category: 'utility',
                      subcategory: receipt.category || 'utility',
                      images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'],
                      stock: 999,
                      rating: 5.0,
                      reviewsCount: 1,
                      sellerId: 'system-utility-gateway',
                      sellerName: providerTitle,
                      sellerVerified: true,
                      features: ['Instant Digital Fulfillment', 'PSTP Order Protection Active'],
                      shippingWeightKg: 0,
                      tags: ['utility', receipt.category || 'utility', providerTitle],
                      utilityProvider: providerTitle
                    },
                    quantity: 1,
                    customDetails: {
                      accountNumber: receipt.accountNumber,
                      phoneNumber: receipt.accountNumber
                    }
                  }
                ],
                totalPi: receipt.piAmount,
                escrowStatus: 'released',
                pstpStatus: 'Completed',
                piPaymentId: receipt.piPaymentId || `pi_pay_util_${Date.now()}`,
                piTxid: receipt.piTxid || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
                trackingNumber: receipt.tokenOrCode ? `TOKEN-${receipt.tokenOrCode}` : `UTIL-REF-${transactionId}`,
                carrier: 'Digital Direct Fulfillment',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                serverVerified: true,
                digitalDeliveries: receipt.tokenOrCode ? [
                  {
                    productId: `prod-util-${providerTitle.toLowerCase().replace(/\s+/g, '-')}`,
                    codeOrUrl: receipt.tokenOrCode,
                    title: `${providerTitle} Digital Voucher / Ref Token`
                  }
                ] : undefined,
                timeline: [
                  {
                    status: 'Pending Payment',
                    timestamp: new Date(Date.now() - 5000).toISOString(),
                    actor: user.username,
                    actorRole: 'buyer',
                    note: 'Utility payment initiated via Pi Network SDK.'
                  },
                  {
                    status: 'Payment Verified',
                    timestamp: new Date(Date.now() - 2000).toISOString(),
                    actor: 'PSTP_Protection_Server',
                    actorRole: 'system',
                    note: 'Payment completed & verified server-side via Pi Platform API.'
                  },
                  {
                    status: 'Completed',
                    timestamp: new Date().toISOString(),
                    actor: providerTitle,
                    actorRole: 'seller',
                    note: receipt.tokenOrCode
                      ? `Service fulfilled. Digital Token/Code: ${receipt.tokenOrCode}`
                      : `Service fulfilled & applied directly to account ${receipt.accountNumber}.`
                  }
                ]
              };

              setOrders((previousOrders) => {
                if (
                  previousOrders.some(
                    (order) =>
                      (receipt.piPaymentId && order.piPaymentId === receipt.piPaymentId) ||
                      order.id === orderId ||
                      (receipt.transactionId && order.id === receipt.transactionId)
                  )
                ) {
                  return previousOrders;
                }

                const updatedOrders = [newUtilityOrder, ...previousOrders];

                try {
                  localStorage.setItem('pinova_user_orders', JSON.stringify(updatedOrders));
                } catch (e) {
                  console.warn('Failed to persist orders:', e);
                }

                return updatedOrders;
              });

              setUserBalancePi((prev) => Math.max(0, prev - receipt.piAmount));

              setNotifications((prev) => [
                {
                  id: `notif-${Date.now()}`,
                  title: 'Utility Purchase Fulfilled & Order Recorded',
                  message: `Successfully purchased ${providerTitle} (${receipt.accountNumber}) for ${receipt.piAmount.toFixed(4)} π. Order ID: ${orderId}. Token: ${receipt.tokenOrCode || 'Delivered'}`,
                  type: 'order_protection',
                  timestamp: new Date().toISOString(),
                  read: false
                },
                ...prev
              ]);
            }}
          />
        )}

        {activeSection === 'services' && (
          <ServicesView userBalancePi={userBalancePi} />
        )}

        {activeSection === 'ai_search' && (
          <AiSearchView
            products={products}
            vendors={vendors}
            orders={orders}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onInstantBuy={(p) => handleInstantBuy(p, 1)}
            onToggleWishlist={handleToggleWishlist}
            wishlistProductIds={wishlist.map((w) => w.id)}
            onNavigateSection={handleNavigateSection}
            onOpenStorefront={handleOpenStorefrontByName}
            onOpenUniversalSearch={handleOpenUniversalSearch}
          />
        )}

        {activeSection === 'cart' && (
          <CartView
            cart={cartItems}
            appliedCoupon={checkoutAppliedCoupon || null}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={() => setCartItems([])}
            onApplyCoupon={(code) => {
              const found = coupons.find((c) => c.code === code && c.active);
              if (found) setCheckoutAppliedCoupon(found);
            }}
            onRemoveCoupon={() => setCheckoutAppliedCoupon(undefined)}
            onOpenCheckoutModal={() => setIsCheckoutOpen(true)}
            onNavigateSection={handleNavigateSection}
          />
        )}

        {activeSection === 'orders' && (
          <OrdersView
            orders={orders}
            currentUserRole={user.role}
            currentUsername={user.username}
            initialOrderId={selectedTrackingOrderId}
            initialSubTab={selectedTrackingSubTab}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onConfirmReceipt={handleConfirmReceipt}
            onRequestReturn={handleRequestReturn}
            onOpenDispute={handleOpenDispute}
            onResolveDispute={handleResolveDispute}
            onExploreMarketplace={() => handleNavigateSection('marketplace')}
            onOrderUpdated={handleOrderUpdated}
          />
        )}

        {activeSection === 'community' && (
          <SocialCommunityHub
            user={user}
            products={products}
            vendors={vendors}
            orders={orders}
            onOpenMessaging={(recipient) => setActiveChatUser(recipient)}
            onOpenProductDetail={handleSelectProduct}
            onOpenVendorStorefront={(vendor) => setSelectedVendor(vendor)}
          />
        )}

        {activeSection === 'profile' && (
          <ProfileView
            user={user}
            currentUserRole={user.role}
            onSwitchRole={(role) => setUser((prev) => ({ ...prev, role }))}
            onOpenPstpShield={() => setIsPstpShieldOpen(true)}
            onNavigateSection={handleNavigateSection}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenVendorApplication={() => setIsVendorApplicationOpen(true)}
          />
        )}

        {activeSection === 'seller_studio' && (
          <MerchantEcosystemHub
            products={products}
            orders={orders}
            coupons={coupons}
            vendorProfile={
              vendors.find((v) => v.storeName.toLowerCase() === user.username.toLowerCase()) ||
              vendors[0] || {
                id: 'vendor-current',
                storeName: `${user.username}'s Official Store`,
                bio: 'Verified Pi Pioneer Merchant offering authentic merchandise & trusted local fulfillment.',
                rating: 5.0,
                reviewsCount: 1,
                verified: true,
                totalSalesPi: 140.0,
                bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                logoImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80',
                joinedDate: '2025-01-01',
                shippingCountries: ['Nigeria', 'Global']
              }
            }
            onAddProduct={(newProd) => setProducts((prev) => [newProd, ...prev])}
            onUpdateFulfillment={(orderId, trackingNumber, carrier) => {
              handleUpdateOrderStatus(orderId, 'Shipped', { trackingNumber, carrier });
            }}
            onCreateCoupon={(newCoupon) => setCoupons((prev) => [newCoupon, ...prev])}
          />
        )}

        {activeSection === 'finance_analytics' && (
          <FinanceAnalyticsView
            products={products}
            orders={orders}
            onOpenPstpShield={() => setIsPstpShieldOpen(true)}
          />
        )}

        {activeSection === 'admin_governance' && (
          <PlatformAdminView
            currentAdminUsername={user.username}
            onNavigateSection={handleNavigateSection}
          />
        )}

        {activeSection === 'security_trust' && (
          <EnterpriseSecurityView
            userRole={user.role}
            onNavigateSection={handleNavigateSection}
          />
        )}

        {activeSection === 'developer_platform' && (
          <div className="space-y-4">
            <PiBrowserBanner sandboxMode={true} userBalancePi={userBalancePi} />
            <DeveloperPlatformView
              userRole={user.role}
              onNavigateSection={handleNavigateSection}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer 
        onSelectCategory={(cat) => handleNavigateSection('marketplace', cat as any)} 
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenVendorApplication={() => setIsVendorApplicationOpen(true)}
        onOpenSellerStudio={() => handleNavigateSection('seller_studio' as any)}
      />

      {/* Streamlined 5-Destination Mobile Bottom Navigation */}
      <FullScreenMobileBottomNav
        activeSection={activeSection}
        onNavigateSection={(sec) => handleNavigateSection(sec)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
      />

      {/* Universal Search Modal Overlay */}
      <UniversalSearchModal
        isOpen={isUniversalSearchOpen}
        onClose={() => setIsUniversalSearchOpen(false)}
        initialQuery={universalSearchInitialQuery}
        products={products}
        vendors={vendors}
        orders={orders}
        onSelectProduct={handleSelectProduct}
        onSelectVendorByName={handleOpenStorefrontByName}
        onNavigateSection={handleNavigateSection}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onInstantBuy={(p) => handleInstantBuy(p, 1)}
        onSelectOrder={handleTrackOrder}
      />

      {/* Modals & Overlays */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
          reviews={reviews}
          onAddReview={handleAddReview}
          onOpenStorefront={(sellerName) => {
            setSelectedProduct(null);
            handleOpenStorefrontByName(sellerName);
          }}
          onContactSeller={(sellerUsername) => {
            setSelectedProduct(null);
            setActiveChatUser(sellerUsername);
          }}
        />
      )}

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onFullDetails={(p) => {
            setQuickViewProduct(null);
            handleSelectProduct(p);
          }}
          onAddToCart={(p, qty) => handleAddToCart(p, qty)}
          onInstantBuy={(p, qty) => handleInstantBuy(p, qty)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some((w) => w.id === quickViewProduct.id)}
          onOpenStorefront={(sellerName) => {
            setQuickViewProduct(null);
            handleOpenStorefrontByName(sellerName);
          }}
        />
      )}

      {selectedVendor && (
        <SellerStorefrontModal
          vendor={selectedVendor}
          products={products}
          onClose={() => setSelectedVendor(null)}
          onSelectProduct={handleSelectProduct}
          onAddToCart={(p, e) => handleAddToCart(p, 1)}
          onToggleWishlist={handleToggleWishlist}
          wishlistProductIds={wishlist.map((w) => w.id)}
          onInstantBuy={(p, e) => handleInstantBuy(p, 1)}
          onContactSeller={(sellerUsername) => setActiveChatUser(sellerUsername)}
        />
      )}

      {isCheckoutOpen && (
        <EscrowCheckoutModal
          cartItems={cartItems}
          appliedCoupon={checkoutAppliedCoupon}
          shippingCountry={checkoutShippingCountry}
          onClose={() => setIsCheckoutOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          userUsername={user.username}
          onTrackOrder={handleTrackOrder}
        />
      )}

      {isNotificationsOpen && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          onTrackOrder={handleTrackOrder}
        />
      )}

      {activeChatUser && (
        <MessagingModal
          recipientUsername={activeChatUser}
          orderId={activeChatOrderId}
          onClose={() => setActiveChatUser(null)}
          messages={messages}
          onSendMessage={handleSendMessage}
          userUsername={user.username}
        />
      )}

      {isPstpShieldOpen && (
        <PstpShieldCenter
          onClose={() => setIsPstpShieldOpen(false)}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          currentUser={user}
        />
      )}

      {isLanguageModalOpen && (
        <LanguageSelectorModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
        />
      )}

      {isQrScannerOpen && (
        <QRScannerModal
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
          onScanToPay={(rawQr) => {
            setIsQrScannerOpen(false);
            setScanToPayRawQr(rawQr);
            setIsScanToPayOpen(true);
          }}
        />
      )}

      {isScanToPayOpen && (
        <ScanToPayModal
          isOpen={isScanToPayOpen}
          onClose={() => setIsScanToPayOpen(false)}
          rawQrCode={scanToPayRawQr}
          userUsername={user.username}
          userBalancePi={userBalancePi}
          onPaymentSuccess={(result) => {
            setNotifications((prev) => [
              {
                id: `notif-scan-pay-${Date.now()}`,
                title: 'Scan-to-Pay Completed',
                message: `Successfully transferred ${result.amount} π to ${result.recipient}. Payment ID: ${result.paymentId}`,
                type: 'order_protection',
                timestamp: new Date().toISOString(),
                read: false
              },
              ...prev
            ]);
            setUserBalancePi((prev) => Math.max(0, prev - result.amount));
          }}
        />
      )}

      {isVendorApplicationOpen && (
        <VendorApplicationModal
          isOpen={isVendorApplicationOpen}
          onClose={() => setIsVendorApplicationOpen(false)}
          pioneerUsername={user.username}
          onApplicationSubmitted={(app) => {
            setNotifications((prev) => [
              {
                id: `notif-vendor-app-${Date.now()}`,
                title: 'Vendor Application Submitted',
                message: `Your vendor application for store "${app.storeName}" has been submitted for verification review. Reference: ${app.id}`,
                type: 'order_protection',
                timestamp: new Date().toISOString(),
                read: false
              },
              ...prev
            ]);
          }}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
