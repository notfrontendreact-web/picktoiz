import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const BADGES = [
    {
      icon: <ShieldCheck size={26} className="text-amber-500" />,
      title: 'ضمانت اصالت ۱۰۰٪ کالا',
      desc: 'تمامی اسباب‌بازی‌ها با گواهی استاندارد و سلامتی وارداتی و داخلی عرضه می‌شوند.',
    },
    {
      icon: <Truck size={26} className="text-amber-500" />,
      title: 'ارسال سریع به تمام ایران',
      desc: 'تحویل ۲۴ ساعته در تهران و ۲ تا ۳ روزه کاری با پست پیشتاز و تیپاکس به شهرستان‌ها.',
    },
    {
      icon: <RotateCcw size={26} className="text-amber-500" />,
      title: '۷ روز مهلت بازگشت کالا',
      desc: 'در صورت عدم تطابق یا نقص، امکان تعویض و عودت وجه تا ۷ روز کاری وجود دارد.',
    },
    {
      icon: <Headphones size={26} className="text-amber-500" />,
      title: 'پشتیبانی آنلاین و تلفنی',
      desc: 'مشاوران پیکو تویز همه‌روزه از ۹ صبح تا ۹ شب پاسخگوی سوالات شما هستند.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BADGES.map((b, idx) => (
          <div key={idx} className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
              {b.icon}
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 mb-1">{b.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
