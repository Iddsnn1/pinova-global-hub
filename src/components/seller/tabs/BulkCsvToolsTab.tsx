import React, { useState, useRef } from 'react';
import { vendorAuthenticatedFetch } from '../../../lib/vendorAuthBridge';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  RefreshCw,
  Table
} from 'lucide-react';
import { Product } from '../../../types';

interface BulkCsvToolsTabProps {
  products: Product[];
  onAddProduct?: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
}

export const BulkCsvToolsTab: React.FC<BulkCsvToolsTabProps> = ({
  products,
  onAddProduct
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<{
    success: boolean;
    importedCount: number;
    errors: string[];
  } | null>(null);

  // Download real CSV template
  const handleDownloadTemplate = (type: 'products' | 'inventory') => {
    let csvContent = '';
    if (type === 'products') {
      csvContent = 'title,description,pricePi,category,stock,tags\n"Authentic Merchant Watch","Premium Pioneer mechanical watch with sapphire glass",25.50,"electronics",10,"watch,luxury,hardware"\n"Pioneer Organic Coffee","Direct-trade high-altitude organic coffee beans 500g",3.20,"groceries",50,"coffee,organic,food"';
    } else {
      csvContent = 'sku,productTitle,stockOnHand,warehouseLocation,reorderPoint\n"SKU-WATCH-01","Authentic Merchant Watch",10,"Primary Depot",3\n"SKU-COFFEE-02","Pioneer Organic Coffee",50,"Primary Depot",10';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pinova_${type}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export current catalog as CSV
  const handleExportCatalog = () => {
    const headers = ['id', 'title', 'pricePi', 'category', 'stock', 'sellerVerified'];
    const rows = products.map(p => [
      `"${p.id}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      p.pricePi ?? 0,
      `"${p.category || 'general'}"`,
      p.stock ?? 0,
      p.sellerVerified ? 'true' : 'false'
    ]);

    const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pinova_catalog_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setParseResult(null);
    }
  };

  const handleProcessCsv = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setParseResult(null);
    try {
      if (selectedFile.size > 10 * 1024 * 1024) throw new Error('CSV file exceeds the 10 MB limit.');
      const csv = await selectedFile.text();
      const response = await vendorAuthenticatedFetch('/api/products-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || data?.error || 'Server rejected the bulk import.');
      const errors = Array.isArray(data?.errors) ? data.errors : [];
      setParseResult({
        success: Number(data?.importedCount || 0) > 0 && errors.length === 0,
        importedCount: Number(data?.importedCount || 0),
        errors: errors.length ? errors : []
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setParseResult({ success: false, importedCount: 0, errors: [err?.message || 'Failed to process CSV file.'] });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6" id="bulk-csv-tools-tab">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                Data Operations
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Batch Import & Export
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" />
              Bulk CSV Tools
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Import multiple products, update warehouse inventory stock in bulk, or export your full catalog for accounting.
            </p>
          </div>

          <button
            id="export-catalog-csv-btn"
            onClick={handleExportCatalog}
            disabled={products.length === 0}
            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shrink-0 min-h-[44px]"
          >
            <Download className="w-4 h-4 text-purple-600" />
            <span>Export Catalog ({products.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Templates & Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template Downloads */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Download className="w-4 h-4 text-purple-600" />
            Download Standard CSV Templates
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Use our pre-formatted templates to ensure proper column names, price formats, and stock fields before uploading.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                  Product Catalog Template
                </span>
                <span className="text-[11px] text-neutral-500">
                  Headers: title, description, pricePi, category, stock, tags
                </span>
              </div>
              <button
                id="download-products-template-btn"
                onClick={() => handleDownloadTemplate('products')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-semibold text-purple-600 dark:text-purple-300 hover:bg-neutral-50 min-h-[36px]"
              >
                Download
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                  Inventory Stock Update Template
                </span>
                <span className="text-[11px] text-neutral-500">
                  Headers: sku, productTitle, stockOnHand, warehouseLocation
                </span>
              </div>
              <button
                id="download-inventory-template-btn"
                onClick={() => handleDownloadTemplate('inventory')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-semibold text-purple-600 dark:text-purple-300 hover:bg-neutral-50 min-h-[36px]"
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Upload Box */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-purple-600" />
            Upload Batch CSV File
          </h3>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-xl p-6 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <FileSpreadsheet className="w-10 h-10 mx-auto text-purple-500 mb-2" />
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
              {selectedFile ? selectedFile.name : 'Click or drop a CSV file here'}
            </span>
            <span className="text-[11px] text-neutral-400 block mt-1">
              Supports .csv up to 10 MB • Product imports are server-validated and enter moderation review
            </span>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-600 dark:text-neutral-300 truncate font-mono">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
              <button
                id="process-csv-upload-btn"
                onClick={handleProcessCsv}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 min-h-[44px]"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Process Import</span>
                  </>
                )}
              </button>
            </div>
          )}

          {parseResult && (
            <div className={`p-3.5 rounded-xl border text-xs ${
              parseResult.success
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400'
            }`}>
              {parseResult.success ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Successfully imported {parseResult.importedCount} items into your store catalog!</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>CSV Import Failed:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {parseResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
