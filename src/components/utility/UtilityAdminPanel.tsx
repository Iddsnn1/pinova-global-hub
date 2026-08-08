import React, { useState } from 'react';
import { 
  Zap, 
  Settings, 
  RefreshCw, 
  Sliders, 
  History, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertCircle, 
  Database,
  Save,
  Globe,
  DollarSign,
  PlusCircle,
  Trash2,
  Eye,
  FileText
} from 'lucide-react';
import { 
  PiConversionConfig, 
  ConversionRateLog, 
  UtilityServiceProvider, 
  UtilityTransactionReceipt,
  UtilityCategoryType 
} from '../../types/utility';
import { UTILITY_CATEGORY_META, SAMPLE_UTILITY_PROVIDERS, INITIAL_UTILITY_TRANSACTIONS } from '../../data/utilityData';
import { DigitalReceiptModal } from './DigitalReceiptModal';

interface UtilityAdminPanelProps {
  config: PiConversionConfig;
  onUpdateConfig: (newConfig: PiConversionConfig, note: string) => void;
  rateLogs: ConversionRateLog[];
}

export const UtilityAdminPanel: React.FC<UtilityAdminPanelProps> = ({
  config,
  onUpdateConfig,
  rateLogs
}) => {
  const [activeTab, setActiveTab] = useState<'conversion' | 'providers' | 'transactions' | 'oracle'>('conversion');
  
  // Rate Engine Form
  const [newRateUsd, setNewRateUsd] = useState<number>(config.piRateUsd);
  const [minPi, setMinPi] = useState<number>(config.minPurchasePi);
  const [maxPi, setMaxPi] = useState<number>(config.maxPurchasePi);
  const [updateNote, setUpdateNote] = useState<string>('Routine Rate Adjustment');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Providers & Packages Manager
  const [providers, setProviders] = useState<UtilityServiceProvider[]>(SAMPLE_UTILITY_PROVIDERS);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  
  // Transactions Monitor State
  const [transactions, setTransactions] = useState<UtilityTransactionReceipt[]>(INITIAL_UTILITY_TRANSACTIONS);
  const [viewingReceipt, setViewingReceipt] = useState<UtilityTransactionReceipt | null>(null);

  // New Package Modal State
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgFiat, setNewPkgFiat] = useState(10);
  const [newPkgValidity, setNewPkgValidity] = useState('30 Days');

  // Handle Rate Update Submit
  const handleSaveRateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRateUsd <= 0) return;

    const updatedConfig: PiConversionConfig = {
      ...config,
      piRateUsd: Number(newRateUsd),
      minPurchasePi: Number(minPi),
      maxPurchasePi: Number(maxPi),
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Platform_Admin'
    };

    onUpdateConfig(updatedConfig, updateNote);
    setSaveSuccessMsg('Active Pi Conversion Rate updated successfully across platform.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Toggle Provider Enable Status
  const handleToggleProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  // Add Package to Provider
  const handleAddPackage = (providerId: string) => {
    if (!newPkgName.trim()) return;

    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          const newPkg = {
            id: `pkg-${Date.now()}`,
            name: newPkgName,
            description: newPkgDesc || 'Service Package',
            fiatPrice: Number(newPkgFiat),
            currency: p.currency,
            validity: newPkgValidity
          };
          return { ...p, packages: [...p.packages, newPkg] };
        }
        return p;
      })
    );

    setEditingProviderId(null);
    setNewPkgName('');
    setNewPkgDesc('');
    setNewPkgFiat(10);
  };

  // Delete Package
  const handleDeletePackage = (providerId: string, packageId: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          return { ...p, packages: p.packages.filter((pkg) => pkg.id !== packageId) };
        }
        return p;
      })
    );
  };

  const filteredProviders = selectedCategoryFilter === 'all'
    ? providers
    : providers.filter((p) => p.category === selectedCategoryFilter);

  return (
    <div className="space-y-6">
      
      {/* Admin Panel Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
            <Zap className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Enterprise Administration</span>
            <h2 className="text-xl font-black text-white">Utility Services & Platform Pricing Configuration Engine</h2>
            <p className="text-xs text-slate-300">Configure marketplace platform pricing rules, set transaction thresholds, manage service providers, and review audit logs.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Pricing Rule</span>
            <span className="text-lg font-black text-amber-400">1 π = ${config.piRateUsd.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('conversion')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'conversion'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Dynamic Pi Rate Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'providers'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Service Providers & Packages ({providers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'transactions'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Utility Transaction History ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('oracle')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'oracle'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Automated Oracle Feed Config</span>
        </button>
      </div>

      {/* TAB 1: CONVERSION RATE ENGINE & AUDIT LOGS */}
      {activeTab === 'conversion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Rate Configuration Form (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Configure Active Pi Conversion Rate</span>
              </h3>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveRateConfig} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Active Conversion Rate (USD per 1 Pi)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newRateUsd}
                    onChange={(e) => setNewRateUsd(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-black text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400">Example: Setting to $10.00 means 1 Pi Coin converts to $10.00 USD worth of utility value.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Min Purchase Limit (π)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minPi}
                    onChange={(e) => setMinPi(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Purchase Limit (π)</label>
                  <input
                    type="number"
                    step="1"
                    value={maxPi}
                    onChange={(e) => setMaxPi(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Audit Change Reason / Note</label>
                <input
                  type="text"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="e.g. Oracle price update / Market volatility adjustment"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Active Rate Configuration</span>
              </button>
            </form>
          </div>

          {/* Rate Audit History Log (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500" />
              <span>Conversion Rate Audit History</span>
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {rateLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-purple-600 dark:text-purple-400">
                      Changed to 1 π = ${log.newRateUsd.toFixed(2)} USD
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    {log.reason}
                  </p>

                  <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Previous: ${log.previousRateUsd.toFixed(2)}</span>
                    <span>Admin Actor: {log.updatedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICE PROVIDERS & PACKAGES */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
              >
                <option value="all">All Service Categories ({providers.length})</option>
                {Object.keys(UTILITY_CATEGORY_META).map((cat) => (
                  <option key={cat} value={cat}>
                    {UTILITY_CATEGORY_META[cat].title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProviders.map((prov) => (
              <div
                key={prov.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={prov.logo}
                      alt={prov.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{prov.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                        <span className="capitalize text-purple-600 dark:text-purple-400">{prov.category}</span>
                        <span>•</span>
                        <span>{prov.country}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleProvider(prov.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      prov.enabled
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}
                  >
                    {prov.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Packages List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Packages & Plans ({prov.packages.length})
                    </span>
                    <button
                      onClick={() => setEditingProviderId(prov.id)}
                      className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Package</span>
                    </button>
                  </div>

                  {/* Add Package Modal / Inline Box */}
                  {editingProviderId === prov.id && (
                    <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 space-y-2 text-xs">
                      <div className="font-bold text-purple-900 dark:text-purple-200">New Package Details</div>
                      <input
                        type="text"
                        placeholder="Package Name (e.g. 10GB Data Plan)"
                        value={newPkgName}
                        onChange={(e) => setNewPkgName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={newPkgDesc}
                        onChange={(e) => setNewPkgDesc(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Fiat Price ($)"
                          value={newPkgFiat}
                          onChange={(e) => setNewPkgFiat(Number(e.target.value))}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                        />
                        <input
                          type="text"
                          placeholder="Validity (e.g. 30 Days)"
                          value={newPkgValidity}
                          onChange={(e) => setNewPkgValidity(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingProviderId(null)}
                          className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddPackage(prov.id)}
                          className="px-3 py-1 bg-purple-600 text-white rounded-lg text-[11px] font-bold"
                        >
                          Save Package
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {prov.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{pkg.name}</span>
                          <span className="text-[10px] text-slate-400 ml-2">${pkg.fiatPrice.toFixed(2)} USD</span>
                        </div>
                        <button
                          onClick={() => handleDeletePackage(prov.id, pkg.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: UTILITY TRANSACTIONS HISTORY */}
      {activeTab === 'transactions' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Platform Utility Purchase Records</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Transaction Ref</th>
                  <th className="py-2.5 px-3">Provider & Account</th>
                  <th className="py-2.5 px-3">Local Value</th>
                  <th className="py-2.5 px-3">Pi Coin Amount</th>
                  <th className="py-2.5 px-3">Applied Rate</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">{tx.transactionId}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{tx.providerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{tx.accountNumber}</div>
                    </td>
                    <td className="py-3 px-3 font-bold">${tx.fiatAmount.toFixed(2)} {tx.fiatCurrency}</td>
                    <td className="py-3 px-3 font-black text-amber-500">{tx.piAmount.toFixed(4)} π</td>
                    <td className="py-3 px-3 font-mono text-slate-500">1 π = ${tx.appliedPiRateUsd.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setViewingReceipt(tx)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-500 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUTOMATED PRICING BENCHMARK FEED */}
      {activeTab === 'oracle' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Platform Pricing Reference & Automated Benchmarks</span>
          </h3>

          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-purple-900 dark:text-purple-200">Platform Internal Pricing Benchmark Listener</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                Active Listener
              </span>
            </div>
            <p className="text-purple-700 dark:text-purple-300">
              Marketplace administrators configure platform pricing rules. Internal reference benchmarks assist administrators with market monitoring. Note: Pi Network does not establish, publish, or guarantee exchange rates.
            </p>
          </div>
        </div>
      )}

      {/* View Digital Receipt Modal */}
      {viewingReceipt && (
        <DigitalReceiptModal
          receipt={viewingReceipt}
          onClose={() => setViewingReceipt(null)}
        />
      )}
    </div>
  );
};
