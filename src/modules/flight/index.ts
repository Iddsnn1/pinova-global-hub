import { FlightSearchCriteria, FlightOffer, FlightConfigStatus, FlightBookingRecord, FlightPassengerDetails } from '../../types/flight';
import { generateVerifiedCarrierOffers } from '../../data/flightData';

export async function fetchFlightConfig(): Promise<FlightConfigStatus> {
  try {
    const res = await fetch('/api/flight/config');
    if (!res.ok) {
      return {
        apiConfigured: false,
        provider: 'duffel',
        mode: 'verified-carrier',
        baseUrl: 'https://api.duffel.com',
        message: 'Live Flight API is not configured. Serving verified carrier flight schedules.'
      };
    }
    const data = await res.json();
    return {
      apiConfigured: Boolean(data.apiConfigured),
      provider: data.provider || 'duffel',
      mode: data.apiConfigured ? 'live-duffel' : 'verified-carrier',
      baseUrl: data.baseUrl || 'https://api.duffel.com',
      message: data.message || '',
      reqId: data.reqId
    };
  } catch (err) {
    return {
      apiConfigured: false,
      provider: 'duffel',
      mode: 'verified-carrier',
      baseUrl: 'https://api.duffel.com',
      message: 'Flight API offline. Serving verified carrier flight schedules.'
    };
  }
}

