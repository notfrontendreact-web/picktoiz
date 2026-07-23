import React from 'react';
import { X, SlidersHorizontal, Trash2, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { toToman } from '../utils/formatters';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  onRemoveFromCompare,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-5xl overflow-hidden my-8 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <SlidersHorizontal size={18} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800">جدول مقایسه اسباب‌بازی‌ها</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-bold text-slate-700 mb-1">هیچ اسباب‌بازی برای مقایسه انتخاب نشده است.</p>
              <p className="text-xs">برای مقایسه دقیق ویژگی‌ها، آیکون مقایسه روی کارت‌های محصول را کلیک کنید.</p>
            </div>
          ) : (
            <table className="w-full text-right border-collapse text-xs min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-100/60 border-b border-slate-200 font-extrabold text-slate-700 w-36">مشخصات</th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="p-3 border-b border-slate-200 text-center min-w-[180px]">
                      <div className="flex flex-col items-center">
                        <div className="relative mb-2">
                          <img src={p.images[0]} alt={p.name} className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                          <button
                            onClick={() => onRemoveFromCompare(p.id)}
                            className="absolute -top-1 -right-1 bg-rose-500 text-white p-1 rounded-full shadow-xs hover:bg-rose-600"
                            title="حذف"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <span className="font-extrabold text-slate-800 text-xs line-clamp-2">{p.name}</span>
                        <span className="text-xs font-black text-amber-600 mt-1">{toToman(p.price)}</span>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <ShoppingBag size={13} />
                          <span>خرید</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-bold bg-slate-50 text-slate-600">رده سنی:</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-amber-700">{p.ageLabel}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50 text-slate-600">دسته‌بندی:</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">{p.categoryName}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50 text-slate-600">امتیاز خریداران:</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-amber-500">
                      ★ {p.rating} ({p.reviewCount})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50 text-slate-600">متریال / جنس:</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">{p.specifications.material}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50 text-slate-600">ابعاد:</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">{p.specifications.dimensions}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50 text-slate-600">ویژگی‌های اصلی:</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-[11px] text-slate-600">
                      <ul className="space-y-1 text-right">
                        {p.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <Check size={12} className="text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};
