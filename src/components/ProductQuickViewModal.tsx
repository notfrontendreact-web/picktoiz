import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Heart,
  SlidersHorizontal,
  PackageCheck,
  Building,
  Ruler,
  Scale
} from 'lucide-react';
import { Product } from '../types';
import { toToman } from '../utils/formatters';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  isInWishlist: boolean;
  isInCompare: boolean;
  onToggleWishlist: (p: Product) => void;
  onToggleCompare: (p: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isInWishlist,
  isInCompare,
  onToggleWishlist,
  onToggleCompare,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl overflow-hidden my-8 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-100 flex flex-col justify-between">
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 mb-3 shadow-xs">
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Multi Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImage === img ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guarantees Box */}
            <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck size={20} className="text-amber-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">اصالت ۱۰۰٪</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck size={20} className="text-amber-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">ارسال سریع</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw size={20} className="text-amber-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">۷ روز ضمانت</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-lg">
                  {product.categoryName}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-lg">
                  رده سنی: {product.ageLabel}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-4 text-xs mb-4 text-slate-500">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} دیدگاه)</span>
                </div>
                <span>•</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <PackageCheck size={14} />
                  موجود در انبار ({product.stock} عدد)
                </span>
              </div>

              {/* Price Box */}
              <div className="bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-2xl mb-5 flex items-center justify-between">
                <div>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through font-medium block">
                      {toToman(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xl font-black text-slate-900">
                    {toToman(product.price)}
                  </span>
                </div>
                {product.discountPercent && (
                  <span className="bg-rose-500 text-white font-black text-xs px-2.5 py-1 rounded-xl">
                    %{product.discountPercent} تخفیف ویژه
                  </span>
                )}
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-slate-200 mb-4">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === 'desc' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'
                  }`}
                >
                  توضیحات و ویژگی‌ها
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === 'specs' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'
                  }`}
                >
                  مشخصات فنی
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === 'reviews' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'
                  }`}
                >
                  نظرات خریداران
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'desc' && (
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-48 overflow-y-auto pr-1">
                  <p>{product.description}</p>
                  <ul className="space-y-1.5 pt-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="text-xs space-y-2 text-slate-700 max-h-48 overflow-y-auto pr-1">
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">جنس و متریال:</span>
                    <span className="font-bold">{product.specifications.material}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">ابعاد بسته:</span>
                    <span className="font-bold">{product.specifications.dimensions}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">وزن:</span>
                    <span className="font-bold">{product.specifications.weight}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">برند:</span>
                    <span className="font-bold">{product.specifications.brand}</span>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-xs space-y-3 max-h-48 overflow-y-auto pr-1">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800">{rev.userName}</span>
                          <span className="text-slate-400 text-[10px]">{rev.date}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 py-4 text-center">هنوز دیدگاهی ثبت نشده است. اولین خریدار باشید!</p>
                  )}
                </div>
              )}

            </div>

            {/* Actions: Quantity + Add to Cart */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
              
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-extrabold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>افزودن به سبد خرید ({toToman(product.price * quantity)})</span>
              </button>

              {/* Wishlist button */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isInWishlist ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Heart size={18} className={isInWishlist ? 'fill-current' : ''} />
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
