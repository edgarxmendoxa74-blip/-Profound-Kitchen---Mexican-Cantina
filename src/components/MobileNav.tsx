import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-violet-100 md:hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-2 overflow-x-auto py-3 scrollbar-hide">
          <button
            onClick={() => onCategoryClick('all')}
            className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 border flex-shrink-0 font-montserrat ${activeCategory === 'all'
              ? 'bg-[#7F00FF] text-white border-[#7F00FF]'
              : 'bg-white text-violet-900 border-violet-100 hover:border-[#7F00FF]'
              }`}
          >
            All Selection
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategoryClick(c.id)}
              className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 border flex-shrink-0 flex items-center space-x-2 font-montserrat ${activeCategory === c.id
                ? 'bg-[#7F00FF] text-white border-[#7F00FF]'
                : 'bg-white text-violet-900 border-violet-100 hover:border-[#7F00FF]'
                }`}
            >
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>);
};

export default MobileNav;