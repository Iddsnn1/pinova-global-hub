import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Calendar, ShieldCheck } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/categoryData';

interface ServicesViewProps {
  userBalancePi: number;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ userBalancePi }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Services Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-xs font-bold">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Enterprise Services & Freelance Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Professional Services & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Hire verified Pioneer professionals for software development, technical consulting, smartphone & hardware repairs, media production, and home maintenance with PSTP Escrow protection.
          </p>
        </div>
      </div>

      {/* Services Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICE_CATEGORIES.map((serv) => (
          <div
            key={serv.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center border border-blue-200 dark:border-blue-800 text-blue-500">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-500/10 px-2.5 py-1 rounded-full border border-slate-500/20">
                  Provider listings required
                </span>
              </div>

              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {serv.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {serv.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                Service discovery is available, but no verified provider listings are currently connected to the Hub. Booking and escrow remain disabled until provider, availability, pricing, and server-side booking records exist.
              </div>
            </div>

            <button
              disabled
              title="Booking is unavailable until verified provider listings and server-side booking are available"
              onClick={() => setSelectedServiceId(null)}
              className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        ))}
      </div>



    </div>
  );
};