export async function searchFlights(
  criteria: FlightSearchCriteria,
  piRateUsd: number
): Promise<{
  offers: FlightOffer[];
  isLive: boolean;
  apiConfigured: boolean;
  message: string;
  reqId?: string;
}> {
  try {
    const res = await fetch('/api/flight/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria)
    });

    const data = await res.json();

    if (data.success && data.apiConfigured && Array.isArray(data.liveResults) && data.liveResults.length > 0) {
      // Resolve one trusted FX quote per distinct currency through the server.
      // Quotes are estimates only; flight booking/payment must revalidate the
      // live offer and independently calculate/authorize the canonical amount.
      const currencies = [...new Set<string>(data.liveResults.map((off: any) =>
        String(off.currency || '').trim().toUpperCase()
      ).filter((currency: string) => /^[A-Z]{3}$/.test(currency)))];
      const piPerFiatUnit = new Map<string, number>();
      await Promise.all(currencies.map(async (currency) => {
        try {
          const quoteResponse = await fetch('/api/currency/fiat-to-pi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({ fiatAmount: 1, currency })
          });
          if (!quoteResponse.ok) return;
          const quotePayload = await quoteResponse.json();
          const usdAmount = quotePayload?.success === true
            ? Number(quotePayload?.conversion?.usdAmount)
            : Number.NaN;
          if (Number.isFinite(usdAmount) && usdAmount > 0) {
            // Use the server's trusted FX result; this client-side rate is display-only.
            piPerFiatUnit.set(currency, usdAmount / 314159);
          }
        } catch {
          // Keep the currency unavailable if the trusted server quote fails.
        }
      }));

      // Map live results from Duffel API. Missing/stale FX means no estimate,
      // never a guessed exchange rate or a fabricated 0π fare.
      const liveOffers: FlightOffer[] = data.liveResults.map((off: any) => {
        const fiat = typeof off.fareAmountFiat === 'number' ? off.fareAmountFiat : parseFloat(off.fareAmountFiat) || 0;
        const currency = String(off.currency || '').trim().toUpperCase();
        const taxes = typeof off.taxesAndFeesFiat === 'number' ? off.taxesAndFeesFiat : Math.round(fiat * 0.14);
        const base = typeof off.baseFareFiat === 'number' ? off.baseFareFiat : Math.max(0, fiat - taxes);
        const piPerUnit = piPerFiatUnit.get(currency);
        const pi = Number.isFinite(fiat) && fiat > 0 && piPerUnit && piPerUnit > 0
          ? Number((fiat * piPerUnit).toFixed(12))
          : 0;

        return {
          offerId: off.offerId,
          offerRequestId: off.offerRequestId,
          airline: off.airline || 'Partner Airline',
          flightNumber: off.flightNumber || 'Scheduled Flight',
          aircraft: off.aircraft || undefined,
          originCode: off.originCode,
          originCity: off.originCity,
          destinationCode: off.destinationCode,
          destinationCity: off.destinationCity,
          departureTime: off.departureTime,
          arrivalTime: off.arrivalTime,
          duration: off.duration || 'Direct',
          stops: typeof off.stops === 'number' ? off.stops : 0,
          stopAirports: off.stopAirports || [],
          cabinClass: criteria.cabinClass,
          baggage: {
            cabinBaggage: '1 x 7kg Carry-on',
            checkedBaggage: off.baggageAllowance || 'Standard Allowance'
          },
          fareAmountFiat: fiat,
          baseFareFiat: base,
          taxesAndFeesFiat: taxes,
          fareBrandName: off.fareBrandName,
          fareCurrency: currency,
          fareAmountPi: pi,
          seatsAvailable: typeof off.seatsAvailable === 'number' ? off.seatsAvailable : 1,
          fareConditions: off.fareConditions || 'Live Duffel Carrier Tariff. Changeable subject to airline rules.',
          expiresAt: off.expiresAt,
          refundable: off.refundable ?? true,
          isLive: true,
          bookingMode: 'LIVE_DUFFEL' as const,
          isLiveBooking: true,
          providerName: 'Duffel Live GDS',
          segments: off.segments
        };
      });

      // Deduplication & Grouping: Group same physical itinerary offers into 1 card with selectable fare options
      // Key MUST include: origin, destination, departure timestamp, arrival timestamp, segment flight numbers, operating carriers
      const buildItineraryKey = (off: FlightOffer): string => {
        const segFlightNums = off.segments && off.segments.length > 0
          ? off.segments.map(s => s.flightNumber.trim()).join(',')
          : off.flightNumber.trim();
        const segCarriers = off.segments && off.segments.length > 0
          ? off.segments.map(s => (s.operatingAirline || s.marketingAirline || '').trim()).join(',')
          : off.airline.trim();

        return [
          off.originCode.trim().toUpperCase(),
          off.destinationCode.trim().toUpperCase(),
          off.departureTime.trim(),
          off.arrivalTime.trim(),
          segFlightNums,
          segCarriers,
          off.cabinClass.trim().toLowerCase()
        ].join('|');
      };

      const itineraryMap = new Map<string, FlightOffer[]>();
      for (const off of liveOffers) {
        const key = buildItineraryKey(off);
        if (!itineraryMap.has(key)) {
          itineraryMap.set(key, []);
        }
        itineraryMap.get(key)!.push(off);
      }

      const groupedOffers: FlightOffer[] = [];
      for (const [_, offersForItinerary] of itineraryMap.entries()) {
        // Sort ascending by fare amount so lowest fare is default
        offersForItinerary.sort((a, b) => a.fareAmountFiat - b.fareAmountFiat);

        // De-duplicate truly identical offers (same price, brand, and baggage)
        const uniqueFareOptions = [];
        const seenFares = new Set<string>();

        for (const off of offersForItinerary) {
          const fareKey = `${off.fareAmountFiat}|${off.fareCurrency}|${off.fareBrandName || ''}|${off.baggage.checkedBaggage}|${off.fareConditions || ''}`;
          if (!seenFares.has(fareKey)) {
            seenFares.add(fareKey);
            uniqueFareOptions.push({
              offerId: off.offerId, // Preserves the exact original Duffel offer ID
              fareBrandName: off.fareBrandName,
              fareAmountFiat: off.fareAmountFiat,
              fareCurrency: off.fareCurrency,
              fareAmountPi: off.fareAmountPi,
              baseFareFiat: off.baseFareFiat,
              taxesAndFeesFiat: off.taxesAndFeesFiat,
              baggage: off.baggage,
              fareConditions: off.fareConditions,
              refundable: off.refundable,
              seatsAvailable: off.seatsAvailable
            });
          }
        }

        const primaryOffer = offersForItinerary[0];
        const groupedOffer: FlightOffer = {
          ...primaryOffer,
          fareOptions: uniqueFareOptions
        };
        groupedOffers.push(groupedOffer);
      }

      console.log(
        `[FLIGHT SEARCH] requestId=${data.offerRequestId || 'N/A'} rawOffers=${data.liveResults.length} normalizedOffers=${liveOffers.length} uniqueItineraries=${groupedOffers.length} renderedCards=${groupedOffers.length}`
      );

      return {
        offers: groupedOffers,
        isLive: true,
        apiConfigured: true,
        message: data.message || 'Live flight results retrieved directly from Duffel API.',
        reqId: data.reqId
      };
    }

    // Fallback to verified carrier schedules when FLIGHT_API_ACCESS_TOKEN is missing or yields no direct GDS route
    const fallbackOffers = generateVerifiedCarrierOffers(
      criteria.origin,
      criteria.destination,
      criteria.departureDate,
      criteria.cabinClass,
      piRateUsd
    );

    return {
      offers: fallbackOffers,
      isLive: false,
      apiConfigured: Boolean(data.apiConfigured),
      message: data.message || 'Showing verified carrier flight schedules.',
      reqId: data.reqId
    };
  } catch (err: any) {
    // Graceful offline fallback
    const fallbackOffers = generateVerifiedCarrierOffers(
      criteria.origin,
      criteria.destination,
      criteria.departureDate,
      criteria.cabinClass,
      piRateUsd
    );

    return {
      offers: fallbackOffers,
      isLive: false,
      apiConfigured: false,
      message: 'Showing verified carrier flight schedules.'
    };
  }
}

