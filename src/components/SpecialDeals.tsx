import React, { useState, useEffect } from 'react';
import { Timer, Flame, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface SpecialDealsProps {
  products: Product[];
  wishlistIds: string[];
  compareIds: string[];
  cartIds: string[];
  onToggleWishlist: (p: Product) => void;
  onToggleCompare: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

export const SpecialDeals: React.FC<SpecialDealsProps> = ({
  products,
  wishlistIds,
  compareIds,
  cartIds,
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onQuickView,
}) => {
  // Deal of the day countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 38, seconds: 22 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dealProducts = products.filter((p) => p.isSpecialDeal || p.discountPercent).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header with Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-md">
              <Flame size={28} className="animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">پیشنهادات شگفت‌انگیز روز (Deal of the Day)</h2>
              <p className="text-xs text-rose-100 font-medium">تخفیف‌های ویژه با مدت زمان محدود و تعداد محدود در انبار</p>
            </div>
          </div>

          {/* Timer Clock Box */}
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 self-start sm:self-auto">
            <Timer size={18} className="text-amber-300" />
            <span className="text-xs font-bold ml-1">زمان باقی‌مانده:</span>
            <div className="flex items-center gap-1 font-mono text-sm font-black">
              <span className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {dealProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isInWishlist={wishlistIds.includes(p.id)}
              isInCompare={compareIds.includes(p.id)}
              isInCart={cartIds.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
