import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Truck, 
  Tag, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem } from '../types';
import { toToman, toPersianDigits } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (appliedDiscount: number, discountCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const FREE_SHIPPING_THRESHOLD = 1000000; // 1M Toman
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 45000;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'PICCO15') {
      setDiscountPercent(15);
      setPromoSuccess('کد تخفیف ۱۵٪ پیکو تویز اعمال شد!');
    } else if (promoCode.trim().toUpperCase() === 'PICCO10') {
      setDiscountPercent(10);
      setPromoSuccess('کد تخفیف ۱۰٪ اعمال شد!');
    } else {
      setPromoError('کد تخفیف نامعتبر است (کد پیشنهادی: PICCO15)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">سبد خرید شما</h2>
              <span className="text-[11px] font-medium text-slate-500">
                {toPersianDigits(items.length)} آیتم انتخاب شده
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-3 bg-amber-50 border-b border-amber-100/80">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck size={16} className="text-amber-600" />
              {subtotal >= FREE_SHIPPING_THRESHOLD
                ? '🎉 تبریک! ارسال این سفارش رایگان شد'
                : `فقط ${toToman(FREE_SHIPPING_THRESHOLD - subtotal)} تا ارسال رایگان`}
            </span>
            <span>{toPersianDigits(progressPercent)}٪</span>
          </div>
          <div className="w-full h-2 bg-amber-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 mb-3">
                <ShoppingBag size={32} />
              </div>
              <p className="text-sm font-extrabold text-slate-700 mb-1">سبد خرید شما خالی است</p>
              <p className="text-xs text-slate-400">هنوز هیچ اسباب‌بازی جذابی به سبد خرید اضافه نکرده‌اید.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors shrink-0"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-bold inline-block mt-1">
                      رده سنی: {item.product.ageLabel}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-black">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-black text-slate-900">
                      {toToman(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
            
            {/* Promo Code Input */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="کد تخفیف (مثلا PICCO15)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 pr-8 pl-3 text-xs focus:outline-none focus:border-amber-500 uppercase font-bold"
                  />
                  <Tag size={15} className="absolute right-2.5 top-2.5 text-slate-400" />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  اعمال
                </button>
              </div>
              {promoError && <p className="text-[11px] text-rose-500 font-medium mt-1">{promoError}</p>}
              {promoSuccess && <p className="text-[11px] text-emerald-600 font-medium mt-1">{promoSuccess}</p>}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200">
              <div className="flex justify-between">
                <span>جمع کل سفارش:</span>
                <span className="font-bold text-slate-800">{toToman(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>تخفیف کد promo:</span>
                  <span>- {toToman(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>هزینه ارسال:</span>
                <span className="font-bold">
                  {shippingFee === 0 ? <span className="text-emerald-600">رایگان</span> : toToman(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-amber-600">{toToman(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onCheckout(discountAmount, promoCode);
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
            >
              <span>تکمیل خرید و ثبت سفارش</span>
              <ArrowLeft size={18} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
