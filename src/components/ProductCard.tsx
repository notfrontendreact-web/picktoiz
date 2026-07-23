import React from 'react';
import { 
  Heart, 
  Eye, 
  ShoppingBag, 
  Star, 
  SlidersHorizontal,
  Check,
  CheckCircle
} from 'lucide-react';
import { Product } from '../types';
import { toToman } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  isInCompare: boolean;
  isInCart: boolean;
  onToggleWishlist: (p: Product) => void;
  onToggleCompare: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist,
  isInCompare,
  isInCart,
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onQuickView,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercent && (
            <span className="bg-rose-500 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
              %{product.discountPercent} تخفیف
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-sm">
              پرفروش
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-sm">
              جدید
            </span>
          )}
        </div>

        {/* Age Pill Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xs">
          رده سنی: {product.ageLabel}
        </div>

        {/* Quick Actions (Wishlist & Compare) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isInWishlist
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500 shadow-xs'
            }`}
            title="افزودن به علاقه‌مندی"
          >
            <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isInCompare
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-indigo-600 shadow-xs'
            }`}
            title="مقایسه اسباب بازی"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Quick View Hover Overlay Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute inset-x-4 bottom-12 bg-white/95 text-slate-800 text-xs font-bold py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Eye size={16} />
          <span>مشاهده سریع و مشخصات</span>
        </button>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="text-sm font-extrabold text-slate-800 hover:text-amber-600 cursor-pointer line-clamp-2 leading-snug mb-2"
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through font-medium">
                {toToman(product.originalPrice)}
              </span>
            )}
            <span className="text-sm sm:text-base font-black text-slate-900">
              {toToman(product.price)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className={`p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isInCart
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
            }`}
          >
            {isInCart ? (
              <>
                <Check size={16} />
                <span className="hidden sm:inline">اضافه شد</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">خرید سریع</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};
