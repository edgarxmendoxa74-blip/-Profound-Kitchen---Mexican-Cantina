import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useStoreHours } from '../hooks/useStoreHours';
import SubNav from './SubNav';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onEventsClick: () => void;
  onFeedbackClick: () => void;
  onContactClick: () => void;
  selectedCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
  showCategories?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  cartItemsCount,
  onCartClick,
  onMenuClick,
  onEventsClick,
  onFeedbackClick,
  onContactClick,
  selectedCategory,
  onCategoryClick,
  showCategories
}) => {
  const { siteSettings } = useSiteSettings();
  const { storeHoursSummary } = useStoreHours();
  const name = siteSettings?.site_name || "Profound + Kitchen";

  return (
    <header className="fixed top-0 left-0 right-0 z-[80] border-b border-gray-100">
      {/* Store Hours Top Bar */}
      <div className="bg-brand-black py-2 px-4 md:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4 md:space-x-8">
          <span className="text-[8px] md:text-[9px] font-sans font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all duration-300 cursor-default select-none">
            <span className="font-black text-emerald-400">{storeHoursSummary}</span>
          </span>
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-[8px] text-white/40 font-black uppercase tracking-widest italic">Est. 2024</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20 md:h-24">
          {/* Logo/Brand */}
          <div
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={onMenuClick}
            title="Return to Menu"
          >
            <div className="relative">
              <img
                src="/pk-logo.jpg"
                alt="Logo"
                className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-sm shadow-2xl border border-gray-100 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute -inset-2 bg-brand-violet/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-lg md:text-xl font-heading font-black text-brand-black tracking-[0.02em] uppercase whitespace-nowrap leading-none mb-2 flex items-center">
                {name.includes(' + ') ? (
                  <>
                    <span>{name.split(' + ')[0]}</span>
                    <span className="text-brand-violet mx-1 font-sans">+</span>
                    <span>{name.split(' + ')[1]}</span>
                  </>
                ) : (
                  <span>{name}</span>
                )}
              </span>
              <div className="flex items-center space-x-2">
                <div className="h-[1.5px] w-6 bg-brand-violet/40" />
                <span className="text-[10px] md:text-[11px] font-accent font-normal uppercase tracking-[0.2em] text-brand-black/60 leading-none">
                  South Triangle
                </span>
              </div>
            </div>
          </div>

          {/* Navigation (Desktop) & Cart */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <nav className="hidden md:flex items-center space-x-10">
              <button onClick={onEventsClick} className="text-[10px] md:text-[11px] font-sans font-black uppercase tracking-widest text-brand-black hover:text-brand-violet hover:scale-105 active:scale-95 transition-all duration-200">Book an Event</button>
              <button onClick={onFeedbackClick} className="text-[10px] md:text-[11px] font-sans font-black uppercase tracking-widest text-brand-black hover:text-brand-violet hover:scale-105 active:scale-95 transition-all duration-200">Feedback</button>
              <button onClick={onContactClick} className="text-[10px] md:text-[11px] font-sans font-black uppercase tracking-widest text-brand-black hover:text-brand-violet hover:scale-105 active:scale-95 transition-all duration-200">Contact Us</button>
            </nav>

            <button
              onClick={onCartClick}
              title="View Shopping Cart"
              className="relative p-2.5 md:p-3 bg-brand-black text-white rounded-full hover:bg-brand-violet transition-all duration-300 shadow-xl shadow-brand-violet/10 group"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-violet text-white text-[9px] md:text-[10px] font-black h-4 w-4 md:h-5 md:w-5 rounded-full flex items-center justify-center border-2 border-white animate-scale-in">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories (SubNav) */}
        {showCategories && selectedCategory && onCategoryClick && (
          <SubNav
            selectedCategory={selectedCategory}
            onCategoryClick={onCategoryClick}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
