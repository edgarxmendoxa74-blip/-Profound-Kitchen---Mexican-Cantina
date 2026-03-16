import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-t border-gray-50 overflow-x-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-start md:justify-center space-x-6 md:space-x-12 min-w-max">
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-3 w-16 bg-gray-50 rounded animate-pulse" />
            ))
          ) : (
            <>
              <button
                key="all"
                onClick={() => onCategoryClick('all')}
                className={`relative py-1 text-[9px] md:text-[10px] font-sans font-black uppercase tracking-[0.2em] transition-all duration-300 ${selectedCategory === 'all'
                  ? 'text-brand-black'
                  : 'text-gray-400 hover:text-brand-violet'
                  }`}
              >
                All Items
                {selectedCategory === 'all' && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-violet rounded-full" />
                )}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryClick(category.id)}
                  className={`relative py-1 text-[9px] md:text-[10px] font-sans font-black uppercase tracking-[0.2em] transition-all duration-300 ${selectedCategory === category.id
                    ? 'text-brand-black'
                    : 'text-gray-400 hover:text-brand-violet'
                    }`}
                >
                  {category.name}
                  {selectedCategory === category.id && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-violet rounded-full" />
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default SubNav;