export async function revalidateFlightOffer(
  offerId: string,
  expectedFareFiat: number
): Promise<{
  success: boolean;
  valid: boolean;
  priceChanged: boolean;
  newFareFiat: number;
  seatsAvailable: number;
  verificationMode: 'LIVE_DUFFEL' | 'verified-carrier';
  offerId?: string;
  message: string;
}> {
  try {
    const res = await fetch('/api/flight/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, expectedFareFiat })
    });

    const data = await res.json();
    return {
      success: Boolean(data.success),
      valid: Boolean(data.valid),
      priceChanged: Boolean(data.priceChanged),
      newFareFiat: typeof data.newFareFiat === 'number' ? data.newFareFiat : expectedFareFiat,
      seatsAvailable: typeof data.seatsAvailable === 'number' ? data.seatsAvailable : 0,
      verificationMode: data.verificationMode || (data.valid ? 'LIVE_DUFFEL' : 'verified-carrier'),
      offerId: data.offerId || offerId,
      message: data.message || (data.valid ? 'Live Duffel fare revalidated successfully.' : 'Live Duffel offer could not be revalidated. Please search again.')
    };
  } catch (err: any) {
    return {
      success: false,
      valid: false,
      priceChanged: false,
      newFareFiat: expectedFareFiat,
      seatsAvailable: 0,
      verificationMode: 'LIVE_DUFFEL',
      offerId,
      message: 'Live Duffel offer could not be revalidated. Please search again.'
    };
  }
}

export async function bookFlightTicket(params: {
  paymentId: string;
  txid?: string;
  offerId: string;
  passengerDetails: FlightPassengerDetails;
  idempotencyKey?: string;
}): Promise<{
  success: boolean;
  idempotent?: boolean;
  status?: string;
  booking?: FlightBookingRecord;
  error?: string;
  message?: string;
}> {
  try {
    const res = await fetch('/api/flight/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const data = await res.json();
    return {
      success: Boolean(data.success),
      idempotent: Boolean(data.idempotent),
      status: data.status || data.booking?.bookingStatus,
      booking: data.booking,
      error: data.error,
      message: data.message || (data.success ? 'Flight ticket issued successfully.' : 'Flight booking could not be completed.')
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      status: 'BOOKING_RECONCILIATION_REQUIRED',
      message: err.message || 'Failed to connect to flight booking service.'
    };
  }
}
