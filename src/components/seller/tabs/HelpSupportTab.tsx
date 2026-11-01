import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface HelpSupportTabProps {
  userUsername: string;
}

export const HelpSupportTab: React.FC<HelpSupportTabProps> = ({ userUsername }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      q: 'How does the Pioneer Seller Trust Protocol (PSTP) protect my sales?',
      a: 'When a customer purchases from your store, their Pi payment is locked in smart cryptographic escrow. Once you ship the order and provide a tracking number, the buyer has a standard inspection window. Funds are automatically released to your merchant balance upon verified delivery or QR scan confirmation.'
    },
    {
      q: 'What are the image requirements for Store Branding?',
      a: 'Store logos should be square (1:1 ratio, 400x400px recommended). Showcase banners should be landscape (16:9 ratio, 1200x675px recommended). Supported formats are PNG, JPEG, and WebP up to 5 MB. Files are stored on high-performance cloud storage and validated via magic-byte signatures.'
    },
    {
      q: 'How long does KYC & Identity Verification take?',
      a: 'The Platform Compliance team reviews submitted documents within 24 to 48 business hours. You can monitor your status in the KYC & Verification tab. Once approved, your products become immediately visible to Pioneers across the global marketplace.'
    },
    {
      q: 'What happens if a buyer requests a return or refund?',
      a: 'PSTP provides a transparent dispute mediation process. If a customer reports an item damaged in transit or defective within the 7-day inspection window, you can review their photographic proof and approve a replacement or refund. PSTP arbiters assist if an amicable resolution cannot be reached.'
    }
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setTicketSent(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setTicketSent(false), 6000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="seller-help-tab">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Seller Help & Compliance Support
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Knowledge base, PSTP protocol guidelines, and merchant compliance assistance
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
            24/7 Portal
          </span>
        </div>

        {/* Quick Links Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs">
            <BookOpen className="w-5 h-5 text-purple-600 mb-2" />
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100">
              Merchant Guidelines
            </h4>
            <p className="text-neutral-500 mt-1">
              Best practices for product descriptions, stock management, and courier shipping.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100">
              PSTP Escrow Rules
            </h4>
            <p className="text-neutral-500 mt-1">
              Clear rules governing escrow hold periods, tracking validation, and fund release.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs">
            <MessageSquare className="w-5 h-5 text-blue-600 mb-2" />
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100">
              Direct Support
            </h4>
            <p className="text-neutral-500 mt-1">
              Open a ticket with Platform Compliance for document or account assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Frequently Asked Questions
        </h4>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-neutral-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-neutral-400" />}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Compliance Support Form */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Open Support Inquiry
        </h4>
        <p className="text-xs text-neutral-500 mb-4">
          Need assistance with verification, a transaction dispute, or store settings?
        </p>

        {ticketSent && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Your inquiry has been submitted to Platform Compliance. Reference: TCK-{Date.now().toString().slice(-6)}
          </div>
        )}

        <form onSubmit={handleSendTicket} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Question regarding verification document upload"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              Message Details
            </label>
            <textarea
              rows={3}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Describe your question or issue in detail..."
              required
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
              Submit Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
