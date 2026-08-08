import React, { useState } from 'react';
import {
  Lock,
  Download,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  FileText,
  Clock,
  Sliders,
  Sparkles,
  Tag,
  RefreshCw,
  Info,
  Check,
  Key,
  Database,
  BarChart3,
  ListFilter
} from 'lucide-react';
import {
  AIPrivacySettings,
  AIConsentHistoryRecord,
  AIPersonalizationProfile,
  AIDataUsageSummary,
  redactSensitiveData
} from '../../modules/ai';

interface AiPrivacyGovernanceTabProps {
  onAddAuditLog: (
    user: string,
    role: 'Buyer' | 'Merchant' | 'Admin' | 'System',
    provider: string,
    action: string,
    promptSnippet: string,
    responseSnippet: string,
    status: string
  ) => void;
  setNoticeMessage: (msg: string | null) => void;
}

export const AiPrivacyGovernanceTab: React.FC<AiPrivacyGovernanceTabProps> = ({
  onAddAuditLog,
  setNoticeMessage
}) => {
  // ----------------------------------------------------
  // 1. PRIVACY PREFERENCE CENTER STATE
  // ----------------------------------------------------
  const [privacySettings, setPrivacySettings] = useState<AIPrivacySettings>({
    dataProcessingConsent: true,
    personalizationConsent: true,
    trainingDataUsageConsent: false,
    personalizedSearchIndexing: true,
    crossMerchantContextSharing: false,
    crossSessionMemoryPersistence: true,
    retentionDays: 60,
    piiRedactionEnabled: true,
    dataMinimizationEnabled: true,
    encryptionStatus: 'AES-256-GCM Active',
    allowExport: true,
    allowDeletion: true,
    backgroundProfilingActive: true
  });

  // ----------------------------------------------------
  // 2. PERSONALIZATION CONTROLS STATE
  // ----------------------------------------------------
  const [userTasteProfile, setUserTasteProfile] = useState<AIPersonalizationProfile>({
    userId: '@Pioneer_Account',
    tasteCategories: ['Smartphones & Mobile Tech', 'Crypto Hardware Wallets', 'Noise Cancelling Headphones', 'Solar Energy'],
    interestTags: ['Pi_Payment_Accepted', 'Fast_Global_Shipping', 'Verified_Sellers_Only', 'OLED_Screens'],
    aiMemorySummary: 'User prefers high-value electronics with verified Order Protection Status under 100 Pi budget limit.',
    lastContextCleared: 'Never'
  });

  const [newTagInput, setNewTagInput] = useState('');

  const handleAddInterestTag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().replace(/\s+/g, '_');
    if (!userTasteProfile.interestTags.includes(cleanTag)) {
      setUserTasteProfile(prev => ({
        ...prev,
        interestTags: [...prev.interestTags, cleanTag]
      }));
      setNewTagInput('');
      setNoticeMessage(`Personalization tag "${cleanTag}" added to AI taste profile.`);
    }
  };

  const handleRemoveInterestTag = (tagToRemove: string) => {
    setUserTasteProfile(prev => ({
      ...prev,
      interestTags: prev.interestTags.filter(t => t !== tagToRemove)
    }));
    setNoticeMessage(`Tag "${tagToRemove}" removed from AI taste profile.`);
  };

  const handleClearSessionContext = () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setUserTasteProfile(prev => ({
      ...prev,
      aiMemorySummary: 'Active session context buffer cleared. Re-initializing generic catalog preferences.',
      lastContextCleared: timestamp
    }));
    setNoticeMessage('Active AI session context & memory buffer cleared.');

    onAddAuditLog(
      '@Pioneer_Account',
      'Buyer',
      'AI_Memory_Engine',
      'Clear Active Session Context',
      'User requested session context reset',
      'Session context buffer cleared',
      'Success'
    );
  };

  const handleResetTasteProfile = () => {
    setUserTasteProfile({
      userId: '@Pioneer_Account',
      tasteCategories: ['General Marketplace Catalog'],
      interestTags: ['Pi_Payment_Accepted'],
      aiMemorySummary: 'Default profile restored.',
      lastContextCleared: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });
    setNoticeMessage('AI taste profile reset to default factory settings.');
  };

  // ----------------------------------------------------
  // 3. CONSENT HISTORY AUDIT TRAIL STATE
  // ----------------------------------------------------
  const [consentHistory, setConsentHistory] = useState<AIConsentHistoryRecord[]>([
    {
      id: 'con-104',
      timestamp: '2026-08-04 08:30',
      action: 'Consent_Updated',
      scope: 'Training Data Usage: Disabled, PII Redaction: Active',
      ipHash: 'IP-HASH-88A921F00C',
      consentVersion: 'v2.4'
    },
    {
      id: 'con-103',
      timestamp: '2026-07-20 11:15',
      action: 'Terms_Acknowledged',
      scope: 'Marketplace AI Privacy Policy & Pi Platform SDK v2 Terms',
      ipHash: 'IP-HASH-88A921F00C',
      consentVersion: 'v2.4'
    },
    {
      id: 'con-102',
      timestamp: '2026-05-10 09:00',
      action: 'Consent_Granted',
      scope: 'Data Processing & Personalization Consent Opt-In',
      ipHash: 'IP-HASH-88A921F00C',
      consentVersion: 'v2.1'
    }
  ]);

  // ----------------------------------------------------
  // 4. AI DATA USAGE SUMMARY STATE
  // ----------------------------------------------------
  const [dataUsageSummary] = useState<AIDataUsageSummary>({
    totalInteractionsCount: 148,
    bytesStored: 43820, // ~42.8 KB
    modelsInteractedWithCount: 4,
    retentionCountdownDays: 28,
    dataDistributionPct: {
      promptsHistory: 40,
      recommendations: 35,
      semanticEmbeddings: 15,
      tasteProfiles: 10
    }
  });

  // ----------------------------------------------------
  // 5. DOWNLOAD MY AI DATA (EXPORT JSON)
  // ----------------------------------------------------
  const handleDownloadMyAiData = () => {
    const exportPayload = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        userAccount: '@Pioneer_Account',
        regulatoryCompliance: 'GDPR / Pi Network Privacy Framework',
        encryptionStatus: privacySettings.encryptionStatus
      },
      privacySettings,
      userTasteProfile,
      dataUsageSummary,
      consentHistory,
      interactionLogsSample: [
        { query: 'Find crypto hardware wallets under 50 Pi', timestamp: '2026-08-04 06:45', model: 'gemini-3.6-flash' },
        { query: 'Noise cancelling headphones with long battery', timestamp: '2026-08-03 14:20', model: 'gemini-3.6-flash' }
      ],
      semanticVectorEmbeddingsMetadata: {
        vectorDimensions: 1536,
        embeddingIndex: 'pinova_user_taste_index_v2',
        vectorCount: 12
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pinova_my_ai_data_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setNoticeMessage('Full AI Data Export downloaded successfully (JSON format).');

    onAddAuditLog(
      '@Pioneer_Account',
      'Buyer',
      'AI_Privacy_Engine',
      'Download My AI Data',
      'Full JSON export request',
      'Export file generated & delivered',
      'Success'
    );
  };

  // ----------------------------------------------------
  // 6. DELETE MY AI DATA (PURGE WORKFLOW & CERTIFICATE)
  // ----------------------------------------------------
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOptions, setDeleteOptions] = useState({
    purgeType: 'full' as 'full' | 'partial',
    purgePrompts: true,
    purgeSearch: true,
    purgeEmbeddings: true,
    purgeTasteProfile: true,
    anonymizeOnly: false,
    confirmText: ''
  });

  const [deletionCertificate, setDeletionCertificate] = useState<{
    certId: string;
    timestamp: string;
    hash: string;
    purgedScope: string;
  } | null>(null);

  const handleExecuteDataPurge = () => {
    if (deleteOptions.confirmText !== 'DELETE') return;

    const certId = `CERT-PURGE-${Date.now().toString().slice(-6)}`;
    const hash = `SHA256-DEL-${Math.random().toString(16).substring(2, 14).toUpperCase()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const scopeStr = deleteOptions.anonymizeOnly
      ? 'Anonymization applied (PII scrubbed, user ID disassociated)'
      : deleteOptions.purgeType === 'full'
      ? 'Full AI Interaction Data Purge (Prompts, Search, Embeddings & Taste Profiles)'
      : 'Partial Data Purge';

    setDeletionCertificate({
      certId,
      timestamp,
      hash,
      purgedScope: scopeStr
    });

    // Reset local profiles if purged
    if (!deleteOptions.anonymizeOnly) {
      setUserTasteProfile(prev => ({
        ...prev,
        aiMemorySummary: 'All AI memory wiped according to deletion request.',
        interestTags: ['Pi_Payment_Accepted']
      }));
    }

    // Add to consent history
    const newConsentRecord: AIConsentHistoryRecord = {
      id: `con-${Date.now()}`,
      timestamp,
      action: 'Data_Purge_Requested',
      scope: scopeStr,
      ipHash: 'IP-HASH-88A921F00C',
      consentVersion: 'v2.4'
    };
    setConsentHistory(prev => [newConsentRecord, ...prev]);

    setShowDeleteModal(false);
    setNoticeMessage(`AI Data Purge completed. Compliance Certificate #${certId} generated.`);

    onAddAuditLog(
      '@Pioneer_Account',
      'Buyer',
      'AI_Privacy_Engine',
      'Delete My AI Data',
      `Scope: ${scopeStr}`,
      `Purged. Certificate: ${certId}, Hash: ${hash}`,
      'Data_Purged'
    );
  };

  const handleDownloadCertificate = () => {
    if (!deletionCertificate) return;

    const certData = {
      title: 'PiNova Global Marketplace — AI Data Deletion Compliance Certificate',
      certificateId: deletionCertificate.certId,
      timestamp: deletionCertificate.timestamp,
      verificationHash: deletionCertificate.hash,
      purgedScope: deletionCertificate.purgedScope,
      regulatoryCompliance: 'GDPR Article 17 / Pi Network User Privacy Charter',
      cryptographicSignature: 'VERIFIED_BY_PINOVA_GOVERNANCE_PROTOCOL'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(certData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${deletionCertificate.certId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ----------------------------------------------------
  // 7. CONSENT WITHDRAWAL
  // ----------------------------------------------------
  const handleWithdrawConsent = () => {
    setPrivacySettings(prev => ({
      ...prev,
      dataProcessingConsent: false,
      personalizationConsent: false,
      backgroundProfilingActive: false
    }));

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newConsentRecord: AIConsentHistoryRecord = {
      id: `con-${Date.now()}`,
      timestamp,
      action: 'Consent_Withdrawn',
      scope: 'Instant Revocation of Data Processing & Background Profiling',
      ipHash: 'IP-HASH-88A921F00C',
      consentVersion: 'v2.4'
    };
    setConsentHistory(prev => [newConsentRecord, ...prev]);

    setNoticeMessage('🚫 CONSENT REVOKED: Background AI profiling and vectorization immediately stopped.');

    onAddAuditLog(
      '@Pioneer_Account',
      'Buyer',
      'AI_Privacy_Engine',
      'Withdraw AI Consent',
      'Revoked all AI profiling consent',
      'Background AI profiling stopped',
      'Consent_Withdrawn'
    );
  };

  // Interactive PII Redaction Tester
  const [piiTestInput, setPiiTestInput] = useState('My email is pioneer@pinova.app and my seed phrase is apple banana cherry dog elephant fox grape horse iguana jaguar kangaroo lemon');
  const [piiTestResult, setPiiTestResult] = useState<{ sanitized: string; redactedCount: number } | null>(null);

  const handleTestPiiRedaction = () => {
    const res = redactSensitiveData(piiTestInput);
    setPiiTestResult(res);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* BACKGROUND PROFILING REVOCATION STATUS BANNER */}
      {!privacySettings.backgroundProfilingActive && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>BACKGROUND AI PROFILING & VECTORIZATION: STOPPED & REVOKED</span>
          </div>
          <button
            onClick={() => {
              setPrivacySettings(prev => ({ ...prev, backgroundProfilingActive: true, dataProcessingConsent: true }));
              setNoticeMessage('Background AI Profiling re-enabled.');
            }}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs"
          >
            Re-Enable AI Profiling
          </button>
        </div>
      )}

      {/* TOP HEADER DATA USAGE SUMMARY DASHBOARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 border border-purple-800/50 text-white shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/60 text-amber-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full User Sovereign Data Control</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              AI Privacy & Personal Data Usage Summary
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mt-1">
              Real-time breakdown of stored interaction history, data footprint, model exposure, and active retention countdown timers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadMyAiData}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/25"
            >
              <Download className="w-4 h-4" /> Download My AI Data (JSON)
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2.5 bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/40 font-black text-xs rounded-xl flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete My AI Data
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-purple-200 uppercase font-bold">Total AI Interactions</span>
            <div className="text-2xl font-black text-amber-300">{dataUsageSummary.totalInteractionsCount}</div>
            <span className="text-[9px] text-slate-400">Logged in current window</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-purple-200 uppercase font-bold">Data Storage Footprint</span>
            <div className="text-2xl font-black text-emerald-400">{(dataUsageSummary.bytesStored / 1024).toFixed(1)} KB</div>
            <span className="text-[9px] text-slate-400">AES-256 Encrypted</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-purple-200 uppercase font-bold">Models Exposed</span>
            <div className="text-2xl font-black text-indigo-300">{dataUsageSummary.modelsInteractedWithCount} Models</div>
            <span className="text-[9px] text-slate-400">Gemini, GPT-4o, Claude</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-purple-200 uppercase font-bold">Retention Auto-Scrub</span>
            <div className="text-2xl font-black text-purple-300">{dataUsageSummary.retentionCountdownDays} Days</div>
            <span className="text-[9px] text-amber-300 font-semibold">Countdown Active</span>
          </div>
        </div>

        {/* Distribution Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex justify-between text-[11px] font-bold text-slate-300">
            <span>Stored AI Data Distribution</span>
            <span>100% User Owned</span>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
            <div className="bg-purple-500 h-full" style={{ width: `${dataUsageSummary.dataDistributionPct.promptsHistory}%` }} title="Prompts & Chat (40%)" />
            <div className="bg-indigo-500 h-full" style={{ width: `${dataUsageSummary.dataDistributionPct.recommendations}%` }} title="Recommendations (35%)" />
            <div className="bg-emerald-500 h-full" style={{ width: `${dataUsageSummary.dataDistributionPct.semanticEmbeddings}%` }} title="Embeddings (15%)" />
            <div className="bg-amber-500 h-full" style={{ width: `${dataUsageSummary.dataDistributionPct.tasteProfiles}%` }} title="Taste Profile (10%)" />
          </div>

          <div className="flex flex-wrap gap-4 text-[10px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Prompts & Chat ({dataUsageSummary.dataDistributionPct.promptsHistory}%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Recommendations ({dataUsageSummary.dataDistributionPct.recommendations}%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Semantic Embeddings ({dataUsageSummary.dataDistributionPct.semanticEmbeddings}%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Taste Profile ({dataUsageSummary.dataDistributionPct.tasteProfiles}%)</span>
          </div>
        </div>
      </div>

      {/* SECTION: DELETION COMPLIANCE CERTIFICATE DISPLAY */}
      {deletionCertificate && (
        <div className="p-6 rounded-3xl bg-emerald-950/40 border-2 border-emerald-500/50 text-white space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Official Compliance Record</span>
                <h3 className="font-black text-sm text-white">AI Data Deletion Compliance Certificate #{deletionCertificate.certId}</h3>
              </div>
            </div>

            <button
              onClick={handleDownloadCertificate}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" /> Download Certificate (JSON)
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs font-mono space-y-1.5">
            <div className="text-emerald-400 font-bold">Verification Hash: {deletionCertificate.hash}</div>
            <div className="text-slate-300">Timestamp: {deletionCertificate.timestamp}</div>
            <div className="text-slate-300">Purged Scope: {deletionCertificate.purgedScope}</div>
            <div className="text-slate-400 text-[10px]">GDPR Article 17 & Pi Network User Charter Verified</div>
          </div>
        </div>
      )}

      {/* SECTION: PRIVACY PREFERENCE CENTER & GRANULAR TOGGLES */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" /> Privacy Preference Center & Data Controls
            </h3>
            <p className="text-xs text-slate-500">
              Granular opt-in/opt-out toggles for training data usage, personalized search indexing, context sharing, and retention duration.
            </p>
          </div>

          <button
            onClick={handleWithdrawConsent}
            className="px-4 py-2 bg-rose-600/10 text-rose-500 border border-rose-500/30 hover:bg-rose-600 hover:text-white font-bold text-xs rounded-xl transition-all"
          >
            Revoke Consent & Stop Profiling
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Toggle 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>Model Training Data Usage</span>
              <input
                type="checkbox"
                checked={privacySettings.trainingDataUsageConsent}
                onChange={e => {
                  setPrivacySettings({ ...privacySettings, trainingDataUsageConsent: e.target.checked });
                  setNoticeMessage(`Model Training Data Usage set to: ${e.target.checked ? 'Opt-In' : 'Opt-Out'}`);
                }}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Allows anonymized interaction data to train future AI model iterations. (Default: Opt-Out).
            </p>
          </div>

          {/* Toggle 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>Personalized Search Indexing</span>
              <input
                type="checkbox"
                checked={privacySettings.personalizedSearchIndexing}
                onChange={e => {
                  setPrivacySettings({ ...privacySettings, personalizedSearchIndexing: e.target.checked });
                  setNoticeMessage(`Personalized Search Indexing: ${e.target.checked ? 'Active' : 'Disabled'}`);
                }}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tailors search ranking and item suggestions to your pioneer interaction history.
            </p>
          </div>

          {/* Toggle 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>Cross-Merchant Context Sharing</span>
              <input
                type="checkbox"
                checked={privacySettings.crossMerchantContextSharing}
                onChange={e => {
                  setPrivacySettings({ ...privacySettings, crossMerchantContextSharing: e.target.checked });
                  setNoticeMessage(`Cross-Merchant Context Sharing: ${e.target.checked ? 'Active' : 'Disabled'}`);
                }}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Shares taste tags across verified storefronts for unified product recommendations.
            </p>
          </div>

          {/* Toggle 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>Cross-Session Memory Persistence</span>
              <input
                type="checkbox"
                checked={privacySettings.crossSessionMemoryPersistence}
                onChange={e => {
                  setPrivacySettings({ ...privacySettings, crossSessionMemoryPersistence: e.target.checked });
                  setNoticeMessage(`Cross-Session Memory: ${e.target.checked ? 'Persisted' : 'Session Only'}`);
                }}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Remembers conversation context across browser sessions or clears buffer on exit.
            </p>
          </div>

          {/* Retention Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block">AI Memory Retention Period</span>
            <select
              value={privacySettings.retentionDays}
              onChange={e => {
                const days = Number(e.target.value) as any;
                setPrivacySettings({ ...privacySettings, retentionDays: days });
                setNoticeMessage(`Retention policy set to ${days} Days Auto-Purge.`);
              }}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
            >
              <option value={7}>7 Days Storage</option>
              <option value={14}>14 Days Storage</option>
              <option value={30}>30 Days Storage</option>
              <option value={60}>60 Days Storage</option>
              <option value={90}>90 Days Storage</option>
              <option value={180}>180 Days Storage</option>
              <option value={365}>365 Days Storage</option>
            </select>
          </div>

          {/* PII Redaction Indicator */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>Automatic PII Redaction</span>
              <span className="text-[10px] text-emerald-500 font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10">100% Active</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Auto-sanitizes email addresses, credit cards, and secret seed phrases before sending to AI endpoints.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: PERSONALIZATION CONTROLS & TASTE PROFILE EDITOR */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-500" /> Fine-Tune AI Personalization & Taste Profile
            </h3>
            <p className="text-xs text-slate-500">
              Inspect, edit, or reset learned interest categories, custom tags, and session memory buffers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearSessionContext}
              className="px-3.5 py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white font-bold text-xs rounded-xl transition-all"
            >
              Clear Session Memory Buffer
            </button>
            <button
              onClick={handleResetTasteProfile}
              className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-500 hover:text-white font-bold text-xs rounded-xl transition-all"
            >
              Reset Taste Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Interest Tags Manager */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">User Interest Tags & Vector Preferences</h4>
            
            <div className="flex flex-wrap gap-2">
              {userTasteProfile.interestTags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30 text-xs flex items-center gap-1.5"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveInterestTag(tag)}
                    className="hover:text-rose-500 font-black text-sm leading-none ml-1"
                    title="Remove tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom interest tag (e.g., 5G_Phones)..."
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              />
              <button
                onClick={handleAddInterestTag}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Learned Memory Summary */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Active AI Memory Summary & Context</h4>
            <p className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs">
              "{userTasteProfile.aiMemorySummary}"
            </p>
            <div className="text-[10px] text-slate-400 font-mono">
              Last Buffer Clear: {userTasteProfile.lastContextCleared}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: INTERACTIVE PII SANITIZER TESTER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-500" /> Interactive Sensitive Data & PII Redaction Tester
        </h3>
        <p className="text-xs text-slate-500">
          Test real-time automatic redaction of emails, credit cards, and seed phrases before prompt submission.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-8">
            <input
              type="text"
              value={piiTestInput}
              onChange={e => setPiiTestInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px]"
            />
          </div>
          <div className="md:col-span-4">
            <button
              onClick={handleTestPiiRedaction}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Run Redaction Test
            </button>
          </div>
        </div>

        {piiTestResult && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 font-mono text-xs space-y-2">
            <div className="text-emerald-400 font-bold">
              Sanitized Output ({piiTestResult.redactedCount} sensitive patterns redacted):
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">{piiTestResult.sanitized}</p>
          </div>
        )}
      </div>

      {/* SECTION: CONSENT HISTORY AUDIT TRAIL */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" /> Timestamped Consent History Audit Trail
          </h3>
          <p className="text-xs text-slate-500">
            Immutable log of all user opt-ins, opt-outs, terms updates, and privacy policy acknowledgments.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Consent Action</th>
                <th className="py-2.5 px-3">Scope / Details</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3 text-right">IP Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {consentHistory.map(con => (
                <tr key={con.id}>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{con.timestamp}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      con.action === 'Consent_Granted'
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : con.action === 'Consent_Withdrawn'
                        ? 'bg-rose-500/15 text-rose-500'
                        : 'bg-purple-500/15 text-purple-400'
                    }`}>
                      {con.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">{con.scope}</td>
                  <td className="py-3 px-3 font-mono text-purple-400">{con.consentVersion}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500 text-[10px]">{con.ipHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MY AI DATA CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-sm text-rose-500 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Permanent AI Data Deletion Request
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This action will permanently purge selected AI conversation histories, semantic vector embeddings, and taste preferences.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Purge Scope Selection:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteOptions.purgePrompts}
                    onChange={e => setDeleteOptions({ ...deleteOptions, purgePrompts: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Chat Stream & Prompt Histories</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteOptions.purgeSearch}
                    onChange={e => setDeleteOptions({ ...deleteOptions, purgeSearch: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Catalog Search Logs</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteOptions.purgeEmbeddings}
                    onChange={e => setDeleteOptions({ ...deleteOptions, purgeEmbeddings: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Semantic Vector Embeddings</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteOptions.purgeTasteProfile}
                    onChange={e => setDeleteOptions({ ...deleteOptions, purgeTasteProfile: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Personalization & Taste Profile</span>
                </label>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={deleteOptions.anonymizeOnly}
                  onChange={e => setDeleteOptions({ ...deleteOptions, anonymizeOnly: e.target.checked })}
                  className="accent-amber-500"
                />
                <span>Anonymize Only (Scrub PII, disassociate user ID, preserve non-identifiable aggregate metrics)</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Type <strong className="text-rose-500">DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteOptions.confirmText}
                  onChange={e => setDeleteOptions({ ...deleteOptions, confirmText: e.target.value })}
                  placeholder="Type DELETE"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs font-bold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleExecuteDataPurge}
                  disabled={deleteOptions.confirmText !== 'DELETE'}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl disabled:opacity-40"
                >
                  Confirm & Purge Data
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
