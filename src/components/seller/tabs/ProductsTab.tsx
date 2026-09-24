import React, { useEffect, useMemo, useState } from 'react';
import { Package, Plus, Search, Edit3, Trash2, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Product, ProductCategory } from '../../../types';
import { MARKETPLACE_CATEGORIES } from '../../../data/categoryData';
import { createSellerProduct, updateSellerProduct, deleteSellerProduct } from '../../../lib/productApi';
import { vendorAuthenticatedFetch } from '../../../lib/vendorAuthBridge';

interface ProductsTabProps {
  products: Product[];
  onOpenAddProduct?: () => void;
  openCreateOnMount?: boolean;
  onCreateFormOpened?: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

type ProductDraft = { title: string; description: string; category: ProductCategory; marketplaceCategory: string; subcategory: string; pricePi: string; stock: string; imageUrl: string };
const EMPTY_DRAFT: ProductDraft = { title: '', description: '', category: 'physical', marketplaceCategory: MARKETPLACE_CATEGORIES[0]?.id || 'other_general', subcategory: '', pricePi: '', stock: '0', imageUrl: '' };

export const ProductsTab: React.FC<ProductsTabProps> = ({ products, openCreateOnMount = false, onCreateFormOpened, onEditProduct, onDeleteProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [createdProducts, setCreatedProducts] = useState<Product[]>([]);
  const [serverProducts, setServerProducts] = useState<Product[]>([]);
  const [isLoadingServerProducts, setIsLoadingServerProducts] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadServerProducts = async () => {
      setIsLoadingServerProducts(true);
      try {
        const response = await vendorAuthenticatedFetch('/api/products', { method: 'GET' });
        const text = await response.text();
        if (!response.ok || !text) return;
        const data = JSON.parse(text);
        if (!cancelled && Array.isArray(data?.products)) setServerProducts(data.products);
      } catch (error) {
        console.warn('[ProductsTab] Failed to hydrate products from durable catalog:', error);
      } finally {
        if (!cancelled) setIsLoadingServerProducts(false);
      }
    };
    loadServerProducts();
    return () => { cancelled = true; };
  }, []);

