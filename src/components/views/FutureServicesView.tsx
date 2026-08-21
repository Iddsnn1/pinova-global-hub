import React from 'react';
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Workflow, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Zap, 
  Code,
  Compass
} from 'lucide-react';
import { MainSection } from '../../types/navigation';

interface FutureServicesViewProps {
  onNavigateSection: (section: MainSection, cat?: any) => void;
  onOpenPstpShield?: () => void;
}

export const FutureServicesView: React.FC<FutureServicesViewProps> = ({
  onNavigateSection,
  onOpenPstpShield
}) => {
  const expansionDomains = [
    {
      id: 'ai-agents',
      title: 'Autonomous AI Agents & Intelligent Dispatch',
      badge: 'Architecture Ready',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      description: 'Autonomous micro-services for smart price discovery, automated inventory replenishment, and decentralized task execution powered by Pi Network settlement.'
    },
    {
      id: 'identity-oracles',
      title: 'Decentralized Identity & Verifiable Credentials',
      badge: 'Standards Aligned',
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      description: 'W3C-compliant decentralized identity (DID) verification for cross-platform Pioneer authentication, merchant credit scores, and verified vendor certificates.'
    },
    {
      id: 'cross-border',
      title: 'Cross-Border Escrow & Settlement Oracles',
      badge: 'PSTP Protocol Extension',
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      description: 'Global multi-currency clearance oracles enabling seamless trade settlement between regional supply chains with multi-sig milestone escrow release.'
    },
    {
      id: 'rwa-logistics',
      title: 'Real-World Asset (RWA) & IoT Supply Chain Oracles',
      badge: 'Infrastructure Prepared',
      icon: <Workflow className="w-5 h-5 text-amber-400" />,
      description: 'Cryptographic proof-of-delivery sensors, cold-chain telemetry tracking, and automated carrier milestone confirmations wired directly to smart contracts.'
    },
    {
      id: 'green-energy',
      title: 'Decentralized Micro-Grid & Energy Exchange',
      badge: 'Ecosystem Frontier',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      description: 'P2P solar energy and renewable utility settlement on Pi Network, allowing communities to trade localized kilowatt-hour credits securely.'
    },
    {
      id: 'modular-sdk',
      title: 'Open Platform Ecosystem Connectors',
      badge: 'SDK Ready',
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      description: 'Standardized REST/GraphQL and Webhook connectors for community developers to deploy third-party dApps directly into the PiNova ecosystem.'
    }
  ];

  return (
    <div id="future-services-view" className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 sm:p-10 rounded-2xl border border-purple-900/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>PiNova Global Hub • Core Portal 07</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Future Services & Platform Expansion</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The dedicated expansion portal for upcoming decentralized applications, autonomous services, and ecosystem protocols. Designed to integrate novel platform capabilities seamlessly without restructuring existing core modules.
          </p>
        </div>
      </div>

      {/* Core Architectural Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
            Non-Disruptive Extensibility
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            New capability modules integrate into the unified PiNova Global Hub matrix while preserving the autonomy of Marketplace, Utilities, Travel, and Logistics.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
            Authoritative Pi Payment Verification
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All future services strictly inherit the fail-closed Pi Network Platform API verification (<code className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">/v2/payments</code>) and PSTP Escrow protection.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
            Zero Mock / Zero Simulated Data
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Future services are activated exclusively upon verified backend API configuration and smart contract deployment, guaranteeing authentic execution.
          </p>
        </div>
      </div>

      {/* Planned Expansion Capability Matrix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Platform Expansion Matrix</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                Ecosystem Readiness
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-level capability frameworks scheduled for phased activation in upcoming platform releases
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {expansionDomains.map((domain) => (
            <div
              key={domain.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {domain.icon}
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                    {domain.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {domain.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {domain.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-500 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Portal Enforced</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">v2.0-SEC</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer & Pioneer Action Center */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <h3 className="text-base sm:text-lg font-black text-white">
            Building a New Service on Pi Network?
          </h3>
          <p className="text-xs text-slate-300">
            Access our Developer SDK and API endpoints to integrate your decentralized services, utility gateways, or logistics carriers with PiNova's native PSTP Escrow.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateSection('developer_platform')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Code className="w-4 h-4" />
            <span>Developer SDK</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onOpenPstpShield && (
            <button
              onClick={onOpenPstpShield}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>PSTP Security Specs</span>
            </button>
          )}

          <button
            onClick={() => onNavigateSection('home')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            Back to Global Hub
          </button>
        </div>
      </div>

    </div>
  );
};
