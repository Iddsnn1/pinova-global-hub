/**
 * Module 11 — Enterprise Developer Platform, Integration & Extensibility Engine
 * Full-Featured Production-Grade UI View for PiNova Global Hub
 */

import React, { useState, useEffect } from 'react';
import {
  Code,
  Terminal,
  Server,
  Webhook,
  Package,
  Sliders,
  Activity,
  Key,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Download,
  ExternalLink,
  Layers,
  Cpu,
  Globe,
  Search,
  Lock,
  Database,
  Zap,
  Radio,
  Play,
  FileText,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Check,
  Briefcase
} from 'lucide-react';

import { getDeveloperPlatformEngine } from '../../modules/developer_platform';
import {
  ApiEndpoint,
  IntegrationConnector,
  WebhookSubscription,
  WebhookDeliveryLog,
  MarketplacePlugin,
  FeatureFlag,
  EnvironmentProfile,
  EventBusMessage,
  BackgroundJob,
  DeveloperApiKey,
  DeveloperOAuthClient,
  DeveloperAuditLog,
  DeveloperPlatformHealthSummary
} from '../../modules/developer_platform/types';

interface DeveloperPlatformViewProps {
  userRole?: string;
  onNavigateSection?: (section: string) => void;
}

export const DeveloperPlatformView: React.FC<DeveloperPlatformViewProps> = ({
  userRole = 'Admin',
  onNavigateSection
}) => {
  const engine = getDeveloperPlatformEngine();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<
    'gateway' | 'integrations' | 'webhooks' | 'plugins' | 'portal' | 'config' | 'event_bus' | 'observability' | 'access_security'
  >('gateway');

  // State slices
  const [health, setHealth] = useState<DeveloperPlatformHealthSummary>(engine.getHealthSummary());
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(engine.getEndpoints());
  const [connectors, setConnectors] = useState<IntegrationConnector[]>(engine.getConnectors());
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>(engine.getWebhooks());
  const [webhookLogs, setWebhookLogs] = useState<WebhookDeliveryLog[]>(engine.getWebhookLogs());
  const [plugins, setPlugins] = useState<MarketplacePlugin[]>(engine.getPlugins());
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(engine.getFeatureFlags());
  const [activeEnv, setActiveEnv] = useState<EnvironmentProfile>(engine.getEnvironmentProfile());
  const [eventMessages, setEventMessages] = useState<EventBusMessage[]>(engine.getEventMessages());
  const [backgroundJobs, setBackgroundJobs] = useState<BackgroundJob[]>(engine.getBackgroundJobs());
  const [apiKeys, setApiKeys] = useState<DeveloperApiKey[]>(engine.getApiKeys());
  const [oauthClients, setOauthClients] = useState<DeveloperOAuthClient[]>(engine.getOAuthClients());
  const [auditLogs, setAuditLogs] = useState<DeveloperAuditLog[]>(engine.getAuditLogs());

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive API Runner State
  const [apiTestPath, setApiTestPath] = useState<string>('/api/v2/pi/payments/verify');
  const [apiTestMethod, setApiTestMethod] = useState<string>('POST');
  const [apiTestHeaders, setApiTestHeaders] = useState<string>('{\n  "Authorization": "Bearer pn_live_pk_demo8841",\n  "Content-Type": "application/json"\n}');
  const [apiTestBody, setApiTestBody] = useState<string>('{\n  "paymentId": "pi_tx_99812401",\n  "amountPi": 12.5,\n  "currency": "PI"\n}');
  const [apiTestResult, setApiTestResult] = useState<any | null>(null);
  const [isExecutingApiTest, setIsExecutingApiTest] = useState<boolean>(false);
  const [selectedSdkTab, setSelectedSdkTab] = useState<'curl' | 'typescript' | 'python'>('typescript');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Audit filter state
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [auditEventType, setAuditEventType] = useState<string>('ALL');

  // New Key Modal
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [newKeyRole, setNewKeyRole] = useState<DeveloperApiKey['role']>('FULL_DEVELOPER');
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshState = () => {
    setHealth(engine.getHealthSummary());
    setEndpoints(engine.getEndpoints());
    setConnectors(engine.getConnectors());
    setWebhooks(engine.getWebhooks());
    setWebhookLogs(engine.getWebhookLogs());
    setPlugins(engine.getPlugins());
    setFeatureFlags(engine.getFeatureFlags());
    setActiveEnv(engine.getEnvironmentProfile());
    setEventMessages(engine.getEventMessages());
    setBackgroundJobs(engine.getBackgroundJobs());
    setApiKeys(engine.getApiKeys());
    setOauthClients(engine.getOAuthClients());
    setAuditLogs(engine.getAuditLogs());
  };

  // --- HANDLERS ---
  const handleRateLimitChange = (id: string, val: number) => {
    const updated = engine.updateEndpointRateLimit(id, val);
    setEndpoints(updated);
    refreshState();
    showToast(`Updated endpoint rate limit to ${val} req/min.`);
  };

  const handleTestConnector = (id: string) => {
    const res = engine.testConnectorConnection(id);
    refreshState();
    if (res.success) {
      showToast(`Ping Success (${res.latencyMs}ms): ${res.message}`);
    }
  };

  const handleToggleConnector = (id: string) => {
    const updated = engine.toggleConnectorStatus(id);
    setConnectors(updated);
    refreshState();
    showToast('Integration status updated.');
  };

  const handleTriggerWebhookTest = (id: string) => {
    const newLog = engine.triggerWebhookTest(id);
    refreshState();
    showToast(`Webhook Test Dispatched! Result: HTTP ${newLog.statusCode} (${newLog.deliveryDurationMs}ms)`);
  };

  const handleReplayWebhook = (logId: string) => {
    const replayed = engine.replayWebhookEvent(logId);
    if (replayed) {
      refreshState();
      showToast(`Event replayed successfully! HTTP ${replayed.statusCode}`);
    }
  };

  const handleTogglePlugin = (id: string) => {
    const updated = engine.togglePlugin(id);
    setPlugins(updated);
    refreshState();
    showToast('Plugin state updated.');
  };

  const handleUpdatePlugin = (id: string) => {
    const updated = engine.updatePlugin(id);
    setPlugins(updated);
    refreshState();
    showToast('Plugin updated to latest version successfully!');
  };

  const handleToggleFeatureFlag = (key: string) => {
    const updated = engine.toggleFeatureFlag(key);
    setFeatureFlags(updated);
    refreshState();
    showToast(`Feature flag [${key}] toggled.`);
  };

  const handleEnvChange = (env: EnvironmentProfile) => {
    engine.setEnvironmentProfile(env);
    refreshState();
    showToast(`Environment profile switched to ${env}.`);
  };

  const handleRunApiTest = () => {
    setIsExecutingApiTest(true);
    setTimeout(() => {
      const res = engine.executeApiRequest(apiTestPath, apiTestMethod, apiTestHeaders, apiTestBody);
      setApiTestResult(res);
      setIsExecutingApiTest(false);
      refreshState();
    }, 300);
  };

  const handleCreateKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const defaultScopes = ['pi:payments:write', 'catalog:read', 'orders:read'];
    const created = engine.createApiKey(newKeyName.trim(), newKeyRole, defaultScopes);
    setGeneratedSecret(created.maskedKey);
    setNewKeyName('');
    setApiKeys(engine.getApiKeys());
    refreshState();
    showToast('Developer API key generated successfully!');
  };

  const handleRevokeKey = (id: string) => {
    const updated = engine.revokeApiKey(id);
    setApiKeys(updated);
    refreshState();
    showToast('API key revoked.');
  };

  const handleExportAuditCSV = () => {
    const csv = engine.exportAuditLogsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pinova_developer_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Developer audit logs exported to CSV.');
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actorUsername.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.module.toLowerCase().includes(auditSearch.toLowerCase());

    const matchesType = auditEventType === 'ALL' || log.eventType === auditEventType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xl shadow-purple-900/50 border border-purple-400 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mandatory Pi Network Compliance & Transparency Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border border-purple-500/30 space-y-2 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-200">
              Module 11 — Enterprise Developer Platform, Integration & Extensibility Engine
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-extrabold border border-emerald-800">
            Pi SDK v2 & Platform API Verified
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          <strong>Official Compliance Notice:</strong> PiNova Global Hub is built on a non-custodial architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services. Payment approval and completion are processed through the Official Pi SDK v2 payment workflow and Pi Platform API according to their documented integration flow, and PiNova never performs wallet custody, settlement, blockchain validation, or transaction finality. Certain capabilities rely on external service providers and official Pi Platform services; feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status. All developer integrations, API routing gateways, and extensions operate strictly within the application sandbox for testing and validation.
        </p>
      </div>

      {/* Top Header & Global Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Code className="w-7 h-7 text-purple-400" />
            <span>Developer Platform & Integrations</span>
          </h1>
          <p className="text-xs text-slate-400">
            Centralized API Gateway, Integration Hub, Webhook Engine, Extension Framework & Governance
          </p>
        </div>

        {/* Global Quick Actions & Environment Profile Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-bold text-slate-400">Environment:</span>
            <div className="flex items-center gap-1">
              {(['SANDBOX', 'STAGING', 'PRODUCTION'] as EnvironmentProfile[]).map(env => (
                <button
                  key={env}
                  onClick={() => handleEnvChange(env)}
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all ${
                    activeEnv === env
                      ? env === 'PRODUCTION'
                        ? 'bg-emerald-600 text-white shadow'
                        : env === 'STAGING'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateSection && onNavigateSection('admin_governance')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Center</span>
          </button>
        </div>
      </div>

      {/* Top Health KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Platform Status</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-black text-emerald-400">{health.overallStatus}</span>
          </div>
          <span className="text-[10px] text-slate-500 block">System SLA {health.apiSlaPercentage}%</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">API Gateway</span>
          <span className="text-lg font-black text-white">{health.activeEndpointsCount} Routes</span>
          <span className="text-[10px] text-purple-400 block font-medium">Avg Latency {health.avgApiLatencyMs}ms</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Connectors</span>
          <span className="text-lg font-black text-emerald-400">{health.connectedIntegrationsCount} Connected</span>
          <span className="text-[10px] text-slate-500 block">Payment, Utility, AI, ERP</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Plugins Active</span>
          <span className="text-lg font-black text-indigo-400">{health.activePluginsCount} Extensions</span>
          <span className="text-[10px] text-slate-500 block">Marketplace & Admin</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Webhook Success</span>
          <span className="text-lg font-black text-amber-400">{health.webhookSuccessRate24h}%</span>
          <span className="text-[10px] text-slate-500 block">HMAC SHA-256 Verified</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Job Queue</span>
          <span className="text-lg font-black text-purple-300">{health.activeJobsInQueue} Active</span>
          <span className="text-[10px] text-slate-500 block">Background Queue Engine</span>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 border-b border-slate-800">
        {[
          { id: 'gateway', label: 'API Gateway & Routes', icon: Server },
          { id: 'integrations', label: 'Enterprise Integration Hub', icon: Layers },
          { id: 'webhooks', label: 'Webhook & DLQ Engine', icon: Webhook },
          { id: 'plugins', label: 'Plugin Marketplace', icon: Package },
          { id: 'portal', label: 'Interactive API Portal', icon: Terminal },
          { id: 'config', label: 'Config & Feature Flags', icon: Sliders },
          { id: 'event_bus', label: 'Event Bus & Workflows', icon: Radio },
          { id: 'observability', label: 'Observability & SLA', icon: Activity },
          { id: 'access_security', label: 'API Keys & Audit Governance', icon: Key }
        ].map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: API GATEWAY & ROUTING --- */}
      {activeTab === 'gateway' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                <span>Centralized API Gateway & Endpoint Registry</span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage versioning, endpoint rate limits, SLA metrics, latency distribution, and deprecation policies.
              </p>
            </div>
            <button
              onClick={refreshState}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Refresh Gateway</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Method & Path</th>
                  <th className="p-3.5">Endpoint Name & Version</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Rate Limit</th>
                  <th className="p-3.5">24h Requests</th>
                  <th className="p-3.5">Latency</th>
                  <th className="p-3.5">SLA %</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {endpoints.map(ep => (
                  <tr key={ep.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            ep.method === 'POST'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : ep.method === 'GET'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="text-xs font-bold text-purple-200">{ep.path}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white text-xs">{ep.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>Ver: {ep.version}</span>
                        {ep.deprecated && (
                          <span className="text-amber-400 font-bold">({ep.deprecationNotice})</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                        {ep.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-amber-400">{ep.rateLimitPerMin} / min</span>
                        <button
                          onClick={() => {
                            const val = prompt(`Set rate limit (req/min) for ${ep.name}:`, String(ep.rateLimitPerMin));
                            if (val && !isNaN(Number(val))) handleRateLimitChange(ep.id, Number(val));
                          }}
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      {ep.activeRequests24h.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">{ep.avgLatencyMs} ms</td>
                    <td className="p-3.5 font-bold text-purple-300">{ep.slaPercent}%</td>
                    <td className="p-3.5">
                      {ep.deprecated ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold text-[10px] border border-amber-800">
                          DEPRECATED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800">
                          ACTIVE SLA
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: INTEGRATION HUB --- */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Enterprise Integration Hub & Connectors</span>
              </h3>
              <p className="text-xs text-slate-400">
                Agnostic enterprise connectors for Payments, Telco Utilities, Shipping, Notifications, AI Models, and ERP/CRM systems.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectors.map(conn => (
              <div key={conn.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 text-[10px] font-black uppercase">
                      {conn.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        conn.status === 'CONNECTED'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : conn.status === 'CONFIGURING'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-rose-950 text-rose-400 border-rose-800'
                      }`}
                    >
                      {conn.status} ({conn.healthPercent}%)
                    </span>
                  </div>

                  <h4 className="font-black text-white text-sm">{conn.name}</h4>
                  <p className="text-xs text-slate-400">{conn.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Provider & Docs</span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-semibold">{conn.provider}</span>
                      <a
                        href={conn.apiDocsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[10px] font-bold"
                      >
                        <span>Docs</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Active Configuration</span>
                    {Object.entries(conn.activeConfig).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-slate-400">
                        <span className="text-slate-500">{k}:</span>
                        <span className="text-slate-200 font-medium truncate max-w-[150px]">{v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleTestConnector(conn.id)}
                      className="flex-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Test Ping</span>
                    </button>
                    <button
                      onClick={() => handleToggleConnector(conn.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                    >
                      {conn.status === 'CONNECTED' ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: WEBHOOK ENGINE & DLQ --- */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Webhook className="w-5 h-5 text-amber-400" />
                <span>Webhook Management Engine & Dead Letter Queue (DLQ)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage event delivery targets, HMAC SHA-256 signature verification (<code className="text-amber-400 font-mono">X-PiNova-Signature</code>), retry queues, and event replay.
              </p>
            </div>
          </div>

          {/* Webhook Registry */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Webhook Subscriptions</h4>
            <div className="space-y-3">
              {webhooks.map(wh => (
                <div key={wh.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{wh.name}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800">
                        {wh.status} ({wh.successRate24h}%)
                      </span>
                    </div>
                    <div className="text-xs font-mono text-amber-300">{wh.targetUrl}</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap pt-1">
                      <span>Events: {wh.events.join(', ')}</span>
                      <span>• Secret: {wh.secretKeyMasked}</span>
                      <span>• Delivered 24h: {wh.totalDelivered24h.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleTriggerWebhookTest(wh.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Trigger Test Payload</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Logs & DLQ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Delivery History & DLQ Status</h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Event Type</th>
                    <th className="p-3.5">Target Endpoint</th>
                    <th className="p-3.5">Status & Code</th>
                    <th className="p-3.5">Duration</th>
                    <th className="p-3.5">HMAC Signature</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {webhookLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {new Date(log.timestampIso).toLocaleTimeString()}
                      </td>
                      <td className="p-3.5 font-bold text-amber-400 font-mono">
                        {log.eventType}
                      </td>
                      <td className="p-3.5 font-mono text-slate-300 text-[11px] max-w-[200px] truncate">
                        {log.targetUrl}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {log.status} ({log.statusCode})
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-300">{log.deliveryDurationMs} ms</td>
                      <td className="p-3.5 font-mono text-[10px] text-slate-400 max-w-[150px] truncate">
                        {log.signatureHeader}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleReplayWebhook(log.id)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 text-[10px] font-bold flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Replay</span>
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

      {/* --- TAB 4: PLUGIN MARKETPLACE --- */}
      {activeTab === 'plugins' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                <span>Plugin & Extensibility Framework</span>
              </h3>
              <p className="text-xs text-slate-400">
                Modular ecosystem plugins for Marketplace Export, AI Pricing, Carrier Logistics, and Security Policy Auditing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plugins.map(plug => (
              <div key={plug.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center font-bold">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{plug.name}</h4>
                        <span className="text-[10px] text-slate-400">v{plug.version} • By {plug.author}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 text-[10px] font-bold uppercase">
                      {plug.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{plug.description}</p>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Required Scope Permissions</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {plug.permissions.map(perm => (
                        <span key={perm} className="px-2 py-0.5 rounded bg-slate-950 text-purple-300 text-[10px] font-mono border border-slate-800">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    {plug.updateAvailable && (
                      <button
                        onClick={() => handleUpdatePlugin(plug.id)}
                        className="text-[10px] text-amber-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Update Available to v{plug.latestVersion}</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleTogglePlugin(plug.id)}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      plug.enabled
                        ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                    }`}
                  >
                    {plug.enabled ? 'Disable Plugin' : 'Enable Plugin'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: INTERACTIVE DEVELOPER PORTAL & API EXPLORER --- */}
      {activeTab === 'portal' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                <span>Sandboxed Developer Playground & Integration Sandbox</span>
              </h3>
              <p className="text-xs text-slate-400">
                Execute live API Request Testing payloads against PiNova developer endpoints, perform Pi SDK v2 Integration Testing & Pi Platform API Integration Testing, and achieve complete SDK Integration Validation.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                Pi SDK v2 Integration Testing
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800">
                Pi Platform API Integration Testing
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                SDK Integration Validation
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Sandbox Purpose Disclaimer:</strong> The Developer Integration Sandbox is provided solely for application development, API integration testing, and SDK validation. It does not execute smart contracts, on-chain contract deployments, or official Pi Network blockchain operations.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Request Builder */}
            <div className="lg:col-span-6 space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <span>API Request Testing Engine</span>
              </h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Endpoint Path</label>
                  <div className="flex gap-2">
                    <select
                      value={apiTestMethod}
                      onChange={e => setApiTestMethod(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white"
                    >
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                      <option value="PUT">PUT</option>
                    </select>
                    <input
                      type="text"
                      value={apiTestPath}
                      onChange={e => setApiTestPath(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Request Headers (JSON)</label>
                  <textarea
                    rows={3}
                    value={apiTestHeaders}
                    onChange={e => setApiTestHeaders(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Request Body (JSON Payload)</label>
                  <textarea
                    rows={4}
                    value={apiTestBody}
                    onChange={e => setApiTestBody(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={handleRunApiTest}
                  disabled={isExecutingApiTest}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2"
                >
                  {isExecutingApiTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Executing API Request...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Execute API Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response Viewer & Code Snippets */}
            <div className="lg:col-span-6 space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Response Output</span>
                  </h4>
                  {apiTestResult && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                      HTTP {apiTestResult.statusCode} {apiTestResult.statusText} ({apiTestResult.responseTimeMs}ms)
                    </span>
                  )}
                </div>

                {apiTestResult ? (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase font-bold block">Response Headers</span>
                      {Object.entries(apiTestResult.responseHeaders).map(([k, v]) => (
                        <div key={k} className="text-slate-400 text-[10px]">
                          <span className="text-purple-400">{k}:</span> {String(v)}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase font-bold block">Response Payload Body</span>
                      <pre className="text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(apiTestResult.responseBody, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                    <Terminal className="w-8 h-8 text-slate-700 mx-auto" />
                    <p>Click "Execute API Request" to test endpoint routing in real-time.</p>
                  </div>
                )}
              </div>

              {/* Code Generator Tab */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">SDK Code Snippet Generator</span>
                  <div className="flex gap-1">
                    {(['typescript', 'python', 'curl'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setSelectedSdkTab(lang)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          selectedSdkTab === lang ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-purple-300 overflow-x-auto">
                  {selectedSdkTab === 'typescript' && (
                    <pre>{`import { PiNovaSDK } from '@pinova/sdk-v2';

const pinova = new PiNovaSDK({ apiKey: process.env.PINOVA_API_KEY });
const response = await pinova.payments.verify({
  paymentId: "pi_tx_99812401",
  amountPi: 12.5
});`}</pre>
                  )}
                  {selectedSdkTab === 'python' && (
                    <pre>{`from pinova import PiNovaClient

client = PiNovaClient(api_key="pn_live_pk_demo8841")
response = client.payments.verify(
    payment_id="pi_tx_99812401",
    amount_pi=12.5
)`}</pre>
                  )}
                  {selectedSdkTab === 'curl' && (
                    <pre>{`curl -X POST https://api.pinova.app/api/v2/pi/payments/verify \\
  -H "Authorization: Bearer pn_live_pk_demo8841" \\
  -H "Content-Type: application/json" \\
  -d '{"paymentId":"pi_tx_99812401","amountPi":12.5}'`}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 6: CONFIGURATION & FEATURE FLAGS --- */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Centralized Configuration & Feature Flags</span>
              </h3>
              <p className="text-xs text-slate-400">
                Control runtime environment profiles, feature toggles, HMAC headers, and system preferences.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Feature Flags Toggle Matrix</h4>
            <div className="space-y-3">
              {featureFlags.map(flag => (
                <div key={flag.key} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 text-xs font-bold">{flag.key}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {flag.moduleTarget}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">{flag.name}</div>
                    <p className="text-xs text-slate-400">{flag.description}</p>
                  </div>

                  <button
                    onClick={() => handleToggleFeatureFlag(flag.key)}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      flag.enabled
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {flag.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 7: EVENT BUS & WORKFLOWS --- */}
      {activeTab === 'event_bus' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400" />
                <span>Enterprise Event Bus & Background Jobs Queue</span>
              </h3>
              <p className="text-xs text-slate-400">
                Publish-subscribe event stream, job processing queues, retry policies, and workflow triggers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Event Stream */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>Published System Event Stream</span>
              </h4>
              <div className="space-y-3">
                {eventMessages.map(msg => (
                  <div key={msg.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-amber-400">{msg.topic}</span>
                      <span className="text-[10px] text-slate-500">{new Date(msg.publishedIso).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-slate-300">{msg.payloadSummary}</p>
                    <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                      <span>Source: {msg.sourceModule}</span>
                      <span>Subscribers: {msg.subscribersCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Jobs Queue */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Background Processing Queue Status</span>
              </h4>
              <div className="space-y-3">
                {backgroundJobs.map(job => (
                  <div key={job.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{job.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          job.status === 'RUNNING'
                            ? 'bg-purple-950 text-purple-400 border border-purple-800'
                            : job.status === 'SCHEDULED'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full transition-all duration-500"
                        style={{ width: `${job.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Queue: {job.queue}</span>
                      <span>Attempts: {job.attempts}/{job.maxAttempts}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 8: OBSERVABILITY & SLA --- */}
      {activeTab === 'observability' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span>Observability, Telemetry & SLA Compliance</span>
              </h3>
              <p className="text-xs text-slate-400">
                Real-time API latency breakdown, SLA tracking, error budgets, and system health metrics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block uppercase">Gateway SLA Compliance</span>
              <div className="text-3xl font-black text-emerald-400">99.98%</div>
              <p className="text-[11px] text-slate-400">Exceeds target 99.90% SLA commitment across 6 endpoints.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block uppercase">Average Latency (P99)</span>
              <div className="text-3xl font-black text-purple-300">42 ms</div>
              <p className="text-[11px] text-slate-400">Optimized via in-memory cached configuration layers.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block uppercase">Error Budget Remaining</span>
              <div className="text-3xl font-black text-amber-400">98.4%</div>
              <p className="text-[11px] text-slate-400">Zero catastrophic outage incidents recorded in 30 days.</p>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 9: DEVELOPER API KEYS & AUDIT GOVERNANCE --- */}
      {activeTab === 'access_security' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <span>API Keys, OAuth Clients & Audit Governance</span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage developer credentials with granular scopes, secret revocation, and export immutable audit records.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateKeyModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Generate API Key</span>
              </button>
              <button
                onClick={handleExportAuditCSV}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>

          {/* API Keys Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Developer API Keys</h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Key Name</th>
                    <th className="p-3.5">Masked Key</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Rate Limit</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {apiKeys.map(key => (
                    <tr key={key.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-bold text-white">{key.name}</td>
                      <td className="p-3.5 font-mono text-purple-300">{key.maskedKey}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                          {key.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-amber-400 font-bold">{key.rateLimitPerMin} / min</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            key.status === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {key.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {key.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevokeKey(key.id)}
                            className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold border border-rose-800"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Developer Audit & Governance Log</h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Actor</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Module & Integration</th>
                    <th className="p-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {filteredAuditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-bold text-white">{log.actorUsername}</td>
                      <td className="p-3.5 font-mono text-purple-300 font-bold">{log.action}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-200">{log.module}</div>
                        <div className="text-[10px] text-slate-400">{log.integration}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 text-[11px] max-w-xs truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Generate API Key Modal */}
      {isCreateKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              <span>Generate New Developer API Key</span>
            </h3>

            <form onSubmit={handleCreateKeySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Key Identifier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Shipping Service Gateway Key"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Role & Access Scope</label>
                <select
                  value={newKeyRole}
                  onChange={e => setNewKeyRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="FULL_DEVELOPER">Full Developer (Read & Write)</option>
                  <option value="READ_ONLY">Read Only Streamer</option>
                  <option value="ADMIN_INTEGRATION">Admin Integration (High Throughput)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateKeyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
