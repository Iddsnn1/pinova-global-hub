import React, { useState } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  ShieldCheck, 
  Star, 
  Tag, 
  Zap, 
  RefreshCw, 
  X,
  ChevronDown
} from 'lucide-react';
import { ProductCategory } from '../types';

export interface FilterOptions {
  category: ProductCategory | 'all';
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  verifiedOnly: boolean;
  orderProtectionOnly: boolean;
  minRating: number;
  discountOnly: boolean;
  sortBy: 'featured' | 'rating' | 'price_low' | 'price_high' | 'newest';
}

interface CatalogFilterBarProps {
  filters: FilterOptions;
  onFilterChange: (updated: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const CatalogFilterBar: React.FC<CatalogFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Catalog' },
    { id: 'physical', label: 'Physical Goods' },
    { id: 'digital', label: 'Digital Keys & Code' },
    { id: 'airtime', label: 'Airtime & Data' },
    { id: 'utility', label: 'Utility Bills' },
    { id: 'giftcard', label: 'Gift Cards' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured & Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'New Arrivals' }
  ];

  return (
    <div className="space-y-4">
      {/* Top Quick Category Pills & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                filters.category === cat.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Controls: Filter Drawer Toggle & Sort dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-500" />
            <span>Filters</span>
            {(filters.verifiedOnly || filters.discountOnly || filters.minRating > 0 || filters.maxPrice < 500) && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="appearance-none px-3.5 py-1.5 pr-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Expanded Filter Drawer (Desktop & Mobile) */}
      {isMobileDrawerOpen && (
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Advanced Catalog Filters
              </h3>
            </div>
            <button
              onClick={onResetFilters}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Max Price: <span className="text-amber-500 font-black">{filters.maxPrice} π</span>
              </label>
              <input
                type="range"
                min="1"
                max="500"
                step="5"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: parseFloat(e.target.value) })}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 π</span>
                <span>500 π</span>
              </div>
            </div>

            {/* Seller Rating Filter */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Minimum Rating:</label>
              <div className="flex gap-1.5">
                {[0, 4, 4.5, 4.8].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => onFilterChange({ minRating: stars })}
                    className={`px-2.5 py-1 rounded-lg font-bold border ${
                      filters.minRating === stars
                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {stars === 0 ? 'Any' : `${stars}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Merchants Only Toggle */}
            <div className="flex items-center gap-2 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-purple-600"></div>
              </label>
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                Verified Sellers Only
              </span>
            </div>

            {/* Discounted Items Only */}
            <div className="flex items-center gap-2 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.discountOnly}
                  onChange={(e) => onFilterChange({ discountOnly: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-amber-500"></div>
              </label>
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                On Sale (-10%+)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
