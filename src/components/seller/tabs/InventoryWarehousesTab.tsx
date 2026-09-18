import React, { useState } from 'react';
import { 
  Boxes, 
  Warehouse as WarehouseIcon, 
  Plus, 
  AlertCircle, 
  Search, 
  ArrowUpDown, 
  Package, 
  CheckCircle2, 
  Building2,
  RefreshCw
} from 'lucide-react';
import { Product } from '../../../types';
import { vendorAuthenticatedFetch } from '../../../lib/vendorAuthBridge';

interface InventoryWarehousesTabProps {
  products: Product[];
  onUpdateProduct?: (product: Product) => void;
}

export const InventoryWarehousesTab: React.FC<InventoryWarehousesTabProps> = ({
  products,
  onUpdateProduct
}) => {
  const [activeSubView, setActiveSubView] = useState<'inventory' | 'warehouses'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustStockVal, setAdjustStockVal] = useState<number>(0);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [warehousesList, setWarehousesList] = useState<Array<{ id: string; name: string; location: string; country: string; isPrimary: boolean }>>([]);
  const [inventorySaving, setInventorySaving] = useState(false);
  const [warehouseSaving, setWarehouseSaving] = useState(false);
  const [inventoryError, setInventoryError] = useState('');

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await vendorAuthenticatedFetch('/api/vendor/warehouses');
        const data = await res.json().catch(() => null);
        if (!cancelled && res.ok && Array.isArray(data?.warehouses)) setWarehousesList(data.warehouses);
      } catch {
        if (!cancelled) setInventoryError('Unable to load durable warehouse records.');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setInventorySaving(true);
    setInventoryError('');
    try {
      const csv = `productId,stockOnHand\n${selectedProduct.id},${Math.max(0, adjustStockVal)}\n`;
      const res = await vendorAuthenticatedFetch('/api/products-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv, importType: 'inventory' })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || Number(data?.importedCount) !== 1) throw new Error(data?.error || data?.errors?.[0] || 'Inventory update failed.');
      onUpdateProduct?.({ ...selectedProduct, stock: Math.max(0, adjustStockVal) });
      setSelectedProduct(null);
    } catch (error:any) {
      setInventoryError(error?.message || 'Unable to save stock.');
    } finally {
      setInventorySaving(false);
    }
  };

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseName.trim()) return;
    setWarehouseSaving(true);
    setInventoryError('');
    try {
      const res = await vendorAuthenticatedFetch('/api/vendor/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: warehouseName.trim(), location: warehouseLocation.trim() || 'Global Depot', country: '' })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.warehouse) throw new Error(data?.error || data?.message || 'Unable to create warehouse.');
      setWarehousesList(Array.isArray(data.warehouses) ? data.warehouses : [data.warehouse]);
      setWarehouseName('');
      setWarehouseLocation('');
      setShowWarehouseModal(false);
    } catch (error:any) {
      setInventoryError(error?.message || 'Unable to save warehouse.');
    } finally {
      setWarehouseSaving(false);
    }
  };

  return (
    <div className="space-y-6" id="inventory-warehouses-tab">
      {/* Header Banner */}
      {inventoryError && (
        <div className="px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-xs text-rose-700 dark:text-rose-300">{inventoryError}</div>
      )}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                Logistics & Supply
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                PSTP Escrow Locked
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-purple-600" />
              Inventory & Warehouses
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Authoritative stock tracking, warehouse allocation, and SKU inventory reservations for verified orders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center">
              <button
                id="toggle-inventory-subview-btn"
                onClick={() => setActiveSubView('inventory')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] ${
                  activeSubView === 'inventory'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Stock ({products.length})
              </button>
              <button
                id="toggle-warehouses-subview-btn"
                onClick={() => setActiveSubView('warehouses')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] ${
                  activeSubView === 'warehouses'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Warehouses ({warehousesList.length})
              </button>
            </div>

            {activeSubView === 'warehouses' && (
              <button
                id="add-warehouse-btn"
                onClick={() => setShowWarehouseModal(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Warehouse</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {activeSubView === 'inventory' ? (
        /* Inventory Subview */
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search catalog inventory by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <span className="text-xs text-neutral-500 self-center">
              Total Catalog Items: <strong className="text-neutral-800 dark:text-neutral-200">{products.length}</strong>
            </span>
          </div>

          {products.length === 0 ? (
            /* Truthful Empty State */
            <div className="text-center py-12 px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
              <Boxes className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3" />
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                No inventory records yet.
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
                Products published to your merchant catalog will appear here with live stock levels, unit reservations, and reorder controls.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                    <th className="pb-3 pl-2">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">Unit Price</th>
                    <th className="pb-3 text-center">In Stock</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredProducts.map((product) => {
                    const stock = product.stock ?? 0;
                    return (
                      <tr key={product.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Package className="w-5 h-5 m-auto mt-2 text-neutral-400" />
                              )}
                            </div>
                            <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                              <span className="font-bold text-neutral-900 dark:text-neutral-100 block truncate">
                                {product.title}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                ID: {product.id.slice(0, 12)}...
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 capitalize text-neutral-600 dark:text-neutral-400">
                          {product.category || 'General'}
                        </td>
                        <td className="py-3.5 text-right font-bold text-neutral-900 dark:text-neutral-100">
                          {product.pricePi ? `${product.pricePi.toFixed(2)} π` : '0.00 π'}
                        </td>
                        <td className="py-3.5 text-center font-semibold text-neutral-800 dark:text-neutral-200">
                          {stock} units
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            stock > 0
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                          }`}>
                            {stock > 0 ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-2 text-right">
                          <button
                            id={`adjust-stock-${product.id}`}
                            onClick={() => {
                              setSelectedProduct(product);
                              setAdjustStockVal(product.stock ?? 0);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold min-h-[36px]"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Warehouses Subview */
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <WarehouseIcon className="w-4 h-4 text-purple-600" />
              Configured Fulfillment Depots
            </h3>
            <button
              onClick={() => setShowWarehouseModal(true)}
              className="text-xs text-purple-600 hover:underline font-semibold"
            >
              + Add Depot
            </button>
          </div>

          {warehousesList.length === 0 ? (
            /* Truthful Empty State */
            <div className="text-center py-12 px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
              <WarehouseIcon className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3" />
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                No warehouses configured yet.
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
                Configure regional storage depots or merchant fulfillment centers to manage localized shipping and multi-warehouse inventory allocation.
              </p>
              <button
                id="empty-add-warehouse-btn"
                onClick={() => setShowWarehouseModal(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Configure Primary Warehouse</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {warehousesList.map(wh => (
                <div key={wh.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{wh.name}</h4>
                      {wh.isPrimary && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{wh.location}</p>
                  </div>
                  <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-neutral-200/60 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                    Active Depot
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-purple-600" />
              Adjust Stock Level
            </h3>
            <p className="text-xs text-neutral-500">
              Update available inventory for <strong>{selectedProduct.title}</strong>.
            </p>

            <form onSubmit={handleAdjustStock} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Stock On Hand (Units) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustStockVal}
                  onChange={(e) => setAdjustStockVal(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold min-h-[44px]"
                >
                  {inventorySaving ? 'Saving…' : 'Save Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {showWarehouseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <WarehouseIcon className="w-5 h-5 text-purple-600" />
              Configure Warehouse
            </h3>
            <form onSubmit={handleCreateWarehouse} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Warehouse / Depot Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Western Regional Fulfillment Hub"
                  value={warehouseName}
                  onChange={(e) => setWarehouseName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Location (City, Country)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frankfurt, Germany"
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWarehouseModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold min-h-[44px]"
                >
                  {warehouseSaving ? 'Saving…' : 'Save Depot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
