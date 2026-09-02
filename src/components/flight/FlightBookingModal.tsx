import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Plane,
  User,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock
} from 'lucide-react';
import {
  FlightOffer,
  FlightPassengerDetails,
  FlightBookingRecord
} from '../../types/flight';
import {
  createPiPayment,
  resetPiAuthState,
  authenticatePiUser,
  isPaymentScopeReady
} from '../../lib/piSdk';
import {
  bookFlightTicket,
  revalidateFlightOffer
} from '../../modules/flight';

interface FlightBookingModalProps {
  offer: FlightOffer;
  piRateUsd: number;
  userBalancePi?: number;
  buyerUsername?: string;
  onClose: () => void;
  onBookingSuccess: (booking: FlightBookingRecord) => void;
}

type BookingFlowState =
  | 'details'
  | 'revalidating'
  | 'payment'
  | 'authenticating'
  | 'creating_payment'
  | 'booking'
  | 'confirmed'
  | 'booking_failed_escrow'
  | 'payment_failed'
  | 'auth_failed';

export const FlightBookingModal: React.FC<FlightBookingModalProps> = ({
  offer,
  piRateUsd,
  userBalancePi = 1250.0,
  buyerUsername = 'Pioneer_User',
  onClose,
  onBookingSuccess
}) => {
  /*
   * ============================================================
   * FLOW STATE
   * ============================================================
   *
   * Explicit state is used instead of inferring authentication
   * failures from hasPaymentCreated.
   */
  const [flowState, setFlowState] =
    useState<BookingFlowState>('details');

  const [paymentStatusText, setPaymentStatusText] = useState(
    'Authorizing Pi Escrow Payment...'
  );

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [hasPaymentCreated, setHasPaymentCreated] =
    useState(false);

  const [confirmedBooking, setConfirmedBooking] =
    useState<FlightBookingRecord | null>(null);

  /*
   * IMPORTANT:
   * The same idempotency key must be reused for the complete
   * checkout attempt so retries do not accidentally create
   * duplicate payment/booking operations.
   */
  const checkoutAttemptKeyRef = useRef<string>(
    `idem_flt_${offer.offerId}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`
  );

  /*
   * ============================================================
   * PASSENGER STATE
   * ============================================================
   */
  const [title, setTitle] = useState<
    'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Alh.' | 'Hjy.'
  >('Mr');

  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const [gender, setGender] = useState<
    'male' | 'female' | 'other'
  >('male');

  const [nationality, setNationality] =
    useState('Nigeria');

  const [passportNumber, setPassportNumber] =
    useState('');

  const [passportExpiry, setPassportExpiry] =
    useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  /*
   * ============================================================
   * FARE STATE
   * ============================================================
   */
  const initialFareNum = (() => {
    const raw = offer.fareAmountFiat;

    const parsed =
      typeof raw === 'number'
        ? raw
        : parseFloat(
            String(raw || '').replace(/[^0-9.]/g, '')
          );

    return Number.isFinite(parsed) && parsed > 0
      ? Number(parsed.toFixed(2))
      : 100.0;
  })();

  const [currentFareFiat, setCurrentFareFiat] =
    useState<number>(initialFareNum);

  /*
   * One canonical Pi rate is used everywhere.
   */
  const effectivePiRate =
    Number.isFinite(piRateUsd) && piRateUsd > 0
      ? piRateUsd
      : 10.0;

  const canonicalPiAmount = Number(
    (currentFareFiat / effectivePiRate).toFixed(7)
  );

  const formattedPi =
    canonicalPiAmount < 0.0001
      ? canonicalPiAmount.toFixed(6)
      : canonicalPiAmount
          .toFixed(6)
          .replace(/0+$/, '')
          .replace(/\.$/, '');

  /*
   * ============================================================
   * OFFER MODE
   * ============================================================
   */
  const isLiveDuffelOffer =
    typeof offer.offerId === 'string' &&
    /^off_[A-Za-z0-9]+$/.test(offer.offerId) &&
    offer.bookingMode === 'LIVE_DUFFEL' &&
    offer.isLive === true;

  /*
   * ============================================================
   * DERIVED UI STATE
   * ============================================================
   */
  const isProcessing =
    flowState === 'revalidating' ||
    flowState === 'authenticating' ||
    flowState === 'creating_payment' ||
    flowState === 'booking';

  const isAuthenticationError =
    flowState === 'auth_failed';

  const canRetryPayment =
    flowState === 'payment_failed' &&
    hasPaymentCreated;

  /*
   * ============================================================
   * LOG SELECTED OFFER
   * ============================================================
   */
  useEffect(() => {
    console.log(
      `[Flight UI] CHECKOUT_SELECTED_OFFER ` +
        `offerId=${offer.offerId} ` +
        `bookingMode=${offer.bookingMode} ` +
        `isLive=${offer.isLive} ` +
        `isLiveBooking=${offer.isLiveBooking} ` +
        `airline=${offer.airline} ` +
        `flightNumber=${offer.flightNumber}`
    );
  }, [
    offer.offerId,
    offer.bookingMode,
    offer.isLive,
    offer.isLiveBooking,
    offer.airline,
    offer.flightNumber
  ]);

  /*
   * ============================================================
   * ERROR CLASSIFICATION
   * ============================================================
   */
  const getErrorMessage = (err: any, fallback: string) => {
    if (typeof err === 'string' && err.trim()) {
      return err;
    }

    if (
      err?.message &&
      typeof err.message === 'string'
    ) {
      return err.message;
    }

    return fallback;
  };

  /*
   * ============================================================
   * PASSENGER VALIDATION
   * ============================================================
   */
  const validatePassengerDetails = (): string | null => {
    if (!givenName || !givenName.trim() || !familyName || !familyName.trim()) {
      return 'Please enter passenger first and last name.';
    }

    if (!title || !title.trim()) {
      return 'Please select a passenger title (Mr, Mrs, Ms).';
    }

    if (!gender || (gender !== 'male' && gender !== 'female')) {
      return 'Please select passenger gender (Male or Female) required for carrier ticket issuance.';
    }

    const trimmedDob = typeof dateOfBirth === 'string' ? dateOfBirth.trim() : '';
    if (!trimmedDob || !/^\d{4}-\d{2}-\d{2}$/.test(trimmedDob)) {
      return "Please enter the passenger's date of birth in YYYY-MM-DD format.";
    }

    const [yStr, mStr, dStr] = trimmedDob.split('-');
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);
    const day = parseInt(dStr, 10);

    if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
      return "Please enter the passenger's date of birth in YYYY-MM-DD format.";
    }

    const dobDate = new Date(year, month - 1, day);
    if (
      dobDate.getFullYear() !== year ||
      dobDate.getMonth() !== month - 1 ||
      dobDate.getDate() !== day
    ) {
      return "Please enter the passenger's date of birth in YYYY-MM-DD format.";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dobDate.getTime() >= today.getTime()) {
      return 'Passenger date of birth must be a valid date in the past.';
    }

    if (year < 1900) {
      return 'Please enter a valid passenger date of birth (after 1900).';
    }

    if (!email || !email.trim() || !email.includes('@') || !phone || !phone.trim()) {
      return 'Please provide a valid email and phone number for e-ticket delivery.';
    }

    if (
      !Number.isFinite(currentFareFiat) ||
      currentFareFiat <= 0
    ) {
      return 'Flight fare must be a valid positive amount.';
    }

    return null;
  };

  /*
   * ============================================================
   * PASSENGER OBJECT
   * ============================================================
   */
  const buildPassengerDetails =
    (): FlightPassengerDetails => ({
      title,
      givenName: givenName.trim(),
      familyName: familyName.trim(),
      dateOfBirth: dateOfBirth.trim(),
      gender,
      nationality: nationality.trim() || undefined,
      passportNumber:
        passportNumber.trim() || undefined,
      passportExpiry:
        passportExpiry || undefined,
      email: email.trim(),
      phone: phone.trim()
    });

  /*
   * ============================================================
   * STEP 1 → STEP 2
   * ============================================================
   */
  const handleProceedToPayment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const validationError =
      validatePassengerDetails();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);

    console.log(
      `[Flight Lifecycle] selected_offer_id=${offer.offerId} ` +
      `search_offer_id=${offer.offerId}`
    );

    /*
     * Live Duffel offers MUST be revalidated before payment.
     */
    if (isLiveDuffelOffer) {
      setFlowState('revalidating');
      setPaymentStatusText(
        'Revalidating live Duffel airfare...'
      );

      try {
        console.log(
          `[Flight Lifecycle] LIVE_DUFFEL_REVALIDATION_START ` +
            `offerId=${offer.offerId} ` +
            `fare=${currentFareFiat}`
        );

        const reval = await revalidateFlightOffer(
          offer.offerId,
          currentFareFiat
        );

        if (!reval?.valid) {
          setErrorMessage(
            reval?.message ||
              'This flight offer is no longer available. Please search again to get the latest availability.'
          );

          setFlowState('details');
          return;
        }

        console.log(
          `[Flight Lifecycle] revalidated_offer_id=${reval.offerId || offer.offerId}`
        );

        if (
          typeof reval.newFareFiat === 'number' &&
          Number.isFinite(reval.newFareFiat) &&
          reval.newFareFiat > 0
        ) {
          const normalizedFare = Number(
            reval.newFareFiat.toFixed(2)
          );

          setCurrentFareFiat(normalizedFare);

          console.log(
            `[Flight Lifecycle] LIVE_DUFFEL_REVALIDATION_UPDATED ` +
              `offerId=${offer.offerId} ` +
              `fare=${normalizedFare}`
          );
        }

        setFlowState('payment');
      } catch (err: any) {
        console.error(
          '[Flight Lifecycle] LIVE_DUFFEL_REVALIDATION_FAILED',
          err
        );

        setErrorMessage(
          getErrorMessage(
            err,
            'This flight offer is no longer available. Please search again to get the latest availability.'
          )
        );

        setFlowState('details');
      }

      return;
    }

    /*
     * Verified Carrier fallback:
     * no live Duffel revalidation required.
     */
    setFlowState('payment');
  };

  /*
   * ============================================================
   * PI AUTHENTICATION RETRY
   * ============================================================
   */
  const handleRetryAuth = async () => {
    if (isProcessing) return;

    setErrorMessage(null);
    setFlowState('authenticating');
    setPaymentStatusText(
      'Connecting to Pi Browser Wallet…'
    );

    try {
      console.log(
        '[Pi Lifecycle] AUTH_RETRY_START'
      );

      resetPiAuthState();

      await authenticatePiUser(
        undefined,
        true
      );

      console.log(
        '[Pi Lifecycle] AUTH_RETRY_SUCCESS'
      );

      /*
       * Authentication succeeded.
       * Return to payment screen with passenger details and flight selection preserved.
       */
      setFlowState('payment');
      setPaymentStatusText(
        'Pi Wallet authenticated. Ready to proceed with payment.'
      );
    } catch (err: any) {
      console.error(
        '[Pi Lifecycle] AUTH_RETRY_FAILED',
        err
      );

      setFlowState('auth_failed');

      setErrorMessage(
        getErrorMessage(
          err,
          'Pi Browser did not complete wallet authentication. Please retry Pi Authentication.'
        )
      );
    }
  };

  /*
   * ============================================================
   * CREATE PAYMENT + BOOK FLIGHT
   * ============================================================
   */
  const handleExecutePiPayment = async () => {
    if (isProcessing) return;

    const passengerValidationError = validatePassengerDetails();
    if (passengerValidationError) {
      setFlowState('details');
      setErrorMessage(passengerValidationError);
      return;
    }

    if (
      !Number.isFinite(currentFareFiat) ||
      currentFareFiat <= 0
    ) {
      setFlowState('payment_failed');
      setErrorMessage(
        'Validation Error: Flight fare must be a valid positive number greater than 0.'
      );
      return;
    }

    if (
      !Number.isFinite(canonicalPiAmount) ||
      canonicalPiAmount <= 0
    ) {
      setFlowState('payment_failed');
      setErrorMessage(
        'Payment amount could not be calculated safely. Please restart checkout.'
      );
      return;
    }

    setErrorMessage(null);

    // Step A: Explicitly ensure Pi authentication before payment creation
    if (!isPaymentScopeReady()) {
      setFlowState('authenticating');
      setPaymentStatusText('Connecting to Pi Browser Wallet…');

      try {
        await authenticatePiUser();
        setPaymentStatusText('Authentication successful. Preparing Pi payment…');
        await new Promise((r) => setTimeout(r, 350));
      } catch (authErr: any) {
        console.error('[Pi Lifecycle] AUTH_CHECKOUT_FAILED', authErr);
        setFlowState('auth_failed');
        setErrorMessage(
          getErrorMessage(
            authErr,
            'Pi Browser did not complete wallet authentication. Please retry Pi Authentication.'
          )
        );
        return;
      }
    }

    setFlowState('creating_payment');
    setPaymentStatusText(
      'Waiting for Pi Wallet authorization…'
    );

    const passengerDetails =
      buildPassengerDetails();

    const finalPiNumber =
      canonicalPiAmount;

    const memo =
      `Flight Ticket: ${offer.airline} ` +
      `(${offer.flightNumber}) ` +
      `${offer.originCode}➔${offer.destinationCode} ` +
      `for ${givenName.trim()} ${familyName.trim()}`;

    try {
      console.log(
        `[Pi Lifecycle] PAYMENT_CREATE_START ` +
          `offerId=${offer.offerId} ` +
          `piAmount=${finalPiNumber} ` +
          `fiatAmount=${currentFareFiat} ` +
          `idempotencyKey=${checkoutAttemptKeyRef.current}`
      );

      /*
       * --------------------------------------------------------
       * 1. PI PAYMENT
       * --------------------------------------------------------
       */
      const paymentResult =
        await createPiPayment({
          amountPi: finalPiNumber,
          memo,
          idempotencyKey:
            checkoutAttemptKeyRef.current,

          onStatusUpdate: (msg) => {
            setPaymentStatusText(msg);
          },

          metadata: {
            serviceType: 'FLIGHT_TICKET',
            category: 'transport',
            transportType: 'air',

            providerId:
              `prov-flight-${offer.airline
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')}`,

            providerName: offer.airline,
            countryCode: 'GLOBAL',

            offerId: offer.offerId,
            airline: offer.airline,
            flightNumber: offer.flightNumber,

            route:
              `${offer.originCode}-${offer.destinationCode}`,

            originCode: offer.originCode,
            destinationCode:
              offer.destinationCode,

            departureDate:
              offer.departureTime,

            cabinClass:
              offer.cabinClass,

            fiatAmount:
              Number(currentFareFiat.toFixed(2)),

            fiatFare:
              Number(currentFareFiat.toFixed(2)),

            fiatCurrency:
              offer.fareCurrency || 'USD',

            piRateApplied:
              effectivePiRate,

            passengerName:
              `${title ? `${title} ` : ''}` +
              `${givenName.trim()} ${familyName.trim()}`
                .trim(),

            passengerEmail:
              email.trim(),

            passengerPhone:
              phone.trim(),

            passportNumber:
              passportNumber.trim() || undefined
          }
        });

      /*
       * --------------------------------------------------------
       * PAYMENT FAILED
       * --------------------------------------------------------
       */
      if (
        !paymentResult ||
        !paymentResult.success
      ) {
        /*
         * If a paymentId exists, backend may already have a
         * payment lifecycle record. Do NOT blindly recreate
         * another payment.
         */
        if (paymentResult?.paymentId) {
          setHasPaymentCreated(true);
        }

        setFlowState('payment_failed');

        setErrorMessage(
          paymentResult?.message ||
            'Pi payment could not be completed.'
        );

        return;
      }

      /*
       * --------------------------------------------------------
       * PAYMENT CREATED
       * --------------------------------------------------------
       */
      setHasPaymentCreated(true);

      console.log(
        `[Pi Lifecycle] PAYMENT_CREATED ` +
          `paymentId=${paymentResult.paymentId || 'unknown'} ` +
          `txid=${paymentResult.txid || 'pending'}`
      );

      /*
       * --------------------------------------------------------
       * 2. BOOK FLIGHT
       * --------------------------------------------------------
       */
      setFlowState('booking');
      setPaymentStatusText(
        'Securing ticket with carrier...'
      );

      console.log(
        `[Flight Lifecycle] book_offer_id=${offer.offerId} ` +
          `paymentId=${paymentResult.paymentId || 'unknown'}`
      );

      const bookResponse =
        await bookFlightTicket({
          paymentId:
            paymentResult.paymentId ||
            `pi_flight_${Date.now()}`,

          txid:
            paymentResult.txid,

          offerId:
            offer.offerId,

          passengerDetails,

          idempotencyKey:
            checkoutAttemptKeyRef.current
        });

      /*
       * --------------------------------------------------------
       * BOOKING SUCCESS
       * --------------------------------------------------------
       */
      if (
        bookResponse?.success &&
        bookResponse.booking
      ) {
        console.log(
          `[Flight Lifecycle] BOOKING_CONFIRMED ` +
            `bookingId=${bookResponse.booking.bookingId} ` +
            `offerId=${offer.offerId}`
        );

        setConfirmedBooking(
          bookResponse.booking
        );

        setFlowState('confirmed');

        onBookingSuccess(
          bookResponse.booking
        );

        return;
      }

      /*
       * --------------------------------------------------------
       * PAYMENT SUCCESSFUL / BOOKING FAILED
       * --------------------------------------------------------
       *
       * IMPORTANT:
       * This is NOT a successful booking.
       *
       * The Pi payment remains protected according to the
       * backend/PSTP lifecycle and should be resolved by refund,
       * retry, or dispute logic.
       */
      const failedRecord:
        FlightBookingRecord = {
          bookingId:
            `BK-${isLiveDuffelOffer ? 'DUFFEL' : 'CARRIER'}-` +
            `${Date.now().toString().slice(-6)}`,

          pnr: null,

          bookingReference:
            `ESCROW-${paymentResult.paymentId
              ?.slice(-8)
              .toUpperCase() ||
              Date.now()
                .toString()
                .slice(-8)}`,

          ticketNumber: null,

          bookingStatus:
            'BOOKING_FAILED_HELD_FOR_REFUND',

          flightSummary: {
            airline:
              offer.airline,

            flightNumber:
              offer.flightNumber,

            originCode:
              offer.originCode,

            destinationCode:
              offer.destinationCode,

            departureTime:
              offer.departureTime,

            arrivalTime:
              offer.arrivalTime,

            cabinClass:
              offer.cabinClass
          },

          passenger:
            passengerDetails,

          payment: {
            piPaymentId:
              paymentResult.paymentId ||
              `pi_pay_${Date.now()}`,

            piTxid:
              paymentResult.txid,

            piAmount:
              finalPiNumber,

            fiatAmount:
              Number(
                currentFareFiat.toFixed(2)
              ),

            fiatCurrency:
              offer.fareCurrency ||
              'USD',

            piRateApplied:
              effectivePiRate,

            escrowProtected:
              true
          },

          provider:
            isLiveDuffelOffer
              ? 'Duffel Live GDS'
              : 'Verified Transport Carrier Gateway',

          bookingMode:
            isLiveDuffelOffer
              ? 'LIVE_DUFFEL'
              : 'VERIFIED_CARRIER',

          isLiveBooking:
            isLiveDuffelOffer,

          issuedAt:
            new Date().toISOString(),

          notice:
            bookResponse?.message ||
            'Pi payment was confirmed, but carrier booking failed. Funds remain protected for refund or retry.'
        };

      console.warn(
        `[Flight Lifecycle] BOOKING_FAILED_ESCROW ` +
          `offerId=${offer.offerId} ` +
          `paymentId=${failedRecord.payment.piPaymentId}`
      );

      setConfirmedBooking(
        failedRecord
      );

      setFlowState(
        'booking_failed_escrow'
      );

      onBookingSuccess(
        failedRecord
      );
    } catch (err: any) {
      console.error(
        '[Flight Lifecycle] PAYMENT_OR_BOOKING_ERROR',
        err
      );

      /*
       * Do not classify generic errors as authentication
       * failures.
       */
      const message = getErrorMessage(
        err,
        'Payment execution failed.'
      );

      const lower =
        message.toLowerCase();

      const looksLikeAuthFailure =
        lower.includes('authentication') ||
        lower.includes('authenticate') ||
        lower.includes('pi browser') ||
        lower.includes('permission') ||
        lower.includes('browser required') ||
        lower.includes('category_a') ||
        lower.includes('category_b') ||
        lower.includes('category_c') ||
        lower.includes('category_d') ||
        lower.includes('category_e') ||
        lower.includes('auth_timeout') ||
        lower.includes(
          'authenticate_unavailable'
        );

      if (looksLikeAuthFailure) {
        setFlowState('auth_failed');
      } else {
        setFlowState('payment_failed');
      }

      setErrorMessage(message);
    }
  };

  /*
   * ============================================================
   * CONFIRMED / ESCROW STATE
   * ============================================================
   */
  const isSuccessfulBooking =
    flowState === 'confirmed' &&
    confirmedBooking?.bookingStatus !==
      'BOOKING_FAILED_HELD_FOR_REFUND';

  const isEscrowFailure =
    flowState ===
      'booking_failed_escrow' ||
    confirmedBooking?.bookingStatus ===
      'BOOKING_FAILED_HELD_FOR_REFUND';

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <div id="flight-booking-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div id="flight-booking-modal-card" className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">

        {/* =====================================================
            HEADER
        ====================================================== */}
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
                {isSuccessfulBooking
                  ? 'Flight Booking Confirmed'
                  : isEscrowFailure
                    ? 'Payment Secured — Booking Issue'
                    : 'Passenger & Flight Checkout'}
              </h3>
            </div>
          </div>

          <button
            id="flight-modal-close-btn"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =====================================================
            BODY
        ====================================================== */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">

          {/* ===================================================
              FLIGHT SUMMARY
          ==================================================== */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">

                <span className="font-extrabold text-sm text-white">
                  {offer.airline}
                </span>

                <span className="text-xs font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/40">
                  {offer.flightNumber}
                </span>

                <span className="text-xs text-slate-400 capitalize">
                  • {offer.cabinClass.replace('_', ' ')}
                </span>

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

              <div className="text-right shrink-0">
                <span className="text-base font-black text-amber-300 font-mono">
                  {formattedPi} π
                </span>

                <span className="text-[11px] text-slate-400 block">
                  ≈ ${currentFareFiat.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl">

              <div>
                <span className="font-bold text-white text-sm">
                  {offer.originCode}
                </span>

                <div className="text-[10px] text-slate-400">
                  {new Date(
                    offer.departureTime
                  ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="text-center">
                <div className="text-[10px] text-purple-400 font-bold">
                  {offer.duration}
                </div>

                <div className="text-[10px] text-slate-400">
                  {offer.stops === 0
                    ? 'Non-stop'
                    : `${offer.stops} Stop`}
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-white text-sm">
                  {offer.destinationCode}
                </span>

                <div className="text-[10px] text-slate-400">
                  {new Date(
                    offer.arrivalTime
                  ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ===================================================
              ERROR BANNER
          ==================================================== */}
          {errorMessage && (
            <div id="flight-checkout-error-banner" className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-300">

              <div className="flex items-start sm:items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5 sm:mt-0" />

                <span className="leading-relaxed">
                  {errorMessage}
                </span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">

                {canRetryPayment && (
                  <button
                    id="flight-retry-payment-btn"
                    type="button"
                    onClick={handleExecutePiPayment}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold rounded-xl text-[11px] flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isProcessing
                          ? 'animate-spin'
                          : ''
                      }`}
                    />

                    <span>
                      Retry Payment
                    </span>
                  </button>
                )}

                {isAuthenticationError && (
                  <button
                    id="flight-retry-auth-btn"
                    type="button"
                    onClick={handleRetryAuth}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-bold rounded-xl text-[11px] flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isProcessing
                          ? 'animate-spin'
                          : ''
                      }`}
                    />

                    <span>
                      Retry Pi Authentication
                    </span>
                  </button>
                )}

              </div>
            </div>
          )}

          {/* ===================================================
              STEP 1 — PASSENGER DETAILS
          ==================================================== */}
          {flowState === 'details' && (
            <form
              id="flight-passenger-form"
              onSubmit={
                handleProceedToPayment
              }
              className="space-y-4"
            >

              <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-400" />
                <span>
                  PASSENGER DETAILS (Required for Airline GDS Manifest & E-Ticket)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Title *
                  </label>

                  <select
                    id="flight-passenger-title-select"
                    required
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value as any
                      )
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Mr">
                      Mr
                    </option>
                    <option value="Mrs">
                      Mrs
                    </option>
                    <option value="Ms">
                      Ms
                    </option>
                    <option value="Dr">
                      Dr
                    </option>
                    <option value="Alh.">
                      Alh.
                    </option>
                    <option value="Hjy.">
                      Hjy.
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Given / First Name *
                  </label>

                  <input
                    id="flight-passenger-given-name"
                    type="text"
                    required
                    placeholder="e.g. Ibrahim"
                    value={givenName}
                    onChange={(e) =>
                      setGivenName(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Family / Last Name *
                  </label>

                  <input
                    id="flight-passenger-family-name"
                    type="text"
                    required
                    placeholder="e.g. Bello"
                    value={familyName}
                    onChange={(e) =>
                      setFamilyName(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Date of Birth *
                  </label>

                  <input
                    id="flight-passenger-dob"
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={dateOfBirth}
                    onChange={(e) =>
                      setDateOfBirth(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Gender *
                  </label>

                  <select
                    id="flight-passenger-gender"
                    required
                    value={gender}
                    onChange={(e) =>
                      setGender(
                        e.target.value as any
                      )
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Nationality
                  </label>

                  <input
                    id="flight-passenger-nationality"
                    type="text"
                    value={nationality}
                    onChange={(e) =>
                      setNationality(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Passport / Travel ID Number
                  </label>

                  <input
                    id="flight-passenger-passport"
                    type="text"
                    placeholder="A12345678"
                    value={passportNumber}
                    onChange={(e) =>
                      setPassportNumber(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Passport Expiry Date
                  </label>

                  <input
                    id="flight-passenger-passport-expiry"
                    type="date"
                    value={passportExpiry}
                    onChange={(e) =>
                      setPassportExpiry(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

              </div>

              <div className="border-t border-slate-800 pt-3 space-y-3">

                <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  Contact Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Email Address *
                    </label>

                    <input
                      id="flight-passenger-email"
                      type="email"
                      required
                      placeholder="pioneer@example.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Mobile Phone *
                    </label>

                    <input
                      id="flight-passenger-phone"
                      type="tel"
                      required
                      placeholder="+234 801 234 5678"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">

                <button
                  id="flight-passenger-cancel-btn"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>

                <button
                  id="flight-passenger-submit-btn"
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {flowState ===
                  'revalidating' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>
                        Revalidating Fare...
                      </span>
                    </>
                  ) : (
                    <span>
                      Review Fare & Payment
                    </span>
                  )}
                </button>

              </div>
            </form>
          )}

          {/* ===================================================
              REVALIDATING
          ==================================================== */}
          {flowState ===
            'revalidating' && (
            <div id="flight-revalidating-view" className="py-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />

              <h4 className="text-sm font-black text-white">
                Revalidating Live Airfare
              </h4>

              <p className="text-xs text-slate-400 mt-2">
                Checking the current carrier fare before payment.
              </p>
            </div>
          )}

          {/* ===================================================
              STEP 2 — PAYMENT
          ==================================================== */}
          {flowState === 'payment' && (
            <div id="flight-payment-step-view" className="space-y-4">

              <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span>
                  Fare Summary & Pi Network Payment
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">

                <div className="flex justify-between text-slate-400">
                  <span>
                    Base Airfare
                  </span>

                  <span className="font-mono text-white">
                    $
                    {Math.max(
                      10,
                      currentFareFiat -
                        (offer.taxesAndFeesFiat ||
                          35)
                    ).toFixed(2)}{' '}
                    USD
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>
                    Airport Taxes & Security Surcharge
                  </span>

                  <span className="font-mono text-white">
                    $
                    {(
                      offer.taxesAndFeesFiat ||
                      35
                    ).toFixed(2)}{' '}
                    USD
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>
                    Passenger
                  </span>

                  <span className="font-bold text-white">
                    {title}{' '}
                    {givenName}{' '}
                    {familyName}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>
                    Date of Birth / Gender
                  </span>

                  <span className="font-mono text-white">
                    {dateOfBirth} ({gender === 'male' ? 'Male' : 'Female'})
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                  <span className="font-extrabold text-white">
                    Total Amount
                  </span>

                  <span className="font-black text-sm text-white font-mono">
                    $
                    {currentFareFiat.toFixed(
                      2
                    )}{' '}
                    USD
                  </span>
                </div>

                <div className="flex justify-between items-center bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/40">

                  <div>
                    <span className="font-extrabold text-amber-300 text-sm">
                      Pi Payment Required
                    </span>

                    <div className="text-[10px] text-purple-300">
                      Rate: 1 π = $
                      {effectivePiRate.toFixed(
                        2
                      )}{' '}
                      USD
                    </div>
                  </div>

                  <div className="text-right">

                    <div className="text-lg font-black text-amber-300 font-mono">
                      {formattedPi} π
                    </div>

                    <div className="text-[10px] text-slate-400">
                      Protected Payment Flow
                    </div>

                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">

                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />

                <div>
                  <span className="font-bold text-white">
                    Payment Protection:{' '}
                  </span>

                  <span>
                    Your payment is processed through the PiNova payment and escrow lifecycle. If carrier booking fails after payment confirmation, the payment is handled through the protected refund/retry process.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between gap-3">

                <button
                  id="flight-back-to-details-btn"
                  type="button"
                  onClick={() =>
                    setFlowState(
                      'details'
                    )
                  }
                  disabled={isProcessing}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl disabled:opacity-50"
                >
                  Back to Passenger Details
                </button>

                <button
                  id="flight-confirm-pay-btn"
                  type="button"
                  onClick={
                    handleExecutePiPayment
                  }
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />

                  <span>
                    Confirm & Pay {formattedPi} π
                  </span>
                </button>

              </div>
            </div>
          )}

          {/* ===================================================
              AUTHENTICATING / PAYMENT CREATION / BOOKING
          ==================================================== */}
          {(flowState ===
            'authenticating' ||
            flowState ===
              'creating_payment' ||
            flowState ===
              'booking') && (
            <div id="flight-processing-view" className="py-12 text-center">

              <RefreshCw className="w-9 h-9 animate-spin text-purple-400 mx-auto mb-4" />

              <h4 className="text-base font-black text-white">
                {flowState ===
                'authenticating'
                  ? 'Authenticating with Pi Network'
                  : flowState ===
                      'creating_payment'
                    ? 'Processing Pi Payment'
                    : 'Securing Flight Booking'}
              </h4>

              <p className="text-xs text-slate-400 mt-2">
                {paymentStatusText}
              </p>

              <div className="mt-5 max-w-sm mx-auto bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] text-slate-500">
                Please do not close the Pi Browser or press the payment button again while this operation is in progress.
              </div>

            </div>
          )}

          {/* ===================================================
              PAYMENT FAILED
          ==================================================== */}
          {flowState ===
            'payment_failed' && (
            <div id="flight-payment-failed-view" className="py-8 text-center">

              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>

              <h4 className="text-lg font-black text-white mt-4">
                Pi Payment Was Not Completed
              </h4>

              <p className="text-xs text-slate-400 mt-2">
                No successful flight booking has been created. You can return to payment and try again.
              </p>

              <button
                id="flight-return-to-payment-btn"
                type="button"
                onClick={() =>
                  setFlowState(
                    'payment'
                  )
                }
                className="mt-5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl"
              >
                Return to Payment
              </button>

            </div>
          )}

          {/* ===================================================
              AUTH FAILED
          ==================================================== */}
          {flowState ===
            'auth_failed' && (
            <div id="flight-auth-failed-view" className="py-8 text-center">

              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>

              <h4 className="text-lg font-black text-white mt-4">
                Pi Authentication Required
              </h4>

              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                Pi Browser did not complete wallet authentication.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-w-md mx-auto mt-3 text-[11px] text-slate-400">
                Your flight selection and passenger details are saved. No Pi payment was completed and no flight booking was created.
              </div>

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  id="flight-auth-failed-return-btn"
                  type="button"
                  onClick={() => setFlowState('payment')}
                  disabled={isProcessing}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl disabled:opacity-50"
                >
                  Return to Payment
                </button>
                <button
                  id="flight-auth-failed-retry-btn"
                  type="button"
                  onClick={handleRetryAuth}
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Pi Authentication
                </button>
              </div>

            </div>
          )}

          {/* ===================================================
              CONFIRMED / ESCROW RESULT
          ==================================================== */}
          {(flowState ===
            'confirmed' ||
            flowState ===
              'booking_failed_escrow') &&
            confirmedBooking && (
              <div id="flight-confirmed-booking-view" className="space-y-4 text-center">

                {isEscrowFailure ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-7 h-7" />
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-white">
                        Payment Secured — Booking Requires Resolution
                      </h4>

                      <p className="text-xs text-slate-400 mt-1">
                        Your Pi payment was received, but the carrier did not complete ticket allocation. Your payment record is protected for refund or retry.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-white">
                        Flight Booking Confirmed
                      </h4>

                      <p className="text-xs text-slate-400 mt-1">
                        Your flight booking has been successfully completed.
                      </p>
                    </div>
                  </>
                )}

                {/* =================================================
                    TICKET / BOOKING CARD
                ================================================== */}
                <div id="flight-booking-ticket-card" className="bg-slate-950 border border-purple-900/40 rounded-3xl p-5 text-left space-y-4 shadow-xl relative overflow-hidden">

                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl" />

                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">

                    <div>
                      <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                        PiNova Flight Booking Record
                      </div>

                      <div className="text-base font-black text-white">
                        {confirmedBooking.flightSummary.airline}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase">
                        Booking Ref / PNR
                      </div>

                      <div className="text-sm font-mono font-black text-amber-300">
                        {confirmedBooking.pnr ||
                          confirmedBooking.bookingReference}
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">

                    <div>
                      <div className="text-slate-500 text-[10px]">
                        Passenger
                      </div>

                      <div className="font-bold text-white truncate">
                        {
                          confirmedBooking
                            .passenger
                            .givenName
                        }{' '}
                        {
                          confirmedBooking
                            .passenger
                            .familyName
                        }
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500 text-[10px]">
                        Flight No.
                      </div>

                      <div className="font-mono font-bold text-purple-300">
                        {
                          confirmedBooking
                            .flightSummary
                            .flightNumber
                        }
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500 text-[10px]">
                        Route
                      </div>

                      <div className="font-bold text-white">
                        {
                          confirmedBooking
                            .flightSummary
                            .originCode
                        }{' '}
                        ➔{' '}
                        {
                          confirmedBooking
                            .flightSummary
                            .destinationCode
                        }
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500 text-[10px]">
                        Class
                      </div>

                      <div className="font-bold text-white capitalize">
                        {
                          confirmedBooking
                            .flightSummary
                            .cabinClass
                            .replace(
                              '_',
                              ' '
                            )
                        }
                      </div>
                    </div>

                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">

                    <div className="flex items-center gap-2">

                      <ShieldCheck className="w-4 h-4 text-emerald-400" />

                      <div>
                        <div className="font-bold text-white">
                          Payment Protection
                        </div>

                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                          TxID:{' '}
                          {confirmedBooking.payment.piTxid ||
                            confirmedBooking.payment.piPaymentId}
                        </div>
                      </div>

                    </div>

                    <div className="text-right">

                      <div className="text-xs font-mono font-black text-amber-300">
                        {
                          confirmedBooking
                            .payment
                            .piAmount
                        }{' '}
                        π
                      </div>

                      <div className="text-[10px] text-slate-400">
                        $
                        {
                          confirmedBooking
                            .payment
                            .fiatAmount
                        }{' '}
                        USD
                      </div>

                    </div>

                  </div>

                  <div className="text-[11px] text-slate-400 italic">
                    {isEscrowFailure
                      ? confirmedBooking.notice ||
                        'Your payment remains protected while the booking issue is resolved.'
                      : `A confirmation copy has been sent to ${confirmedBooking.passenger.email}. Present your booking reference and valid travel identification at check-in.`}
                  </div>

                </div>

                <div className="pt-2 flex justify-center gap-3">

                  <button
                    id="flight-confirmed-return-btn"
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md"
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
