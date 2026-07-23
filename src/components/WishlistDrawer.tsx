import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { toToman } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onQuickView,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
              <Heart size={18} className="fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">لیست علاقه‌مندی‌های شما</h3>
              <span className="text-[11px] font-medium text-slate-500">
                {wishlistItems.length} اسباب‌بازی ذخیره‌شده
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-300 mb-3">
                <Heart size={32} />
              </div>
              <p className="text-sm font-extrabold text-slate-700 mb-1">لیست علاقه‌مندی‌ها خالی است</p>
              <p className="text-xs text-slate-400">با زدن آیکون قلب روی هر اسباب‌بازی، آن را اینجا ذخیره کنید.</p>
            </div>
          ) : (
            wishlistItems.map((product) => (
              <div key={product.id} className="pt-3 first:pt-0 flex gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shrink-0 cursor-pointer"
                  onClick={() => onQuickView(product)}
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 
                        onClick={() => onQuickView(product)}
                        className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug cursor-pointer hover:text-amber-600"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="text-slate-300 hover:text-rose-500 p-1 shrink-0"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-bold inline-block mt-1">
                      رده سنی: {product.ageLabel}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-black text-slate-900">{toToman(product.price)}</span>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <ShoppingBag size={14} />
                      <span>افزودن به سبد</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
