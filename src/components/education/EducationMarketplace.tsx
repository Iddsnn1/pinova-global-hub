import React, { useState, useEffect } from 'react';
import { EducationMarketplaceItem } from '../../types/education';
import { educationService } from '../../services/educationService';
import {
  ShoppingBag,
  BookOpen,
  Laptop,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  Sparkles,
  Award,
  CreditCard,
  Truck
} from 'lucide-react';

export const EducationMarketplace: React.FC = () => {
  const [items, setItems] = useState<EducationMarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [orderedNotice, setOrderedNotice] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, [categoryFilter, tierFilter]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await educationService.getMarketplaceItems(
        categoryFilter === 'all' ? undefined : categoryFilter,
        tierFilter === 'all' ? undefined : tierFilter
      );
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (item: EducationMarketplaceItem) => {
    setOrderedNotice(`Order placed for "${item.title}" with Pi Network Escrow! Item will be delivered/unlocked shortly.`);
    setTimeout(() => setOrderedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
              Education Marketplace & Learning Supplies
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Verified Student Discounts</span>
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1.5">Learning Materials & Exam Prep</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Curated curriculum textbooks, JAMB/WAEC prep portals, scientific calculators, STEM kits, and institutional courseware.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            <option value="exam_prep">Exam Prep (JAMB/WAEC/SAT)</option>
            <option value="textbook">Textbooks & Books</option>
            <option value="digital_course">Digital Courses & AI</option>
            <option value="hardware">Hardware & Lab Kits</option>
            <option value="supplies">School Supplies</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Levels</option>
            <option value="secondary">Secondary Level</option>
            <option value="tertiary">University Level</option>
            <option value="technical_vocational">Vocational & Tech</option>
          </select>
        </div>
      </div>

      {orderedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{orderedNotice}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-64 animate-pulse" />
          ))
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition group"
            >
              <div className="h-36 w-full bg-slate-950 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <span className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-amber-400 font-mono font-bold text-xs px-2 py-0.5 rounded-full border border-slate-700">
                  {item.piPrice.toFixed(4)} π
                </span>
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 uppercase">
                  {item.category.replace('_', ' ')}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-white">${item.fiatPrice.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{item.piPrice.toFixed(4)} π</span>
                  </div>

                  <button
                    onClick={() => handleOrder(item)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/10 flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
