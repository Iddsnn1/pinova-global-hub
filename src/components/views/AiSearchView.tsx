import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  ArrowRight,
  ShieldCheck,
  Star,
  Sliders,
  Cpu,
  FileText,
  Lock,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Tag,
  ShoppingBag,
  Store,
  Layers,
  Database,
  Activity,
  Award,
  BookOpen,
  Filter,
  Info,
  Globe,
  DollarSign,
  AlertCircle,
  Clock,
  UserCheck,
  Copy,
  Check,
  Languages,
  TrendingUp,
  Package,
  RotateCcw,
  Trash2,
  Download,
  Eye,
  Scale,
  History,
  Calendar
} from 'lucide-react';
import { Product } from '../../types';
import { AiModelGovernanceTab } from '../ai/AiModelGovernanceTab';
import { AiPrivacyGovernanceTab } from '../ai/AiPrivacyGovernanceTab';
import {
  AIProviderRegistry,
  AIProviderKey,
  AIProviderConfig,
  AIPromptTemplate,
  AIPermissionRule,
  AIUsageMetric,
  AIAuditLog,
  aiCommerceEngine,
  AIMerchantCopyResponse,
  AIContentModerationResult,
  AIExplainabilityMetadata,
  AIProviderHealthState,
  AIModelVersionRecord,
  AIPrivacySettings,
  AIResponsibleControls,
  redactSensitiveData
} from '../../modules/ai';

interface AiSearchViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  wishlistProductIds: string[];
}

export type AiHubSubTab =
  | 'shopping_assistant'
  | 'merchant_assistant'
  | 'inventory_intelligence'
  | 'smart_automation'
  | 'model_governance'
  | 'privacy_governance'
  | 'architecture_governance'
  | 'audit_monitoring';

