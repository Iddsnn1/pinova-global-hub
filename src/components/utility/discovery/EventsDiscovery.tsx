import React, { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Ticket,
  Search,
  Sparkles,
  Crown,
  CheckCircle2,
  Users,
  Clock,
  Globe,
  Share2,
  Copy,
  ChevronRight,
  ShieldCheck,
  X,
  CreditCard,
  QrCode,
  Tag,
  ArrowRight
} from 'lucide-react';
import {
  GlobalEventItem,
  EventTicketTier,
  PurchasedEventTicket,
  GLOBAL_EVENTS_MASTER
} from '../../../data/eventsData';
import { ALL_GLOBAL_COUNTRIES } from '../../../data/countriesData';
import { PiConversionConfig, UtilityTransactionReceipt } from '../../../types/utility';
import { createPiPayment } from '../../../lib/piSdk';
import { formatPiAmount, calculateAuthoritativePiAmount } from '../../../utils/formatters';

interface EventsDiscoveryProps {
  selectedCountryCode?: string;
  piConversionConfig?: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onCountryChange?: (countryCode: string) => void;
  onTransactionSuccess?: (receipt: UtilityTransactionReceipt) => void;
}

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Categories' },
  { id: 'pi_community', label: 'Pi Community & Web3' },
  { id: 'web3', label: 'FinTech & Blockchain' },
  { id: 'tech', label: 'AI & Engineering' },
  { id: 'music', label: 'Music & Concerts' },
  { id: 'business', label: 'Business & Gala' },
  { id: 'sports', label: 'Sports & Gaming' },
  { id: 'arts', label: 'Arts & Culture' }
];

