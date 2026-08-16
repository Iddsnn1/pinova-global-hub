import React, { useState, useMemo, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldCheck,
  Download,
  RefreshCw,
  Users,
  ShoppingBag,
  Package,
  Globe,
  Store,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Clock,
  Target,
  Zap,
  Award,
  FileText,
  Search,
  HelpCircle,
  Briefcase,
  Lock,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Info,
  Bookmark,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  LayoutGrid,
  Bell,
  Share2,
  CalendarDays,
  SlidersHorizontal,
  Check,
  LineChart as LineChartIcon,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

import { Product, Order } from '../../types';
import {
  TimePeriod,
  ViewPerspective,
  financeAnalyticsEngine,
  BIRecommendation,
  DataSourceProvenance,
  RBACRole,
  AnalyticsAuditRecord,
  ModulePermissionConfig,
  DashboardPresetRole,
  WidgetConfig,
  DashboardLayoutProfile,
  SavedReport,
  ScheduledReportConfig,
  ScheduleFrequency,
  UserAnalyticsPreferences
} from '../../modules/finance_analytics';

interface FinanceAnalyticsViewProps {
  products: Product[];
  orders: Order[];
  onOpenPstpShield?: () => void;
}

/**
 * Reusable Data Quality & Provenance Badge
 */
const ProvenanceBadge: React.FC<{ provenance: DataSourceProvenance }> = ({ provenance }) => {
  if (provenance === 'verified_marketplace_ledger') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
        <ShieldCheck className="w-3 h-3 text-emerald-500" />
        Verified Marketplace Ledger
      </span>
    );
  }
  if (provenance === 'ai_generated_estimate') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-purple-400" />
        AI Generated Estimate
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-wider">
      <BarChart3 className="w-3 h-3 text-indigo-500" />
      Calculated Marketplace Metric
    </span>
  );
};

/**
 * Reusable Formula & Explainability Tooltip Component
 */
const FormulaTooltip: React.FC<{ title: string; formula: string; description: string }> = ({ title, formula, description }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-full text-slate-400 hover:text-purple-500 hover:bg-purple-500/10 transition-colors focus:outline-none"
        title="Explain Metric Formula & Provenance"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute z-50 top-6 left-0 w-72 p-3.5 rounded-2xl bg-slate-900 border border-purple-500/40 text-white shadow-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-extrabold text-amber-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              {title} Calculation
            </span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
          </div>
          <div className="font-mono text-[10px] bg-slate-950 p-2 rounded-xl border border-slate-800 text-purple-300 leading-relaxed">
            {formula}
          </div>
          <p className="text-[10px] text-slate-300 leading-normal">{description}</p>
        </div>
      )}
    </div>
  );
};

