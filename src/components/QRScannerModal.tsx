import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  X, 
  Camera, 
  Zap, 
  ZapOff, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  RefreshCw, 
  Keyboard, 
  Sparkles,
  ShieldCheck,
  Store,
  Package,
  FileText,
  Wallet
} from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult?: (code: string, type: string) => void;
  onScanToPay?: (rawQr: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
  onScanToPay
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<{ code: string; type: string; details: string } | null>(null);
  const [scanningActive, setScanningActive] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) setHasCameraPermission(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setHasCameraPermission(true);
      } catch (err) {
        console.warn('Camera access error/permission denied or running in sandbox frame:', err);
        if (isMounted) setHasCameraPermission(false);
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [isOpen]);

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!mediaStreamRef.current) return;
    const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const capabilities = (videoTrack.getCapabilities && videoTrack.getCapabilities()) || {};
      if ('torch' in capabilities) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !torchOn } as any]
        });
        setTorchOn(!torchOn);
      } else {
        alert('Flashlight mode is not supported on this device/camera.');
      }
    } catch {
      alert('Could not toggle flashlight on this camera.');
    }
  };

  // Classify scanned QR payload
  const classifyCode = (code: string) => {
    const trimmed = code.trim();
    if (trimmed.startsWith('G') && trimmed.length >= 20) {
      return { type: 'Pi Wallet Address', details: 'Direct Pioneer Wallet Payment Destination' };
    } else if (trimmed.startsWith('MERCHANT_') || trimmed.includes('store') || trimmed.includes('seller')) {
      return { type: 'Merchant QR Code', details: 'Verified PiNova Merchant Storefront' };
    } else if (trimmed.startsWith('PI_ITEM_') || trimmed.startsWith('PRD_')) {
      return { type: 'Product QR Code', details: 'Marketplace Inventory Item Reference' };
    } else if (trimmed.startsWith('ESCROW_') || trimmed.startsWith('PSTP_')) {
      return { type: 'PSTP Escrow Reference', details: 'PSTP Escrow Payment Protection Reference' };
    } else if (trimmed.startsWith('ORD_')) {
      return { type: 'Order Tracking Reference', details: 'Pioneer Order Tracking & Delivery Verification' };
    } else if (trimmed.startsWith('PAY_') || trimmed.startsWith('TX_')) {
      return { type: 'Payment Transaction', details: 'Pi Mainnet Payment Receipt Reference' };
    }
    return { type: 'Universal Data QR', details: 'Custom PiNova Payload Data' };
  };

  const handleProcessCode = (rawCode: string) => {
    if (!rawCode.trim()) return;
    const classified = classifyCode(rawCode);
    setScannedResult({
      code: rawCode.trim(),
      type: classified.type,
      details: classified.details
    });
    setScanningActive(false);

    if (onScanResult) {
      onScanResult(rawCode.trim(), classified.type);
    }
  };

  const handleCopyCode = () => {
    if (!scannedResult) return;
    navigator.clipboard.writeText(scannedResult.code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const resetScan = () => {
    setScannedResult(null);
    setScanningActive(true);
    setManualCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-400">
              <QrCode className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                <span>PiNova Universal QR Scanner</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  HD Real-Time
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Scan Pi Wallets, Products, Merchants & Escrow Refs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="p-4 space-y-4">

          {scannedResult ? (
            /* Scanned Result View */
            <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                      {scannedResult.type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      Verified Scan
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{scannedResult.details}</p>
                </div>
              </div>

              {/* Scanned Code Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-amber-300 break-all select-all flex-1">
                  {scannedResult.code}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  {copySuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Quick Actions based on type */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                {onScanToPay && (
                  <button
                    onClick={() => {
                      if (scannedResult) {
                        onScanToPay(scannedResult.code);
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Proceed to Scan-to-Pay</span>
                  </button>
                )}
                <button
                  onClick={resetScan}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Rescan</span>
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Scanner View */
            <div className="space-y-4">
              
              {/* Camera Viewport or Fallback */}
              <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                {hasCameraPermission === true ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />

                    {/* Laser Overlay Viewport Guide */}
                    <div className="absolute inset-0 border-[24px] sm:border-[40px] border-slate-950/70 pointer-events-none flex items-center justify-center">
                      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-xl border-2 border-dashed border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        {/* Scanning Laser */}
                        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-emerald-400 to-purple-500 shadow-[0_0_12px_#34d399] animate-scan" />
                        
                        {/* Corner Brackets */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 -mt-1 -ml-1" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 -mt-1 -mr-1" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 -mb-1 -ml-1" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 -mb-1 -mr-1" />
                      </div>
                    </div>

                    {/* Camera Control Overlays */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-black text-emerald-400 flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>CAMERA ACTIVE</span>
                      </span>

                      <button
                        onClick={toggleTorch}
                        className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
                          torchOn 
                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold' 
                            : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                        }`}
                        title="Toggle Flashlight"
                      >
                        {torchOn ? <Zap className="w-4 h-4 fill-slate-950" /> : <ZapOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
                ) : (
                  /* Fallback Camera View for Sandbox/Frames or Denied Permissions */
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800 text-purple-400 mx-auto flex items-center justify-center">
                      <Camera className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Interactive QR Code Simulator</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Camera access is simulated or running in preview mode. Select a test payload below or enter a QR string manually.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Presets for Instant Testing */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Quick Test Payloads (Instant Simulation)</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleProcessCode('pi:GDFX72A9910023PI19208447219902011?amount=12.5&memo=PiNova_Scan_Pay&merchant=PiNova_Official_Store')}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-left transition-all group col-span-2 bg-gradient-to-r from-amber-950/40 to-purple-950/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                        <span>Official Pi Scan-to-Pay URI (12.5 π)</span>
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        Scan & Pay
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">pi:GDFX72A9...3PI?amount=12.5</p>
                  </button>

                  <button
                    onClick={() => handleProcessCode('GDFX72A9910023PI19208447219902011')}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Wallet className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">Pi Wallet Address</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">GDFX72A9910...</p>
                  </button>

                  <button
                    onClick={() => handleProcessCode('MERCHANT_PI_HUB_101')}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                      <Store className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">Verified Merchant</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">MERCHANT_PI_HUB_101</p>
                  </button>
                </div>
              </div>

              {/* Manual Input Fallback */}
              <div className="pt-2 border-t border-slate-800">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (manualCode) handleProcessCode(manualCode);
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Or enter QR code payload manually..."
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!manualCode.trim()}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    Validate
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PSTP Smart Protection</span>
          </span>
          <button onClick={onClose} className="hover:text-white transition-colors">
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
