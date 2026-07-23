import React from 'react';
import { Category } from '../types';
import { 
  Boxes, 
  Puzzle, 
  Sparkles, 
  Car, 
  Baby, 
  Bot, 
  LayoutGrid 
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: Category | 'all';
  onSelectCategory: (cat: Category | 'all') => void;
}

const CATEGORIES: { id: Category | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'همه دسته‌ها', icon: <LayoutGrid size={18} /> },
  { id: 'lego-puzzle', label: 'لگو و پازل', icon: <Boxes size={18} /> },
  { id: 'wooden', label: 'اسباب بازی چوبی', icon: <Sparkles size={18} /> },
  { id: 'educational', label: 'بازی فکری و آموزشی', icon: <Puzzle size={18} /> },
  { id: 'rc-cars', label: 'ماشین و کنترلی', icon: <Car size={18} /> },
  { id: 'dolls-figures', label: 'عروسک و اکشن فیگور', icon: <Bot size={18} /> },
  { id: 'baby-toys', label: 'اسباب بازی نوزاد', icon: <Baby size={18} /> },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white border-b border-slate-100 shadow-xs py-2.5 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-amber-500'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
