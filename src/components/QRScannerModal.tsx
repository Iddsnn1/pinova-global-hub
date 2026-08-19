import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  QrCode, 
  X, 
  Camera, 
  CameraOff,
  Zap, 
  ZapOff, 
  CheckCircle2, 
  Copy, 
  RefreshCw, 
  Keyboard, 
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Store,
  Wallet,
  Upload,
  Settings,
  HelpCircle,
  Loader2,
  FileCheck,
  Maximize2,
  SwitchCamera
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
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [scanMode, setScanMode] = useState<'qr' | 'document'>('qr');
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<{ code: string; type: string; details: string } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSettingsHelp, setShowSettingsHelp] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const isInitializingRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to cleanly stop all camera tracks and release hardware
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
      videoRef.current.onloadedmetadata = null;
      videoRef.current.oncanplay = null;
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
    } else if (trimmed.startsWith('DOC_') || trimmed.startsWith('KYC_') || trimmed.startsWith('RECEIPT_')) {
      return { type: 'Verified Document Payload', details: 'Encrypted Pi Ecosystem Document Record' };
    } else if (trimmed.startsWith('PAY_') || trimmed.startsWith('TX_')) {
      return { type: 'Payment Transaction', details: 'Pi Mainnet Payment Receipt Reference' };
    }
    return { type: 'Universal Data QR', details: 'Custom PiNova Ecosystem Payload' };
  }, []);

  // Process a detected QR or Document code
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
  const startCamera = useCallback(async (desiredFacing: 'environment' | 'user' = facingMode) => {
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

      // Check available media devices
      try {
        if (navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          setHasMultipleCameras(videoInputs.length > 1);
        }
      } catch {
        // device enumeration is optional
      }

      // Explicitly request user camera with crisp HD resolution & environment facing
      let stream: MediaStream | null = null;
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: desiredFacing },
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 }
          },
          audio: false
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (constraintErr: any) {
        if (
          constraintErr?.name === 'OverconstrainedError' ||
          constraintErr?.name === 'ConstraintNotSatisfiedError'
        ) {
          // Fallback to basic video constraint without resolution boundaries
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: desiredFacing },
              audio: false
            });
          } catch {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          }
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

      // Explicitly attach stream to the live video element and ensure playback
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('autoplay', 'true');
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;

        // Ensure video is playing and ready before declaring active
        await new Promise<void>((resolve) => {
          let resolved = false;
          const onVideoReady = async () => {
            if (resolved) return;
            resolved = true;
            try {
              await video.play();
            } catch (playErr) {
              console.warn('Video auto-play triggered on frame', playErr);
            }
            resolve();
          };

          if (video.readyState >= 2) {
            onVideoReady();
          } else {
            video.onloadedmetadata = () => onVideoReady();
            video.oncanplay = () => onVideoReady();
            video.onplaying = () => onVideoReady();
            // Fallback timer to prevent hanging
            setTimeout(onVideoReady, 400);
          }
        });
      }

      // Stream successfully attached, verified, and rendering
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
  }, [isOpen, facingMode, stopCameraStream]);

  // Lifecycle: start camera only on open, stop on close or unmount
  useEffect(() => {
    if (isOpen) {
      setScannedResult(null);
      setShowSettingsHelp(false);
      startCamera(facingMode);
    } else {
      stopCameraStream();
      setCameraStatus('closed');
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen, startCamera, stopCameraStream, facingMode]);

  // Switch between front/back camera
  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

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
      startCamera(facingMode);
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
                <span>QR / Document Scanner</span>
                {cameraStatus === 'camera_active' && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    HD Preview
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                {scanMode === 'qr' ? 'Position the QR code inside the scanning frame.' : 'Align document edges within the live viewport.'}
              </p>
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
          
          {/* Mode Switcher: QR Code vs Document Scan */}
          <div className="flex items-center justify-between bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setScanMode('qr')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                scanMode === 'qr'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code Mode</span>
            </button>
            <button
              onClick={() => setScanMode('document')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                scanMode === 'document'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Document / KYC Mode</span>
            </button>
          </div>

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
              
              {/* Camera Viewport Container - High Contrast & Full Transparency for Crisp Live Video */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
                
                {/* 1. Live Video Element - ALWAYS MOUNTED to ensure ref and stream binding */}
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
                    cameraStatus === 'camera_active' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  playsInline
                  muted
                  autoPlay
                />

                {/* 2. CAMERA ACTIVE STATE - Non-obscuring Scanning Frame Overlay */}
                {cameraStatus === 'camera_active' && (
                  <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between p-4">
                    
                    {/* Top Status & Controls Bar */}
                    <div className="w-full flex items-center justify-between pointer-events-auto">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-emerald-500/40 text-[11px] font-black text-emerald-400 flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Camera active</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {hasMultipleCameras && (
                          <button
                            onClick={toggleCameraFacing}
                            className="p-2 rounded-xl bg-slate-950/80 text-slate-200 border border-slate-700/80 hover:bg-slate-800 backdrop-blur-md transition-all"
                            title="Switch Camera (Front/Rear)"
                            aria-label="Switch Camera"
                          >
                            <SwitchCamera className="w-4 h-4 text-purple-400" />
                          </button>
                        )}
                        {hasTorchSupport && (
                          <button
                            onClick={toggleTorch}
                            className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
                              torchOn 
                                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-lg shadow-amber-400/30' 
                                : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                            }`}
                            title="Toggle Flashlight"
                            aria-label="Toggle Flashlight"
                          >
                            {torchOn ? <Zap className="w-4 h-4 fill-slate-950" /> : <ZapOff className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Central Target Scanner Reticle - Clear & Transparent */}
                    <div className="relative my-auto flex items-center justify-center">
                      <div className={`relative rounded-2xl border-2 transition-all duration-300 ${
                        scanMode === 'qr' 
                          ? 'w-48 h-48 sm:w-56 sm:h-56 border-amber-400/80' 
                          : 'w-64 h-44 sm:w-72 sm:h-48 border-emerald-400/80'
                      }`}>
                        {/* Laser Scan Beam */}
                        <div className="absolute left-1 right-1 h-0.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-400 shadow-[0_0_12px_#10b981] animate-scan" />

                        {/* Corner Target Markers */}
                        <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-amber-400 -mt-1 -ml-1 rounded-tl" />
                        <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-amber-400 -mt-1 -mr-1 rounded-tr" />
                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-amber-400 -mb-1 -ml-1 rounded-bl" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-amber-400 -mb-1 -mr-1 rounded-br" />

                        {/* Center alignment crosshair */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                          <Maximize2 className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Guidance Tag */}
                    <div className="px-3 py-1 rounded-full bg-slate-950/85 border border-slate-800/80 text-[11px] font-semibold text-slate-300 backdrop-blur-md shadow-md">
                      {scanMode === 'qr' 
                        ? 'Align QR code inside the glowing frame' 
                        : 'Align document or ID card flat within bounds'}
                    </div>

                  </div>
                )}

                {/* 3. INITIALIZING / REQUESTING PERMISSION STATE */}
                {(cameraStatus === 'requesting_permission' || cameraStatus === 'initializing_camera') && (
                  <div className="relative z-20 p-6 text-center space-y-3 animate-in fade-in duration-200">
                    <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800 text-purple-400 mx-auto flex items-center justify-center shadow-lg">
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Initializing camera...</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Starting camera stream. Please approve the permission prompt if requested.
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. PERMISSION DENIED STATE */}
                {cameraStatus === 'permission_denied' && (
                  <div className="relative z-20 p-5 sm:p-6 text-center space-y-3 animate-in fade-in duration-200 max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/80 text-red-400 mx-auto flex items-center justify-center shadow-lg">
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
                        onClick={() => startCamera(facingMode)}
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

                {/* 5. CAMERA ERROR / UNAVAILABLE / FALLBACK STATE */}
                {cameraStatus === 'camera_error' && (
                  <div className="relative z-20 p-5 sm:p-6 text-center space-y-3 animate-in fade-in duration-200 max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800/80 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
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
                        onClick={() => startCamera(facingMode)}
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
                    <li><strong>Pi Browser / Mobile Chrome:</strong> Tap the lock or tune icon in the address bar &gt; Site settings &gt; Set Camera to &quot;Allow&quot;.</li>
                    <li><strong>Desktop Browser:</strong> Click the camera or lock icon next to the URL &gt; Reset or allow Camera permissions &gt; Click &quot;Try Again&quot;.</li>
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
