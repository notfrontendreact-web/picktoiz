import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';

interface HeroSliderProps {
  onOpenAIFinder: () => void;
  onSelectCategory: (cat: any) => void;
}

const SLIDES = [
  {
    id: 1,
    title: 'دنیای هیجان‌انگیز لگو و سازه‌های هوشمند',
    subtitle: 'تخفیف‌های ویژه تا ۲۰٪ روی تمامی ست‌های ساختنی پیکو بلاک',
    badge: 'پیشنهاد شگفت‌انگیز هفته',
    bgGradient: 'from-amber-500 via-orange-500 to-amber-600',
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=1000&q=80',
    actionText: 'مشاهده ست‌های لگو',
    actionCategory: 'lego-puzzle',
  },
  {
    id: 2,
    title: 'اسباب‌بازی‌های چوبی طبیعی و ایمن برای کودک',
    subtitle: 'ساخته شده از چوب ارگانیک، بدون لبه‌های تیز و رنگ غیرسمی',
    badge: 'طراحی ایمن و بهداشتی',
    bgGradient: 'from-amber-700 via-orange-600 to-amber-800',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
    actionText: 'کالکشن اسباب‌بازی چوبی',
    actionCategory: 'wooden',
  },
  {
    id: 3,
    title: 'دستیار هوشمند انتخاب هدیه هوش مصنوعی',
    subtitle: 'سن کودک، بودجه و اهداف تربیتی را وارد کنید تا بهترین اسباب‌بازی پیشنهاد شود!',
    badge: 'قابلیت انحصاری پیکو تویز',
    bgGradient: 'from-purple-600 via-indigo-600 to-purple-800',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
    actionText: 'شروع جستجوی هوشمند ✨',
    isAI: true,
  },
];

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onOpenAIFinder,
  onSelectCategory,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${slide.bgGradient} text-white shadow-xl transition-all duration-700 min-h-[300px] sm:min-h-[360px] flex items-center`}>
        
        {/* Background Image Overlay with Fade */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-amber-200 mb-3 border border-white/20">
            <Sparkles size={14} />
            {slide.badge}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight mb-3 drop-shadow-xs">
            {slide.title}
          </h1>
          <p className="text-sm sm:text-base text-amber-100 font-medium mb-6 leading-relaxed">
            {slide.subtitle}
          </p>

          <button
            onClick={() => {
              if (slide.isAI) {
                onOpenAIFinder();
              } else {
                onSelectCategory(slide.actionCategory);
              }
            }}
            className="bg-white text-slate-900 hover:bg-amber-100 font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all text-sm flex items-center gap-2 cursor-pointer"
          >
            <span>{slide.actionText}</span>
          </button>
        </div>

        {/* Hero Illustration Side */}
        <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 w-80 h-64 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
          <img
            src={slide.image}
            alt="اسباب بازی پیکو"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slide Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-xs transition-all"
        >
          <ChevronRight size={22} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-xs transition-all"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
