import React, { useState } from 'react';
import { Briefcase, UserCheck, Code, Wrench, Sparkles, Camera, Star, CheckCircle2, ShieldCheck, Clock, Calendar } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/categoryData';

interface ServicesViewProps {
  userBalancePi: number;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ userBalancePi }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const activeService = SERVICE_CATEGORIES.find((s) => s.id === selectedServiceId);

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
                <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Avg. {serv.averagePricePi} π
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

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Popular Services:</span>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  {serv.popularServices.map((ps, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>{ps}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedServiceId(serv.id);
                setBookingSuccess(false);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal / Form */}
      {selectedServiceId && activeService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-5 relative shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
                Book {activeService.name}
              </h3>
              <button
                onClick={() => setSelectedServiceId(null)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                Close ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
                  Service Request Escrow Locked Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {activeService.averagePricePi} π held safely in PSTP Escrow. Verified provider assigned.
                </p>
                <button
                  onClick={() => setSelectedServiceId(null)}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a date and describe your task requirements. Your funds remain protected in PSTP Escrow until the work is verified completed.
                </p>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Preferred Service Date
                  </label>
                  <input
                    type="date"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Task / Project Brief
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your requirements or specific issues..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl flex justify-between items-center text-xs text-white">
                  <span>Escrow Service Deposit:</span>
                  <span className="font-black text-amber-400">{activeService.averagePricePi} π</span>
                </div>

                <button
                  onClick={() => setBookingSuccess(true)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Confirm & Lock {activeService.averagePricePi} π in Escrow
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
