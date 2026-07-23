import React, { useState } from 'react';
import { 
  Smile, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Send, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Store Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl">
                <Smile size={24} />
              </div>
              <span className="text-xl font-black text-white">پیکو تویز (Picco Toys)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              فروشگاه تخصصی آنلاین اسباب بازی، بازی فکری، سازه‌های ساختنی و لوازم آموزشی کودک با ضمانت اصالت، فیلتر دقیق رده سنی و ارسال سریع به سراسر ایران.
            </p>
            <div className="space-y-2 text-xs text-slate-400 font-medium pt-1">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-500 shrink-0" />
                <span>تهران، خیابان پاسداران، بوستان پنجم، پلاک ۲۴، واحد ۱</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-amber-500 shrink-0" />
                <span>شماره تماس: ۰۲۱-۲۲۳۳۴۴۵۵</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-black text-white mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">اسباب بازی چوبی ارگانیک</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">لگو و سازه‌های مهندسی</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">بازی‌های فکری و بردگیم</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">عروسک و فیگورهای اکشن</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">اسباب بازی‌های موزیکال نوزاد</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-sm font-black text-white mb-4">خدمات مشتریان</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">راهنمای انتخاب اسباب بازی بر اساس سن</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">شرایط و قوانین تعویض ۷ روزه</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">پیگیری آنلاین وضعیت سفارش</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">پرسش‌های متداول (FAQ)</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">درباره ما و تماس با ما</a></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Trust Symbols */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white">عضویت در خبرنامه تخفیف‌ها</h4>
            <p className="text-xs text-slate-400">از کد تخفیف‌های ویژه و جشنواره‌های پیکو تویز زودتر باخبر شوید:</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="ایمیل یا شماره موبایل..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold p-2 rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={14} />
                با موفقیت عضو شدید!
              </p>
            )}

            {/* Simulated Iranian Electronic Trust Badges */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 font-bold block mb-2">نمادهای الکترونیکی اعتماد:</span>
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-[10px] text-slate-400 p-1 text-center font-bold">
                  <ShieldCheck size={20} className="text-emerald-400 mb-0.5" />
                  <span>اینماد ۲ ستاره</span>
                </div>
                <div className="w-16 h-16 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-[10px] text-slate-400 p-1 text-center font-bold">
                  <ShieldCheck size={20} className="text-blue-400 mb-0.5" />
                  <span>ساماندهی</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-3">
          <p>© ۱۴۰۵ تمامی حقوق این وب‌سایت متعلق به فروشگاه آنلاین اسباب‌بازی پیکو تویز (Picco Toys) می‌باشد.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-amber-400 transition-colors cursor-pointer">اینستاگرام</span>
            <span>•</span>
            <span className="hover:text-amber-400 transition-colors cursor-pointer">تلگرام</span>
            <span>•</span>
            <span className="hover:text-amber-400 transition-colors cursor-pointer">واتساپ پشتیبانی</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
