import React, { useState } from 'react';
import {
  Gift,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  BarChart3,
  TrendingUp,
  Globe,
  Smartphone,
  Plus,
  Play,
  Pause,
  Download,
  Search,
  Filter,
  Copy,
  Check,
  Share2,
  Award,
  Info,
  HelpCircle,
  RefreshCw,
  Sliders,
  Eye,
  CheckSquare,
  Trophy,
  Medal,
  Star,
  Users,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Tag,
  Lock,
  History,
  Scale,
  RotateCcw,
  AlertCircle,
  Calendar,
  FileCheck,
  UserX,
  Send,
  ArrowRight,
  ShieldX,
  Activity
} from 'lucide-react';
import { PiUser } from '../../types';

interface ReferralGovernanceHubProps {
  user: PiUser;
}

export type SubTab =
  | 'dashboard'
  | 'recognition_leaderboard'
  | 'governance_dashboard'
  | 'appeals_system'
  | 'antifraud_verification'
  | 'analytics'
  | 'admin_controls'
  | 'policy_center';

export type VerificationState =
  | 'Invitation Sent'
  | 'Invitation Accepted'
  | 'Registration Completed'
  | 'Identity Verified'
  | 'Eligible Referral'
  | 'Campaign Benefit Applied'
  | 'Rejected'
  | 'Under Review';

export type RecognitionStatus =
  | 'Active'
  | 'Under Review'
  | 'Suspended'
  | 'Revoked'
  | 'Expired'
  | 'Reinstated';

export type BadgeValidityType =
  | 'Permanent Recognition'
  | 'Time-Limited Recognition'
  | 'Renewable Recognition'
  | 'Activity-Based Recognition';

export interface UserRecognitionRecord {
  id: string;
  username: string;
  badgeTitle: string;
  category: 'Referrals' | 'Community Activity' | 'Helpful Q&A' | 'Store Advocacy';
  status: RecognitionStatus;
  validityType: BadgeValidityType;
  awardDate: string;
  expiryDate?: string;
  renewalThreshold?: string;
  lastActivityDate: string;
  reasonNotes?: string;
}

export interface RecognitionHistoryLog {
  id: string;
  recognitionId: string;
  username: string;
  badgeTitle: string;
  action: 'Awarded' | 'Status Changed' | 'Suspended' | 'Revoked' | 'Expired' | 'Reinstated' | 'Appeal Submitted' | 'Appeal Approved' | 'Appeal Rejected';
  fromStatus?: RecognitionStatus;
  toStatus: RecognitionStatus;
  timestamp: string;
  performedBy: string;
  notes: string;
}

export interface AppealRecord {
  id: string;
  recognitionId: string;
  username: string;
  badgeTitle: string;
  appealType: 'Status Review' | 'Suspension Appeal' | 'Revocation Appeal' | 'Expiration Renewal';
  reason: string;
  supportingInfo: string;
  status: 'Submitted' | 'In Review' | 'Approved' | 'Rejected' | 'Info Requested';
  submittedDate: string;
  reviewedDate?: string;
  decisionNotes?: string;
  reviewer?: string;
}

interface ReferralRecord {
  id: string;
  invitedUser: string;
  dateSent: string;
  status: VerificationState;
  benefit: string;
  riskScore: 'Low' | 'Medium' | 'High';
  deviceInfo: string;
  country: string;
}

interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Ended';
  benefitType: string;
  startDate: string;
  endDate: string;
  totalParticipants: number;
}

interface RecognitionTitleConfig {
  id: string;
  title: string;
  category: 'Referrals' | 'Community Activity' | 'Helpful Q&A' | 'Store Advocacy';
  validityType: BadgeValidityType;
  validityDays: number;
  minThreshold: number;
  badgeColor: string;
  enabled: boolean;
}