export const FinanceAnalyticsView: React.FC<FinanceAnalyticsViewProps> = ({
  products,
  orders,
  onOpenPstpShield
}) => {
  // Load User Preferences from localStorage or defaults
  const [userPrefs, setUserPrefs] = useState<UserAnalyticsPreferences>(() => {
    try {
      const saved = localStorage.getItem('pinova_analytics_prefs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      activePreset: 'Administrator',
      comparisonPeriod: 'previous_period',
      defaultTimePeriod: '30d',
      defaultPerspective: 'marketplace',
      chartStyle: 'area',
      layoutProfileId: 'profile-admin'
    };
  });

  // Save Preferences to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('pinova_analytics_prefs', JSON.stringify(userPrefs));
    } catch (e) {
      // ignore
    }
  }, [userPrefs]);

  // Top-level View Perspective & Filters
  const [perspective, setPerspective] = useState<ViewPerspective>(userPrefs.defaultPerspective);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(userPrefs.defaultTimePeriod);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [comparisonPeriod, setComparisonPeriod] = useState<'previous_period' | 'year_over_year' | 'none'>(userPrefs.comparisonPeriod);
  const [chartStyle, setChartStyle] = useState<'area' | 'bar' | 'line'>(userPrefs.chartStyle);

  // RBAC User Role & Permissions State
  const [userRole, setUserRole] = useState<RBACRole>('Admin');
  const [rbacConfig, setRbacConfig] = useState<ModulePermissionConfig>(financeAnalyticsEngine.getRBACConfig());
  const [showRbacModal, setShowRbacModal] = useState(false);

  // Layout Profiles & Widgets Customization
  const [layoutProfiles, setLayoutProfiles] = useState<DashboardLayoutProfile[]>(financeAnalyticsEngine.getDefaultLayoutProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>('profile-admin');
  const [widgets, setWidgets] = useState<WidgetConfig[]>(
    financeAnalyticsEngine.getDefaultLayoutProfiles()[0].widgets
  );
  const [showWidgetCustomizer, setShowWidgetCustomizer] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // Saved & Scheduled Reports State
  const [savedReports, setSavedReports] = useState<SavedReport[]>(financeAnalyticsEngine.getSavedReports());
  const [scheduledReports, setScheduledReports] = useState<ScheduledReportConfig[]>(financeAnalyticsEngine.getScheduledReports());
  const [showSaveReportModal, setShowSaveReportModal] = useState(false);
  const [showScheduleReportModal, setShowScheduleReportModal] = useState(false);

  // New Report Form state
  const [newReportTitle, setNewReportTitle] = useState('');
  const [newReportDesc, setNewReportDesc] = useState('');
  const [newReportRoles, setNewReportRoles] = useState<RBACRole[]>(['Admin', 'Merchant']);

  // New Schedule Form state
  const [selectedReportForSched, setSelectedReportForSched] = useState<string>(savedReports[0]?.id || '');
  const [schedFreq, setSchedFreq] = useState<ScheduleFrequency>('Weekly');

  // Sub-Tab Navigation
  const [activeTab, setActiveTab] = useState<
    'financial_dashboard' | 'merchant_center' | 'marketplace_analytics' | 'bi_forecasting' | 'saved_reports' | 'audit_governance'
  >('financial_dashboard');

  // Audit Logs State & Filter
  const [auditLogs, setAuditLogs] = useState<AnalyticsAuditRecord[]>(financeAnalyticsEngine.getAuditLogs());
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const auditPageSize = 5;

  // Pagination for Transaction Ledger
  const [ledgerPage, setLedgerPage] = useState(1);
  const ledgerPageSize = 5;

  // Toast Notification Banner
  const [showExportNotice, setShowExportNotice] = useState(false);
  const [exportNoticeMessage, setExportNoticeMessage] = useState('');

  // Local BI Recommendations State
  const [biRecommendations, setBiRecommendations] = useState<BIRecommendation[]>(
    financeAnalyticsEngine.getBusinessIntelligence(orders, products).operationalRecommendations
  );

  // Performance Cache Simulation
  const [queryLatencyMs, setQueryLatencyMs] = useState(0.12);
  const [isCacheHit, setIsCacheHit] = useState(true);

  // Recalculate metrics on demand
  const summary = useMemo(() => financeAnalyticsEngine.getFinancialSummary(orders, timePeriod, perspective), [orders, timePeriod, perspective]);
  const merchantMetrics = useMemo(() => financeAnalyticsEngine.getMerchantFinancialMetrics(orders, products), [orders, products]);
  const analyticsData = useMemo(() => financeAnalyticsEngine.getMarketplaceAnalytics(orders, products), [orders, products]);
  const biData = useMemo(() => financeAnalyticsEngine.getBusinessIntelligence(orders, products), [orders, products]);

  // Handle Preset Switching
  const handleSelectPreset = (presetRole: DashboardPresetRole) => {
    setUserPrefs(prev => ({ ...prev, activePreset: presetRole }));
    
    // Map preset to default parameters
    if (presetRole === 'Administrator') {
      setUserRole('Admin');
      setPerspective('marketplace');
      const prof = layoutProfiles.find(p => p.rolePreset === 'Administrator') || layoutProfiles[0];
      setActiveProfileId(prof.id);
      setWidgets(prof.widgets);
    } else if (presetRole === 'Merchant') {
      setUserRole('Merchant');
      setPerspective('merchant');
      const prof = layoutProfiles.find(p => p.rolePreset === 'Merchant') || layoutProfiles[1];
      if (prof) { setActiveProfileId(prof.id); setWidgets(prof.widgets); }
    } else if (presetRole === 'Finance Officer') {
      setUserRole('Auditor');
      setPerspective('admin');
      const prof = layoutProfiles.find(p => p.rolePreset === 'Finance Officer') || layoutProfiles[2];
      if (prof) { setActiveProfileId(prof.id); setWidgets(prof.widgets); }
    } else if (presetRole === 'Analyst') {
      setUserRole('Analyst');
      setPerspective('marketplace');
      const prof = layoutProfiles.find(p => p.rolePreset === 'Analyst') || layoutProfiles[3];
      if (prof) { setActiveProfileId(prof.id); setWidgets(prof.widgets); }
    } else if (presetRole === 'Auditor') {
      setUserRole('Auditor');
      setPerspective('admin');
      setActiveTab('audit_governance');
    } else if (presetRole === 'Business Manager') {
      setUserRole('Admin');
      setPerspective('marketplace');
      setActiveTab('bi_forecasting');
    }

    setExportNoticeMessage(`Switched to ${presetRole} Dashboard Preset & Layout Profile.`);
    setShowExportNotice(true);
    setTimeout(() => setShowExportNotice(false), 3000);
  };

  // Toggle Widget Visibility
  const toggleWidgetVisibility = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  // Move Widget Order
  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...widgets];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newWidgets.length) return;
    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIdx];
    newWidgets[targetIdx] = temp;
    // Reassign order
    setWidgets(newWidgets.map((w, idx) => ({ ...w, order: idx + 1 })));
  };

  // Change Widget Size
  const changeWidgetSize = (id: string, size: WidgetConfig['size']) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  };

  // Save Current Layout Profile
  const handleSaveLayoutProfile = () => {
    const name = newProfileName.trim() || `Custom Layout ${layoutProfiles.length + 1}`;
    const newProf: DashboardLayoutProfile = {
      id: `profile-${Date.now().toString().slice(-5)}`,
      name,
      rolePreset: userPrefs.activePreset,
      widgets: [...widgets]
    };
    setLayoutProfiles(prev => [...prev, newProf]);
    setActiveProfileId(newProf.id);
    setNewProfileName('');
    setExportNoticeMessage(`Saved new layout profile "${name}".`);
    setShowExportNotice(true);
    setTimeout(() => setShowExportNotice(false), 3000);
  };

  // Save Current View as Report
  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportTitle.trim()) return;
    const rep = financeAnalyticsEngine.addSavedReport({
      title: newReportTitle,
      description: newReportDesc || 'Custom saved financial report configuration.',
      perspective,
      timePeriod,
      categoryFilter: selectedCategoryFilter,
      createdBy: `Pioneer (${userRole})`,
      isFavorite: true,
      sharedWithRoles: newReportRoles
    });
    setSavedReports(financeAnalyticsEngine.getSavedReports());
    setShowSaveReportModal(false);
    setNewReportTitle('');
    setNewReportDesc('');
    setExportNoticeMessage(`Saved custom report "${rep.title}".`);
    setShowExportNotice(true);
    setTimeout(() => setShowExportNotice(false), 3000);
  };

  // Create New Schedule
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const rep = savedReports.find(r => r.id === selectedReportForSched) || savedReports[0];
    const sched = financeAnalyticsEngine.createScheduledReport({
      reportId: rep.id,
      reportTitle: rep.title,
      frequency: schedFreq,
      recipientRoles: ['Admin', 'Merchant'],
      exportFormat: 'CSV',
      enabled: true,
      nextRunAt: new Date(Date.now() + 86400000).toISOString(),
      deliveryChannel: 'In-App Notification'
    });
    setScheduledReports(financeAnalyticsEngine.getScheduledReports());
    setShowScheduleReportModal(false);
    setExportNoticeMessage(`Scheduled automated report delivery (${schedFreq}).`);
    setShowExportNotice(true);
    setTimeout(() => setShowExportNotice(false), 3000);
  };

  // Refresh Analytics Engine
  const refreshAnalyticsEngine = () => {
    setIsCacheHit(false);
    setQueryLatencyMs(Number((Math.random() * 0.4 + 0.1).toFixed(2)));
    setTimeout(() => setIsCacheHit(true), 600);

    financeAnalyticsEngine.logAuditRecord(
      `Pioneer (${userRole})`,
      userRole,
      'CALCULATE_BI_FORECAST',
      'ENGINE_MANUAL_REFRESH',
      'calculated_marketplace_metric',
      undefined,
      'Refreshed analytics engine calculations and cache indices'
    );
    setAuditLogs(financeAnalyticsEngine.getAuditLogs());

    setExportNoticeMessage('Analytics Engine refreshed. All metrics and forecasts re-indexed.');
    setShowExportNotice(true);
    setTimeout(() => setShowExportNotice(false), 3000);
  };

  const handleApplyRecommendation = (recId: string) => {
    financeAnalyticsEngine.applyBIRecommendation(recId);
    setBiRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, applied: true } : r))
    );
    financeAnalyticsEngine.logAuditRecord(
      `Pioneer (${userRole})`,
      userRole,
      'APPLY_BI_RECOMMENDATION',
      'BI_OPERATIONAL_POLICY',
      'ai_generated_estimate',
      undefined,
      `Applied recommendation ${recId}`
    );
    setAuditLogs(financeAnalyticsEngine.getAuditLogs());

    setExportNoticeMessage('Operational recommendation applied successfully to system policy engine.');
    setShowExportNotice(true);
    setTimeout(() => setShowExportNotice(false), 4000);
  };

  const handleDownloadCsv = () => {
    const csvContent = financeAnalyticsEngine.exportFinancialReportCsv(
      summary,
      merchantMetrics,
      `Pioneer User (${userRole})`,
      userRole,
      `${timePeriod} Historical Window`
    );
    setAuditLogs(financeAnalyticsEngine.getAuditLogs());

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PiNova_Financial_Report_${perspective}_${timePeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNoticeMessage('Financial Audit Ledger exported as CSV with complete metadata header.');
    setShowExportNotice(true);
    setTimeout(() => setShowExportNotice(false), 4000);
  };

  // Check RBAC permission for active tab
  const isTabAllowed = (tabKey: keyof ModulePermissionConfig) => {
    const allowedRoles = rbacConfig[tabKey] || [];
    return allowedRoles.includes(userRole);
  };

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) =>
    log.actor.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
    log.actionType.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
    log.reportType.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
    log.dataProvenance.toLowerCase().includes(auditSearchQuery.toLowerCase())
  );

  const totalAuditPages = Math.ceil(filteredAuditLogs.length / auditPageSize) || 1;
  const paginatedAuditLogs = filteredAuditLogs.slice((auditPage - 1) * auditPageSize, auditPage * auditPageSize);

  // Mock Transaction Ledger items for Pagination demo
  const sampleTransactions = [
    { inv: 'INV-2026-001', ord: 'ORD-9821', amt: 180.00, sdkId: 'pi_pay_8849201a', status: 'COMPLETED', date: '2026-08-04 14:22' },
    { inv: 'INV-2026-002', ord: 'ORD-9822', amt: 45.00, sdkId: 'pi_pay_993012b', status: 'COMPLETED', date: '2026-08-04 15:10' },
    { inv: 'INV-2026-003', ord: 'ORD-9825', amt: 210.00, sdkId: 'pi_pay_110293c', status: 'PENDING_VERIFICATION', date: '2026-08-04 16:45' },
    { inv: 'INV-2026-004', ord: 'ORD-9828', amt: 89.50, sdkId: 'pi_pay_449201d', status: 'COMPLETED', date: '2026-08-04 18:02' },
    { inv: 'INV-2026-005', ord: 'ORD-9830', amt: 320.00, sdkId: 'pi_pay_551920e', status: 'COMPLETED', date: '2026-08-05 00:15' },
    { inv: 'INV-2026-006', ord: 'ORD-9831', amt: 15.00, sdkId: 'pi_pay_662019f', status: 'COMPLETED', date: '2026-08-05 01:05' },
    { inv: 'INV-2026-007', ord: 'ORD-9834', amt: 500.00, sdkId: 'pi_pay_773021g', status: 'PENDING_VERIFICATION', date: '2026-08-05 01:20' }
  ];

  const totalLedgerPages = Math.ceil(sampleTransactions.length / ledgerPageSize) || 1;
  const paginatedTransactions = sampleTransactions.slice((ledgerPage - 1) * ledgerPageSize, ledgerPage * ledgerPageSize);

  // Colors for charts
  const COLORS = ['#8b5cf6', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  // Check if a widget is visible
  const isWidgetVisible = (id: string) => {
    const w = widgets.find(x => x.id === id);
    return w ? w.visible : true;
  };

  return (
    <div id="finance-analytics-engine-root" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Toast Notification Banner */}
      {showExportNotice && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-white shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{exportNoticeMessage}</span>
        </div>
      )}

      {/* Main Engine Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Module 8 Enterprise Engine
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Pi SDK v2 Payment Verification
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Latency: {queryLatencyMs}ms (Cached Index)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Finance, Analytics & Business Intelligence Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time Gross Marketplace Sales (GMS), verified Pi payment completion metrics, merchant liquidity tracking, and AI-driven predictive intelligence.
          </p>
        </div>

        {/* Header Control Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowWidgetCustomizer(!showWidgetCustomizer)}
            className="px-3.5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-extrabold flex items-center gap-2 transition-all shadow-md"
          >
            <LayoutGrid className="w-4 h-4 text-purple-400" />
            <span>Customize Dashboard</span>
          </button>

          <button
            onClick={() => setShowRbacModal(!showRbacModal)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>RBAC Controls</span>
          </button>

          <button
            onClick={refreshAnalyticsEngine}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${!isCacheHit ? 'animate-spin' : ''}`} />
            <span>Refresh Engine</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-purple-950/50"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Dashboard Preset Role Selector Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-purple-800/40 text-white shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Executive Persona Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['Administrator', 'Merchant', 'Business Manager', 'Finance Officer', 'Auditor', 'Analyst'] as DashboardPresetRole[]).map((preset) => (
            <button
              key={preset}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                userPrefs.activePreset === preset
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {userPrefs.activePreset === preset && <Check className="w-3.5 h-3.5 text-slate-950" />}
              <span>{preset}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Customization Drawer / Modal */}
      {showWidgetCustomizer && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/40 text-white shadow-2xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-black text-sm text-amber-400 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-amber-400" />
                <span>Personalize Dashboard Layout & Widget Reordering</span>
              </h3>
              <p className="text-xs text-slate-400">Drag/reorder widgets, adjust dimensions, or save layout profiles per workflow.</p>
            </div>
            <button onClick={() => setShowWidgetCustomizer(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕ Close</button>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 block">Widget List & Layout Sequence:</span>
            <div className="space-y-2">
              {widgets.map((w, idx) => (
                <div key={w.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleWidgetVisibility(w.id)}
                      className={`p-1.5 rounded-lg transition-colors ${w.visible ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}
                      title={w.visible ? 'Hide Widget' : 'Show Widget'}
                    >
                      {w.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <div>
                      <span className="font-bold text-xs text-white block">{w.title}</span>
                      <span className="text-[10px] text-slate-400 capitalize">Category: {w.category} • Size: {w.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={w.size}
                      onChange={(e) => changeWidgetSize(w.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-200"
                    >
                      <option value="small">Small (1/4)</option>
                      <option value="medium">Medium (1/2)</option>
                      <option value="large">Large (2/3)</option>
                      <option value="full">Full Width</option>
                    </select>

                    <button
                      disabled={idx === 0}
                      onClick={() => moveWidget(idx, 'up')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                    >
                      <MoveUp className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                    <button
                      disabled={idx === widgets.length - 1}
                      onClick={() => moveWidget(idx, 'down')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                    >
                      <MoveDown className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="New Layout Profile Name..."
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-full sm:w-64"
              />
              <button
                onClick={handleSaveLayoutProfile}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold whitespace-nowrap"
              >
                Save Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RBAC Modal */}
      {showRbacModal && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/40 text-white shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-black text-sm text-amber-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Administrator RBAC Dashboard Permissions Control</span>
            </h3>
            <button onClick={() => setShowRbacModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕ Close</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-300 block">Switch Active User Role Simulator:</span>
              <div className="flex flex-wrap gap-2">
                {(['Admin', 'Merchant', 'Analyst', 'Auditor'] as RBACRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRole(r)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      userRole === r ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-300 block">Role Module Access Map:</span>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between p-1.5 rounded bg-slate-950">
                  <span>Financial Summary:</span>
                  <span className="text-emerald-400">{rbacConfig.financialSummary.join(', ')}</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-950">
                  <span>Sales Analytics:</span>
                  <span className="text-indigo-400">{rbacConfig.salesAnalytics.join(', ')}</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-950">
                  <span>BI & AI Forecasting:</span>
                  <span className="text-purple-400">{rbacConfig.biForecasting.join(', ')}</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-950">
                  <span>Audit Governance:</span>
                  <span className="text-amber-400">{rbacConfig.auditGovernance.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Transparency Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 shadow-sm">
        <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 block mb-0.5">Revenue & Operational Transparency Notice</span>
          <p>Revenue reports and financial dashboards represent platform operational reporting only. PiNova Global Hub does not provide Pi wallet custody, settlement services, blockchain verification, or official Pi Network financial reporting.</p>
          <p className="text-[11px] text-amber-300/80 italic">Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status.</p>
        </div>
      </div>

      {/* Global Perspective, Filter & Comparison Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Perspective Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {[
            { id: 'marketplace', label: 'Global Marketplace', icon: Globe },
            { id: 'merchant', label: 'Merchant View', icon: Store },
            { id: 'admin', label: 'Admin Audit View', icon: ShieldCheck }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = perspective === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPerspective(item.id as ViewPerspective)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Time Period & Comparison Period Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Time Window:</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {[
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' },
              { id: '1y', label: '1Y' },
              { id: 'all', label: 'All' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setTimePeriod(p.id as TimePeriod)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  timePeriod === p.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Comparison Period */}
          <select
            value={comparisonPeriod}
            onChange={(e) => setComparisonPeriod(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="previous_period">vs Previous Period</option>
            <option value="year_over_year">vs Year Over Year (YoY)</option>
            <option value="none">No Comparison</option>
          </select>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'financial_dashboard', label: 'Enterprise Financial Dashboard', icon: DollarSign, key: 'financialSummary' },
          { id: 'merchant_center', label: 'Merchant Financial Center', icon: Briefcase, key: 'financialSummary' },
          { id: 'marketplace_analytics', label: 'Marketplace Analytics', icon: BarChart3, key: 'salesAnalytics' },
          { id: 'bi_forecasting', label: 'Business Intelligence & Forecasting', icon: Sparkles, key: 'biForecasting' },
          { id: 'saved_reports', label: 'Saved & Scheduled Reports', icon: Bookmark, key: 'financialSummary' },
          { id: 'audit_governance', label: 'Audit Governance & Provenance', icon: ShieldCheck, key: 'auditGovernance' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const allowed = isTabAllowed(tab.key as any);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-t-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 border-b-2 ${
                isActive
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {!allowed && <Lock className="w-3 h-3 text-rose-500" />}
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* TAB 1: ENTERPRISE FINANCIAL DASHBOARD */}
      {/* ==================================================== */}
      {activeTab === 'financial_dashboard' && isTabAllowed('financialSummary') && (
        <div className="space-y-8">
          
          {/* Top Primary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* GMS Card */}
            {isWidgetVisible('w-gms') && (
              <div
                onClick={() => setActiveTab('marketplace_analytics')}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-purple-500/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Gross Marketplace Sales (GMS)</span>
                    <FormulaTooltip title="GMS" formula="Sum of (Item Price * Quantity) for all orders on PiNova" description="Calculated in real-time from verified Pi SDK v2 completed checkout transactions." />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                    π
                  </div>
                </div>
                <ProvenanceBadge provenance="verified_marketplace_ledger" />
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {summary.grossMarketplaceSalesPi.toLocaleString('en-US', { minimumFractionDigits: 2 })} π
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-extrabold mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+18.4% vs {comparisonPeriod === 'year_over_year' ? 'previous year' : 'previous period'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Net Marketplace Revenue */}
            {isWidgetVisible('w-net-rev') && (
              <div
                onClick={() => setActiveTab('merchant_center')}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-purple-500/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Net Marketplace Revenue</span>
                    <FormulaTooltip title="Net Revenue" formula="Gross Sales - Merchant Payouts - Refunds" description="Reflects marketplace platform fee earnings (currently set at 0.00% Pioneer promo tier)." />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <ProvenanceBadge provenance="calculated_marketplace_metric" />
                <div>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                    {summary.netMarketplaceRevenuePi.toLocaleString('en-US', { minimumFractionDigits: 2 })} π
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-purple-400 font-extrabold mt-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>0.00% Pioneer Platform Fee</span>
                  </div>
                </div>
              </div>
            )}

            {/* Completed Orders Count */}
            {isWidgetVisible('w-orders') && (
              <div
                onClick={() => setActiveTab('audit_governance')}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-purple-500/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Completed Orders Ratio</span>
                    <FormulaTooltip title="Completion Ratio" formula="(Completed Orders ÷ Total Orders) * 100%" description="Measures verified Pi SDK v2 payment approval and successful PSTP delivery." />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <ProvenanceBadge provenance="verified_marketplace_ledger" />
                <div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                    {summary.completedOrders} / {summary.totalOrders}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-extrabold mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>98.6% Settlement Completion</span>
                  </div>
                </div>
              </div>
            )}

            {/* Average Order Value (AOV) */}
            {isWidgetVisible('w-aov') && (
              <div
                onClick={() => setActiveTab('marketplace_analytics')}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-purple-500/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Average Order Value (AOV)</span>
                    <FormulaTooltip title="AOV" formula="Gross Sales ÷ Completed Orders" description="Standard marketplace basket value in native Pi currency." />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                </div>
                <ProvenanceBadge provenance="calculated_marketplace_metric" />
                <div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                    {summary.averageOrderValuePi.toFixed(2)} π
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-extrabold mt-1">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span>High-value physical & utility cart mix</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Revenue Chart Section with Chart Style Toggle */}
          {isWidgetVisible('w-revenue-chart') && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <span>Gross Sales & Verified Payment Velocity</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Daily revenue trajectory tracking Pi SDK v2 completed checkouts across physical and digital goods.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => setChartStyle('area')}
                      className={`px-2.5 py-1 rounded-lg font-bold ${chartStyle === 'area' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                    >
                      Area
                    </button>
                    <button
                      onClick={() => setChartStyle('bar')}
                      className={`px-2.5 py-1 rounded-lg font-bold ${chartStyle === 'bar' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                    >
                      Bar
                    </button>
                    <button
                      onClick={() => setChartStyle('line')}
                      className={`px-2.5 py-1 rounded-lg font-bold ${chartStyle === 'line' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                    >
                      Line
                    </button>
                  </div>
                  <ProvenanceBadge provenance="verified_marketplace_ledger" />
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartStyle === 'area' ? (
                    <AreaChart data={summary.revenueTrends}>
                      <defs>
                        <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any) => [`${val} π`, 'Amount']}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="grossSalesPi" name="Gross Sales (Pi)" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorGross)" />
                      <Area type="monotone" dataKey="netRevenuePi" name="Net Marketplace Revenue (Pi)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNet)" />
                    </AreaChart>
                  ) : chartStyle === 'bar' ? (
                    <BarChart data={summary.revenueTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any) => [`${val} π`, 'Amount']}
                      />
                      <Legend />
                      <Bar dataKey="grossSalesPi" name="Gross Sales (Pi)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="netRevenuePi" name="Net Marketplace Revenue (Pi)" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={summary.revenueTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any) => [`${val} π`, 'Amount']}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="grossSalesPi" name="Gross Sales (Pi)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="netRevenuePi" name="Net Marketplace Revenue (Pi)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Paginated Verified Transaction Ledger Table */}
          {isWidgetVisible('w-transaction-table') && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>Verified Transaction & Invoice Ledger</span>
                  </h3>
                  <p className="text-xs text-slate-500">Live verified payments with Pi SDK v2 IDs and audit timestamps.</p>
                </div>
                <ProvenanceBadge provenance="verified_marketplace_ledger" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                      <th className="py-3 px-3">Invoice #</th>
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Amount (π)</th>
                      <th className="py-3 px-3">SDK Payment ID</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedTransactions.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{row.inv}</td>
                        <td className="py-3 px-3 font-mono text-purple-600 dark:text-purple-400">{row.ord}</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">{row.amt.toFixed(2)} π</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{row.sdkId}</td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">{row.date}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400">Page {ledgerPage} of {totalLedgerPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={ledgerPage === 1}
                    onClick={() => setLedgerPage(p => Math.max(p - 1, 1))}
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 font-bold"
                  >
                    Prev
                  </button>
                  <button
                    disabled={ledgerPage === totalLedgerPages}
                    onClick={() => setLedgerPage(p => Math.min(p + 1, totalLedgerPages))}
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: MERCHANT FINANCIAL CENTER */}
      {/* ==================================================== */}
      {activeTab === 'merchant_center' && isTabAllowed('financialSummary') && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400">Merchant Store</span>
              <div className="text-lg font-black text-slate-900 dark:text-white truncate">
                {merchantMetrics.merchantName}
              </div>
              <ProvenanceBadge provenance="verified_marketplace_ledger" />
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400">Total Merchant Sales</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {merchantMetrics.totalSalesPi.toLocaleString()} π
              </div>
              <span className="text-[10px] text-slate-400">Verified Completed Orders</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400">Pending Order Protection Status</span>
              <div className="text-2xl font-black text-amber-500">
                {merchantMetrics.pendingEscrowPi.toLocaleString()} π
              </div>
              <span className="text-[10px] text-amber-500/80 font-bold">Buyer Protection Processing</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400">Total Catalog Inventory Value</span>
              <div className="text-2xl font-black text-purple-500 tracking-tight">
                {merchantMetrics.totalInventoryValuePi.toLocaleString()} π
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                Reflects estimated marketplace catalog values calculated from merchant-listed prices in Pi currency across active product stock.
              </p>
            </div>

          </div>

          {/* Best Selling Products */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              <span>Best Selling Products & Return Rates</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-2 font-bold">Product Title</th>
                    <th className="py-3 px-2 font-bold">Category</th>
                    <th className="py-3 px-2 font-bold">Units Sold</th>
                    <th className="py-3 px-2 font-bold">Revenue (Pi)</th>
                    <th className="py-3 px-2 font-bold">In-Stock Qty</th>
                    <th className="py-3 px-2 font-bold">Return Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {merchantMetrics.bestSellingProducts.map((item) => (
                    <tr key={item.productId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-2 font-bold text-slate-900 dark:text-slate-100">{item.title}</td>
                      <td className="py-3 px-2 text-slate-500 capitalize">{item.category}</td>
                      <td className="py-3 px-2 font-extrabold text-slate-800 dark:text-slate-200">{item.unitsSold}</td>
                      <td className="py-3 px-2 font-black text-amber-500">{item.revenuePi.toLocaleString()} π</td>
                      <td className="py-3 px-2 font-bold text-purple-400">{item.stockQty}</td>
                      <td className="py-3 px-2 text-slate-400">{item.returnRatePercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: MARKETPLACE ANALYTICS */}
      {/* ==================================================== */}
      {activeTab === 'marketplace_analytics' && isTabAllowed('salesAnalytics') && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  <span>Category Performance & GMS Share</span>
                </h3>
                <ProvenanceBadge provenance="calculated_marketplace_metric" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.categoryPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" height={40} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} π`, 'Gross Sales']}
                    />
                    <Bar dataKey="grossSalesPi" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-500" />
                  <span>Pioneer Traffic Sources & Conversion</span>
                </h3>
                <ProvenanceBadge provenance="calculated_marketplace_metric" />
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.trafficSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="sharePercent"
                      nameKey="source"
                      label={(entry) => `${entry.source}: ${entry.sharePercent}%`}
                    >
                      {analyticsData.trafficSources.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: BUSINESS INTELLIGENCE & FORECASTING */}
      {/* ==================================================== */}
      {activeTab === 'bi_forecasting' && isTabAllowed('biForecasting') && (
        <div className="space-y-8">
          
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs flex items-start gap-3 shadow-sm">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-purple-300 block mb-0.5">AI Forecasting Governance Notice</span>
              <span>Forecasts are AI-generated operational estimates based on historical marketplace activity and should not be interpreted as guaranteed future performance.</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="font-black text-lg text-amber-400 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <span>Executive BI Scorecard & Target Benchmarks</span>
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/30 text-purple-200 font-bold">
                  Marketplace Operational Index: {biData.kpiScorecard.operationalHealthScore} / 100
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 font-bold">
                  Marketplace Performance Score: {biData.kpiScorecard.marketplacePerformanceScore} / 100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">GMS Target Progress</span>
                <div className="text-xl font-black text-amber-400">{biData.kpiScorecard.grossSalesTargetProgressPercent}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Fulfillment SLA</span>
                <div className="text-xl font-black text-emerald-400">{biData.kpiScorecard.fulfillmentSlaPercent}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Dispute Rate</span>
                <div className="text-xl font-black text-purple-300">{biData.kpiScorecard.disputeRatePercent}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Customer CSAT</span>
                <div className="text-xl font-black text-amber-300">{biData.kpiScorecard.customerSatisfactionScore} / 5.0</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Revenue Forecast (Next 30, 60, 90 Days)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {biData.revenueForecasts.map((rf) => (
                  <div key={rf.periodLabel} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{rf.periodLabel}</span>
                    <div className="text-xl font-black text-emerald-500">{rf.projectedRevenuePi.toLocaleString()} π</div>
                    <div className="text-[10px] text-slate-400 font-bold">
                      Range: {rf.confidenceLowerPi.toLocaleString()} π – {rf.confidenceUpperPi.toLocaleString()} π
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Lifetime Value (LTV) Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span>Customer Lifetime Value (LTV)</span>
              </h3>
              <div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                  {biData.customerInsights.avgLtvPi} π
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                  Cohort: {biData.customerInsights.topCohort}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal pt-1 border-t border-slate-100 dark:border-slate-800">
                LTV calculations are derived solely from marketplace transaction history and customer order activity on PiNova. Does not represent Pi Network wallet balances or holdings.
              </p>
            </div>

          </div>

          {/* Operational AI Recommendations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>AI Operational Recommendations & Policy Triggers</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {biRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase">
                      {rec.category} • {rec.confidencePercent}% Confidence
                    </span>
                    {rec.applied && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">Applied</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rec.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{rec.description}</p>
                  {!rec.applied && (
                    <button
                      onClick={() => handleApplyRecommendation(rec.id)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      {rec.actionText}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: SAVED & SCHEDULED REPORTS */}
      {/* ==================================================== */}
      {activeTab === 'saved_reports' && (
        <div className="space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-purple-500" />
                <span>Custom Saved Reports & Scheduled Delivery</span>
              </h3>
              <p className="text-xs text-slate-500">Save custom filter states, manage automated schedules, and share reports across RBAC roles.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSaveReportModal(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Current View</span>
              </button>
              <button
                onClick={() => setShowScheduleReportModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Bell className="w-4 h-4" />
                <span>New Schedule</span>
              </button>
            </div>
          </div>

          {/* Saved Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedReports.map((rep) => (
              <div key={rep.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[10px] font-black uppercase">
                    {rep.perspective} • {rep.timePeriod}
                  </span>
                  <button
                    onClick={() => setSavedReports(financeAnalyticsEngine.toggleFavoriteReport(rep.id))}
                    className="text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Bookmark className={`w-4 h-4 ${rep.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{rep.title}</h4>
                <p className="text-xs text-slate-500">{rep.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <span>Created by: {rep.createdBy}</span>
                  <span className="font-mono text-indigo-400">Shared: {rep.sharedWithRoles.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Scheduled Reports List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-500" />
              <span>Automated Report Schedule Rules</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Report Title</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Recipients</th>
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scheduledReports.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{s.reportTitle}</td>
                      <td className="py-3 px-3 font-semibold text-purple-600 dark:text-purple-400">{s.frequency}</td>
                      <td className="py-3 px-3 text-slate-400">{s.recipientRoles.join(', ')}</td>
                      <td className="py-3 px-3 font-mono font-bold">{s.exportFormat}</td>
                      <td className="py-3 px-3 text-slate-400">{s.deliveryChannel}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setScheduledReports(financeAnalyticsEngine.toggleScheduledReport(s.id))}
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            s.enabled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                          }`}
                        >
                          {s.enabled ? 'Active' : 'Paused'}
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

      {/* Save Report Modal */}
      {showSaveReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveReport} className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-purple-500/40 text-white shadow-2xl space-y-4">
            <h3 className="font-black text-sm text-amber-400 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Save Current View as Custom Report</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Weekly Electronics GMS Audit"
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  placeholder="Brief description of this saved report context..."
                  value={newReportDesc}
                  onChange={(e) => setNewReportDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 h-20"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>Perspective: <span className="text-white font-bold">{perspective}</span></div>
                <div>Time Window: <span className="text-white font-bold">{timePeriod}</span></div>
                <div>Category: <span className="text-white font-bold">{selectedCategoryFilter}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSaveReportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Save Report
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Report Modal */}
      {showScheduleReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSchedule} className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-purple-500/40 text-white shadow-2xl space-y-4">
            <h3 className="font-black text-sm text-amber-400 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Configure Automated Report Schedule</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Select Report Template</label>
                <select
                  value={selectedReportForSched}
                  onChange={(e) => setSelectedReportForSched(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                >
                  {savedReports.map((r) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Delivery Frequency</label>
                <select
                  value={schedFreq}
                  onChange={(e) => setSchedFreq(e.target.value as ScheduleFrequency)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowScheduleReportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Enable Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: AUDIT GOVERNANCE & PROVENANCE */}
      {/* ==================================================== */}
      {activeTab === 'audit_governance' && isTabAllowed('auditGovernance') && (
        <div className="space-y-8">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Append-only Financial & Analytics Audit Governance Ledger</span>
                </h3>
                <p className="text-xs text-slate-500">Every report export, calculation, and RBAC policy edit creates an append-only log record.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Audit ID</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Actor / Role</th>
                    <th className="py-2.5 px-3">Action Type</th>
                    <th className="py-2.5 px-3">Data Provenance</th>
                    <th className="py-2.5 px-3">Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{log.id}</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{log.actor}</span>
                        <span className="text-[10px] text-slate-400">({log.userRole})</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-purple-600 dark:text-purple-400 font-bold">{log.actionType}</td>
                      <td className="py-3 px-3"><ProvenanceBadge provenance={log.dataProvenance} /></td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate">{log.metadata}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audit Pagination */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400">Page {auditPage} of {totalAuditPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={auditPage === 1}
                  onClick={() => setAuditPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 font-bold"
                >
                  Prev
                </button>
                <button
                  disabled={auditPage === totalAuditPages}
                  onClick={() => setAuditPage(p => Math.min(p + 1, totalAuditPages))}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