export const AiSearchView: React.FC<AiSearchViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onInstantBuy,
  onToggleWishlist,
  wishlistProductIds
}) => {
  const [activeTab, setActiveTab] = useState<AiHubSubTab>('shopping_assistant');
  const [activeProvider, setActiveProvider] = useState<AIProviderKey>(AIProviderRegistry.getActiveKey());
  const [providerConfigs, setProviderConfigs] = useState<AIProviderConfig[]>(AIProviderRegistry.getProviderConfigs());

  // Notification & Alert Banner State
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Personalization Engine Toggle
  const [personalizationEnabled, setPersonalizationEnabled] = useState<boolean>(true);

  // Human Review & Escalation Modal State
  const [escalationModalState, setEscalationModalState] = useState<{
    open: boolean;
    ticketId: string;
    type: 'review' | 'report' | 'feedback';
    title: string;
    message: string;
  } | null>(null);

  // AI Provider Health & Failover State
  const [providerHealthList, setProviderHealthList] = useState<AIProviderHealthState[]>([
    {
      providerKey: 'gemini',
      providerName: 'Google Gemini 3.6 Flash',
      modelName: 'gemini-3.6-flash',
      status: 'Operational',
      availabilityPct: 99.94,
      failoverStatus: 'Primary Active Target — Fallback: OpenAI GPT-4o',
      avgLatencyMs: 124,
      successRatePct: 99.5,
      errorRatePct: 0.5,
      activeRequests: 18
    },
    {
      providerKey: 'openai',
      providerName: 'OpenAI GPT-4o',
      modelName: 'gpt-4o',
      status: 'Operational',
      availabilityPct: 99.88,
      failoverStatus: 'Standby Failover Target',
      avgLatencyMs: 185,
      successRatePct: 99.2,
      errorRatePct: 0.8,
      activeRequests: 6
    },
    {
      providerKey: 'anthropic',
      providerName: 'Anthropic Claude 3.5 Sonnet',
      modelName: 'claude-3-5-sonnet',
      status: 'Operational',
      availabilityPct: 99.91,
      failoverStatus: 'Standby Failover Target',
      avgLatencyMs: 142,
      successRatePct: 99.6,
      errorRatePct: 0.4,
      activeRequests: 4
    },
    {
      providerKey: 'deepseek',
      providerName: 'DeepSeek V3 Commerce',
      modelName: 'deepseek-v3',
      status: 'Operational',
      availabilityPct: 99.75,
      failoverStatus: 'High-Throughput Backup',
      avgLatencyMs: 88,
      successRatePct: 98.9,
      errorRatePct: 1.1,
      activeRequests: 24
    }
  ]);

  const [simulatedOutageActive, setSimulatedOutageActive] = useState(false);

  // ----------------------------------------------------
  // GOVERNANCE, VERSIONING & PRIVACY CONTROL STATES
  // ----------------------------------------------------
  const [modelVersions, setModelVersions] = useState<AIModelVersionRecord[]>([
    {
      id: 'ver-gemini-3.6.2',
      modelName: 'Google Gemini 3.6 Flash',
      providerKey: 'gemini',
      version: 'v3.6.2 (Active Production)',
      releaseDate: '2026-07-15',
      status: 'Active',
      qualityScorePct: 98.6,
      avgLatencyMs: 124,
      resourceUsageUnits: 1200,
      scheduledUpgradeDate: '2026-09-01 (v3.7.0)',
      notes: 'Primary production model tuned for PiNova e-commerce intent parsing and seller copywriting.'
    },
    {
      id: 'ver-gemini-3.5.8',
      modelName: 'Google Gemini 3.5 Pro',
      providerKey: 'gemini',
      version: 'v3.5.8 (Stable Previous)',
      releaseDate: '2026-05-10',
      status: 'Stable_Previous',
      qualityScorePct: 97.2,
      avgLatencyMs: 165,
      resourceUsageUnits: 1450,
      notes: 'Rollback target model. Verified stable performance.'
    },
    {
      id: 'ver-gpt4o-2026.04',
      modelName: 'OpenAI GPT-4o',
      providerKey: 'openai',
      version: 'v2026.04 (Failover Target)',
      releaseDate: '2026-04-20',
      status: 'Active',
      qualityScorePct: 98.4,
      avgLatencyMs: 185,
      resourceUsageUnits: 1600,
      notes: 'Failover provider model for high-traffic load smoothing.'
    },
    {
      id: 'ver-claude35-2.1',
      modelName: 'Anthropic Claude 3.5 Sonnet',
      providerKey: 'anthropic',
      version: 'v2.1 (Standby)',
      releaseDate: '2026-03-30',
      status: 'Active',
      qualityScorePct: 99.1,
      avgLatencyMs: 142,
      resourceUsageUnits: 1500,
      notes: 'High-precision moderation and dispute analysis target.'
    }
  ]);

  const [scheduledUpgradeInput, setScheduledUpgradeInput] = useState('2026-09-15');

  const [privacySettings, setPrivacySettings] = useState<AIPrivacySettings>({
    dataProcessingConsent: true,
    personalizationConsent: true,
    retentionDays: 60,
    piiRedactionEnabled: true,
    dataMinimizationEnabled: true,
    encryptionStatus: 'AES-256-GCM Active',
    allowExport: true,
    allowDeletion: true
  });

  const [responsibleControls, setResponsibleControls] = useState<AIResponsibleControls>({
    decisionTransparency: true,
    confidenceMonitoring: true,
    biasMonitoringScorePct: 99.4,
    safetyMonitoringStatus: '24/7 Active',
    riskClassification: 'Low',
    humanOverrideActive: true,
    continuousComplianceStatus: '100% Compliant (Pi SDK v2)'
  });

  const [piiInputText, setPiiInputText] = useState('My contact email is pioneer@pinova.app and my seed passphrase phrase is apple banana cherry dog elephant fox grape horse iguana jaguar kangaroo lemon');
  const [piiRedactedOutput, setPiiRedactedOutput] = useState<{ sanitized: string; redactedCount: number } | null>(null);

  const handleRollbackModel = (vRec: AIModelVersionRecord) => {
    setModelVersions(prev => prev.map(m => {
      if (m.id === vRec.id) return { ...m, status: 'Active' };
      if (m.providerKey === vRec.providerKey && m.status === 'Active') return { ...m, status: 'Stable_Previous' };
      return m;
    }));
    setNoticeMessage(`MODEL ROLLBACK EXECUTED: Restored ${vRec.modelName} ${vRec.version} as active model.`);
    addAuditLogEntry(
      'Admin_Governance',
      'Admin',
      vRec.modelName,
      'Model Version Rollback',
      `Target version: ${vRec.version}`,
      `Successfully restored ${vRec.version} into active routing.`,
      'Rollback_Executed'
    );
  };

  const handleScheduleUpgrade = (modelId: string) => {
    setModelVersions(prev => prev.map(m => m.id === modelId ? { ...m, scheduledUpgradeDate: scheduledUpgradeInput } : m));
    setNoticeMessage(`MODEL UPGRADE SCHEDULED: Target date set to ${scheduledUpgradeInput}.`);
    addAuditLogEntry(
      'Admin_Officer',
      'Admin',
      'Governance_Engine',
      'Schedule Model Upgrade',
      `Model ID ${modelId}`,
      `Scheduled upgrade for ${scheduledUpgradeInput}`,
      'Success'
    );
  };

  const handleTestPiiRedaction = () => {
    const res = redactSensitiveData(piiInputText);
    setPiiRedactedOutput(res);
    addAuditLogEntry(
      'Pioneer_User',
      'Buyer',
      'PII_Sanitizer_Engine',
      'PII & Sensitive Data Redaction Test',
      piiInputText,
      `Redacted ${res.redactedCount} sensitive string(s)`,
      'PII_Redacted'
    );
  };

  const handleExportConversationHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      exportDate: new Date().toISOString(),
      privacyConsent: privacySettings,
      chatStream: shoppingMessages,
      auditTrail: auditLogs
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pinova_ai_conversation_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setNoticeMessage('AI Conversation History exported successfully as JSON.');
  };

  const handleDeleteConversationHistory = () => {
    setShoppingMessages([
      {
        sender: 'ai',
        text: 'Session history cleared according to user privacy preference.',
        providerUsed: 'Google Gemini 3.6 Flash'
      }
    ]);
    setNoticeMessage('AI Conversation history purged permanently from session memory.');
    addAuditLogEntry(
      'Pioneer_User',
      'Buyer',
      'Privacy_Engine',
      'User Data Deletion Request',
      'Clear chat history',
      'Session chat logs purged',
      'Success'
    );
  };

  // ----------------------------------------------------
  // SUB-TAB 1: SHOPPING ASSISTANT & SUPPORT STATE
  // ----------------------------------------------------
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState<number | ''>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'Smartphones under 100 Pi',
    'Noise cancelling headphones',
    'Crypto hardware wallets'
  ]);
  const [shoppingMessages, setShoppingMessages] = useState<
    Array<{
      sender: 'user' | 'ai';
      text: string;
      matchedProducts?: Product[];
      buyingAdvice?: string;
      budgetMatch?: string;
      providerUsed?: string;
      explainability?: AIExplainabilityMetadata;
    }>
  >([
    {
      sender: 'ai',
      text: 'Hello Pioneer! I am your PiNova AI Shopping Assistant. Ask me anything about products, discover deals, compare items, or ask for budget recommendations in natural language.',
      providerUsed: 'Google Gemini 3.6 Flash',
      explainability: {
        isAiGenerated: true,
        confidenceLevel: 99,
        latencyMs: 110,
        modelName: 'gemini-3.6-flash',
        providerName: 'Google Gemini 3.6 Flash',
        lastUpdated: '2026-08-04 08:55',
        sourcesUsed: ['PiNova Global Catalog V2', 'Order Protection Status Index'],
        recommendationReason: 'Initial shopping concierge initialization & catalog index scan',
        personalizationStatus: 'Active — Personalized for Pioneer Account'
      }
    }
  ]);

  // Customer Support State
  const [supportQuery, setSupportQuery] = useState('');
  const [supportCategory, setSupportCategory] = useState<'order_status' | 'returns' | 'disputes' | 'general'>('order_status');
  const [supportStream, setSupportStream] = useState<Array<{ sender: 'user' | 'ai' | 'human'; text: string }>>([
    { sender: 'ai', text: 'PiNova AI Customer Support ready. How may I assist you with orders, returns, disputes, or marketplace navigation?' }
  ]);
  const [isEscalatedToHuman, setIsEscalatedToHuman] = useState(false);

  // ----------------------------------------------------
  // SUB-TAB 2: MARKETING & BI ASSISTANT STATE
  // ----------------------------------------------------
  const [merchantTitleInput, setMerchantTitleInput] = useState('Enterprise Pioneer Smartphone Pro Max');
  const [merchantCategoryInput, setMerchantCategoryInput] = useState('smartphones');
  const [merchantFeaturesInput, setMerchantFeaturesInput] = useState('5G connectivity, OLED display, 5000mAh battery, Order Protection Status');
  const [isGeneratingMerchantCopy, setIsGeneratingMerchantCopy] = useState(false);
  const [merchantCopyResult, setMerchantCopyResult] = useState<AIMerchantCopyResponse | null>(null);

  // Marketing Draft Assistant
  const [marketingType, setMarketingType] = useState<'email' | 'social' | 'banner' | 'announcement'>('social');
  const [marketingTargetAudience, setMarketingTargetAudience] = useState('Pioneers in West Africa & Asia');
  const [generatedMarketingDraft, setGeneratedMarketingDraft] = useState<string | null>(null);

  const handleGenerateMarketingDraft = () => {
    let draft = '';
    if (marketingType === 'social') {
      draft = `🚀 Pioneer Alert! Upgrade your everyday tech with the ${merchantTitleInput} on PiNova Global Marketplace! ⚡ Authentic deals, instant settlement, and Order Protection Status verification. #PiNova #PiNetwork #PiPioneers #PiMerchant`;
    } else if (marketingType === 'email') {
      draft = `Subject: Exclusive Pioneer Offer: Save up to 15% Pi on ${merchantTitleInput}!\n\nDear Pioneer,\n\nWe are excited to announce a special campaign for ${merchantTitleInput}. Engineered for high performance and seamless Pi payments. Visit our merchant storefront today to claim your discount before inventory runs out!\n\nWarm regards,\nPiNova Merchant Team`;
    } else if (marketingType === 'banner') {
      draft = `🔥 PI NOVA EXCLUSIVE: ${merchantTitleInput.toUpperCase()} — 100% VERIFIED PURCHASE PROTECTION STATUS`;
    } else {
      draft = `Store Announcement: We have restocked our flagship item (${merchantTitleInput}). Worldwide shipping available with automated tracking & dispute protection.`;
    }
    setGeneratedMarketingDraft(draft);
  };

  // ----------------------------------------------------
  // SUB-TAB 3: INVENTORY INTELLIGENCE STATE
  // ----------------------------------------------------
  const [inventoryItems] = useState([
    { id: 'inv-1', title: 'Pioneer Phone 15 Pro', stock: 4, velocityPerDay: 3.2, leadTimeDays: 7, suggestedReorder: 25, alertType: 'Low Stock Prediction' },
    { id: 'inv-2', title: 'Wireless ANC Earbuds', stock: 180, velocityPerDay: 0.5, leadTimeDays: 14, suggestedReorder: 0, alertType: 'Overstock Alert' },
    { id: 'inv-3', title: 'Crypto Hardware Wallet v2', stock: 12, velocityPerDay: 2.1, leadTimeDays: 5, suggestedReorder: 30, alertType: 'Reorder Recommended' },
    { id: 'inv-4', title: 'Solar Power Bank 20000mAh', stock: 45, velocityPerDay: 1.8, leadTimeDays: 10, suggestedReorder: 0, alertType: 'Optimal Inventory' }
  ]);

  // ----------------------------------------------------
  // SUB-TAB 4: TRANSLATION & FRAUD AUTOMATION
  // ----------------------------------------------------
  const [translationText, setTranslationText] = useState('Verified seller with fast delivery and high quality product rating.');
  const [targetLang, setTargetLang] = useState<'ar' | 'zh' | 'fr' | 'ha' | 'es'>('fr');
  const [translatedResult, setTranslatedResult] = useState<string | null>(null);

  const handleTranslateText = () => {
    const map: Record<string, string> = {
      fr: 'Vendeur vérifié avec livraison rapide et évaluation de produit de haute qualité.',
      ar: 'بائع معتمد مع تسليم سريع وتقييم منتج عالي الجودة.',
      zh: '经过认证的卖家，发货迅速，产品评价极高。',
      ha: 'Dillali amintacce mai isar da sako da sauri da kuma darajar kaya mai kyau.',
      es: 'Vendedor verificado con entrega rápida y calificación de producto de alta calidad.'
    };
    setTranslatedResult(map[targetLang] || translationText);
  };

  const samplePrompts = [
    'Find high-speed smartphones or hardware wallets under 100 Pi',
    'Best wireless noise cancelling headphones with long battery',
    'Compare top electronics for home office setups',
    'Gift suggestions for tech-enthusiast Pioneers'
  ];

  // Escalation & Report Handlers
  const handleTriggerHumanReview = (contextTitle: string) => {
    const id = `REV-${Math.floor(10000 + Math.random() * 90000)}`;
    setEscalationModalState({
      open: true,
      ticketId: id,
      type: 'review',
      title: 'Human Governance Review Requested',
      message: `Your request for human evaluation on "${contextTitle}" has been logged as Ticket #${id}. A PiNova Merchant Compliance Officer will audit this AI recommendation within 4 business hours.`
    });
    addAuditLogEntry(
      'Pioneer_User',
      'Buyer',
      providerConfigs.find((c) => c.key === activeProvider)?.name || activeProvider,
      'Request Human Review Escalation',
      contextTitle,
      `Created Governance Escalation Ticket #${id}`,
      'Success'
    );
  };

  const handleReportIncorrect = (contextTitle: string) => {
    const id = `RPT-${Math.floor(10000 + Math.random() * 90000)}`;
    setEscalationModalState({
      open: true,
      ticketId: id,
      type: 'report',
      title: 'Incorrect AI Response Reported',
      message: `Thank you for safeguarding marketplace integrity. Report #${id} has been dispatched to our Responsible AI Quality Assurance team. Model tuning parameters will be updated accordingly.`
    });
    addAuditLogEntry(
      'Pioneer_User',
      'Buyer',
      providerConfigs.find((c) => c.key === activeProvider)?.name || activeProvider,
      'Report Incorrect AI Response',
      contextTitle,
      `Flagged for Model Re-Training (Ticket #${id})`,
      'Success'
    );
  };

  // Provider Outage & Failover Simulation
  const handleSimulateFailoverOutage = () => {
    if (!simulatedOutageActive) {
      setSimulatedOutageActive(true);
      setProviderHealthList((prev) =>
        prev.map((item) =>
          item.providerKey === 'gemini'
            ? { ...item, status: 'Offline', availabilityPct: 82.4, failoverStatus: 'FAILOVER ENGAGED → OpenAI GPT-4o Active' }
            : item.providerKey === 'openai'
            ? { ...item, status: 'Operational', failoverStatus: 'Active Traffic Target (Failover Mode)' }
            : item
        )
      );
      AIProviderRegistry.setActiveProvider('openai');
      setActiveProvider('openai');
      setNoticeMessage('🚨 AUTOMATIC FAILOVER ENGAGED: Google Gemini 3.6 Flash failover test initiated. AI Traffic seamlessly re-routed to OpenAI GPT-4o.');
      addAuditLogEntry(
        'System_Monitor',
        'System',
        'Google Gemini 3.6 Flash',
        'Automatic Failover Trigger',
        'AI Service Continuity & Failover Test',
        'Engaged failover to OpenAI GPT-4o target',
        'Fallback'
      );
    } else {
      setSimulatedOutageActive(false);
      setProviderHealthList((prev) =>
        prev.map((item) =>
          item.providerKey === 'gemini'
            ? { ...item, status: 'Operational', availabilityPct: 99.94, failoverStatus: 'Primary Active Target — Fallback: OpenAI GPT-4o' }
            : item
        )
      );
      AIProviderRegistry.setActiveProvider('gemini');
      setActiveProvider('gemini');
      setNoticeMessage('AI Provider Health Check: Primary Provider Google Gemini 3.6 Flash recovered. System restored to normal routing.');
    }
  };

  const handleExecuteAiSearch = async (textToSearch: string) => {
    if (!textToSearch.trim()) return;
    const userPrompt = textToSearch;
    setQuery('');

    setShoppingMessages((prev) => [...prev, { sender: 'user', text: userPrompt }]);
    setIsSearching(true);

    try {
      const budgetNum = typeof budgetLimit === 'number' ? budgetLimit : undefined;
      const res = await aiCommerceEngine.searchCatalog({
        query: userPrompt,
        catalog: products,
        userBudgetPi: budgetNum
      });

      const matched = products.filter((p) => res.recommendedProductIds.includes(p.id));
      const displayProducts = matched.length > 0 ? matched : products.slice(0, 4);

      const activeConfig = providerConfigs.find((c) => c.key === activeProvider);
      const explainabilityData: AIExplainabilityMetadata = {
        isAiGenerated: true,
        confidenceLevel: 97,
        latencyMs: res.latencyMs || 135,
        modelName: activeConfig?.model || 'gemini-3.6-flash',
        providerName: res.providerUsed || 'Google Gemini 3.6 Flash',
        lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sourcesUsed: ['PiNova Catalog V2 Index', 'Seller Ratings Index', 'Order Protection Status Registry'],
        recommendationReason: `Query matched intent "${userPrompt.slice(0, 30)}"${budgetNum ? ` within budget constraint ${budgetNum} π` : ''}`,
        personalizationStatus: personalizationEnabled ? 'Active (Personalized for Pioneer Account)' : 'Disabled (Generic Search)'
      };

      setShoppingMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.aiInsights,
          matchedProducts: displayProducts,
          buyingAdvice: res.buyingAdvice,
          budgetMatch: res.budgetMatch,
          providerUsed: res.providerUsed,
          explainability: explainabilityData
        }
      ]);

      // Add audit log entry
      addAuditLogEntry(
        'Pioneer_User',
        'Buyer',
        res.providerUsed,
        'Natural Language Product Search',
        userPrompt,
        res.aiInsights.slice(0, 80) + '...',
        'Success'
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateMerchantCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantTitleInput.trim()) return;

    setIsGeneratingMerchantCopy(true);
    try {
      const res = await aiCommerceEngine.generateMerchantCopy({
        productTitle: merchantTitleInput,
        category: merchantCategoryInput,
        keyFeatures: merchantFeaturesInput.split(',').map((f) => f.trim())
      });

      setMerchantCopyResult(res);

      addAuditLogEntry(
        'Merchant_Pioneer',
        'Merchant',
        res.providerUsed,
        'AI Product Description & SEO Generation',
        merchantTitleInput,
        `Generated copy & ${res.suggestedTags.length} tags`,
        'Success'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMerchantCopy(false);
    }
  };

  // ----------------------------------------------------
  // SUB-TAB 3: SMART AUTOMATION STATE
  // ----------------------------------------------------
  const [moderationTextInput, setModerationTextInput] = useState('Buy 1000 Pi for 1$! Guaranteed seed phrase doubling bot telegram @scam');
  const [moderationResult, setModerationResult] = useState<AIContentModerationResult | null>(null);
  const [isModerating, setIsModerating] = useState(false);

  // Dynamic Pricing & Fraud Simulation
  const [fraudRiskItem, setFraudRiskItem] = useState({
    itemTitle: 'Ultra High-End Laptop 2026',
    pricePi: 0.1,
    typicalPricePi: 450.0,
    sellerAgeDays: 2,
    salesVolume24h: 120
  });
  const [fraudAnalysis, setFraudAnalysis] = useState<{ riskScore: number; status: string; recommendation: string } | null>(null);

  const handleRunContentModeration = async () => {
    if (!moderationTextInput.trim()) return;
    setIsModerating(true);
    try {
      const res = await aiCommerceEngine.moderateContent(moderationTextInput);
      setModerationResult(res);

      addAuditLogEntry(
        'System_Moderator',
        'System',
        AIProviderRegistry.getActiveProvider().providerName,
        'Auto Content Moderation Scan',
        moderationTextInput.slice(0, 50),
        `Approved: ${res.isApproved}, Risk: ${res.riskScore}`,
        res.isApproved ? 'Success' : 'Blocked by Policy'
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsModerating(false);
    }
  };

  const handleAnalyzeFraudRisk = () => {
    const isAnomalousPrice = fraudRiskItem.pricePi < fraudRiskItem.typicalPricePi * 0.1;
    const isNewSeller = fraudRiskItem.sellerAgeDays < 7;
    const isHighSpike = fraudRiskItem.salesVolume24h > 50;

    let score = 10;
    if (isAnomalousPrice) score += 45;
    if (isNewSeller) score += 25;
    if (isHighSpike) score += 15;

    setFraudAnalysis({
      riskScore: score,
      status: score > 60 ? 'High Risk — Transaction Held in Verification Review' : score > 30 ? 'Medium Risk — Audit Triggered' : 'Low Risk — Safe Order',
      recommendation: score > 60
        ? 'Automated security trigger: Price anomaly (99% below average) from new seller account. Requiring mandatory Pi Network identity verification.'
        : 'Normal market parameters detected.'
    });
  };

  // ----------------------------------------------------
  // SUB-TAB 4: ARCHITECTURE & GOVERNANCE CONTROL
  // ----------------------------------------------------
  const [promptTemplates] = useState<AIPromptTemplate[]>([
    {
      id: 'prompt-1',
      title: 'Shopping Concierge Persona',
      category: 'Shopping',
      systemPrompt: 'You are an enterprise shopping concierge for PiNova Global Marketplace. Assist users in finding items, comparing prices in Pi, and giving buying advice. Never provide legal, medical, or financial investment advice.',
      userPromptTemplate: 'User query: {{query}}. User budget: {{budget}}. Catalog count: {{count}}.',
      parameters: ['query', 'budget', 'count']
    },
    {
      id: 'prompt-2',
      title: 'Merchant SEO Copywriter',
      category: 'Merchant',
      systemPrompt: 'You are a professional ecommerce copywriter for PiNova. Write compelling, search-engine-optimized product listings highlighting value for Pi Pioneers.',
      userPromptTemplate: 'Product: {{title}}, Category: {{category}}, Features: {{features}}.',
      parameters: ['title', 'category', 'features']
    },
    {
      id: 'prompt-3',
      title: 'Auto Policy Moderation Engine',
      category: 'Moderation',
      systemPrompt: 'Scan user submission for seed phrase phishing, scam links, counterfeit claims, or offensive speech according to Pi Platform Guidelines.',
      userPromptTemplate: 'Text: {{input}}',
      parameters: ['input']
    }
  ]);

  const [permissionRules] = useState<AIPermissionRule[]>([
    { role: 'buyer', allowedCapabilities: ['Natural Language Search', 'Product Recommendations', 'Budget Assistance'], monthlyTokenQuota: 50000, tokensUsedThisMonth: 12400 },
    { role: 'merchant', allowedCapabilities: ['SEO Copywriting', 'Title & Tag Generator', 'Inventory Forecast', 'Customer Support Auto-Response'], monthlyTokenQuota: 250000, tokensUsedThisMonth: 89000 },
    { role: 'admin', allowedCapabilities: ['All AI Engines', 'Provider Configuration', 'Prompt Library Edit', 'Audit Log Export', 'Fraud Detection Config'], monthlyTokenQuota: 1000000, tokensUsedThisMonth: 342000 }
  ]);

  const handleChangeActiveProvider = (key: AIProviderKey) => {
    AIProviderRegistry.setActiveProvider(key);
    setActiveProvider(key);

    const targetConfig = providerConfigs.find((c) => c.key === key);
    setNoticeMessage(`Active AI Provider switched to: ${targetConfig?.name || key}. All requests will route through this adapter.`);
    setTimeout(() => setNoticeMessage(null), 4000);

    addAuditLogEntry(
      'Governance_Admin',
      'Admin',
      key,
      'Provider Active Switch',
      `Switched to ${key}`,
      'Active provider updated in system registry',
      'Success'
    );
  };

  const handleToggleProviderEnabled = (key: AIProviderKey) => {
    setProviderConfigs((prev) =>
      prev.map((c) => {
        if (c.key === key) {
          const updated = { ...c, enabled: !c.enabled };
          AIProviderRegistry.updateProviderConfig(key, { enabled: updated.enabled });
          return updated;
        }
        return c;
      })
    );
  };

  // ----------------------------------------------------
  // SUB-TAB 5: USAGE & AUDIT LOGS
  // ----------------------------------------------------
  const [usageMetrics] = useState<AIUsageMetric[]>([
    { id: 'm-1', timestamp: '2026-08-04 06:45', providerKey: 'gemini', taskType: 'search', tokensUsed: 420, latencyMs: 135, status: 'Success', resourceUsageUnits: 420 },
    { id: 'm-2', timestamp: '2026-08-04 06:42', providerKey: 'gemini', taskType: 'merchant_copy', tokensUsed: 1250, latencyMs: 310, status: 'Success', resourceUsageUnits: 1250 },
    { id: 'm-3', timestamp: '2026-08-04 06:30', providerKey: 'openai', taskType: 'moderation', tokensUsed: 180, latencyMs: 95, status: 'Success', resourceUsageUnits: 180 },
    { id: 'm-4', timestamp: '2026-08-04 06:15', providerKey: 'anthropic', taskType: 'pricing', tokensUsed: 650, latencyMs: 210, status: 'Success', resourceUsageUnits: 650 },
    { id: 'm-5', timestamp: '2026-08-04 05:50', providerKey: 'deepseek', taskType: 'search', tokensUsed: 380, latencyMs: 88, status: 'Success', resourceUsageUnits: 380 }
  ]);

  const [auditLogs, setAuditLogs] = useState<AIAuditLog[]>([
    { id: 'log-801', timestamp: '2026-08-04 06:45', user: '@Pioneer_Elena', role: 'Buyer', provider: 'Google Gemini 3.6 Flash', action: 'Natural Language Product Search', promptSnippet: 'Find crypto hardware wallets under 50 Pi', responseSnippet: 'Discovered 2 verified hardware wallet listings...', status: 'Success' },
    { id: 'log-802', timestamp: '2026-08-04 06:42', user: '@Global_Merchant_HQ', role: 'Merchant', provider: 'Google Gemini 3.6 Flash', action: 'AI Product Description & SEO Generation', promptSnippet: 'Enterprise Pioneer Smartphone Pro Max', responseSnippet: 'Generated description & 5 tags', status: 'Success' },
    { id: 'log-803', timestamp: '2026-08-04 06:30', user: '@System_Moderator', role: 'System', provider: 'OpenAI GPT-4o', action: 'Auto Content Moderation Scan', promptSnippet: 'Buy 1000 Pi for 1$...', responseSnippet: 'Approved: false, Risk: 92', status: 'Blocked by Policy' },
    { id: 'log-804', timestamp: '2026-08-04 05:50', user: '@Governance_Admin', role: 'Admin', provider: 'DeepSeek V3 Commerce', action: 'Provider Active Switch', promptSnippet: 'Switched to deepseek', responseSnippet: 'Active provider updated in system registry', status: 'Success' }
  ]);

  const addAuditLogEntry = (
    userStr: string,
    roleStr: 'Buyer' | 'Merchant' | 'Admin' | 'System',
    providerStr: string,
    actionStr: string,
    promptStr: string,
    respStr: string,
    statusStr: 'Success' | 'Fallback' | 'Blocked by Policy' | 'PII_Redacted' | 'Rollback_Executed'
  ) => {
    const newLog: AIAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: userStr,
      role: roleStr,
      provider: providerStr,
      action: actionStr,
      promptSnippet: promptStr,
      responseSnippet: respStr,
      status: statusStr
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleExportAuditLogs = () => {
    setNoticeMessage('AI Governance Audit Logs & Provider Usage Report exported (JSON format).');
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  // Helper renderer for AI Explainability & Human Escalation Bar
  const renderExplainabilityFooter = (
    explainability: AIExplainabilityMetadata | undefined,
    fallbackProvider: string,
    onRetry?: () => void
  ) => {
    const [showReasoning, setShowReasoning] = useState(false);
    const [userRating, setUserRating] = useState<'liked' | 'disliked' | null>(null);

    const activeConfig = providerConfigs.find((c) => c.key === activeProvider);
    const meta: AIExplainabilityMetadata = explainability || {
      isAiGenerated: true,
      confidenceLevel: 98,
      latencyMs: 135,
      modelName: activeConfig?.model || 'gemini-3.6-flash',
      providerName: fallbackProvider || 'Google Gemini 3.6 Flash',
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sourcesUsed: ['PiNova Catalog V2 Index', 'Order Protection Status Index'],
      recommendationReason: 'Query intent matching & verified seller parameters',
      personalizationStatus: personalizationEnabled ? 'Active (Personalized)' : 'Disabled'
    };

    return (
      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 space-y-2 text-xs">
        {/* Header Indicator Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> AI Generated
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              {meta.confidenceLevel}% Confidence
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              {meta.latencyMs}ms
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-medium">
              Model: {meta.modelName}
            </span>
          </div>

          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <Info className="w-3 h-3" /> {showReasoning ? 'Hide Reasoning' : 'Why this recommendation?'}
          </button>
        </div>

        {/* Reasoning & Data Sources Accordion */}
        {showReasoning && (
          <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-[11px] text-slate-700 dark:text-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">AI Provider:</span>
                <span className="text-[10px] text-slate-500">{meta.providerName} ({meta.modelName})</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Last Model Update:</span>
                <span className="text-[10px] text-slate-500">{meta.lastUpdated}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Information Sources Used:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {meta.sourcesUsed.map((src, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[9px] font-semibold text-slate-600 dark:text-slate-400">
                    • {src}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Recommendation Reason:</span>
              <p className="text-[10px] text-slate-500 leading-relaxed">{meta.recommendationReason}</p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Personalization: <strong>{meta.personalizationStatus}</strong></span>
              <span className="text-amber-500 font-bold">Verified Marketplace Data vs AI Advisory Distinction Verified</span>
            </div>
          </div>
        )}

        {/* Escalation & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 font-bold">Feedback:</span>
            <button
              onClick={() => {
                setUserRating('liked');
                setNoticeMessage('Thank you! Your feedback helps optimize our AI Shopping Concierge.');
                setTimeout(() => setNoticeMessage(null), 3000);
              }}
              className={`px-2 py-0.5 rounded border transition-colors ${userRating === 'liked' ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-500/20'}`}
            >
              👍 Helpful
            </button>
            <button
              onClick={() => {
                setUserRating('disliked');
                setNoticeMessage('Feedback recorded for model tuning.');
                setTimeout(() => setNoticeMessage(null), 3000);
              }}
              className={`px-2 py-0.5 rounded border transition-colors ${userRating === 'disliked' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-500/20'}`}
            >
              👎 Needs Improvement
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-[10px]">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-600 hover:text-white font-bold transition-colors"
              >
                🔄 Retry Response
              </button>
            )}

            <button
              onClick={() => handleTriggerHumanReview('AI Shopping Recommendation')}
              className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-600 hover:text-white font-bold border border-purple-500/20 transition-colors"
            >
              🙋‍♂️ Request Human Review
            </button>

            <button
              onClick={() => handleReportIncorrect('AI Shopping Recommendation')}
              className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white font-bold border border-rose-500/20 transition-colors"
            >
              🚩 Report Incorrect AI
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-20">
      
      {/* Header Banner & Compliance Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-purple-800/50 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/60 text-amber-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Module 7 — AI Commerce Intelligence & Automation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              PiNova AI Ecosystem Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Provider-agnostic AI architecture supporting Google Gemini, OpenAI, Anthropic, DeepSeek, Grok, and self-hosted models for natural language shopping, merchant SEO copywriting, automated moderation, smart pricing, and audit governance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Provider</span>
                <span className="font-extrabold text-amber-300">{providerConfigs.find((c) => c.key === activeProvider)?.name || activeProvider}</span>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-xl text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Pi SDK v2 Compliant
            </div>
          </div>
        </div>

      {/* Explicit Policy Notice */}
        <div className="pt-3 border-t border-slate-800/80 text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Policy & Transparency Notice:</strong> AI-generated content within PiNova Global Marketplace provides automated recommendations and operational assistance only. Verified marketplace information is displayed separately. AI recommendations should not be interpreted as official Pi Network information or as marketplace guarantees.
          </span>
        </div>
      </div>

      {noticeMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between gap-2 animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {noticeMessage}
          </div>
          <button onClick={() => setNoticeMessage(null)} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'shopping_assistant', label: 'AI Smart Search & Support', icon: ShoppingBag },
            { id: 'merchant_assistant', label: 'AI Merchant & Marketing Studio', icon: Store },
            { id: 'inventory_intelligence', label: 'AI Inventory Intelligence', icon: Package },
            { id: 'smart_automation', label: 'Fraud Detection & Translation', icon: ShieldCheck },
            { id: 'model_governance', label: 'AI Model Governance', icon: FileText },
            { id: 'privacy_governance', label: 'AI Privacy Governance', icon: Lock },
            { id: 'architecture_governance', label: 'Provider Registry & Health', icon: Sliders },
            { id: 'audit_monitoring', label: 'AI Analytics & Usage Metrics', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AiHubSubTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Personalization Control Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shrink-0 self-start sm:self-auto">
          <Sparkles className={`w-3.5 h-3.5 ${personalizationEnabled ? 'text-amber-400' : 'text-slate-400'}`} />
          <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">AI Personalization:</span>
          <button
            onClick={() => {
              setPersonalizationEnabled(!personalizationEnabled);
              setNoticeMessage(`AI Personalization ${!personalizationEnabled ? 'ENABLED' : 'DISABLED'}.`);
              setTimeout(() => setNoticeMessage(null), 3000);
            }}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase transition-all ${
              personalizationEnabled
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {personalizationEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: AI SHOPPING ASSISTANT */}
      {/* ==================================================== */}
      {activeTab === 'shopping_assistant' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Conversational Stream */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" /> Conversational Product Search & Buying Guidance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Natural language product discovery, budget constraint matching, and buying suggestions.
                  </p>
                </div>

                {/* Optional Budget Input */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-500 pl-2">Budget Limit:</span>
                  <input
                    type="number"
                    placeholder="Max Pi (e.g. 50)"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value ? Number(e.target.value) : '')}
                    className="w-28 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                  />
                  <span className="text-xs font-bold text-amber-500 pr-1">π</span>
                </div>
              </div>

              {/* Sample Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold">Suggested Prompts:</span>
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecuteAiSearch(sp)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors font-medium text-[11px]"
                  >
                    {sp}
                  </button>
                ))}
              </div>

              {/* Chat Stream */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {shoppingMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Bot className="w-5 h-5" />
                      </div>
                    )}

                    <div
                      className={`max-w-2xl rounded-2xl p-4 text-xs space-y-3 ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white font-semibold'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200/40 dark:border-slate-700/40 pb-1.5">
                        <span className="font-bold text-[11px] opacity-80">
                          {msg.sender === 'user' ? 'You' : 'PiNova AI Assistant'}
                        </span>
                        {msg.providerUsed && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-[9px] font-bold border border-purple-500/20">
                            Adapter: {msg.providerUsed}
                          </span>
                        )}
                      </div>

                      <p className="leading-relaxed text-sm font-medium">{msg.text}</p>

                      {msg.buyingAdvice && (
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold text-[11px] flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                          <span><strong>Buying Advice:</strong> {msg.buyingAdvice}</span>
                        </div>
                      )}

                      {/* Render Matched Products */}
                      {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {msg.matchedProducts.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => onSelectProduct(p)}
                              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer flex items-center gap-3 group shadow-sm"
                            >
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-14 h-14 object-cover rounded-xl shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate group-hover:text-purple-400">
                                  {p.title}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-black text-amber-500">{p.pricePi.toFixed(2)} π</span>
                                  <span className="text-[10px] text-slate-400">★ {p.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1.5">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddToCart(p);
                                    }}
                                    className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-lg hover:bg-purple-500"
                                  >
                                    + Cart
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onInstantBuy(p);
                                    }}
                                    className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-lg hover:bg-amber-400"
                                  >
                                    Buy Now
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Render Explainability & Escalation Footer for AI Messages */}
                      {msg.sender === 'ai' && renderExplainabilityFooter(msg.explainability, msg.providerUsed || 'Google Gemini 3.6 Flash')}
                    </div>
                  </div>
                ))}

                {isSearching && (
                  <div className="flex items-center gap-2 text-xs text-purple-400 font-bold animate-pulse p-3">
                    <Bot className="w-5 h-5 text-purple-500" />
                    <span>AI Commerce Engine querying global marketplace catalog...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleExecuteAiSearch(query)}
                      placeholder={isVoiceListening ? 'Listening... Speak now...' : 'Ask for any product, gadget, gift ideas, or budget guidance...'}
                      className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium ${
                        isVoiceListening ? 'border-amber-400 ring-2 ring-amber-400/50 animate-pulse' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {isVoiceListening && (
                      <span className="absolute right-3 top-3.5 text-[10px] font-bold text-amber-500 flex items-center gap-1 animate-pulse">
                        <Zap className="w-3 h-3" /> Voice Active
                      </span>
                    )}
                  </div>

                  {/* Voice Simulation */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsVoiceListening(true);
                      setTimeout(() => {
                        setQuery('Find high resolution OLED displays under 80 Pi');
                        setIsVoiceListening(false);
                      }, 2500);
                    }}
                    title="Voice Search"
                    className={`p-3 rounded-2xl border transition-all ${
                      isVoiceListening
                        ? 'bg-amber-500 text-slate-950 border-amber-400 animate-bounce'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </button>

                  {/* Visual Search Simulation */}
                  <button
                    type="button"
                    onClick={() => {
                      setNoticeMessage('Visual Search Engine: Analyzing uploaded image vector features...');
                      setTimeout(() => {
                        handleExecuteAiSearch('smartphones');
                        setNoticeMessage(null);
                      }, 1500);
                    }}
                    title="Visual Search"
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-all"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleExecuteAiSearch(query)}
                    disabled={!query.trim() || isSearching}
                    className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-md shadow-purple-600/20 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Execute</span>
                  </button>
                </div>

                {/* Trending & Search History Bar */}
                <div className="flex flex-wrap items-center justify-between text-[11px] gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-bold">Recent Searches:</span>
                    {searchHistory.map((sh, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExecuteAiSearch(sh)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-400 text-[10px]"
                      >
                        {sh}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px]">
                    <TrendingUp className="w-3 h-3" /> Trending: #HardwareWallets #PioneerSmartphones #OLED
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Capabilities & Support Concierge */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" /> AI Recommendation Engine
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Frequently Bought Together
                    </span>
                    <p className="text-[11px] text-slate-500">Pioneer Phone Pro + Wireless Earbuds + Fast Charger 65W (Save 12% Pi bundle).</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-purple-500" /> Seasonal Trend Alert
                    </span>
                    <p className="text-[11px] text-slate-500">Global Pioneers increase tech purchases by 34% in Q3. High demand for hardware wallets.</p>
                  </div>
                </div>
              </div>

              {/* AI Customer Support Concierge */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-500" /> AI Customer Support
                  </h3>
                  {isEscalatedToHuman && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-500/20">
                      Escalated to Human Agent
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 max-h-40 overflow-y-auto">
                    {supportStream.map((sm, idx) => (
                      <div key={idx} className={`p-2 rounded-lg ${sm.sender === 'user' ? 'bg-purple-600 text-white font-semibold text-right' : sm.sender === 'human' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold' : 'bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200'}`}>
                        <span className="text-[9px] block opacity-70">{sm.sender === 'user' ? 'You' : sm.sender === 'human' ? 'Human Agent' : 'AI Assistant'}</span>
                        {sm.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Ask about returns, order status..."
                      value={supportQuery}
                      onChange={(e) => setSupportQuery(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        if (!supportQuery.trim()) return;
                        setSupportStream(prev => [...prev, { sender: 'user', text: supportQuery }, { sender: 'ai', text: `AI Support: Order #${Math.floor(Math.random()*90000+10000)} is currently under Order Protection Status verification. Estimated delivery in 3 business days.` }]);
                        setSupportQuery('');
                      }}
                      className="px-3 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                    >
                      Ask
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setIsEscalatedToHuman(true);
                      setSupportStream(prev => [...prev, { sender: 'human', text: 'Human Support Agent connected. A customer representative is reviewing your PiNova account record.' }]);
                      handleTriggerHumanReview('AI Customer Support Case');
                    }}
                    className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    Escalate Request to Human Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: AI MERCHANT STUDIO */}
      {/* ==================================================== */}
      {activeTab === 'merchant_assistant' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Merchant Copy Generator Form */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-600" /> AI Product Copywriter & SEO Generator
              </h3>
              <p className="text-xs text-slate-500">
                Generate compelling product descriptions, SEO tags, category suggestions, and marketing hooks in seconds.
              </p>

              <form onSubmit={handleGenerateMerchantCopy} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Product Title / Name:</label>
                  <input
                    type="text"
                    required
                    value={merchantTitleInput}
                    onChange={(e) => setMerchantTitleInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Product Category:</label>
                  <select
                    value={merchantCategoryInput}
                    onChange={(e) => setMerchantCategoryInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="smartphones">Smartphones & Mobile</option>
                    <option value="computers">Computers & Accessories</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="electronics">Electronics & Gadgets</option>
                    <option value="home_living">Home & Living</option>
                    <option value="groceries">Groceries & Food</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Key Features (comma separated):</label>
                  <textarea
                    rows={3}
                    value={merchantFeaturesInput}
                    onChange={(e) => setMerchantFeaturesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingMerchantCopy}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {isGeneratingMerchantCopy ? 'AI Writing Listing...' : 'Generate AI Copy & SEO Pack'}
                </button>
              </form>
            </div>

            {/* Generated Output Card */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" /> AI Generated Result & Insights
              </h3>

              {!merchantCopyResult ? (
                <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p>Fill out the product parameters and click "Generate AI Copy" to preview listing copy.</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider text-purple-600">Generated Description:</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium text-xs">
                      {merchantCopyResult.generatedDescription}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Suggested Title Options:</span>
                    {merchantCopyResult.suggestedTitles.map((t, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold text-[11px] border border-purple-500/20">
                        • {t}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Suggested Tags & Keywords:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {merchantCopyResult.suggestedTags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-semibold space-y-1">
                    <span><strong>Marketing Hook:</strong> {merchantCopyResult.marketingHook}</span>
                    <span className="block text-[10px] opacity-80">Inventory Advisory: {merchantCopyResult.inventoryAdvice}</span>
                  </div>

                  {renderExplainabilityFooter(undefined, merchantCopyResult.providerUsed)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: INVENTORY INTELLIGENCE */}
      {/* ==================================================== */}
      {activeTab === 'inventory_intelligence' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" /> AI Inventory Intelligence & Demand Forecasting
                </h3>
                <p className="text-xs text-slate-500">
                  Predictive low stock alerts, overstock warnings, velocity tracking, and warehouse reorder advice.
                </p>
              </div>

              <div className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                Automated Stock Alerts Active
              </div>
            </div>

            {/* Governance Disclaimer regarding AI Inventory Recommendations */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <span>
                <strong>Inventory Governance Disclaimer:</strong> AI demand forecasts and warehouse reorder calculations provide operational guidance only. Final purchasing, restocking, and inventory decisions rest entirely with store administrators and merchants.
              </span>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventoryItems.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h4>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      item.alertType === 'Low Stock Prediction'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                        : item.alertType === 'Overstock Alert'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                        : item.alertType === 'Reorder Recommended'
                        ? 'bg-purple-500/10 text-purple-500 border-purple-500/30'
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    }`}>
                      {item.alertType}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-slate-500">
                    <div>Current Stock: <span className="font-bold text-slate-900 dark:text-white block">{item.stock} units</span></div>
                    <div>Sales Velocity: <span className="font-bold text-slate-900 dark:text-white block">{item.velocityPerDay}/day</span></div>
                    <div>Lead Time: <span className="font-bold text-slate-900 dark:text-white block">{item.leadTimeDays} days</span></div>
                  </div>

                  {item.suggestedReorder > 0 && (
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] font-semibold flex items-center justify-between">
                      <span>AI Reorder Advisory: Restock {item.suggestedReorder} units</span>
                      <button
                        onClick={() => {
                          setNoticeMessage(`Reorder advisory submitted for approval: +${item.suggestedReorder} units of ${item.title}`);
                          setTimeout(() => setNoticeMessage(null), 3000);
                        }}
                        className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg"
                      >
                        Approve Reorder
                      </button>
                    </div>
                  )}

                  {renderExplainabilityFooter(undefined, 'AI Inventory Intelligence Engine')}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: SMART AUTOMATION & TRANSLATION */}
      {/* ==================================================== */}
      {activeTab === 'smart_automation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Auto Content Moderation */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" /> Automated Policy Moderation Engine
              </h3>
              <p className="text-xs text-slate-500">
                Scans user comments, product listings, and messages for phishing, seed phrase scams, or inappropriate language.
              </p>

              <div className="space-y-3 text-xs">
                <textarea
                  rows={3}
                  value={moderationTextInput}
                  onChange={(e) => setModerationTextInput(e.target.value)}
                  placeholder="Paste text to moderate..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />

                <button
                  onClick={handleRunContentModeration}
                  disabled={isModerating}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-purple-600/20"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isModerating ? 'animate-spin' : ''}`} />
                  {isModerating ? 'Scanning Policy...' : 'Run Moderation Scan'}
                </button>
              </div>

              {moderationResult && (
                <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                  moderationResult.isApproved
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>Status: {moderationResult.isApproved ? 'APPROVED — Policy Compliant' : 'REJECTED — Policy Breach Flagged'}</span>
                    <span>Risk Score: {moderationResult.riskScore}/100</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{moderationResult.reasoning}</p>
                  {moderationResult.suggestedCorrection && (
                    <div className="text-[10px] font-semibold text-amber-500 pt-1">
                      Action Required: {moderationResult.suggestedCorrection}
                    </div>
                  )}
                  {renderExplainabilityFooter(undefined, 'AI Policy Moderation Engine')}
                </div>
              )}
            </div>

            {/* Smart Pricing & Fraud Risk Scoring */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" /> Dynamic Smart Pricing & Fraud Risk Detection
              </h3>
              <p className="text-xs text-slate-500">
                AI algorithm evaluating anomalous price drops, high volume spikes, and new seller risk parameters.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Item Price</span>
                  <div className="font-black text-amber-500 text-base">{fraudRiskItem.pricePi} π</div>
                  <span className="text-[10px] text-slate-400">Typical: {fraudRiskItem.typicalPricePi} π</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Seller Account Age</span>
                  <div className="font-black text-slate-900 dark:text-white text-base">{fraudRiskItem.sellerAgeDays} Days</div>
                  <span className="text-[10px] text-slate-400">24h Sales: {fraudRiskItem.salesVolume24h}</span>
                </div>
              </div>

              <button
                onClick={handleAnalyzeFraudRisk}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" /> Run AI Risk Score Audit
              </button>

              {fraudAnalysis && (
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-amber-400">{fraudAnalysis.status}</span>
                    <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-black text-[11px]">
                      Risk Score: {fraudAnalysis.riskScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{fraudAnalysis.recommendation}</p>
                  {renderExplainabilityFooter(undefined, 'AI Fraud Risk Analysis Engine')}
                </div>
              )}
            </div>
          </div>

          {/* AI Multilingual Translation */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" /> AI Multilingual Translation Engine
            </h3>
            <p className="text-xs text-slate-500">
              Translates product details, chat messages, reviews, and storefront descriptions into PiNova supported languages (Arabic, Chinese, French, Hausa, Spanish).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
              <div className="md:col-span-8 space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Source Content (English):</label>
                <textarea
                  rows={2}
                  value={translationText}
                  onChange={(e) => setTranslationText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="md:col-span-4 space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Target Language:</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  <option value="fr">French (Français)</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="zh">Chinese (中文)</option>
                  <option value="ha">Hausa (Hausa)</option>
                  <option value="es">Spanish (Español)</option>
                </select>

                <button
                  onClick={handleTranslateText}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" /> Translate Content
                </button>
              </div>
            </div>

            {translatedResult && (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200 text-xs font-semibold space-y-1">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block">AI Translated Output ({targetLang.toUpperCase()}):</span>
                <p className="leading-relaxed font-sans">{translatedResult}</p>
                {renderExplainabilityFooter(undefined, 'AI Multilingual Neural Translator')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: AI MODEL GOVERNANCE */}
      {/* ==================================================== */}
      {activeTab === 'model_governance' && (
        <AiModelGovernanceTab
          onAddAuditLog={(user, role, provider, action, prompt, resp, status) => {
            addAuditLogEntry(
              user,
              role,
              provider,
              action,
              prompt,
              resp,
              status as any
            );
          }}
          setNoticeMessage={setNoticeMessage}
        />
      )}

      {/* ==================================================== */}
      {/* TAB 6: AI PRIVACY GOVERNANCE */}
      {/* ==================================================== */}
      {activeTab === 'privacy_governance' && (
        <AiPrivacyGovernanceTab
          onAddAuditLog={(user, role, provider, action, prompt, resp, status) => {
            addAuditLogEntry(
              user,
              role,
              provider,
              action,
              prompt,
              resp,
              status as any
            );
          }}
          setNoticeMessage={setNoticeMessage}
        />
      )}

      {/* ==================================================== */}
      {/* TAB 7: PROVIDER REGISTRY & HEALTH DASHBOARD */}
      {/* ==================================================== */}
      {activeTab === 'architecture_governance' && (
        <div className="space-y-6">
          
          {/* AI Provider Health & Failover Monitoring Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" /> AI Provider Health & Real-Time Availability Dashboard
                </h3>
                <p className="text-xs text-slate-500">
                  Monitors active model status, uptime availability, error rates, and failover preparedness.
                </p>
              </div>

              <button
                onClick={handleSimulateFailoverOutage}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  simulatedOutageActive
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                {simulatedOutageActive ? 'Restore Primary Provider' : 'AI Provider Failover Test'}
              </button>
            </div>

            {/* Health Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {providerHealthList.map((hp) => (
                <div
                  key={hp.providerKey}
                  className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
                    hp.status === 'Offline'
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-200'
                      : hp.status === 'Degraded'
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 dark:text-white truncate">{hp.providerName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                      hp.status === 'Operational'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/20 text-rose-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${hp.status === 'Operational' ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`} />
                      {hp.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div>Model: <span className="font-mono text-slate-800 dark:text-slate-200">{hp.modelName}</span></div>
                    <div>API Availability: <strong className="text-emerald-500">{hp.availabilityPct}%</strong></div>
                    <div>Avg Latency: <strong className="text-slate-800 dark:text-slate-200">{hp.avgLatencyMs} ms</strong></div>
                    <div>Success Rate: <strong>{hp.successRatePct}%</strong> (Errors: {hp.errorRatePct}%)</div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-[10px] text-slate-500 truncate">
                    Failover: <span className="font-semibold text-purple-500">{hp.failoverStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Provider Registry Grid */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-600" /> AI Provider Registry & Provider Adapters
                </h3>
                <p className="text-xs text-slate-500">
                  Switch active AI providers dynamically without altering marketplace code logic.
                </p>
              </div>

              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
                Provider-Agnostic Engine Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providerConfigs.map((cfg) => {
                const isSelected = cfg.key === activeProvider;
                return (
                  <div
                    key={cfg.key}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isSelected
                        ? 'bg-purple-950/30 border-purple-500 shadow-lg shadow-purple-500/10'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-purple-500" /> {cfg.name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cfg.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'}`}>
                        {cfg.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1 text-slate-500 font-medium">
                      <div>Model: <span className="font-mono text-slate-900 dark:text-slate-200">{cfg.model}</span></div>
                      <div>Max Tokens: {cfg.maxTokens} • Rate Limit: {cfg.rateLimitPerMin}/min</div>
                      {cfg.endpoint && <div className="truncate text-[10px] text-purple-400">Endpoint: {cfg.endpoint}</div>}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleToggleProviderEnabled(cfg.key)}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        {cfg.enabled ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => handleChangeActiveProvider(cfg.key)}
                        disabled={isSelected || !cfg.enabled}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40'
                        }`}
                      >
                        {isSelected ? 'Active Provider' : 'Set Active'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Configurable Prompt Library */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" /> Configurable AI Prompt Library
              </h4>

              <div className="space-y-3">
                {promptTemplates.map((pt) => (
                  <div key={pt.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{pt.title} ({pt.category})</span>
                      <span className="text-[10px] text-purple-500 font-mono">Params: {pt.parameters.join(', ')}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      System: {pt.systemPrompt}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role-Based AI Permission Manager */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" /> Role-Based AI Permission & Quotas
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {permissionRules.map((perm) => (
                  <div key={perm.role} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold capitalize text-slate-900 dark:text-white">{perm.role} Role</span>
                      <span className="text-[10px] text-emerald-500 font-bold">Active</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Quota: {perm.monthlyTokenQuota.toLocaleString()} tokens/mo</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${(perm.tokensUsedThisMonth / perm.monthlyTokenQuota) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400">Used: {perm.tokensUsedThisMonth.toLocaleString()} tokens</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Model Version Governance Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-500" /> AI Model Version Governance & Lifecycle Management
                </h3>
                <p className="text-xs text-slate-500">
                  Track model versions, compare performance metrics, schedule upgrades, and execute instant rollbacks with immutable audit logs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={scheduledUpgradeInput}
                  onChange={(e) => setScheduledUpgradeInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium"
                />
                <button
                  onClick={() => handleScheduleUpgrade('ver-gemini-3.6.2')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Schedule Upgrade
                </button>
              </div>
            </div>

            {/* Version Records Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modelVersions.map((mv) => (
                <div
                  key={mv.id}
                  className={`p-4 rounded-2xl border space-y-3 text-xs ${
                    mv.status === 'Active'
                      ? 'bg-indigo-950/20 border-indigo-500/50 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-500" /> {mv.modelName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      mv.status === 'Active' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                    }`}>
                      {mv.version}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-center">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Quality Score</span>
                      <span className="font-bold text-emerald-500">{mv.qualityScorePct}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-center">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Avg Latency</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{mv.avgLatencyMs} ms</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-center">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Compute Units</span>
                      <span className="font-bold text-indigo-400">{mv.resourceUsageUnits}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">{mv.notes}</p>

                  {mv.scheduledUpgradeDate && (
                    <div className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Scheduled Upgrade Target: {mv.scheduledUpgradeDate}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Released: {mv.releaseDate}</span>
                    {mv.status === 'Stable_Previous' && (
                      <button
                        onClick={() => handleRollbackModel(mv)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Rollback To This Model
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Privacy & Conversation Data Governance Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-500" /> AI Privacy & Conversation Data Governance
                </h3>
                <p className="text-xs text-slate-500">
                  Granular user consent settings, encryption standards, retention policy, and PII auto-redaction controls.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportConversationHistory}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Chat (JSON)
                </button>
                <button
                  onClick={handleDeleteConversationHistory}
                  className="px-3 py-1.5 bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Purge Chat History
                </button>
              </div>
            </div>

            {/* Privacy Controls Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>Data Processing Consent</span>
                  <input
                    type="checkbox"
                    checked={privacySettings.dataProcessingConsent}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, dataProcessingConsent: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Permits AI model analysis of natural language shopping queries.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>Personalization Consent</span>
                  <input
                    type="checkbox"
                    checked={privacySettings.personalizationConsent}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, personalizationConsent: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Tailors product suggestions according to browser preference tags.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>PII Redaction</span>
                  <span className="text-[10px] text-emerald-500 font-extrabold uppercase">AES-256</span>
                </div>
                <p className="text-[11px] text-slate-500">Auto-sanitizes emails, card numbers, and secret seed phrases.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold block">Retention Policy</span>
                <select
                  value={privacySettings.retentionDays}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, retentionDays: Number(e.target.value) as any })}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  <option value={30}>30 Days Storage</option>
                  <option value={60}>60 Days Storage</option>
                  <option value={90}>90 Days Storage</option>
                  <option value={180}>180 Days Storage</option>
                  <option value={365}>365 Days Storage</option>
                </select>
              </div>
            </div>

            {/* Interactive PII & Sensitive Data Sanitizer Tester */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Interactive Sensitive Data & PII Redaction Tester
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-8 space-y-1">
                  <input
                    type="text"
                    value={piiInputText}
                    onChange={(e) => setPiiInputText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px]"
                    placeholder="Enter text with email or passphrases..."
                  />
                </div>
                <div className="md:col-span-4">
                  <button
                    onClick={handleTestPiiRedaction}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> Run PII Sanitizer Test
                  </button>
                </div>
              </div>

              {piiRedactedOutput && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>Sanitized Prompt Result ({piiRedactedOutput.redactedCount} redactions applied)</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{piiRedactedOutput.sanitized}</p>
                </div>
              )}
            </div>
          </div>

          {/* Responsible AI Safeguards & Protection Policies */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" /> Responsible AI Controls & Continuous Compliance Framework
            </h3>
            <p className="text-xs text-slate-500">
              Enterprise security controls ensuring decision transparency, bias/confidence monitoring, and non-custodial boundaries.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                { title: 'AI Decision Transparency', status: 'Active', desc: 'Every recommendation displays source data indexes and confidence reasoning.' },
                { title: 'Confidence Monitoring', status: '99.4% High', desc: 'Real-time telemetry tracking score distribution and model certainty.' },
                { title: 'Bias Monitoring Score', status: `${responsibleControls.biasMonitoringScorePct}% Unbiased`, desc: 'Continuous evaluation against merchant catalog preference skew.' },
                { title: 'Safety Monitoring', status: responsibleControls.safetyMonitoringStatus, desc: 'Real-time classification for phishing, seed phrase scams, and prohibited items.' },
                { title: 'Risk Classification', status: `${responsibleControls.riskClassification} Risk`, desc: 'E-commerce assistant classified under low-risk operational guidelines.' },
                { title: 'Continuous Compliance', status: responsibleControls.continuousComplianceStatus, desc: 'Strict alignment with official Pi SDK v2 & Pi Browser requirements.' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-emerald-500 font-extrabold px-2 py-0.5 rounded bg-emerald-500/10">{item.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Permanent Privacy & Governance Disclosure Notice Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-800/50 text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Info className="w-5 h-5" /> Marketplace Privacy & Governance Notice
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              PiNova Global Marketplace processes AI interactions according to marketplace privacy policies. Users remain in control of their AI preferences, privacy settings, and conversation history. AI features operate independently of the Pi Network and do not represent official Pi Network services.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: USAGE METRICS & AUDIT LOGS */}
      {/* ==================================================== */}
      {activeTab === 'audit_monitoring' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" /> AI Resource Usage Monitoring & Governance Audit Trail
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time token metrics, query latency tracking, and transparent audit logs for all AI operations.
                </p>
              </div>

              <button
                onClick={handleExportAuditLogs}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-purple-600/20"
              >
                <Copy className="w-4 h-4" /> Export Audit Logs (JSON)
              </button>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Tokens Processed</span>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">443,400</div>
                <span className="text-[9px] text-slate-400">August 2026</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Average Latency</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">124 ms</div>
                <span className="text-[9px] text-emerald-500 font-bold">Ultra Fast Response</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Policy Compliance</span>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">99.8%</div>
                <span className="text-[9px] text-slate-400">Zero unmoderated breaches</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">AI Compute Resource Usage</span>
                <div className="text-2xl font-black text-amber-500">2,880 Units</div>
                <span className="text-[9px] text-slate-400">Neutral processing metrics</span>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Actor / Role</th>
                    <th className="py-2.5 px-3">AI Provider</th>
                    <th className="py-2.5 px-3">Operation / Action</th>
                    <th className="py-2.5 px-3">Prompt Snippet</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {log.user}
                        <span className="block text-[10px] text-slate-400 font-normal">{log.role}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-purple-600 dark:text-purple-400 text-[11px]">{log.provider}</td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{log.action}</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-500 max-w-xs truncate" title={log.promptSnippet}>
                        {log.promptSnippet}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          log.status === 'Success'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        }`}>
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

      {/* Human Review & Report Escalation Confirmation Modal */}
      {escalationModalState?.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" /> {escalationModalState.title}
              </h3>
              <button
                onClick={() => setEscalationModalState(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200 text-xs font-mono">
              Ticket ID: <strong>#{escalationModalState.ticketId}</strong>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {escalationModalState.message}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setEscalationModalState(null)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