export const ReferralGovernanceHub: React.FC<ReferralGovernanceHubProps> = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('dashboard');
  const [referralCopied, setReferralCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Recognition Title Administrator Settings
  const [recognitionTitles, setRecognitionTitles] = useState<RecognitionTitleConfig[]>([
    { id: 'rt-1', title: 'Verified Community Advocate', category: 'Referrals', validityType: 'Renewable Recognition', validityDays: 180, minThreshold: 50, badgeColor: 'bg-purple-600 text-white', enabled: true },
    { id: 'rt-2', title: 'Community Champion', category: 'Referrals', validityType: 'Time-Limited Recognition', validityDays: 90, minThreshold: 100, badgeColor: 'bg-amber-500 text-slate-900', enabled: true },
    { id: 'rt-3', title: 'Top Marketplace Referrer', category: 'Referrals', validityType: 'Activity-Based Recognition', validityDays: 30, minThreshold: 150, badgeColor: 'bg-emerald-600 text-white', enabled: true },
    { id: 'rt-4', title: 'Trusted Community Contributor', category: 'Helpful Q&A', validityType: 'Permanent Recognition', validityDays: 0, minThreshold: 30, badgeColor: 'bg-blue-600 text-white', enabled: true },
    { id: 'rt-5', title: 'Verified Community Contributor', category: 'Community Activity', validityType: 'Renewable Recognition', validityDays: 120, minThreshold: 20, badgeColor: 'bg-indigo-600 text-white', enabled: true },
    { id: 'rt-6', title: 'Community Leader', category: 'Store Advocacy', validityType: 'Time-Limited Recognition', validityDays: 365, minThreshold: 45, badgeColor: 'bg-rose-600 text-white', enabled: true },
    { id: 'rt-7', title: 'Marketplace Advocate', category: 'Store Advocacy', validityType: 'Activity-Based Recognition', validityDays: 60, minThreshold: 25, badgeColor: 'bg-teal-600 text-white', enabled: true }
  ]);

  // User Recognition State Records (Lifecycle System)
  const [userRecognitions, setUserRecognitions] = useState<UserRecognitionRecord[]>([
    {
      id: 'rec-001',
      username: '@Pioneer_Leader_VN',
      badgeTitle: 'Top Marketplace Referrer',
      category: 'Referrals',
      status: 'Active',
      validityType: 'Activity-Based Recognition',
      awardDate: '2026-05-10',
      expiryDate: '2026-11-10',
      renewalThreshold: '15 Active Referrals / Month',
      lastActivityDate: '2026-08-03'
    },
    {
      id: 'rec-002',
      username: '@Nigeria_Pi_Hub',
      badgeTitle: 'Verified Community Advocate',
      category: 'Referrals',
      status: 'Active',
      validityType: 'Renewable Recognition',
      awardDate: '2026-03-15',
      expiryDate: '2026-09-15',
      renewalThreshold: '10 Verification Onboardings',
      lastActivityDate: '2026-08-02'
    },
    {
      id: 'rec-003',
      username: '@Seoul_Merchant_HQ',
      badgeTitle: 'Community Champion',
      category: 'Referrals',
      status: 'Under Review',
      validityType: 'Time-Limited Recognition',
      awardDate: '2026-02-01',
      expiryDate: '2026-08-30',
      lastActivityDate: '2026-08-01',
      reasonNotes: 'Flagged by anti-fraud filter for high volume verification check.'
    },
    {
      id: 'rec-004',
      username: '@Crypto_Sam',
      badgeTitle: 'Verified Community Contributor',
      category: 'Community Activity',
      status: 'Suspended',
      validityType: 'Time-Limited Recognition',
      awardDate: '2026-01-20',
      expiryDate: '2026-07-20',
      lastActivityDate: '2026-07-15',
      reasonNotes: 'Temporary suspension pending referral activity verification.'
    },
    {
      id: 'rec-005',
      username: '@Old_Pioneer_Contributor',
      badgeTitle: 'Marketplace Advocate',
      category: 'Store Advocacy',
      status: 'Expired',
      validityType: 'Time-Limited Recognition',
      awardDate: '2025-08-01',
      expiryDate: '2026-02-01',
      lastActivityDate: '2026-01-10',
      reasonNotes: 'Validity period completed without renewal submission.'
    },
    {
      id: 'rec-006',
      username: '@Bot_Account_99',
      badgeTitle: 'Trusted Community Contributor',
      category: 'Helpful Q&A',
      status: 'Revoked',
      validityType: 'Permanent Recognition',
      awardDate: '2026-04-10',
      lastActivityDate: '2026-07-18',
      reasonNotes: 'Revoked due to policy violation (automated script account confirmed).'
    },
    {
      id: 'rec-007',
      username: '@Pioneer_Aisha',
      badgeTitle: 'Community Leader',
      category: 'Store Advocacy',
      status: 'Reinstated',
      validityType: 'Renewable Recognition',
      awardDate: '2026-06-12',
      expiryDate: '2026-12-12',
      lastActivityDate: '2026-08-03',
      reasonNotes: 'Reinstated following successful appeal review #APP-802.'
    }
  ]);

  // Comprehensive Recognition History Audit Logs
  const [historyLogs, setHistoryLogs] = useState<RecognitionHistoryLog[]>([
    {
      id: 'log-101',
      recognitionId: 'rec-007',
      username: '@Pioneer_Aisha',
      badgeTitle: 'Community Leader',
      action: 'Reinstated',
      fromStatus: 'Under Review',
      toStatus: 'Reinstated',
      timestamp: '2026-08-03 14:30',
      performedBy: 'Governance Admin',
      notes: 'Appeal #APP-802 approved. Verified merchant storefront onboarding.'
    },
    {
      id: 'log-102',
      recognitionId: 'rec-003',
      username: '@Seoul_Merchant_HQ',
      badgeTitle: 'Community Champion',
      action: 'Status Changed',
      fromStatus: 'Active',
      toStatus: 'Under Review',
      timestamp: '2026-08-02 09:15',
      performedBy: 'Anti-Fraud System',
      notes: 'Triggered audit threshold: 45 referrals within 2 hours.'
    },
    {
      id: 'log-103',
      recognitionId: 'rec-004',
      username: '@Crypto_Sam',
      badgeTitle: 'Verified Community Contributor',
      action: 'Suspended',
      fromStatus: 'Active',
      toStatus: 'Suspended',
      timestamp: '2026-08-01 16:20',
      performedBy: 'Governance Admin',
      notes: 'Suspended pending supporting activity documentation.'
    },
    {
      id: 'log-104',
      recognitionId: 'rec-006',
      username: '@Bot_Account_99',
      badgeTitle: 'Trusted Community Contributor',
      action: 'Revoked',
      fromStatus: 'Active',
      toStatus: 'Revoked',
      timestamp: '2026-07-25 11:40',
      performedBy: 'Compliance System',
      notes: 'Permanent revocation for self-referral and bot script usage.'
    },
    {
      id: 'log-105',
      recognitionId: 'rec-001',
      username: '@Pioneer_Leader_VN',
      badgeTitle: 'Top Marketplace Referrer',
      action: 'Awarded',
      fromStatus: undefined,
      toStatus: 'Active',
      timestamp: '2026-05-10 10:00',
      performedBy: 'Marketplace System',
      notes: 'Met threshold of 150+ verified marketplace referrals.'
    }
  ]);

  // Appeals Queue & User Submissions
  const [appeals, setAppeals] = useState<AppealRecord[]>([
    {
      id: 'APP-801',
      recognitionId: 'rec-004',
      username: '@Crypto_Sam',
      badgeTitle: 'Verified Community Contributor',
      appealType: 'Suspension Appeal',
      reason: 'Referral rate spike was caused by a local Pi Pioneer meetup event in Seoul where attendees joined using my link.',
      supportingInfo: 'Attached meetup registration log, photos, and event venue receipt.',
      status: 'Submitted',
      submittedDate: '2026-08-02'
    },
    {
      id: 'APP-802',
      recognitionId: 'rec-007',
      username: '@Pioneer_Aisha',
      badgeTitle: 'Community Leader',
      appealType: 'Status Review',
      reason: 'Requested reinstatement after submitting proof of 2 active merchant stores onboarded.',
      supportingInfo: 'Store IDs: #STORE-201, #STORE-202 on PiNova marketplace.',
      status: 'Approved',
      submittedDate: '2026-08-01',
      reviewedDate: '2026-08-03',
      reviewer: 'Governance Admin',
      decisionNotes: 'Verified active transaction volume on both merchant storefronts. Badge reinstated.'
    },
    {
      id: 'APP-803',
      recognitionId: 'rec-005',
      username: '@Old_Pioneer_Contributor',
      badgeTitle: 'Marketplace Advocate',
      appealType: 'Expiration Renewal',
      reason: 'Requesting badge renewal based on 3 new community guides published in July 2026.',
      supportingInfo: 'Guide Links: #GUIDE-41, #GUIDE-42, #GUIDE-45.',
      status: 'In Review',
      submittedDate: '2026-08-03'
    }
  ]);

  // Appeal Submission Modal State
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealTargetRec, setAppealTargetRec] = useState<UserRecognitionRecord | null>(null);
  const [appealType, setAppealType] = useState<'Status Review' | 'Suspension Appeal' | 'Revocation Appeal' | 'Expiration Renewal'>('Status Review');
  const [appealReason, setAppealReason] = useState('');
  const [appealInfo, setAppealInfo] = useState('');

  // Admin Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealRecord | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'Rejected' | 'Info Requested'>('Approved');
  const [reviewNotes, setReviewNotes] = useState('');

  // Manual Status Change State
  const [statusChangeRec, setStatusChangeRec] = useState<UserRecognitionRecord | null>(null);
  const [targetStatus, setTargetStatus] = useState<RecognitionStatus>('Under Review');
  const [statusChangeNotes, setStatusChangeNotes] = useState('');

  // Sample Campaign state
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'cmp-01',
      name: 'Summer Pioneer Growth Drive',
      status: 'Active',
      benefitType: '15% Marketplace Discount Voucher',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      totalParticipants: 420
    },
    {
      id: 'cmp-02',
      name: 'Merchant Expansion Initiative',
      status: 'Active',
      benefitType: 'Featured Storefront Placement Voucher',
      startDate: '2026-07-15',
      endDate: '2026-09-15',
      totalParticipants: 185
    },
    {
      id: 'cmp-03',
      name: 'Early Pioneer Pioneer Loyalty Campaign',
      status: 'Ended',
      benefitType: 'Zero Platform Fee Voucher (30 days)',
      startDate: '2026-01-01',
      endDate: '2026-05-31',
      totalParticipants: 1250
    }
  ]);

  // Sample Referral records
  const [referrals] = useState<ReferralRecord[]>([
    {
      id: 'ref-101',
      invitedUser: '@Pioneer_Elena',
      dateSent: '2026-08-03',
      status: 'Campaign Benefit Applied',
      benefit: '15% Off Marketplace Voucher',
      riskScore: 'Low',
      deviceInfo: 'Pi Browser iOS',
      country: 'Vietnam'
    },
    {
      id: 'ref-102',
      invitedUser: '@Merchant_Global',
      dateSent: '2026-08-01',
      status: 'Identity Verified',
      benefit: 'Featured Store Placement',
      riskScore: 'Low',
      deviceInfo: 'Pi Browser Android',
      country: 'Nigeria'
    },
    {
      id: 'ref-103',
      invitedUser: '@Crypto_Sam',
      dateSent: '2026-07-28',
      status: 'Under Review',
      benefit: 'Tier 1 Campaign Incentive',
      riskScore: 'Medium',
      deviceInfo: 'Web Desktop',
      country: 'South Korea'
    },
    {
      id: 'ref-104',
      invitedUser: '@Pioneer_Dave',
      dateSent: '2026-07-24',
      status: 'Registration Completed',
      benefit: '10% Off Marketplace Voucher',
      riskScore: 'Low',
      deviceInfo: 'Pi Browser Android',
      country: 'United States'
    },
    {
      id: 'ref-105',
      invitedUser: '@Bot_Account_99',
      dateSent: '2026-07-20',
      status: 'Rejected',
      benefit: 'None (Self-Referral Flag)',
      riskScore: 'High',
      deviceInfo: 'Automated Script',
      country: 'Unknown'
    },
    {
      id: 'ref-106',
      invitedUser: '@Pioneer_Aisha',
      dateSent: '2026-07-18',
      status: 'Eligible Referral',
      benefit: '15% Off Marketplace Voucher',
      riskScore: 'Low',
      deviceInfo: 'Pi Browser iOS',
      country: 'Egypt'
    }
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://pinova.app/invite?ref=${user.username}`);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2500);
  };

  const handleExportAuditReport = () => {
    setDownloadNotice('Governance Audit Logs & Recognition History exported successfully (CSV format).');
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleToggleTitleStatus = (id: string) => {
    setRecognitionTitles(prev =>
      prev.map(t => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  // Submit User Appeal
  const handleCreateAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealTargetRec || !appealReason) return;

    const newAppeal: AppealRecord = {
      id: `APP-${Math.floor(800 + Math.random() * 100)}`,
      recognitionId: appealTargetRec.id,
      username: appealTargetRec.username,
      badgeTitle: appealTargetRec.badgeTitle,
      appealType,
      reason: appealReason,
      supportingInfo: appealInfo || 'No additional file/link attached.',
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setAppeals(prev => [newAppeal, ...prev]);

    // Update status to Under Review if suspended or active
    setUserRecognitions(prev =>
      prev.map(r => {
        if (r.id === appealTargetRec.id && r.status !== 'Under Review') {
          return { ...r, status: 'Under Review' };
        }
        return r;
      })
    );

    // Audit Log
    const log: RecognitionHistoryLog = {
      id: `log-${Date.now()}`,
      recognitionId: appealTargetRec.id,
      username: appealTargetRec.username,
      badgeTitle: appealTargetRec.badgeTitle,
      action: 'Appeal Submitted',
      fromStatus: appealTargetRec.status,
      toStatus: 'Under Review',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      performedBy: user.username,
      notes: `Appeal submitted (${appealType}): ${appealReason.slice(0, 60)}...`
    };
    setHistoryLogs(prev => [log, ...prev]);

    setShowAppealModal(false);
    setAppealReason('');
    setAppealInfo('');
    setAppealTargetRec(null);
    setDownloadNotice(`Appeal ${newAppeal.id} submitted successfully. Status is now tracked in Appeals Queue.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  // Admin Review Appeal Action
  const handleProcessAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppeal) return;

    const nextStatus: RecognitionStatus =
      reviewDecision === 'Approved' ? 'Reinstated' : reviewDecision === 'Rejected' ? 'Revoked' : 'Under Review';

    // Update Appeal record
    setAppeals(prev =>
      prev.map(a => {
        if (a.id === selectedAppeal.id) {
          return {
            ...a,
            status: reviewDecision,
            reviewedDate: new Date().toISOString().split('T')[0],
            reviewer: 'Governance Admin',
            decisionNotes: reviewNotes || 'Decision processed by Governance Administrator.'
          };
        }
        return a;
      })
    );

    // Update User Recognition Record Status
    setUserRecognitions(prev =>
      prev.map(r => {
        if (r.id === selectedAppeal.recognitionId) {
          return {
            ...r,
            status: nextStatus,
            reasonNotes: reviewNotes || `Appeal decision: ${reviewDecision}`
          };
        }
        return r;
      })
    );

    // Audit Log Entry
    const log: RecognitionHistoryLog = {
      id: `log-${Date.now()}`,
      recognitionId: selectedAppeal.recognitionId,
      username: selectedAppeal.username,
      badgeTitle: selectedAppeal.badgeTitle,
      action: reviewDecision === 'Approved' ? 'Appeal Approved' : 'Appeal Rejected',
      fromStatus: 'Under Review',
      toStatus: nextStatus,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      performedBy: 'Governance Admin',
      notes: `Appeal ${selectedAppeal.id} ${reviewDecision}. Decision Notes: ${reviewNotes}`
    };
    setHistoryLogs(prev => [log, ...prev]);

    setShowReviewModal(false);
    setSelectedAppeal(null);
    setReviewNotes('');
    setDownloadNotice(`Appeal ${selectedAppeal.id} decision recorded. User recognition status updated to ${nextStatus}.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  // Manual Status Change Handler by Admin
  const handleExecStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusChangeRec) return;

    const oldStatus = statusChangeRec.status;

    setUserRecognitions(prev =>
      prev.map(r => {
        if (r.id === statusChangeRec.id) {
          return {
            ...r,
            status: targetStatus,
            reasonNotes: statusChangeNotes || `Status updated manually to ${targetStatus}`
          };
        }
        return r;
      })
    );

    // Audit Log
    const log: RecognitionHistoryLog = {
      id: `log-${Date.now()}`,
      recognitionId: statusChangeRec.id,
      username: statusChangeRec.username,
      badgeTitle: statusChangeRec.badgeTitle,
      action: targetStatus === 'Suspended' ? 'Suspended' : targetStatus === 'Revoked' ? 'Revoked' : targetStatus === 'Reinstated' ? 'Reinstated' : 'Status Changed',
      fromStatus: oldStatus,
      toStatus: targetStatus,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      performedBy: 'Governance Admin',
      notes: statusChangeNotes || `Manual status update from ${oldStatus} to ${targetStatus}`
    };
    setHistoryLogs(prev => [log, ...prev]);

    setStatusChangeRec(null);
    setStatusChangeNotes('');
    setDownloadNotice(`Status for ${statusChangeRec.username} updated from ${oldStatus} to ${targetStatus}.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const getLifecycleStatusBadge = (status: RecognitionStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Reinstated':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Suspended':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'Expired':
        return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
      case 'Revoked':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
    }
  };

  const filteredReferrals = referrals.filter(r => {
    const matchesSearch = r.invitedUser.toLowerCase().includes(searchQuery.toLowerCase()) || r.benefit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase().replace(/ /g, '_') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Transparency & Regulatory Compliance Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-800/40 text-slate-100 shadow-xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold border border-purple-500/30">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="font-black text-base text-white flex items-center gap-2">
                PiNova Enterprise Community Recognition Governance Hub
              </h2>
              <p className="text-xs text-slate-300">
                Transparent lifecycle management, badge validity control, audit history, and appeals system compliant with Official Pi SDK v2 & Platform Policy.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" /> SDK v2 Compliant • Pi Browser Certified
          </div>
        </div>

        {/* Mandatory Transparency Notice */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300/95 leading-relaxed flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Transparency Notice:</strong> Community recognition titles, badges, and leaderboards are awarded solely by PiNova Global Hub based on platform participation and community contributions. They may be reviewed, updated, suspended, or revoked according to published community policies, and do not represent any official role, endorsement, certification, or affiliation with the Pi Network.
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'dashboard', label: 'Referral Dashboard', icon: Gift },
          { id: 'recognition_leaderboard', label: 'Community Leaderboards & Badges', icon: Trophy },
          { id: 'governance_dashboard', label: 'Governance & Analytics Dashboard', icon: Activity },
          { id: 'appeals_system', label: `Appeals Queue (${appeals.filter(a => a.status === 'Submitted' || a.status === 'In Review').length})`, icon: Scale },
          { id: 'antifraud_verification', label: 'Anti-Fraud & Verification', icon: ShieldAlert },
          { id: 'analytics', label: 'Growth Analytics', icon: BarChart3 },
          { id: 'admin_controls', label: 'Badge Validity & Title Settings', icon: Sliders },
          { id: 'policy_center', label: 'Policy & Transparency Center', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

      {downloadNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between gap-2 animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {downloadNotice}
          </div>
          <button onClick={() => setDownloadNotice(null)} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* SUB-TAB 1: REFERRAL DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Invitation Control */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-600" /> Pioneer Referral Progress & Activity
                  </h3>
                  <p className="text-xs text-slate-500">Track your unique Pioneer invitation performance and verified marketplace campaign benefits.</p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-purple-600/20"
                >
                  {referralCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  {referralCopied ? 'Link Copied!' : 'Copy Unique Invite Link'}
                </button>
              </div>

              {/* Unique Link Input Box */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 space-y-2">
                <label className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> Your Unique Pioneer Invitation URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://pinova.app/invite?ref=${user.username}`}
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Core Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Invitations Sent</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">28</div>
                  <span className="text-[9px] text-slate-400">Unique Pioneer links</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Successful Registrations</span>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">18</div>
                  <span className="text-[9px] text-emerald-500 font-bold">Verified Pioneer accounts</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Active Referrals</span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">12</div>
                  <span className="text-[9px] text-slate-400">Active buyers/sellers</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Referral Conversion Rate</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">64.2%</div>
                  <span className="text-[9px] text-emerald-500 font-bold">High engagement ratio</span>
                </div>
              </div>

              {/* Filterable Activity Table */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" /> Referral Activity Timeline & Verification History
                  </h4>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-48">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search referral..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-medium"
                    >
                      <option value="all">All States</option>
                      <option value="invitation_sent">Invitation Sent</option>
                      <option value="invitation_accepted">Invitation Accepted</option>
                      <option value="registration_completed">Registration Completed</option>
                      <option value="identity_verified">Identity Verified</option>
                      <option value="eligible_referral">Eligible Referral</option>
                      <option value="campaign_benefit_applied">Campaign Benefit Applied</option>
                      <option value="under_review">Under Review</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                        <th className="py-2.5 px-3">Invited Pioneer</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Verification State</th>
                        <th className="py-2.5 px-3">Risk Assessment</th>
                        <th className="py-2.5 px-3 text-right">Promotional Benefit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredReferrals.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                            No referral records match your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredReferrals.map((item) => (
                          <tr key={item.id}>
                            <td className="py-3 px-3 font-bold font-mono text-slate-900 dark:text-white">
                              {item.invitedUser}
                              <span className="block text-[10px] text-slate-400 font-normal">{item.deviceInfo} • {item.country}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-400 text-[11px]">{item.dateSent}</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.riskScore === 'Low'
                                  ? 'bg-emerald-500/10 text-emerald-600'
                                  : item.riskScore === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-600'
                                  : 'bg-rose-500/10 text-rose-600'
                              }`}>
                                {item.riskScore} Risk
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-purple-600 dark:text-purple-400 text-[11px]">
                              {item.benefit}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Side Panel: Active Campaign Benefits */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" /> Active Marketplace Campaigns
                </h3>
                <p className="text-xs text-slate-500">
                  Promotional incentives currently configured by PiNova Global Hub.
                </p>

                <div className="space-y-3">
                  {campaigns.filter(c => c.status === 'Active').map(cmp => (
                    <div key={cmp.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{cmp.name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">Active</span>
                      </div>
                      <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                        {cmp.benefitType}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Participants: {cmp.totalParticipants}</span>
                        <span>Ends: {cmp.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anti-Fraud Protection Status */}
              <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-200 space-y-3">
                <h4 className="font-bold text-xs text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Anti-Fraud Shield Active
                </h4>
                <p className="text-[11px] leading-relaxed text-emerald-200/80">
                  Self-referrals, bot accounts, and automated script invites are strictly monitored and filtered out to preserve fair marketplace campaign distribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COMMUNITY LEADERBOARDS & LIFECYCLE RECOGNITIONS */}
      {activeSubTab === 'recognition_leaderboard' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-900 dark:text-indigo-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-black text-indigo-700 dark:text-indigo-400">
              <Info className="w-4 h-4 flex-shrink-0" /> Marketplace Scope & Recognition Lifecycle Rules
            </div>
            <p className="leading-relaxed text-[11px] text-indigo-800/90 dark:text-indigo-300/90">
              Community recognition titles, badges, and leaderboards are awarded solely by PiNova Global Hub based on platform participation and community contributions. Recognitions transition through active lifecycle states (Active, Under Review, Suspended, Revoked, Expired, Reinstated) and do not represent any official role or affiliation with the Pi Network.
            </p>
          </div>

          {/* User Recognitions Lifecycle Registry */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Medal className="w-5 h-5 text-purple-600" /> Community Recognition Lifecycle Registry
                </h3>
                <p className="text-xs text-slate-500">
                  Active recognition badges, validity models, and lifecycle statuses across PiNova contributors.
                </p>
              </div>

              <button
                onClick={() => {
                  const targetRec = userRecognitions.find(r => r.username === user.username) || userRecognitions[0];
                  setAppealTargetRec(targetRec);
                  setShowAppealModal(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-purple-600/20"
              >
                <Scale className="w-4 h-4" /> Request Review / Submit Appeal
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-2.5 px-3">Contributor</th>
                    <th className="py-2.5 px-3">Recognition Title</th>
                    <th className="py-2.5 px-3">Lifecycle State</th>
                    <th className="py-2.5 px-3">Validity Model</th>
                    <th className="py-2.5 px-3">Award Date / Expiry</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {userRecognitions.map(rec => (
                    <tr key={rec.id}>
                      <td className="py-3 px-3 font-bold font-mono text-slate-900 dark:text-white">
                        {rec.username}
                        <span className="block text-[10px] text-slate-400 font-normal">Last Active: {rec.lastActivityDate}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{rec.badgeTitle}</span>
                        <span className="text-[10px] text-purple-500 font-medium">{rec.category}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getLifecycleStatusBadge(rec.status)}`}>
                          {rec.status}
                        </span>
                        {rec.reasonNotes && (
                          <span className="block text-[9px] text-slate-400 mt-1 max-w-xs truncate" title={rec.reasonNotes}>
                            Note: {rec.reasonNotes}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px]">
                          {rec.validityType}
                        </span>
                        {rec.renewalThreshold && (
                          <span className="block text-[9px] text-indigo-400 font-medium mt-0.5">Req: {rec.renewalThreshold}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        <div>Awarded: {rec.awardDate}</div>
                        {rec.expiryDate ? (
                          <div className="text-amber-500 font-semibold text-[10px]">Expires: {rec.expiryDate}</div>
                        ) : (
                          <div className="text-emerald-500 font-semibold text-[10px]">Permanent</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setAppealTargetRec(rec);
                            setShowAppealModal(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-lg transition-colors"
                        >
                          Appeal / Review
                        </button>
                        <button
                          onClick={() => {
                            setStatusChangeRec(rec);
                            setTargetStatus(rec.status === 'Suspended' ? 'Reinstated' : 'Suspended');
                          }}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-lg"
                        >
                          Admin Change
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Leaderboards */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Leaderboard 1: Top Marketplace Referrers */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">Top Marketplace Referrers</h3>
                      <p className="text-xs text-slate-500">Ranked by verified merchant and buyer onboarding within PiNova.</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-[10px] uppercase">
                    Referral Performance
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { rank: 1, name: '@Pioneer_Leader_VN', verifiedCount: 142, conversionRate: '78.4%', badge: 'Top Marketplace Referrer', level: 'Level 4 Champion' },
                    { rank: 2, name: '@Nigeria_Pi_Hub', verifiedCount: 118, conversionRate: '74.1%', badge: 'Verified Community Advocate', level: 'Level 3 Advocate' },
                    { rank: 3, name: '@Seoul_Merchant_HQ', verifiedCount: 94, conversionRate: '69.8%', badge: 'Community Champion', level: 'Level 3 Champion' },
                    { rank: 4, name: '@Global_Trade_Master', verifiedCount: 67, conversionRate: '65.2%', badge: 'Verified Community Contributor', level: 'Level 2 Contributor' }
                  ].map(item => (
                    <div key={item.rank} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-2xl flex items-center justify-center font-black text-xs ${
                          item.rank === 1 ? 'bg-amber-400 text-slate-900 shadow-sm' : item.rank === 2 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                        }`}>
                          #{item.rank}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                            {item.name}
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] mt-0.5">
                            <span className="px-2 py-0.5 rounded bg-purple-600/10 text-purple-600 dark:text-purple-400 font-extrabold">
                              {item.badge}
                            </span>
                            <span className="text-slate-400">• {item.level}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold self-end sm:self-auto">
                        <div className="text-right">
                          <span className="text-slate-900 dark:text-white block">{item.verifiedCount} Verified</span>
                          <span className="text-[10px] text-emerald-500 font-extrabold">{item.conversionRate} Conversion</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Side Panel: Configured Validity Models */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" /> Badge Validity Framework
                </h3>
                <p className="text-xs text-slate-500">4 distinct badge validity architectures supported in PiNova.</p>

                <div className="space-y-2">
                  {[
                    { type: 'Permanent Recognition', desc: 'Remains active indefinitely unless policy violation occurs.' },
                    { type: 'Time-Limited Recognition', desc: 'Valid for fixed duration (e.g., 90/180/365 days).' },
                    { type: 'Renewable Recognition', desc: 'Requires periodic re-validation or activity submission.' },
                    { type: 'Activity-Based Recognition', desc: 'Requires ongoing minimum monthly marketplace contributions.' }
                  ].map((vm, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-bold text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {vm.type}
                      </div>
                      <p className="text-[10px] text-slate-400">{vm.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GOVERNANCE DASHBOARD */}
      {activeSubTab === 'governance_dashboard' && (
        <div className="space-y-6">
          
          {/* Top Governance Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-md">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Active Recognitions</span>
              <div className="text-2xl font-black text-emerald-500">
                {userRecognitions.filter(r => r.status === 'Active' || r.status === 'Reinstated').length}
              </div>
              <span className="text-[9px] text-emerald-600 font-bold">100% Compliant</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-md">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Expiring Recognitions</span>
              <div className="text-2xl font-black text-amber-500">
                {userRecognitions.filter(r => r.status === 'Expired' || (r.expiryDate && new Date(r.expiryDate) <= new Date('2026-09-30'))).length}
              </div>
              <span className="text-[9px] text-amber-600 font-bold">Require Renewal</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-md">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Under Review</span>
              <div className="text-2xl font-black text-indigo-500">
                {userRecognitions.filter(r => r.status === 'Under Review').length}
              </div>
              <span className="text-[9px] text-indigo-400 font-bold">Pending Audit</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-md">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Suspended / Revoked</span>
              <div className="text-2xl font-black text-rose-500">
                {userRecognitions.filter(r => r.status === 'Suspended' || r.status === 'Revoked').length}
              </div>
              <span className="text-[9px] text-rose-400 font-bold">Policy Enforcement</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-md">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Appeals Pending</span>
              <div className="text-2xl font-black text-purple-600">
                {appeals.filter(a => a.status === 'Submitted' || a.status === 'In Review').length}
              </div>
              <span className="text-[9px] text-purple-500 font-bold">Queue Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-md">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Audit History Logs</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {historyLogs.length}
              </div>
              <span className="text-[9px] text-slate-400">Total Recorded</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Audit History Log */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-600" /> Recognition Governance Audit Log
                  </h3>
                  <p className="text-xs text-slate-500">Immutable record of badge awards, status changes, suspensions, reinstatements, and appeal decisions.</p>
                </div>

                <button
                  onClick={handleExportAuditReport}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-purple-500" /> Export CSV Audit
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">User & Badge</th>
                      <th className="py-2.5 px-3">Action Type</th>
                      <th className="py-2.5 px-3">Performed By</th>
                      <th className="py-2.5 px-3">Decision Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {historyLogs.map(log => (
                      <tr key={log.id}>
                        <td className="py-3 px-3 text-slate-400 font-mono text-[10px] whitespace-nowrap">{log.timestamp}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 dark:text-white block font-mono">{log.username}</span>
                          <span className="text-[10px] text-purple-500 font-semibold">{log.badgeTitle}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.action === 'Reinstated' || log.action === 'Appeal Approved' || log.action === 'Awarded'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : log.action === 'Suspended' || log.action === 'Revoked' || log.action === 'Appeal Rejected'
                              ? 'bg-rose-500/10 text-rose-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">{log.performedBy}</td>
                        <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs leading-tight">{log.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Panel: Badge Analytics & Validity Distribution */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" /> Badge Usage Analytics
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Renewable Recognition</span>
                      <span className="text-purple-600 dark:text-purple-400">42%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Time-Limited Recognition</span>
                      <span className="text-amber-500">31%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '31%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Activity-Based Recognition</span>
                      <span className="text-indigo-500">18%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Permanent Recognition</span>
                      <span className="text-emerald-500">9%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '9%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expiring Badge Alert Box */}
              <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-800/40 text-amber-200 space-y-3">
                <h4 className="font-bold text-xs text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" /> Expiring & Renewal Actions
                </h4>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  2 community recognitions are reaching their validity expiration within 30 days. Automated renewal notifications have been triggered to active holders.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: APPEALS & REVIEWS QUEUE */}
      {activeSubTab === 'appeals_system' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">Community Appeals & Recognition Review System</h3>
                  <p className="text-xs text-slate-500">Fair governance mechanism for requesting recognition reviews, appealing suspensions, or submitting activity evidence.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const targetRec = userRecognitions[0];
                  setAppealTargetRec(targetRec);
                  setShowAppealModal(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-purple-600/20"
              >
                <Plus className="w-4 h-4" /> Submit New Appeal
              </button>
            </div>

            {/* Appeals Queue Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-2.5 px-3">Appeal ID</th>
                    <th className="py-2.5 px-3">Contributor</th>
                    <th className="py-2.5 px-3">Badge Title</th>
                    <th className="py-2.5 px-3">Appeal Type</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Submitted Date</th>
                    <th className="py-2.5 px-3 text-right">Governance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {appeals.map(app => (
                    <tr key={app.id}>
                      <td className="py-3 px-3 font-bold font-mono text-purple-600 dark:text-purple-400">{app.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white font-mono">{app.username}</td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{app.badgeTitle}</td>
                      <td className="py-3 px-3 text-slate-500 font-semibold">{app.appealType}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : app.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            : app.status === 'In Review'
                            ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{app.submittedDate}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedAppeal(app);
                            setShowReviewModal(true);
                          }}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] rounded-lg shadow-sm"
                        >
                          Review Appeal
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

      {/* SUB-TAB 5: ANTI-FRAUD & VERIFICATION */}
      {activeSubTab === 'antifraud_verification' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">Enterprise Anti-Fraud Safeguards & Verification</h3>
                  <p className="text-xs text-slate-500">Automated fraud detection engine protecting marketplace campaigns against exploitation.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">System Fraud Defense Index:</span>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-black text-xs rounded-xl">
                  98.4% Clean Activity
                </span>
              </div>
            </div>

            {/* Safeguards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Duplicate Account Shield', desc: 'Prevents multi-accounting via device fingerprinting & Pi Auth verification.', status: 'Active Guard', icon: UserCheck },
                { title: 'Self-Referral Prevention', desc: 'Blocks users from referring their own secondary wallets or IPs.', status: 'Active Guard', icon: XCircle },
                { title: 'Automated / Bot Filter', desc: 'Detects artificial registration spikes and headless browser sessions.', status: 'Active Guard', icon: ShieldAlert },
                { title: 'Campaign Manipulation Guard', desc: 'Flags abnormal rapid benefit claims for admin review.', status: 'Active Guard', icon: Lock }
              ].map((sg, idx) => {
                const IconComponent = sg.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <IconComponent className="w-5 h-5 text-purple-600" />
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {sg.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{sg.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{sg.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: GROWTH ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" /> Referral Performance & Growth Analytics
              </h3>
              <p className="text-xs text-slate-500">Comprehensive insights into invitation volume, conversion funnel, and campaign performance.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-500">Average Time to Conversion</span>
                <div className="text-xl font-black text-slate-900 dark:text-white">4.2 Hours</div>
                <p className="text-[10px] text-slate-400">From invitation click to active marketplace verification.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-500">Campaign Retention Rate</span>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400">84.6%</div>
                <p className="text-[10px] text-slate-400">Invited users who complete 2+ marketplace orders.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: BADGE VALIDITY & TITLE SETTINGS */}
      {activeSubTab === 'admin_controls' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600" /> Community Recognition Title & Validity Configuration
              </h3>
              <p className="text-xs text-slate-500">Configure recognition titles, assign validity models (Permanent, Time-Limited, Renewable, Activity-Based), and set thresholds.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-2.5 px-3">Title Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Validity Model</th>
                    <th className="py-2.5 px-3">Validity Days</th>
                    <th className="py-2.5 px-3">Min Threshold</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recognitionTitles.map(t => (
                    <tr key={t.id}>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{t.title}</td>
                      <td className="py-3 px-3 text-slate-400">{t.category}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[10px]">
                          {t.validityType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-bold">
                        {t.validityDays > 0 ? `${t.validityDays} Days` : 'Permanent'}
                      </td>
                      <td className="py-3 px-3 text-slate-900 dark:text-slate-100 font-bold">{t.minThreshold} Actions</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.enabled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {t.enabled ? 'Active Title' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleToggleTitleStatus(t.id)}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-lg"
                        >
                          {t.enabled ? 'Disable Title' : 'Enable Title'}
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

      {/* SUB-TAB 8: REFERRAL & RECOGNITION POLICY CENTER */}
      {activeSubTab === 'policy_center' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" /> Enterprise Referral & Recognition Policy Center
              </h3>
              <p className="text-xs text-slate-500">Official guidelines, compliance mandates, and terms of participation for PiNova Global Hub.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Program Overview & Rules */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-purple-600" /> 1. Program Overview & Ownership
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    The Referral & Community Recognition Program is an independent platform feature owned, operated, and managed solely by PiNova Global Hub. It is designed to reward Pioneers for introducing verified merchants and shoppers to our ecosystem.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-600" /> 2. Pioneer Eligibility & Fair Participation
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Participants must possess an active, verified Pi Pioneer account. Accounts found engaging in self-referrals, bot generation, or fake registrations will be disqualified from campaign benefits and recognition badges.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" /> 3. Community Recognition Titles, Badges & Governance
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Community recognition titles, badges, and leaderboards are awarded solely by PiNova Global Hub based on platform participation and community contributions. They may be reviewed, updated, suspended, or revoked according to published community policies, and do not represent any official role, endorsement, certification, or affiliation with the Pi Network.
                  </p>
                </div>
              </div>

              {/* FAQs & Privacy Notice */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-600" /> Frequently Asked Questions (FAQ)
                  </h4>
                  <div className="space-y-2 text-[11px]">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Q: Does the Pi Network provide referral Pi coins or official titles?</span>
                      <p className="text-slate-500">A: No. All promotional incentives and recognition badges are marketplace benefits issued by PiNova and not by the Pi Core Team.</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Q: How can I appeal a recognition suspension or status update?</span>
                      <p className="text-slate-500">A: Use the Appeals & Reviews Queue tab to submit supporting activity documentation for administrative review.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> 4. Privacy Notice & Data Governance
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Invitation tracking uses privacy-preserving cryptographic hashes. Personal contact details are never stored or shared with external third parties.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: Submit Appeal */}
      {showAppealModal && appealTargetRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" /> Submit Recognition Appeal / Review Request
              </h3>
              <button onClick={() => setShowAppealModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateAppeal} className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Target Badge: {appealTargetRec.badgeTitle}</span>
                <p className="text-slate-400">Contributor: {appealTargetRec.username} • Current Status: {appealTargetRec.status}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Appeal Request Type</label>
                <select
                  value={appealType}
                  onChange={e => setAppealType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Status Review">Status Review</option>
                  <option value="Suspension Appeal">Suspension Appeal</option>
                  <option value="Revocation Appeal">Revocation Appeal</option>
                  <option value="Expiration Renewal">Expiration Renewal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reason for Appeal</label>
                <textarea
                  required
                  rows={3}
                  value={appealReason}
                  onChange={e => setAppealReason(e.target.value)}
                  placeholder="Explain why this recognition status should be reviewed, reinstated, or renewed..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Supporting Evidence / Proof Links</label>
                <input
                  type="text"
                  value={appealInfo}
                  onChange={e => setAppealInfo(e.target.value)}
                  placeholder="Insert transaction IDs, store IDs, meetup photos, or activity URLs..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppealModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Submit Appeal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Admin Review Appeal */}
      {showReviewModal && selectedAppeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" /> Admin Appeal Governance Review
              </h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleProcessAppeal} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-purple-600 dark:text-purple-400">
                  <span>Appeal {selectedAppeal.id}</span>
                  <span>Type: {selectedAppeal.appealType}</span>
                </div>
                <p className="text-slate-900 dark:text-white font-bold">User: {selectedAppeal.username} • Badge: {selectedAppeal.badgeTitle}</p>
                <p className="text-slate-500 italic mt-1">"{selectedAppeal.reason}"</p>
                <p className="text-[10px] text-indigo-400 font-mono">Evidence: {selectedAppeal.supportingInfo}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Governance Decision</label>
                <select
                  value={reviewDecision}
                  onChange={e => setReviewDecision(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Approved">Approve Appeal & Restore / Reinstate Badge</option>
                  <option value="Rejected">Reject Appeal & Maintain Revocation / Suspension</option>
                  <option value="Info Requested">Request Additional Supporting Info</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Decision Notes (Recorded in Audit Log)</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Record justification and admin notes for audit log..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Record Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Manual Status Change */}
      {statusChangeRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600" /> Admin Recognition Lifecycle Override
              </h3>
              <button onClick={() => setStatusChangeRec(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleExecStatusChange} className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">{statusChangeRec.username}</span>
                <p className="text-slate-400">Badge: {statusChangeRec.badgeTitle} • Current: {statusChangeRec.status}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Lifecycle State</label>
                <select
                  value={targetStatus}
                  onChange={e => setTargetStatus(e.target.value as RecognitionStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Revoked">Revoked</option>
                  <option value="Expired">Expired</option>
                  <option value="Reinstated">Reinstated</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reason Notes</label>
                <input
                  type="text"
                  required
                  value={statusChangeNotes}
                  onChange={e => setStatusChangeNotes(e.target.value)}
                  placeholder="Specify reason for manual status change..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusChangeRec(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Update Lifecycle State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
