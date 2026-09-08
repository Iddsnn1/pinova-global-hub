import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Copy,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Award,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Printer
} from 'lucide-react';
import { PiConversionConfig } from '../../types';

interface ExamBoard {
  id: string;
  name: string;
  shortCode: string;
  country: string;
  countryCode: string;
  flag: string;
  description: string;
  officialPortal: string;
  packages: {
    id: string;
    name: string;
    priceUsd: number;
    description: string;
    pinCount: number;
  }[];
}

const EXAM_BOARDS: ExamBoard[] = [
  {
    id: 'waec',
    name: 'West African Examinations Council',
    shortCode: 'WAEC',
    country: 'Nigeria & West Africa',
    countryCode: 'NG',
    flag: '🇳🇬',
    description: 'WASSCE May/June (School Candidates) & GCE Nov/Dec (Private Candidates) official result verification PIN.',
    officialPortal: 'https://www.waecdirect.org',
    packages: [
      { id: 'waec-pin-1', name: '1x WAEC Result Checker PIN', priceUsd: 4.50, description: 'Single candidate 5-usage result checker PIN & Serial Number', pinCount: 1 },
      { id: 'waec-pin-2', name: '2x WAEC PIN Bundle', priceUsd: 8.50, description: 'Two candidate checker PINs with distinct serial numbers', pinCount: 2 },
      { id: 'waec-pin-5', name: '5x School / Tutorial Pack', priceUsd: 20.00, description: 'Bulk batch for schools, tutoring centers and educational consultants', pinCount: 5 },
      { id: 'waec-reg-pin', name: 'WAEC GCE Registration e-PIN', priceUsd: 38.00, description: 'Official registration token for WASSCE Private Candidates', pinCount: 1 }
    ]
  },
  {
    id: 'neco',
    name: 'National Examinations Council',
    shortCode: 'NECO',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    description: 'Official result token for SSCE Internal, SSCE External, BECE (Junior WAEC), and NCEE entrance examinations.',
    officialPortal: 'https://result.neco.gov.ng',
    packages: [
      { id: 'neco-token-1', name: '1x NECO Result Token', priceUsd: 3.00, description: 'Official token for SSCE / BECE / NCEE result checking', pinCount: 1 },
      { id: 'neco-token-3', name: '3x NECO Token Bundle', priceUsd: 8.00, description: 'Three official tokens for candidate checks', pinCount: 3 },
      { id: 'neco-token-10', name: '10x Bulk Institution Pack', priceUsd: 25.00, description: 'For secondary school administrators and examination officers', pinCount: 10 }
    ]
  },
  {
    id: 'jamb',
    name: 'Joint Admissions and Matriculation Board',
    shortCode: 'JAMB',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    description: 'UTME & Direct Entry registration e-PIN, original result slip printing, and admission letter verification tokens.',
    officialPortal: 'https://www.jamb.gov.ng',
    packages: [
      { id: 'jamb-result-slip', name: 'JAMB Original Result Slip Token', priceUsd: 3.50, description: 'Official token for printing JAMB result slip with passport photograph', pinCount: 1 },
      { id: 'jamb-utme-pin', name: 'JAMB UTME Registration e-PIN', priceUsd: 15.00, description: 'Official e-PIN for UTME registration with CBT profile code', pinCount: 1 },
      { id: 'jamb-de-pin', name: 'JAMB Direct Entry e-PIN', priceUsd: 18.00, description: 'Official Direct Entry registration e-PIN for diploma/NCE holders', pinCount: 1 },
      { id: 'jamb-adm-letter', name: 'Admission Letter Printing Token', priceUsd: 3.50, description: 'Official token to download and print verified institution admission letter', pinCount: 1 }
    ]
  },
  {
    id: 'nabteb',
    name: 'National Business and Technical Examinations Board',
    shortCode: 'NABTEB',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    description: 'National Technical Certificate (NTC) & National Business Certificate (NBC) official result scratch card PIN.',
    officialPortal: 'https://eworld.nabteb.gov.ng',
    packages: [
      { id: 'nabteb-card-1', name: '1x NABTEB Result Scratch Card', priceUsd: 3.50, description: 'Official online result checker pin for NTC / NBC examinations', pinCount: 1 },
      { id: 'nabteb-card-5', name: '5x Technical College Pack', priceUsd: 15.00, description: 'For polytechnic applicants and technical college students', pinCount: 5 }
    ]
  },
  {
    id: 'waec-ghana',
    name: 'WAEC Ghana Direct',
    shortCode: 'WAEC GH',
    country: 'Ghana',
    countryCode: 'GH',
    flag: '🇬🇭',
    description: 'Official WASSCE and BECE result checker voucher for Ghanaian senior and junior high school candidates.',
    officialPortal: 'https://ghana.waecdirect.org',
    packages: [
      { id: 'waec-gh-1', name: '1x WAEC Ghana Result Voucher', priceUsd: 4.50, description: 'Standard serial & pin for checking WASSCE / BECE results in Ghana', pinCount: 1 },
      { id: 'waec-gh-3', name: '3x WAEC Ghana Voucher Pack', priceUsd: 12.00, description: 'Three result checker vouchers with distinct serial codes', pinCount: 3 }
    ]
  },
  {
    id: 'cambridge',
    name: 'Cambridge International Assessment',
    shortCode: 'CIE',
    country: 'International / UK',
    countryCode: 'GB',
    flag: '🇬🇧',
    description: 'Cambridge IGCSE & International AS / A Levels candidate verification tokens and electronic result service credits.',
    officialPortal: 'https://www.cambridgeinternational.org',
    packages: [
      { id: 'cie-verify-1', name: '1x Cambridge Result Verification Credit', priceUsd: 25.00, description: 'Official institutional verification reference for IGCSE / A Levels', pinCount: 1 },
      { id: 'cie-cert-statement', name: 'Certifying Statement of Results', priceUsd: 65.00, description: 'Official authenticated electronic statement sent to universities', pinCount: 1 }
    ]
  }
];

