import React from 'react';
import { AgeGroup } from '../types';
import { Smile, Baby, Zap, GraduationCap } from 'lucide-react';

interface AgeFilterPillsProps {
  selectedAgeGroup: AgeGroup | 'all';
  onSelectAgeGroup: (age: AgeGroup | 'all') => void;
}

const AGE_GROUPS: { id: AgeGroup | 'all'; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
  { id: 'all', title: 'همه رده‌های سنی', subtitle: 'تمامی محصولات', icon: <Smile size={20} />, color: 'bg-amber-500' },
  { id: '0-2', title: '۰ تا ۲ سال', subtitle: 'نوزاد و خردسال', icon: <Baby size={20} />, color: 'bg-emerald-500' },
  { id: '3-5', title: '۳ تا ۵ سال', subtitle: 'کودک نوپا', icon: <Smile size={20} />, color: 'bg-orange-500' },
  { id: '6-8', title: '۶ تا ۸ سال', subtitle: 'دبستانی اولیه', icon: <Zap size={20} />, color: 'bg-blue-500' },
  { id: '9+', title: '۹ سال به بالا', subtitle: 'نوجوان و فکری', icon: <GraduationCap size={20} />, color: 'bg-purple-500' },
];

export const AgeFilterPills: React.FC<AgeFilterPillsProps> = ({
  selectedAgeGroup,
  onSelectAgeGroup,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>🎯 انتخاب اسباب‌بازی بر اساس رده سنی</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            مناسب‌ترین و متناسب‌ترین بازی‌ها برای رشد فکری و شناختی فرزند شما
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {AGE_GROUPS.map((item) => {
          const isActive = selectedAgeGroup === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectAgeGroup(item.id)}
              className={`p-3.5 rounded-2xl border transition-all text-right flex items-center gap-3 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20 scale-102'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : `${item.color} text-white`
                }`}
              >
                {item.icon}
              </div>
              <div>
                <p className={`text-sm font-black ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {item.title}
                </p>
                <p className={`text-[11px] font-medium ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
