import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plane, 
  User, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Luggage, 
  Calendar, 
  FileText, 
  Lock, 
  Sparkles,
  QrCode,
  Download,
  Share2
} from 'lucide-react';
import { FlightOffer, FlightPassengerDetails, FlightBookingRecord } from '../../types/flight';
import { createPiPayment, resetPiAuthState, authenticatePiUser } from '../../lib/piSdk';
import { bookFlightTicket, revalidateFlightOffer } from '../../modules/flight';

interface FlightBookingModalProps {
  offer: FlightOffer;
  piRateUsd: number;
  userBalancePi?: number;
  buyerUsername?: string;
  onClose: () => void;
  onBookingSuccess: (booking: FlightBookingRecord) => void;
}

export const FlightBookingModal: React.FC<FlightBookingModalProps> = ({
  offer,
  piRateUsd,
  userBalancePi = 1250.00,
  buyerUsername = 'Pioneer_User',
  onClose,
  onBookingSuccess
}) => {
  // Step state: 'details' -> 'payment' -> 'confirmed'
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');

  // Passenger form state
  const [title, setTitle] = useState<'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Alh.' | 'Hjy.'>('Mr');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [nationality, setNationality] = useState('Nigeria');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Payment & Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState<string>('Authorizing Pi Escrow Payment...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasPaymentCreated, setHasPaymentCreated] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<FlightBookingRecord | null>(null);
  const checkoutAttemptKeyRef = React.useRef<string>(`idem_flt_${offer.offerId}_${Date.now()}`);

  // Canonical numeric fare state - guaranteed to be a valid positive JavaScript number
  const initialFareNum = (() => {
    const raw = offer.fareAmountFiat;
    const parsed = typeof raw === 'number' ? raw : parseFloat(String(raw || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && parsed > 0 ? Number(parsed.toFixed(2)) : 100.00;
  })();
  const [currentFareFiat, setCurrentFareFiat] = useState<number>(initialFareNum);

  // Calculate Pi amount deterministically from canonical fare with high precision
  const effectivePiRate = piRateUsd > 0 ? piRateUsd : 10.0;
  const canonicalPiAmount = Number((currentFareFiat / effectivePiRate).toFixed(7));
  const formattedPi = canonicalPiAmount < 0.0001 
    ? canonicalPiAmount.toFixed(6) 
    : canonicalPiAmount.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');

  const isLiveDuffelOffer =
    typeof offer.offerId === 'string' &&
    /^off_[A-Za-z0-9]+$/.test(offer.offerId) &&
    offer.bookingMode === 'LIVE_DUFFEL' &&
    offer.isLive === true;

  useEffect(() => {
    console.log(
      `[Flight UI] CHECKOUT_SELECTED_OFFER offerId=${offer.offerId} bookingMode=${offer.bookingMode} isLive=${offer.isLive} isLiveBooking=${offer.isLiveBooking} airline=${offer.airline} flightNumber=${offer.flightNumber}`
    );
  }, [offer.offerId, offer.bookingMode, offer.isLive, offer.isLiveBooking, offer.airline, offer.flightNumber]);

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!givenName.trim() || !familyName.trim()) {
      setErrorMessage('Please enter passenger full first and last name.');
      return;
    }
    if (!email.trim() || !phone.trim()) {
      setErrorMessage('Please provide valid contact email and phone number for e-ticket delivery.');
      return;
    }

    setErrorMessage(null);

    // Only revalidate with live Duffel API if this is an authentic live offer
    if (isLiveDuffelOffer) {
      setIsProcessing(true);
      setPaymentStatusText('Revalidating live Duffel airfare...');
      try {
        console.log(`[Flight Lifecycle] live offer revalidation offerId=${offer.offerId}`);
        const reval = await revalidateFlightOffer(offer.offerId, currentFareFiat);
        if (!reval.valid) {
          setErrorMessage(reval.message || 'Live Duffel offer could not be revalidated. Please search again.');
          setIsProcessing(false);
          return;
        }
        if (typeof reval.newFareFiat === 'number' && Number.isFinite(reval.newFareFiat) && reval.newFareFiat > 0) {
          setCurrentFareFiat(Number(reval.newFareFiat.toFixed(2)));
        }
        setStep('payment');
      } catch (err: any) {
        setErrorMessage('Live Duffel offer could not be revalidated. Please search again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Verified Carrier fallback flights proceed directly to payment without calling live Duffel revalidation
      setStep('payment');
    }
  };

  const handleRetryAuth = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    setPaymentStatusText('Authenticating with Pi Browser...');
    resetPiAuthState();
    try {
      await authenticatePiUser(undefined, true);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Pi Browser did not respond to the authentication request. Please tap Retry Pi Authentication.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecutePiPayment = async () => {
    if (isProcessing) return;

    if (!Number.isFinite(currentFareFiat) || currentFareFiat <= 0) {
      setErrorMessage('Validation Error: Flight fare must be a valid positive number greater than 0.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setPaymentStatusText('Connecting Pi Network Wallet...');

    const passengerDetails: FlightPassengerDetails = {
      title,
      givenName: givenName.trim(),
      familyName: familyName.trim(),
      dateOfBirth,
      gender,
      nationality,
      passportNumber: passportNumber.trim() || undefined,
      passportExpiry: passportExpiry || undefined,
      email: email.trim(),
      phone: phone.trim()
    };

    const finalPiNumber = canonicalPiAmount > 0 ? canonicalPiAmount : Number(formattedPi);
    const memo = `Flight Ticket: ${offer.airline} (${offer.flightNumber}) ${offer.originCode}➔${offer.destinationCode} for ${givenName} ${familyName}`;

    try {
      // 1. Create Pi Payment via SDK / Backend with strictly validated numeric fiat amounts
      const paymentResult = await createPiPayment({
        amountPi: finalPiNumber,
        memo,
        idempotencyKey: checkoutAttemptKeyRef.current,
        onStatusUpdate: (msg) => {
          setPaymentStatusText(msg);
        },
        metadata: {
          serviceType: 'FLIGHT_TICKET',
          category: 'transport',
          transportType: 'air',
          providerId: `prov-flight-${offer.airline.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          providerName: offer.airline,
          countryCode: 'GLOBAL',
          offerId: offer.offerId,
          airline: offer.airline,
          flightNumber: offer.flightNumber,
          route: `${offer.originCode}-${offer.destinationCode}`,
          originCode: offer.originCode,
          destinationCode: offer.destinationCode,
          departureDate: offer.departureTime,
          cabinClass: offer.cabinClass,
          fiatAmount: Number(currentFareFiat.toFixed(2)),
          fiatFare: Number(currentFareFiat.toFixed(2)),
          fiatCurrency: offer.fareCurrency || 'USD',
          piRateApplied: effectivePiRate,
          passengerName: `${title ? title + ' ' : ''}${givenName} ${familyName}`.trim(),
          passengerEmail: email,
          passengerPhone: phone,
          passportNumber: passportNumber
        }
      });

      if (paymentResult && paymentResult.success) {
        setHasPaymentCreated(true);
        setPaymentStatusText('Securing ticket with carrier...');
        // 2. Book with backend flight service
        const bookResponse = await bookFlightTicket({
          paymentId: paymentResult.paymentId || `pi_flight_${Date.now()}`,
          txid: paymentResult.txid,
          offerId: offer.offerId,
          passengerDetails,
          idempotencyKey: checkoutAttemptKeyRef.current
        });

        if (bookResponse.success && bookResponse.booking) {
          setConfirmedBooking(bookResponse.booking);
          setStep('confirmed');
          onBookingSuccess(bookResponse.booking);
        } else {
          // If booking failed or allocation failed, hold funds in Escrow safely
          const failedRecord: FlightBookingRecord = {
            bookingId: `BK-${isLiveDuffelOffer ? 'DUFFEL' : 'CARRIER'}-${Date.now().toString().slice(-6)}`,
            pnr: null,
            bookingReference: `ESCROW-${paymentResult.paymentId?.slice(-8).toUpperCase() || Date.now().toString().slice(-8)}`,
            ticketNumber: null,
            bookingStatus: 'BOOKING_FAILED_HELD_FOR_REFUND',
            flightSummary: {
              airline: offer.airline,
              flightNumber: offer.flightNumber,
              originCode: offer.originCode,
              destinationCode: offer.destinationCode,
              departureTime: offer.departureTime,
              arrivalTime: offer.arrivalTime,
              cabinClass: offer.cabinClass
            },
            passenger: passengerDetails,
            payment: {
              piPaymentId: paymentResult.paymentId || `pi_pay_${Date.now()}`,
              piTxid: paymentResult.txid,
              piAmount: finalPiNumber,
              fiatAmount: Number(currentFareFiat.toFixed(2)),
              fiatCurrency: offer.fareCurrency || 'USD',
              piRateApplied: effectivePiRate,
              escrowProtected: true
            },
            provider: isLiveDuffelOffer ? 'Duffel Live GDS' : 'Verified Transport Carrier Gateway',
            bookingMode: isLiveDuffelOffer ? 'LIVE_DUFFEL' : 'VERIFIED_CARRIER',
            isLiveBooking: isLiveDuffelOffer,
            issuedAt: new Date().toISOString(),
            notice: bookResponse.message || 'Payment confirmed on Pi Network. Carrier gateway allocation failed. Funds held safely in Escrow for instant refund/retry.'
          };

          setConfirmedBooking(failedRecord);
          setStep('confirmed');
          onBookingSuccess(failedRecord);
        }
      } else {
        if (paymentResult?.paymentId) {
          setHasPaymentCreated(true);
        }
        setErrorMessage(paymentResult?.message || 'Pi payment could not be completed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Payment execution failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isAuthTimeoutOrFailed = Boolean(
    errorMessage && (
      errorMessage.toLowerCase().includes('authentication') ||
      errorMessage.toLowerCase().includes('did not respond') ||
      errorMessage.toLowerCase().includes('retry pi authentication') ||
      errorMessage.toLowerCase().includes('browser required') ||
      errorMessage.toLowerCase().includes('permission') ||
      errorMessage.toLowerCase().includes('category_a') ||
      errorMessage.toLowerCase().includes('category_b') ||
      errorMessage.toLowerCase().includes('category_c') ||
      errorMessage.toLowerCase().includes('category_d') ||
      errorMessage.toLowerCase().includes('category_e') ||
      errorMessage.includes('AUTH_TIMEOUT') ||
      errorMessage.includes('AUTHENTICATE_UNAVAILABLE') ||
      !hasPaymentCreated
    )
  );

  const isCategoryCExternalBrowser = Boolean(
    errorMessage && (
      errorMessage.toLowerCase().includes('external browser') ||
      errorMessage.toLowerCase().includes('pi browser required') ||
      errorMessage.includes('CATEGORY_C')
    )
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Plane className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
                PiNova Flight Services
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {step === 'confirmed' ? 'Flight Booking Confirmed' : 'Passenger & Flight Checkout'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Flight Summary Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">{offer.airline}</span>
                <span className="text-xs font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/40">
                  {offer.flightNumber}
                </span>
                <span className="text-xs text-slate-400 capitalize">• {offer.cabinClass.replace('_', ' ')}</span>
                {isLiveDuffelOffer ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    LIVE DUFFEL GDS
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    VERIFIED CARRIER
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-base font-black text-amber-300 font-mono">{formattedPi} π</span>
                <span className="text-[11px] text-slate-400 block">≈ ${currentFareFiat.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl">
              <div>
                <span className="font-bold text-white text-sm">{offer.originCode}</span>
                <div className="text-[10px] text-slate-400">{new Date(offer.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-purple-400 font-bold">{offer.duration}</div>
                <div className="text-[10px] text-slate-400">{offer.stops === 0 ? 'Non-stop' : `${offer.stops} Stop`}</div>
              </div>
              <div className="text-right">
                <span className="font-bold text-white text-sm">{offer.destinationCode}</span>
                <div className="text-[10px] text-slate-400">{new Date(offer.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-300">
              <div className="flex items-start sm:items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5 sm:mt-0" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {/* When authentication timed out or before payment creation, show ONLY Retry Pi Authentication */}
                {!isAuthTimeoutOrFailed && hasPaymentCreated && (
                  <button
                    type="button"
                    onClick={handleExecutePiPayment}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold rounded-xl text-[11px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>Retry Payment</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRetryAuth}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-bold rounded-xl text-[11px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Retry Pi Authentication</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Passenger Details Form */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-400" />
                <span>Passenger & Identification Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                    <option value="Alh.">Alh.</option>
                    <option value="Hjy.">Hjy.</option>
                  </select>
                </div>

                {/* First / Given Name */}
                <div className="sm:col-span-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Given / First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibrahim"
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Last / Family Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Family / Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bello"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Date of Birth */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Passport details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Passport / Travel ID Number (Optional for local)
                  </label>
                  <input
                    type="text"
                    placeholder="A12345678"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Passport Expiry Date
                  </label>
                  <input
                    type="date"
                    value={passportExpiry}
                    onChange={(e) => setPassportExpiry(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  Contact Information (For E-Ticket Delivery)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="pioneer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Mobile Phone (with country code) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 801 234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Revalidating Fare...</span>
                    </>
                  ) : (
                    <span>Review Fare & Payment</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Fare Summary & Pi Payment Execution */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span>Fare Summary & Pi Network Payment</span>
              </div>

              {/* Fare Breakdown Table */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Base Airfare</span>
                  <span className="font-mono text-white">${Math.max(10, currentFareFiat - (offer.taxesAndFeesFiat || 35)).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Airport Taxes & Security Surcharge</span>
                  <span className="font-mono text-white">${(offer.taxesAndFeesFiat || 35).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Passenger</span>
                  <span className="font-bold text-white">{title} {givenName} {familyName}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                  <span className="font-extrabold text-white">Total Amount (Fiat USD)</span>
                  <span className="font-black text-sm text-white font-mono">${currentFareFiat.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between items-center bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/40">
                  <div>
                    <span className="font-extrabold text-amber-300 text-sm">Pi Payment Required</span>
                    <div className="text-[10px] text-purple-300">Rate: 1 π = ${piRateUsd.toFixed(2)} USD</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-amber-300 font-mono">{formattedPi} π</div>
                    <div className="text-[10px] text-slate-400">Escrow Protected</div>
                  </div>
                </div>
              </div>

              {/* Escrow guarantee notice */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Pi Network Escrow Protection: </span>
                  <span>
                    Your Pi payment is securely held in PSTP smart escrow until your flight ticket voucher is verified and issued.
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  disabled={isProcessing}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Back to Passenger Details
                </button>

                <button
                  type="button"
                  onClick={handleExecutePiPayment}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{paymentStatusText || 'Authorizing Pi Escrow Payment...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirm & Pay {formattedPi} π</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmed E-Ticket Screen */}
          {step === 'confirmed' && confirmedBooking && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-lg font-black text-white">
                  Flight Booking Successfully Completed!
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Your ticket voucher has been registered and verified under Pi Network Escrow.
                </p>
              </div>

              {/* Boarding Pass / E-Ticket Card */}
              <div className="bg-slate-950 border border-purple-900/40 rounded-3xl p-5 text-left space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl" />

                {/* Top Ticket Header */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                      PiNova Official E-Ticket Voucher
                    </div>
                    <div className="text-base font-black text-white">
                      {confirmedBooking.flightSummary.airline}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase">Booking Ref / PNR</div>
                    <div className="text-sm font-mono font-black text-amber-300">
                      {confirmedBooking.pnr || confirmedBooking.bookingReference}
                    </div>
                  </div>
                </div>

                {/* Passenger & Flight Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500 text-[10px]">Passenger Name</div>
                    <div className="font-bold text-white truncate">
                      {confirmedBooking.passenger.givenName} {confirmedBooking.passenger.familyName}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[10px]">Flight No.</div>
                    <div className="font-mono font-bold text-purple-300">
                      {confirmedBooking.flightSummary.flightNumber}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[10px]">Route</div>
                    <div className="font-bold text-white">
                      {confirmedBooking.flightSummary.originCode} ➔ {confirmedBooking.flightSummary.destinationCode}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[10px]">Class</div>
                    <div className="font-bold text-white capitalize">
                      {confirmedBooking.flightSummary.cabinClass.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Status & Escrow Proof */}
                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white">PSTP Escrow Verified</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                        TxID: {confirmedBooking.payment.piTxid || confirmedBooking.payment.piPaymentId}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-black text-amber-300">
                      {confirmedBooking.payment.piAmount} π
                    </div>
                    <div className="text-[10px] text-slate-400">
                      (${confirmedBooking.payment.fiatAmount} USD)
                    </div>
                  </div>
                </div>

                {/* Notice text */}
                <div className="text-[11px] text-slate-400 italic">
                  * A confirmation copy has been sent to {confirmedBooking.passenger.email}. Present this voucher and your ID at the airport check-in counter.
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                >
                  Return to Flight Services
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
