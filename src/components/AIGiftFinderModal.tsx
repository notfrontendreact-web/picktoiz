import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Brain, 
  ShoppingBag, 
  Check, 
  Smile, 
  Lightbulb, 
  Target,
  ArrowLeft
} from 'lucide-react';
import { Product } from '../types';
import { toToman } from '../utils/formatters';

interface AIGiftFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

export const AIGiftFinderModal: React.FC<AIGiftFinderModalProps> = ({
  isOpen,
  onClose,
  allProducts,
  onAddToCart,
  onQuickView,
}) => {
  const [childAge, setChildAge] = useState('3-5');
  const [childGender, setChildGender] = useState('دختر / پسر (فرقی ندارد)');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['لگو و ساختنی', 'تقویت خلاقیت']);
  const [budget, setBudget] = useState('زیر ۱,۵۰۰,۰۰۰ تومان');
  const [goal, setGoal] = useState('افزایش تمرکز و دقت کودک');

  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    recommendationReason: string;
    recommendedProductIds: string[];
    tipsForParents: string[];
  } | null>(null);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSearchAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/gift-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childAge,
          childGender,
          interests: selectedInterests,
          budget,
          goal,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResult({
          recommendationReason: data.recommendationReason,
          recommendedProductIds: data.recommendedProductIds || [],
          tipsForParents: data.tipsForParents || [],
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get matching products from catalog
  const recommendedProducts = aiResult
    ? allProducts.filter((p) => aiResult.recommendedProductIds.includes(p.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden my-8 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 font-bold">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black">دستیار هوشمند انتخاب اسباب‌بازی و هدیه</h3>
              <p className="text-[11px] text-purple-200 font-medium">پاسخگویی هوشمند Gemini با تحلیل نیازهای رشد کودک شما</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {!aiResult ? (
            /* STEP 1: Input Form */
            <form onSubmit={handleSearchAI} className="space-y-4 text-xs text-slate-700">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold mb-1.5 text-slate-800">۱. رده سنی کودک شما:</label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:border-purple-500"
                  >
                    <option value="0-2">۰ تا ۲ سال (نوزاد و خردسال)</option>
                    <option value="3-5">۳ تا ۵ سال (کودک نوپا)</option>
                    <option value="6-8">۶ تا ۸ سال (دبستانی اولیه)</option>
                    <option value="9+">۹ سال به بالا (نوجوان و فکری)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold mb-1.5 text-slate-800">۲. حدود بودجه خرید:</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:border-purple-500"
                  >
                    <option value="زیر ۵۰۰,۰۰۰ تومان">زیر ۵۰۰,۰۰۰ تومان</option>
                    <option value="زیر ۱,۵۰۰,۰۰۰ تومان">زیر ۱,۵۰۰,۰۰۰ تومان</option>
                    <option value="آزاد">آزاد / بدون محدودیت</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-extrabold mb-1.5 text-slate-800">۳. زمینه‌های مورد علاقه کودک:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'لگو و ساختنی',
                    'اسباب‌بازی چوبی',
                    'بازی‌های معما و فکری',
                    'عروسک و نقش‌آفرینی',
                    'ماشین و کنترلی',
                    'موسیقی و صدا',
                    'علوم و آزمایشگاهی',
                  ].map((tag) => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-extrabold mb-1.5 text-slate-800">۴. هدف اصلی تربیتی/آموزشی از این بازی:</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="مثلا: افزایش دقت، دست‌ورزی، تقویت قدرت مذاکره..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>هوش مصنوعی در حال تحلیل و پیشنهاد است...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="text-amber-300" />
                      <span>تحلیل هوشمند و دریافت پیشنهادات</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* STEP 2: AI Results */
            <div className="space-y-5">
              
              {/* AI Reasoning Box */}
              <div className="p-4 bg-purple-50 border border-purple-200/80 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
                  <Brain size={18} className="text-purple-600" />
                  <span>تحلیل هوش مصنوعی برای انتخاب شما:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {aiResult.recommendationReason}
                </p>
              </div>

              {/* Parental Tips */}
              {aiResult.tipsForParents.length > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200/60 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1.5">
                    <Lightbulb size={16} className="text-amber-600" />
                    <span>توصیه‌های تربیتی برای والدین:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700 font-medium">
                    {aiResult.tipsForParents.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Catalog Items */}
              <div>
                <h4 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
                  <Target size={16} className="text-purple-600" />
                  <span>اسباب‌بازی‌های پیشنهادی کاتالوگ:</span>
                </h4>

                <div className="space-y-2.5">
                  {recommendedProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-purple-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
                        <div>
                          <p 
                            onClick={() => onQuickView(p)}
                            className="text-xs font-bold text-slate-800 hover:text-purple-600 cursor-pointer line-clamp-1"
                          >
                            {p.name}
                          </p>
                          <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-bold mt-1 inline-block">
                            رده سنی: {p.ageLabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-black text-slate-900">{toToman(p.price)}</span>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs p-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <ShoppingBag size={15} />
                          <span className="hidden sm:inline">افزودن</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <div className="pt-2">
                <button
                  onClick={() => setAiResult(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>جستجوی مجدد با مشخصات جدید</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