export const EventsDiscovery: React.FC<EventsDiscoveryProps> = ({
  selectedCountryCode = 'GLOBAL',
  piConversionConfig,
  userBalancePi = 1250,
  buyerUsername = 'Pioneer_User',
  onCountryChange,
  onTransactionSuccess
}) => {
  // Navigation tabs: 'browse' | 'my_tickets'
  const [activeTab, setActiveTab] = useState<'browse' | 'my_tickets'>('browse');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCountry, setActiveCountry] = useState(selectedCountryCode || 'GLOBAL');
  const [vipOnlyFilter, setVipOnlyFilter] = useState(false);

  // Modal / Booking State
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<GlobalEventItem | null>(null);
  const [selectedTier, setSelectedTier] = useState<EventTicketTier | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingErrorMessage, setBookingErrorMessage] = useState<string | null>(null);
  const [bookingSuccessTicket, setBookingSuccessTicket] = useState<PurchasedEventTicket | null>(null);

  // Purchased Tickets Local State
  const [myTickets, setMyTickets] = useState<PurchasedEventTicket[]>(() => {
    try {
      const saved = localStorage.getItem('pinova_user_event_tickets');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        ticketId: 'TKT-PI-SUMMIT-8921',
        eventId: 'event-pi-global-summit-2026',
        eventTitle: 'Pi Global Pioneers & Web3 Ecosystem Summit 2026',
        eventDate: '2026-10-14 · 09:00 AM',
        eventVenue: 'Eko International Convention Centre',
        eventCity: 'Lagos',
        eventCountry: 'Nigeria',
        tierName: 'VIP Executive Pass',
        attendeeName: buyerUsername || 'Alex Pioneer',
        attendeeEmail: 'alex.pioneer@pinova.hub',
        piAmount: 0.00038,
        fiatAmount: 120,
        txId: 'TX-PI-EVENT-998124',
        piTxid: '0x99a8b7c6d5e4',
        qrCodeData: 'PI-TKT-2026-EKO-VIP-8921-VERIFIED',
        purchaseDate: new Date().toLocaleDateString(),
        status: 'VALID'
      }
    ];
  });

  const piRate = piConversionConfig?.piRateUsd || 314159;

  // Helper to convert USD fiat to Pi
  const calculatePi = (usd: number) => {
    if (!usd || usd <= 0 || !piRate) return 0;
    return calculateAuthoritativePiAmount(usd, piRate);
  };

  // Sync country change if parent prop changes
  React.useEffect(() => {
    if (selectedCountryCode) {
      setActiveCountry(selectedCountryCode);
    }
  }, [selectedCountryCode]);

  // Save tickets to localStorage
  const saveTicket = (newTicket: PurchasedEventTicket) => {
    setMyTickets((prev) => {
      const updated = [newTicket, ...prev];
      try {
        localStorage.setItem('pinova_user_event_tickets', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return GLOBAL_EVENTS_MASTER.filter((ev) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesText =
          ev.title.toLowerCase().includes(q) ||
          ev.venue.toLowerCase().includes(q) ||
          ev.city.toLowerCase().includes(q) ||
          ev.country.toLowerCase().includes(q) ||
          ev.organizer.toLowerCase().includes(q) ||
          ev.description.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // 2. Category Filter
      if (activeCategory !== 'all' && ev.category !== activeCategory) {
        return false;
      }

      // 3. Country Filter
      if (activeCountry !== 'GLOBAL' && ev.countryCode !== activeCountry) {
        return false;
      }

      // 4. VIP Filter
      if (vipOnlyFilter && !ev.isVipAvailable) {
        return false;
      }

      return true;
    });
  }, [searchQuery, activeCategory, activeCountry, vipOnlyFilter]);

  // Open booking modal for an event
  const handleOpenBooking = (event: GlobalEventItem) => {
    setSelectedEventForBooking(event);
    setSelectedTier(event.ticketTiers[0] || null);
    setTicketQuantity(1);
    setAttendeeName(buyerUsername || '');
    setAttendeeEmail(`${buyerUsername.toLowerCase().replace(/\s+/g, '')}@pinetwork.com`);
    setBookingErrorMessage(null);
    setBookingSuccessTicket(null);
  };

  // Execute Pi Payment for Ticket
  const handleProcessTicketPayment = async () => {
    if (!selectedEventForBooking || !selectedTier) return;
    if (!attendeeName.trim()) {
      setBookingErrorMessage('Please enter the attendee full name.');
      return;
    }
    if (!attendeeEmail.trim() || !attendeeEmail.includes('@')) {
      setBookingErrorMessage('Please enter a valid attendee email for ticket delivery.');
      return;
    }

    setBookingErrorMessage(null);
    setIsProcessingPayment(true);

    const totalFiat = selectedTier.fiatPrice * ticketQuantity;
    const totalPi = calculatePi(totalFiat);
    const memoText = `Event Ticket (${ticketQuantity}x ${selectedTier.name}) - ${selectedEventForBooking.title}`;

    try {
      const paymentResult = await createPiPayment({
        amountPi: totalPi,
        memo: memoText,
        metadata: {
          category: 'events',
          eventId: selectedEventForBooking.id,
          eventTitle: selectedEventForBooking.title,
          tierId: selectedTier.id,
          tierName: selectedTier.name,
          quantity: ticketQuantity,
          attendeeName,
          attendeeEmail,
          totalFiat,
          currency: 'USD',
          piRateApplied: piRate
        }
      });

      if (paymentResult && paymentResult.success) {
        const ticketId = `TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        const txId = paymentResult.paymentId || `TX-EVT-${Date.now()}`;
        const piTxid = paymentResult.txid || `0x${Math.random().toString(16).substring(2, 10)}`;

        const newPurchasedTicket: PurchasedEventTicket = {
          ticketId,
          eventId: selectedEventForBooking.id,
          eventTitle: selectedEventForBooking.title,
          eventDate: `${selectedEventForBooking.date} · ${selectedEventForBooking.time}`,
          eventVenue: selectedEventForBooking.venue,
          eventCity: selectedEventForBooking.city,
          eventCountry: selectedEventForBooking.country,
          tierName: selectedTier.name,
          attendeeName,
          attendeeEmail,
          piAmount: totalPi,
          fiatAmount: totalFiat,
          txId,
          piTxid,
          qrCodeData: `PI-PASS-${ticketId}-${selectedEventForBooking.id.toUpperCase()}-VERIFIED`,
          purchaseDate: new Date().toLocaleDateString(),
          status: 'VALID'
        };

        saveTicket(newPurchasedTicket);
        setBookingSuccessTicket(newPurchasedTicket);

        // Notify parent transaction receiver
        if (onTransactionSuccess) {
          const receipt: UtilityTransactionReceipt = {
            transactionId: txId,
            piPaymentId: txId,
            piTxid,
            category: 'events',
            providerId: selectedEventForBooking.id,
            providerName: selectedEventForBooking.organizer,
            accountNumber: attendeeEmail,
            accountName: attendeeName,
            piAmount: totalPi,
            fiatAmount: totalFiat,
            fiatCurrency: 'USD',
            timestamp: new Date().toISOString(),
            status: 'SUCCESS',
            tokenOrCode: ticketId,
            packageName: `${ticketQuantity}x ${selectedTier.name}`,
            appliedPiRateUsd: piRate,
            orderProtectionGuaranteed: true,
            buyerUsername
          };
          onTransactionSuccess(receipt);
        }
      } else {
        setBookingErrorMessage(paymentResult?.message || 'Payment was cancelled or could not be verified.');
      }
    } catch (err: any) {
      setBookingErrorMessage(err?.message || 'An error occurred during ticket checkout.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const featuredEvent = useMemo(() => {
    return GLOBAL_EVENTS_MASTER.find((e) => e.isFeatured) || GLOBAL_EVENTS_MASTER[0];
  }, []);

  return (
    <div className="space-y-6">
      
      {/* EVENT HUB HEADER CONTROLS & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Event Centers & Tickets</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discover global conferences, music festivals, summits, and VIP access passes payable directly in Pi Coin.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'browse'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Events</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_tickets')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'my_tickets'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>My Tickets</span>
            {myTickets.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
                {myTickets.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <div className="space-y-6">

          {/* SEARCH & COUNTRY/CATEGORY FILTER BAR */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Universal Event Search */}
              <div className="md:col-span-7 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events, keynote summits, music festivals, venues, or cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Country Filter */}
              <div className="md:col-span-3">
                <select
                  value={activeCountry}
                  onChange={(e) => {
                    setActiveCountry(e.target.value);
                    if (onCountryChange) onCountryChange(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="GLOBAL">🌐 All Countries (Global)</option>
                  {ALL_GLOBAL_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* VIP Filter Toggle */}
              <div className="md:col-span-2 flex items-center">
                <button
                  type="button"
                  onClick={() => setVipOnlyFilter((prev) => !prev)}
                  className={`w-full py-2.5 px-3 rounded-2xl border text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    vipOnlyFilter
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>VIP Passes</span>
                </button>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORY_FILTERS.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* FEATURED EVENT SHOWCASE BANNER (when searching all or matching) */}
          {featuredEvent && (!searchQuery || featuredEvent.title.toLowerCase().includes(searchQuery.toLowerCase())) && (
            <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured Event
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/80 border border-purple-400/40 text-purple-200">
                        {featuredEvent.categoryLabel}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {featuredEvent.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {featuredEvent.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border-t border-purple-900/60 pt-4">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Date & Time</div>
                      <div className="font-extrabold text-amber-300">{featuredEvent.date}</div>
                      <div className="text-[11px] text-slate-300">{featuredEvent.time}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Venue Location</div>
                      <div className="font-extrabold text-white truncate">{featuredEvent.venue}</div>
                      <div className="text-[11px] text-slate-300">{featuredEvent.flag} {featuredEvent.city}, {featuredEvent.country}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Starting From</div>
                      <div className="font-black text-purple-300 text-sm">
                        {calculatePi(featuredEvent.ticketTiers[0]?.fiatPrice || 35).toFixed(6)} π
                      </div>
                      <div className="text-[10px] text-slate-400">${featuredEvent.ticketTiers[0]?.fiatPrice} USD</div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(featuredEvent)}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 group"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Book Passes in Pi</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
                  <img
                    src={featuredEvent.bannerImage}
                    alt={featuredEvent.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                </div>
              </div>
            </div>
          )}

          {/* EVENTS LIST & GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Upcoming Events ({filteredEvents.length})</span>
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                Direct Pi Settlement
              </span>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">No Events Found</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    We couldn't find any events matching your selected filters. Try clearing your search or switching country to Global.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setActiveCountry('GLOBAL');
                    setVipOnlyFilter(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map((event) => {
                  const minTier = event.ticketTiers[0];
                  const startingPi = calculatePi(minTier?.fiatPrice || 20);

                  return (
                    <div
                      key={event.id}
                      className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between group"
                    >
                      {/* Image Header */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/90 text-purple-200 border border-purple-500/30 backdrop-blur-sm">
                            {event.categoryLabel}
                          </span>
                          {event.isVipAvailable && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/90 text-slate-950 flex items-center gap-0.5 backdrop-blur-sm">
                              <Crown className="w-2.5 h-2.5" />
                              VIP
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.date} · {event.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                            {event.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                            <span className="truncate">{event.venue}, {event.flag} {event.city}</span>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">From</div>
                              <div className="text-sm font-black text-purple-600 dark:text-purple-400">
                                {formatPiAmount(startingPi)} π
                              </div>
                              <div className="text-[10px] text-slate-400">${minTier?.fiatPrice} USD</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenBooking(event)}
                              className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              <span>Select Pass</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* MY PURCHASED TICKETS TAB */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Purchased Event Passes ({myTickets.length})</span>
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified On-Chain Pi Tickets</span>
            </span>
          </div>

          {myTickets.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">No Purchased Passes Yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Your booked conference badges, VIP gala seats, and concert tickets will appear here with dynamic QR codes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 shadow-sm"
              >
                Browse Upcoming Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTickets.map((ticket) => (
                <div
                  key={ticket.ticketId}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 overflow-hidden shadow-md flex flex-col justify-between"
                >
                  <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 text-white p-4 flex items-center justify-between border-b border-purple-800/40">
                    <div>
                      <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">
                        {ticket.tierName}
                      </span>
                      <h4 className="font-black text-sm text-white mt-1 line-clamp-1">{ticket.eventTitle}</h4>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5 text-amber-300" />
                    </div>
                  </div>

                  <div className="p-4 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Attendee</span>
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">{ticket.attendeeName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Ticket ID</span>
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{ticket.ticketId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Date & Venue</span>
                        <span className="font-bold">{ticket.eventDate}</span>
                        <span className="block text-slate-400 text-[10px]">{ticket.eventVenue}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Settled Pi</span>
                        <span className="font-black text-amber-600 dark:text-amber-400">{formatPiAmount(ticket.piAmount)} π</span>
                        <span className="block text-slate-400 text-[10px]">(${ticket.fiatAmount} USD)</span>
                      </div>
                    </div>

                    {/* QR Code Simulator Banner */}
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-900/60 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-extrabold text-purple-900 dark:text-purple-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          <span>Official Entry Pass Token</span>
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 select-all">{ticket.qrCodeData}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(ticket.qrCodeData);
                          alert('Ticket pass code copied!');
                        }}
                        className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500"
                        title="Copy Code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Purchased: {ticket.purchaseDate}</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Status: {ticket.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EVENT BOOKING / TICKET SELECTION MODAL */}
      {selectedEventForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-purple-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {selectedEventForBooking.categoryLabel}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white line-clamp-1">
                    {selectedEventForBooking.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEventForBooking(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {bookingSuccessTicket ? (
                /* SUCCESS STATE */
                <div className="p-6 bg-purple-50 dark:bg-purple-950/40 rounded-3xl border border-purple-200 dark:border-purple-800 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Ticket Reserved Successfully!</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your entry token has been created and securely added to your passes.
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-purple-800/80 text-left space-y-2 text-xs">
                    <div><span className="font-bold">Pass Code:</span> <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{bookingSuccessTicket.ticketId}</span></div>
                    <div><span className="font-bold">Tier:</span> {bookingSuccessTicket.tierName}</div>
                    <div><span className="font-bold">Attendee:</span> {bookingSuccessTicket.attendeeName} ({bookingSuccessTicket.attendeeEmail})</div>
                    <div><span className="font-bold">Settled Pi:</span> <span className="font-black text-purple-600 dark:text-purple-400">{bookingSuccessTicket.piAmount.toFixed(6)} π</span></div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEventForBooking(null);
                        setActiveTab('my_tickets');
                      }}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-xs"
                    >
                      View in My Tickets
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedEventForBooking(null)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* SELECTION & CHECKOUT FORM */
                <div className="space-y-5">
                  
                  {/* Event Summary Pill */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span className="font-bold">{selectedEventForBooking.venue}, {selectedEventForBooking.flag} {selectedEventForBooking.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{selectedEventForBooking.date} · {selectedEventForBooking.time}</span>
                    </div>
                  </div>

                  {/* Ticket Tier Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Select Ticket Tier / Access Pass
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {selectedEventForBooking.ticketTiers.map((tier) => {
                        const isSelected = selectedTier?.id === tier.id;
                        const tierPi = calculatePi(tier.fiatPrice);

                        return (
                          <div
                            key={tier.id}
                            onClick={() => setSelectedTier(tier)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 ring-2 ring-purple-500/20'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-sm text-slate-900 dark:text-slate-100">{tier.name}</span>
                                {tier.badge && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 flex items-center gap-1">
                                    <Crown className="w-2.5 h-2.5" />
                                    {tier.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{tier.description}</p>
                              
                              {/* Perks list */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {tier.perks.map((p, idx) => (
                                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    ✓ {p}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="text-right sm:text-right shrink-0">
                              <div className="text-base font-black text-purple-600 dark:text-purple-400">
                                {formatPiAmount(tierPi)} π
                              </div>
                              <div className="text-xs text-slate-400">${tier.fiatPrice} USD</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity and Attendee Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Quantity
                      </label>
                      <select
                        value={ticketQuantity}
                        onChange={(e) => setTicketQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100"
                      >
                        {[1, 2, 3, 4, 5, 8, 10].map((num) => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Pass' : 'Passes'}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Attendee Full Name
                      </label>
                      <input
                        type="text"
                        value={attendeeName}
                        onChange={(e) => setAttendeeName(e.target.value)}
                        placeholder="e.g. Alex Pioneer"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Attendee Email
                      </label>
                      <input
                        type="email"
                        value={attendeeEmail}
                        onChange={(e) => setAttendeeEmail(e.target.value)}
                        placeholder="attendee@pi.network"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Error banner */}
                  {bookingErrorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
                      {bookingErrorMessage}
                    </div>
                  )}

                  {/* Checkout summary bar */}
                  {selectedTier && (
                    <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Total ({ticketQuantity}x {selectedTier.name}):
                        </div>
                        <div className="text-xl font-black text-purple-900 dark:text-purple-200">
                          {formatPiAmount(calculatePi(selectedTier.fiatPrice * ticketQuantity))} π
                        </div>
                        <div className="text-[11px] text-slate-500">
                          ${(selectedTier.fiatPrice * ticketQuantity).toFixed(2)} USD (GCV: 1 π = ${piRate.toLocaleString()} USD)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleProcessTicketPayment}
                        disabled={isProcessingPayment}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-60 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing Pi Payment...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <span>Pay with Pi ({formatPiAmount(calculatePi(selectedTier.fiatPrice * ticketQuantity))} π)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