interface GeneratedPinRecord {
  id: string;
  boardName: string;
  packageName: string;
  serialNumber: string;
  pinCode: string;
  purchaseDate: string;
  candidateIdentifier: string;
  amountPi: number;
  txHash: string;
  portalUrl: string;
}

interface ExamCardsPortalProps {
  utilityConfig?: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onTransactionSuccess?: (receipt: any) => void;
}

export const ExamCardsPortal: React.FC<ExamCardsPortalProps> = ({
  utilityConfig,
  userBalancePi = 1250,
  buyerUsername = 'Pioneer_User',
  onTransactionSuccess
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedBoardId, setSelectedBoardId] = useState<string>('waec');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('waec-pin-1');
  const [candidateEmail, setCandidateEmail] = useState<string>('');
  const [candidateRegNumber, setCandidateRegNumber] = useState<string>('');
  const [candidatePhone, setCandidatePhone] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [latestReceipt, setLatestReceipt] = useState<GeneratedPinRecord | null>(null);
  const [purchasedPins, setPurchasedPins] = useState<GeneratedPinRecord[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const piRateUsd = utilityConfig?.piRateUsd || 314159;

  const filteredBoards = EXAM_BOARDS.filter(b => {
    if (selectedCountry === 'ALL') return true;
    return b.countryCode === selectedCountry;
  });

  const activeBoard = EXAM_BOARDS.find(b => b.id === selectedBoardId) || EXAM_BOARDS[0];
  const activePackage = activeBoard.packages.find(p => p.id === selectedPackageId) || activeBoard.packages[0];

  const pricePi = Math.max(0.000001, Number((activePackage.priceUsd / piRateUsd).toFixed(6)));

  const handleBoardSelect = (board: ExamBoard) => {
    setSelectedBoardId(board.id);
    setSelectedPackageId(board.packages[0].id);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateEmail.trim()) {
      alert('Please enter a valid recipient email for backup PIN delivery.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate cryptographic settlement & PIN generation
      await new Promise(resolve => setTimeout(resolve, 1400));

      const randomSerial = `${activeBoard.shortCode}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const randomPin = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const txId = `PI-EXAM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const newRecord: GeneratedPinRecord = {
        id: txId,
        boardName: activeBoard.name,
        packageName: activePackage.name,
        serialNumber: randomSerial,
        pinCode: randomPin,
        purchaseDate: new Date().toLocaleString(),
        candidateIdentifier: candidateRegNumber.trim() || candidateEmail.trim(),
        amountPi: pricePi,
        txHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        portalUrl: activeBoard.officialPortal
      };

      setLatestReceipt(newRecord);
      setPurchasedPins(prev => [newRecord, ...prev]);

      if (onTransactionSuccess) {
        onTransactionSuccess({
          providerName: activeBoard.name,
          accountNumber: candidateRegNumber.trim() || candidateEmail.trim(),
          piAmount: pricePi,
          tokenOrCode: randomPin,
          transactionId: txId,
          category: 'exam',
          packageName: activePackage.name,
          piPaymentId: txId,
          piTxid: newRecord.txHash
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
                Exam Cards & PINs Engine
              </span>
              <span className="text-xs text-slate-400">• Instant Digital Delivery</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Official Examination Cards & Registration PINs
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Instant electronic fulfillment of WAEC, NECO, JAMB, and NABTEB scratch cards, result verification tokens, and candidate registration e-PINs with Pi Network escrow.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px]">Your Pi Balance</span>
              <span className="text-amber-400 font-extrabold text-sm">{userBalancePi.toFixed(2)} π</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Receipt Overlay / Card if available */}
      {latestReceipt && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-2 border-emerald-500/60 shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded-md border border-emerald-800/80">
                  Instant Fulfillment Complete
                </span>
                <h3 className="text-base font-black text-white mt-0.5">
                  Official PIN Issued & Ready
                </h3>
              </div>
            </div>

            <button
              onClick={() => setLatestReceipt(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Examination Board</span>
                <span className="text-white font-bold text-sm">{latestReceipt.boardName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Package</span>
                <span className="text-slate-200">{latestReceipt.packageName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Settlement Reference</span>
                <span className="text-amber-400 font-mono text-[11px]">{latestReceipt.id}</span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950/90 p-4 rounded-2xl border border-emerald-500/40">
              <div>
                <span className="text-slate-400 block text-[11px]">Card Serial Number</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs font-black text-white bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    {latestReceipt.serialNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(latestReceipt.serialNumber, 'serial')}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'serial' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Secret PIN Code</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-sm font-black text-amber-400 bg-slate-900 px-2.5 py-1 rounded border border-amber-500/40">
                    {latestReceipt.pinCode}
                  </span>
                  <button
                    onClick={() => handleCopy(latestReceipt.pinCode, 'pin')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'pin' ? 'Copied!' : 'Copy PIN'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <a
              href={latestReceipt.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-bold"
            >
              <span>Visit Official Check Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => {
                  setLatestReceipt(null);
                  setCandidateRegNumber('');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                Purchase Another PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form & Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Exam Board Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-pink-500" />
              <span>1. Select Examination Board</span>
            </h3>
            <div className="flex gap-1 text-[11px]">
              {['ALL', 'NG', 'GH', 'GB'].map(code => (
                <button
                  key={code}
                  onClick={() => setSelectedCountry(code)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition ${
                    selectedCountry === code
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredBoards.map(board => {
              const isSelected = selectedBoardId === board.id;
              return (
                <button
                  key={board.id}
                  type="button"
                  onClick={() => handleBoardSelect(board)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-pink-950/40 border-pink-500 shadow-md shadow-pink-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{board.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-sm text-white truncate">
                        {board.shortCode}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                        {board.packages.length} packages
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-300 mt-0.5">
                      {board.name}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {board.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Package Selection & Candidate Details Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 2: Package Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>2. Choose Package for {activeBoard.shortCode}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeBoard.packages.map(pkg => {
                const isSelected = selectedPackageId === pkg.id;
                const pkgPi = Math.max(0.000001, Number((pkg.priceUsd / piRateUsd).toFixed(6)));
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">
                          {pkg.name}
                        </span>
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          ${pkg.priceUsd.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">
                        {pkg.pinCount} {pkg.pinCount === 1 ? 'PIN' : 'PINs'}
                      </span>
                      <span className="font-black text-amber-400">
                        {pkgPi.toFixed(6)} π
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Candidate Details & Payment Form */}
          <form onSubmit={handlePurchase} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3. Candidate & Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  Delivery Email <span className="text-pink-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="candidate@example.com"
                  value={candidateEmail}
                  onChange={e => setCandidateEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  Exam / Reg No (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 40918239AB"
                  value={candidateRegNumber}
                  onChange={e => setCandidateRegNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-300 font-semibold">
                  SMS Notification Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={candidatePhone}
                  onChange={e => setCandidatePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Price Breakdown Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Total Due with Pi Coin</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-amber-400">{pricePi.toFixed(6)} π</span>
                  <span className="text-slate-500 text-[11px]">(${activePackage.priceUsd.toFixed(2)} USD)</span>
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-400">
                <span>Buyer: </span>
                <span className="text-white font-semibold">{buyerUsername}</span>
                <span className="block text-emerald-400 font-mono">Instant Delivery</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !candidateEmail.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 hover:opacity-95 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Settling with Pi Network & Generating PIN...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 text-amber-300" />
                  <span>Pay {pricePi.toFixed(6)} π & Get Instant PIN</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Historical Purchases */}
      {purchasedPins.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Recently Purchased Exam PINs in this Session ({purchasedPins.length})
          </h4>
          <div className="divide-y divide-slate-800">
            {purchasedPins.map(pin => (
              <div key={pin.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-white">{pin.boardName}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-300">{pin.packageName}</span>
                  <span className="text-slate-500 block text-[11px]">Ref: {pin.candidateIdentifier}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-bold">
                    {pin.pinCode}
                  </span>
                  <button
                    onClick={() => handleCopy(pin.pinCode, pin.id)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copy PIN"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
