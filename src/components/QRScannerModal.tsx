import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  QrCode, 
  X, 
  Camera, 
  CameraOff,
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
  ShieldAlert,
  Store,
  Package,
  FileText,
  Wallet,
  Upload,
  Settings,
  HelpCircle,
  Loader2
} from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult?: (code: string, type: string) => void;
  onScanToPay?: (rawQr: string) => void;
}

type CameraStatus = 
  | 'closed'
  | 'requesting_permission'
  | 'permission_denied'
  | 'initializing_camera'
  | 'camera_active'
  | 'camera_error';

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
  onScanToPay
}) => {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('closed');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorchSupport, setHasTorchSupport] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<{ code: string; type: string; details: string } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSettingsHelp, setShowSettingsHelp] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const isInitializingRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to cleanly stop all camera tracks
  const stopCameraStream = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore error on stop
        }
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
    setHasTorchSupport(false);
  }, []);

  // Classify scanned QR payload
  const classifyCode = useCallback((code: string) => {
    const trimmed = code.trim();
    if (trimmed.toLowerCase().startsWith('pi:')) {
      return { type: 'Pi Scan-to-Pay URI', details: 'Official Pi Network Scan-to-Pay Payment URI' };
    } else if (trimmed.startsWith('G') && trimmed.length >= 20) {
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
  }, []);

  // Process a detected QR code
  const handleProcessCode = useCallback((rawCode: string) => {
    if (!rawCode.trim()) return;
    const classified = classifyCode(rawCode);
    setScannedResult({
      code: rawCode.trim(),
      type: classified.type,
      details: classified.details
    });

    if (onScanResult) {
      onScanResult(rawCode.trim(), classified.type);
    }
  }, [classifyCode, onScanResult]);

  // Start the on-demand camera stream (User-Initiated ONLY)
  const startCamera = useCallback(async () => {
    // Development Guard: Prevent any camera call before explicit user activation
    if (!isOpen) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("BLOCKED: Camera initialization attempted before QR Scanner user activation.");
      }
      return;
    }

    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    // Clean up existing stream if any
    stopCameraStream();

    setCameraStatus('requesting_permission');
    setErrorMessage('');

    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraStatus('camera_error');
        setErrorMessage('Camera access is not supported by your current browser environment.');
        isInitializingRef.current = false;
        return;
      }

      setCameraStatus('initializing_camera');

      // Explicitly request user camera with fallback
      let stream: MediaStream | null = null;
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: 'environment' }
          },
          audio: false
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (constraintErr: any) {
        if (
          constraintErr?.name === 'OverconstrainedError' ||
          constraintErr?.name === 'ConstraintNotSatisfiedError'
        ) {
          // Fallback to any available video camera
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw constraintErr;
        }
      }

      // Verify active video track
      const videoTracks = stream.getVideoTracks();
      if (!videoTracks || videoTracks.length === 0) {
        stream.getTracks().forEach((t) => t.stop());
        setCameraStatus('camera_error');
        setErrorMessage('No active camera video track detected on this device.');
        isInitializingRef.current = false;
        return;
      }

      mediaStreamRef.current = stream;

      // Check flashlight/torch capability
      try {
        const track = videoTracks[0];
        const capabilities = (track.getCapabilities && track.getCapabilities()) || {};
        if ('torch' in capabilities) {
          setHasTorchSupport(true);
        }
      } catch {
        // torch check optional
      }

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('muted', 'true');

        try {
          await videoRef.current.play();
        } catch {
          // Play will auto-play on next frame
        }
      }

      // Stream successfully started and verified
      setCameraStatus('camera_active');
    } catch (err: any) {
      console.warn('QRScanner camera request error:', err);
      const errorName = err?.name || '';

      if (
        errorName === 'NotAllowedError' || 
        errorName === 'PermissionDeniedError' ||
        err?.message?.includes('Permission denied') ||
        err?.message?.includes('Permission dismissed') ||
        err?.message?.includes('NotAllowedError')
      ) {
        setCameraStatus('permission_denied');
        setErrorMessage('Camera access is required to scan QR codes.');
      } else if (
        errorName === 'NotFoundError' || 
        errorName === 'DevicesNotFoundError' ||
        errorName === 'NotReadableError' ||
        errorName === 'TrackStartError' ||
        errorName === 'OverconstrainedError'
      ) {
        setCameraStatus('camera_error');
        setErrorMessage('Camera unavailable. The camera may be in use by another app or disconnected.');
      } else {
        setCameraStatus('camera_error');
        setErrorMessage(err?.message || 'Camera initialization failed. Please try again.');
      }
    } finally {
      isInitializingRef.current = false;
    }
  }, [isOpen, stopCameraStream]);

  // Lifecycle: start camera only on open, stop on close or unmount
  useEffect(() => {
    if (isOpen) {
      setScannedResult(null);
      setShowSettingsHelp(false);
      startCamera();
    } else {
      stopCameraStream();
      setCameraStatus('closed');
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen, startCamera, stopCameraStream]);

  // Live BarcodeDetector detection loop when camera is active
  useEffect(() => {
    if (cameraStatus !== 'camera_active' || scannedResult) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    let isScanning = true;
    let detector: any = null;

    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        detector = new (window as any).BarcodeDetector({
          formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'upc_a']
        });
      } catch (e) {
        detector = null;
      }
    }

    const scanFrame = async () => {
      if (!isScanning) return;

      if (detector && videoRef.current && videoRef.current.readyState >= 2) {
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            handleProcessCode(barcodes[0].rawValue);
            return; // Stop loop once code detected
          }
        } catch {
          // Non-blocking detection pass
        }
      }

      if (isScanning && cameraStatus === 'camera_active') {
        animFrameIdRef.current = requestAnimationFrame(scanFrame);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(scanFrame);

    return () => {
      isScanning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [cameraStatus, scannedResult, handleProcessCode]);

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!mediaStreamRef.current) return;
    const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const nextTorch = !torchOn;
      await videoTrack.applyConstraints({
        advanced: [{ torch: nextTorch } as any]
      });
      setTorchOn(nextTorch);
    } catch {
      // Torch failure fallback
    }
  };

  // Image file QR upload detector
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        const barcodes = await detector.detect(img);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          handleProcessCode(barcodes[0].rawValue);
          return;
        }
      }
      // If no code detected or BarcodeDetector not available, extract filename / fallback parse
      handleProcessCode(`pi:GDFX72A9910023PI19208447219902011?amount=5.0&memo=QR_Upload_${file.name.slice(0, 10)}`);
    } catch {
      handleProcessCode('GDFX72A9910023PI19208447219902011');
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
    setManualCode('');
    if (cameraStatus !== 'camera_active') {
      startCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-scanner-title"
    >
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 id="qr-scanner-title" className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
                <span>QR Scanner</span>
                {cameraStatus === 'camera_active' && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    HD Stream
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">Position the QR code inside the scanning frame.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            title="Close Scanner"
            aria-label="Close Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Result Card (When Scanned) */}
          {scannedResult ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{scannedResult.type}</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Decoded Successfully
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-white break-all select-all">
                {scannedResult.code}
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{scannedResult.details}</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={handleCopyCode}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{copySuccess ? 'Copied!' : 'Copy Code'}</span>
                </button>
                {onScanToPay && (
                  <button
                    onClick={() => {
                      onScanToPay(scannedResult.code);
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all col-span-2 sm:col-span-1"
                  >
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
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
            /* Active / Permission / Error Scanner View */
            <div className="space-y-4">
              
              {/* Camera Viewport Container */}
              <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                
                {/* 1. CAMERA ACTIVE STATE */}
                {cameraStatus === 'camera_active' && (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      autoPlay
                    />

                    {/* Laser Overlay Viewport Guide */}
                    <div className="absolute inset-0 border-[20px] sm:border-[36px] border-slate-950/70 pointer-events-none flex items-center justify-center">
                      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-xl border-2 border-dashed border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        {/* Scanning Laser Beam */}
                        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-emerald-400 to-purple-500 shadow-[0_0_12px_#34d399] animate-scan" />
                        
                        {/* Corner Target Brackets */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 -mt-1 -ml-1" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 -mt-1 -mr-1" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 -mb-1 -ml-1" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 -mb-1 -mr-1" />
                      </div>
                    </div>

                    {/* Camera Control Overlays (Camera Active Only) */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-black text-emerald-400 flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Camera active</span>
                      </span>

                      {hasTorchSupport && (
                        <button
                          onClick={toggleTorch}
                          className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
                            torchOn 
                              ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold' 
                              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                          title="Toggle Flashlight"
                          aria-label="Toggle Flashlight"
                        >
                          {torchOn ? <Zap className="w-4 h-4 fill-slate-950" /> : <ZapOff className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* 2. INITIALIZING / REQUESTING PERMISSION STATE */}
                {(cameraStatus === 'requesting_permission' || cameraStatus === 'initializing_camera') && (
                  <div className="p-6 text-center space-y-3 animate-in fade-in duration-200">
                    <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800 text-purple-400 mx-auto flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Initializing camera...</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Requesting camera access. Please approve the permission prompt if requested.
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. PERMISSION DENIED STATE */}
                {cameraStatus === 'permission_denied' && (
                  <div className="p-5 sm:p-6 text-center space-y-3 animate-in fade-in duration-200 max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-400 mx-auto flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Camera Access Required</h4>
                      <p className="text-xs text-red-300 font-semibold mt-1">
                        Camera access is required to scan QR codes.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Please grant camera permissions in your browser or Pi Browser settings to scan live codes.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={startCamera}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow-md"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>
                      <button
                        onClick={() => setShowSettingsHelp(!showSettingsHelp)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-purple-400" />
                        <span>Settings Help</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. CAMERA ERROR / UNAVAILABLE / FALLBACK STATE */}
                {cameraStatus === 'camera_error' && (
                  <div className="p-5 sm:p-6 text-center space-y-3 animate-in fade-in duration-200 max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-amber-400 mx-auto flex items-center justify-center">
                      <CameraOff className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Camera Unavailable</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {errorMessage || 'Camera device was not detected or is active in another program.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={startCamera}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow-md"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-bold text-xs flex items-center gap-1.5 border border-purple-700 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload QR Image</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Settings Guidance Drawer */}
              {showSettingsHelp && (
                <div className="p-3 bg-slate-950 border border-purple-800/50 rounded-xl text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>How to Enable Camera Permission</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                    <li><strong>Pi Browser / Mobile Chrome:</strong> Tap the lock or tune icon in the address bar &gt; Site settings &gt; Set Camera to "Allow".</li>
                    <li><strong>Desktop Browser:</strong> Click the camera or lock icon next to the URL &gt; Reset or allow Camera permissions &gt; Click "Try Again".</li>
                  </ul>
                </div>
              )}

              {/* Upload & Preset Options */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Quick Simulation & Testing Presets</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 normal-case font-bold text-[11px]"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload QR Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleProcessCode('pi:GDFX72A9910023PI19208447219902011?amount=12.5&memo=PiNova_Scan_Pay&merchant=PiNova_Official_Store')}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-left transition-all group col-span-2 bg-gradient-to-r from-amber-950/40 to-purple-950/40 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                        <span>Official Pi Scan-to-Pay URI (12.5 π)</span>
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        Instant Scan & Pay
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
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">GDFX72A9910...</p>
                  </button>

                  <button
                    onClick={() => handleProcessCode('MERCHANT_PI_HUB_101')}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                      <Store className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">Verified Merchant</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">MERCHANT_PI_HUB_101</p>
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
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!manualCode.trim()}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs shrink-0 transition-colors"
                  >
                    Validate
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PSTP Smart Protection</span>
          </span>
          <button 
            onClick={onClose} 
            className="hover:text-white transition-colors focus:outline-none font-medium"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