  const visibleProducts = useMemo(() => {
    const merged = new Map<string, Product>();
    for (const product of products) merged.set(product.id, product);
    for (const product of serverProducts) merged.set(product.id, product);
    for (const product of createdProducts) merged.set(product.id, product);
    return Array.from(merged.values());
  }, [createdProducts, products, serverProducts]);
  const filteredProducts = visibleProducts.filter(product => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = String(product.title || '').toLowerCase().includes(q) || String(product.description || '').toLowerCase().includes(q) || String(product.id || '').toLowerCase().includes(q);
    const productMarketplaceCategory = product.marketplaceCategory || '';
    const matchesCategory = selectedCategory === 'all' || productMarketplaceCategory === selectedCategory;
    const matchesStock = stockFilter === 'all' || (stockFilter === 'in_stock' && product.stock > 0) || (stockFilter === 'out_of_stock' && (!product.stock || product.stock <= 0));
    return matchesSearch && matchesCategory && matchesStock;
  });
  const categories = MARKETPLACE_CATEGORIES;
  const categoryCount = MARKETPLACE_CATEGORIES.length;

  const openCreateForm = (product?: Product) => {
    setEditingProduct(product || null);
    setDraft(product ? {
      title: product.title || '',
      description: product.description || '',
      category: product.category || 'physical',
      marketplaceCategory: product.marketplaceCategory || MARKETPLACE_CATEGORIES[0]?.id || 'other_general',
      subcategory: product.subcategory || '',
      pricePi: String(product.pricePi ?? ''),
      stock: String(product.stock ?? 0),
      imageUrl: product.images?.[0] || ''
    } : EMPTY_DRAFT);
    setImageFile(null);
    setImagePreview(product?.images?.[0] || null);
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsCreateOpen(true);
  };

  useEffect(() => {
    if (!openCreateOnMount) return;
    openCreateForm();
    onCreateFormOpened?.();
  }, [openCreateOnMount, onCreateFormOpened]);
  const closeCreateForm = () => { if (!isSubmitting && !isUploadingImage) { setIsCreateOpen(false); setImageFile(null); setImagePreview(null); } };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setSubmitError('Product image must be JPEG, PNG, WebP, or GIF.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('Product image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }
    setSubmitError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const submitProduct = async (event: React.FormEvent) => {
    event.preventDefault(); setSubmitError(null); setSubmitSuccess(null);
    const title = draft.title.trim(), description = draft.description.trim(), pricePi = Number(draft.pricePi), stock = Number(draft.stock);
    if (!title) return setSubmitError('Product title is required.');
    if (!description) return setSubmitError('Product description is required.');
    if (!Number.isFinite(pricePi) || pricePi <= 0) return setSubmitError('Enter a valid Pi price greater than 0.');
    if (!Number.isInteger(stock) || stock < 0) return setSubmitError('Inventory must be a whole number of 0 or more.');
    setIsSubmitting(true);
    try {
      let uploadedImageUrl = draft.imageUrl.trim();
      if (imageFile) {
        setIsUploadingImage(true);
        const uploadResponse = await vendorAuthenticatedFetch('/api/vendor/product-image-upload', {
          method: 'POST',
          headers: { 'Content-Type': imageFile.type, 'X-Filename': encodeURIComponent(imageFile.name) },
          body: imageFile
        });
        const uploadText = await uploadResponse.text();
        let uploadData: any = null;
        try { uploadData = uploadText ? JSON.parse(uploadText) : null; } catch { uploadData = null; }
        if (!uploadResponse.ok || !uploadData?.url) {
          const uploadError = uploadData?.error || `IMAGE_UPLOAD_FAILED_HTTP_${uploadResponse.status}`;
          throw new Error(uploadError === 'MERCHANT_SELLER_ACCESS_REQUIRED' ? 'Seller access denied. Complete merchant verification before uploading product images.' : uploadError);
        }
        uploadedImageUrl = uploadData.url;
        setIsUploadingImage(false);
      }
      const result = editingProduct
        ? await updateSellerProduct(editingProduct.id, { title, description, pricePi, category: draft.category, marketplaceCategory: draft.marketplaceCategory, subcategory: draft.subcategory.trim(), images: uploadedImageUrl ? [uploadedImageUrl] : (editingProduct.images || []), stock, productType: draft.category === 'physical' ? 'physical' : draft.category === 'digital' ? 'digital' : 'service' })
        : await createSellerProduct({ title, description, pricePi, category: draft.category, marketplaceCategory: draft.marketplaceCategory, subcategory: draft.subcategory.trim(), images: uploadedImageUrl ? [uploadedImageUrl] : [], stock, features: [], tags: [], productType: draft.category === 'physical' ? 'physical' : draft.category === 'digital' ? 'digital' : 'service' });
      if (!result.ok || !result.product) {
        if (result.status === 403 && result.error === 'MERCHANT_SELLER_ACCESS_REQUIRED') setSubmitError('Seller access denied. Complete merchant verification and activate your store before publishing products.');
        else if (result.status === 401) setSubmitError('Authentication is required. Reconnect your Pi account and try again.');
        else setSubmitError(result.error || 'Product creation failed.');
        return;
      }
      if (editingProduct) {
        setCreatedProducts(prev => prev.map(product => product.id === result.product!.id ? result.product! : product));
        setServerProducts(prev => [result.product!, ...prev.filter(product => product.id !== result.product!.id)]);
        onEditProduct(result.product!);
        setSubmitSuccess(`Product updated successfully: ${result.product.title}`);
      } else {
        setCreatedProducts(prev => [result.product!, ...prev]);
        setServerProducts(prev => [result.product!, ...prev.filter(product => product.id !== result.product!.id)]);
        setSubmitSuccess(`Product created successfully: ${result.product!.title}`);
      }
      setEditingProduct(null);
      setDraft(EMPTY_DRAFT);
      setImageFile(null);
      setImagePreview(null);
      window.setTimeout(() => setIsCreateOpen(false), 900);
    } catch (error: any) {
      console.error('[ProductsTab] Product creation failed:', error);
      const message = String(error?.message || '').trim();
      if (message === 'MERCHANT_SELLER_ACCESS_REQUIRED') {
        setSubmitError('Server-verified merchant access is required. Please refresh Seller Studio and verify that your store is Active.');
      } else if (message === 'AUTHENTICATION_REQUIRED' || message === 'INVALID_SESSION') {
        setSubmitError('Your verified Pi session has expired. Refresh Seller Studio and reconnect your Pi account.');
      } else if (message) {
        setSubmitError(message);
      } else {
        setSubmitError('Unable to complete product submission. Please try again.');
      }
    } finally { setIsUploadingImage(false); setIsSubmitting(false); }
  };

  const handleArchiveProduct = async (product: Product) => {
    if (isSubmitting) return;
    const confirmed = window.confirm(`Archive product \"${product.title}\"?`);
    if (!confirmed) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await deleteSellerProduct(product.id);
      if (!result.ok) throw new Error(result.error || 'PRODUCT_DELETE_FAILED');
      setServerProducts(prev => prev.filter(item => item.id !== product.id));
      setCreatedProducts(prev => prev.filter(item => item.id !== product.id));
      onDeleteProduct(product.id);
      setSubmitSuccess(`Product archived successfully: ${product.title}`);
    } catch (error: any) {
      setSubmitError(String(error?.message || 'Unable to archive product. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" id="seller-products-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"><Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />Product Catalog</h3><p className="text-xs text-neutral-500 mt-0.5">Manage your listings, inventory quantities, and Pi pricing</p></div>
        <button id="add-product-btn" onClick={openCreateForm} className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0"><Plus className="w-4 h-4" />Add Product</button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs"><div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative"><Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products by title or ID..." className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30" /></div>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs"><option value="all">All Categories ({visibleProducts.length})</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select>
        <select value={stockFilter} onChange={e => setStockFilter(e.target.value as 'all' | 'in_stock' | 'out_of_stock')} className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs"><option value="all">All Stock Levels</option><option value="in_stock">In Stock</option><option value="out_of_stock">Out of Stock</option></select>
      </div></div>

      {filteredProducts.length === 0 ? <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-16 px-6 text-center shadow-xs"><div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto mb-4"><Package className="w-7 h-7" /></div><h4 className="text-base font-bold">No products in store yet</h4><p className="text-xs text-neutral-500 max-w-md mx-auto mt-1.5">Create a product with verified seller access to begin receiving customer orders with Pi and PSTP Escrow.</p><button onClick={openCreateForm} className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold inline-flex items-center gap-2"><Plus className="w-4 h-4" />Add Your First Product</button></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filteredProducts.map(product => <div key={product.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-xs"><div><div className="flex items-start gap-3 mb-3"><div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">{product.images?.[0] ? <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <Package className="w-7 h-7 m-5 text-neutral-400" />}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5 mb-1"><span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600 uppercase">{product.marketplaceCategory ? (MARKETPLACE_CATEGORIES.find(c => c.id === product.marketplaceCategory)?.name || product.marketplaceCategory) : (product.category || 'General')}</span><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${product.stock > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></div><h5 className="text-sm font-bold truncate">{product.title}</h5><p className="text-[11px] text-neutral-500 truncate mt-0.5">SKU: {product.id}</p></div></div><div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-2.5 flex items-center justify-between mb-3 text-xs"><div><span className="text-neutral-500 text-[11px] block">Price</span><span className="font-bold">{product.pricePi?.toFixed(2)} π</span></div><div className="text-right"><span className="text-neutral-500 text-[11px] block">Inventory</span><span>{product.stock ?? 0} units</span></div></div></div><div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2"><button onClick={() => openCreateForm(product)} className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5" />Edit</button><button onClick={() => handleArchiveProduct(product)} disabled={isSubmitting} className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-600 text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" />Archive</button></div></div>)}</div>}

      {isCreateOpen && <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3" role="dialog" aria-modal="true"><div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"><div><h3 className="text-base font-bold">{editingProduct ? 'Edit Store Product' : 'Create Store Product'}</h3><p className="text-xs text-neutral-500 mt-0.5">Server-verified merchant access is required before publishing.</p></div><button onClick={closeCreateForm} disabled={isSubmitting} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="w-5 h-5" /></button></div><form onSubmit={submitProduct} className="p-5 space-y-4">
        {submitError && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{submitError}</span></div>}
        {submitSuccess && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /><span>{submitSuccess}</span></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="sm:col-span-2 text-xs font-semibold">Product Title *<input required value={draft.title} onChange={e => setDraft(d => ({...d, title: e.target.value}))} className="mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm" placeholder="e.g. Flagship Smartphone" /></label>
          <label className="sm:col-span-2 text-xs font-semibold">Description *<textarea required value={draft.description} onChange={e => setDraft(d => ({...d, description: e.target.value}))} rows={3} className="mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm resize-none" placeholder="Describe the product accurately." /></label>
          <label className="text-xs font-semibold">Product Type *<select value={draft.category} onChange={e => setDraft(d => ({...d, category: e.target.value as ProductCategory}))} className="mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm"><option value="physical">Physical</option><option value="digital">Digital</option><option value="service">Service</option><option value="airtime">Airtime</option><option value="utility">Utility</option><option value="giftcard">Gift Card</option></select></label>
          <label className="text-xs font-semibold">Marketplace Category *<select required value={draft.marketplaceCategory} onChange={e => setDraft(d => ({...d, marketplaceCategory: e.target.value}))} className="mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm">{MARKETPLACE_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></label>
          <label className="text-xs font-semibold">Subcategory<input value={draft.subcategory} onChange={e => setDraft(d => ({...d, subcategory: e.target.value}))} className="mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm" placeholder="Optional" /></label>
          <label className="text-xs font-semibold">Price (π) *<input required type="number" min="0.000001" step="0.000001" value={draft.pricePi} onChange={e => setDraft(d => ({...d, pricePi: e.target.value}))} className="mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm" placeholder="10" /></label>
          <label className="text-xs font-semibold">Inventory *<input required type="number" min="0" step="1" value={draft.stock} onChange={e => setDraft(d => ({...d, stock: e.target.value}))} className="mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm" placeholder="5" /></label>
          <div className="sm:col-span-2 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-800/50 p-4">
            <div className="flex items-center justify-between gap-3 mb-2"><div><p className="text-xs font-semibold">Product Image</p><p className="text-[11px] text-neutral-500">Upload JPEG, PNG, WebP or GIF · max 5 MB</p></div>{imageFile && <button type="button" onClick={removeImage} disabled={isSubmitting} className="text-xs font-semibold text-rose-600">Remove</button>}</div>
            {imagePreview ? <div className="flex items-center gap-3"><img src={imagePreview} alt="Product preview" className="w-24 h-24 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700" /><div className="min-w-0"><p className="text-xs font-semibold truncate">{imageFile?.name}</p><p className="text-[11px] text-neutral-500 mt-1">{imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) : '0'} MB</p></div></div> : <label className="cursor-pointer flex items-center justify-center min-h-24 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-purple-400 transition-colors"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} className="sr-only" /><span className="text-xs font-semibold text-purple-600">Choose product image</span></label>}
          </div>
        </div><div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2"><button type="button" onClick={closeCreateForm} disabled={isSubmitting} className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold">Cancel</button><button id="submit-product-btn" type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-xs font-semibold flex items-center justify-center gap-2">{isUploadingImage ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading image...</> : isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : <><CheckCircle2 className="w-4 h-4" />{editingProduct ? 'Save Changes' : 'Submit Product'}</>}</button></div>
      </form></div></div>}
    </div>
  );
};
