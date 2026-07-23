import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Truck, 
  ShoppingBag,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { CartItem, Order } from '../types';
import { toToman } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'form' | 'gateway' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: 'علی محمدی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    province: 'تهران',
    city: 'تهران',
    address: 'خیابان شریعتی، بالاتر از پل رومی، پلاک ۴۲، واحد ۳',
    postalCode: '۱۹۳۹۵۴۵۱۲۳',
    notes: 'لطفا قبل از تحویل تماس بگیرید.',
    paymentMethod: 'online',
  });

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shippingFee = subtotal >= 1000000 ? 0 : 45000;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          details: {
            customerName: formData.name,
            phone: formData.phone,
            province: formData.province,
            city: formData.city,
            address: formData.address,
            postalCode: formData.postalCode,
            notes: formData.notes,
            paymentMethod: formData.paymentMethod,
          },
          subtotal,
          discount: discountAmount,
          total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedOrder(data.order);
        setStep('gateway');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatePayment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      onOrderCompleted();
    }, 1500);
  };

  const handleCopyTrackingCode = () => {
    if (createdOrder?.trackingCode) {
      navigator.clipboard.writeText(createdOrder.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden my-8 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                {step === 'form' && 'ثبت و تکمیل مشخصات تحویل گیرنده'}
                {step === 'gateway' && 'درگاه پرداخت آنلاین شتابی'}
                {step === 'success' && 'سفارش شما با موفقیت ثبت شد'}
              </h3>
            </div>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-6">
          
          {/* STEP 1: Address & Details Form */}
          {step === 'form' && (
            <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">نام و نام خانوادگی تحویل‌گیرنده</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-8 pl-3 focus:outline-none focus:border-amber-500"
                    />
                    <User size={15} className="absolute right-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">شماره موبایل جهت پیامک پیگیری</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-8 pl-3 focus:outline-none focus:border-amber-500"
                    />
                    <Phone size={15} className="absolute right-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">استان</label>
                  <input
                    type="text"
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">شهر</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">نشانی دقیق پستی</label>
                <div className="relative">
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-8 pl-3 focus:outline-none focus:border-amber-500"
                  />
                  <MapPin size={15} className="absolute right-2.5 top-2.5 text-slate-400" />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-center justify-between font-bold text-amber-900">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="text-base text-amber-600">{toToman(total)}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3 rounded-2xl shadow-md shadow-amber-500/20 text-sm transition-all cursor-pointer"
              >
                {isSubmitting ? 'در حال ارسال اطلاعات...' : 'ورود به درگاه پرداخت آنلاین'}
              </button>
            </form>
          )}

          {/* STEP 2: Simulated Bank Gateway */}
          {step === 'gateway' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <CreditCard size={32} />
              </div>
              <h4 className="text-base font-extrabold text-slate-800">درگاه امن پرداخت آنلاین پیکو تویز</h4>
              <p className="text-xs text-slate-500">
                شما در حال اتصال به شبکه پرداخت شتاب هستید. مبلغ فاکتور: <strong className="text-slate-900">{toToman(total)}</strong>
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-right text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">کد رهگیری پیش‌فاکتور:</span>
                  <span className="font-bold text-slate-800">{createdOrder?.trackingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">گیرنده:</span>
                  <span className="font-bold">{formData.name} ({formData.phone})</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs"
                >
                  بازگشت
                </button>
                <button
                  onClick={handleSimulatePayment}
                  disabled={isSubmitting}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md text-xs cursor-pointer"
                >
                  {isSubmitting ? 'در حال پردازش...' : 'تایید و پرداخت فاکتور (شبیه‌سازی)'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Success Receipt */}
          {step === 'success' && createdOrder && (
            <div className="space-y-5 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={42} />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  پرداخت موفقیت‌آمیز بود
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">از خرید شما متشکریم!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  سفارش شما در انبار پیکو تویز ثبت شد و آماده ارسال سریع به نشانی شما می‌باشد.
                </p>
              </div>

              {/* Tracking Code Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div className="text-right">
                  <span className="text-[11px] font-bold text-amber-800 block">کد رهگیری سفارش شما:</span>
                  <span className="text-lg font-black text-slate-900 tracking-wider">
                    {createdOrder.trackingCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyTrackingCode}
                  className="bg-amber-500 text-white p-2.5 rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedCode ? 'کپی شد' : 'کپی کد'}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                بازگشت به صفحه اصلی فروشگاه
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
