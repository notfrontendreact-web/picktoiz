import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  PhoneCall, 
  SlidersHorizontal,
  X,
  Smile,
  Boxes,
  Menu
} from 'lucide-react';
import { Product } from '../types';
import { toToman } from '../utils/formatters';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  compareCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenAIFinder: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  cartCount,
  cartTotal,
  wishlistCount,
  compareCount,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onOpenAIFinder,
  allProducts,
  onSelectProduct,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search autocomplete suggestions
  const searchSuggestions = searchQuery.trim()
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-amber-100">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
              تخفیف ویژه
            </span>
            <span>🎁 ارسال رایگان سفارش‌های بالای ۱,۰۰۰,۰۰۰ تومان به سراسر ایران</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:02122334455" className="flex items-center gap-1.5 hover:text-amber-100 transition-colors">
              <PhoneCall size={13} />
              <span>پشتیبانی: ۰۲۱-۲۲۳۳۴۴۵۵</span>
            </a>
            <span className="text-amber-200">|</span>
            <span>ساعات کاری: ۹ صبح تا ۹ شب</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="منوی موبایل"
            >
              <Menu size={22} />
            </button>

            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Smile size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
                  پیکو تویز
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                  PICCO TOYS STORE
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl mx-2 hidden sm:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="جستجوی اسباب‌بازی، لگو، بازی فکری، عروسک..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-slate-100/80 border border-slate-200 rounded-2xl py-2.5 pr-11 pl-10 text-sm focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-slate-400"
              />
              <Search className="absolute right-3.5 text-slate-400 pointer-events-none" size={19} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Live Autocomplete Overlay */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden z-50 animate-in fade-in duration-150">
                <div className="p-2 border-b border-slate-100 bg-amber-50/50 flex justify-between items-center text-xs text-amber-900 font-medium">
                  <span>پیشنهادهای هوشمند جستجو</span>
                  <span>{searchSuggestions.length} نتیجه</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {searchSuggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectProduct(item);
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-right p-3 hover:bg-amber-50/60 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                          <span className="text-[11px] text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded-md font-medium">
                            {item.categoryName} • {item.ageLabel}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 shrink-0">
                        {toToman(item.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Gift Finder Trigger */}
            <button
              onClick={onOpenAIFinder}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-md shadow-indigo-500/20 hover:scale-102 transition-all"
            >
              <Sparkles size={18} className="animate-pulse text-amber-300" />
              <span className="hidden lg:inline">دستیار هوشمند هدیه</span>
              <span className="lg:hidden">هوش مصنوعی</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              className="relative p-2.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-2xl border border-slate-200 transition-all"
              title="مقایسه محصولات"
            >
              <SlidersHorizontal size={20} />
              {compareCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-2xl border border-slate-200 transition-all"
              title="علاقه‌مندی‌ها"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <div className="relative">
                <ShoppingBag size={21} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[10px] font-medium text-amber-100">سبد خرید</span>
                <span className="text-xs font-bold">{toToman(cartTotal)}</span>
              </div>
            </button>

          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 sm:hidden">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="جستجوی اسباب‌بازی..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pr-10 pl-4 text-xs focus:outline-none focus:bg-white"
            />
            <Search className="absolute right-3 text-slate-400" size={16} />
          </div>
        </div>

      </div>
    </header>
  );
};
