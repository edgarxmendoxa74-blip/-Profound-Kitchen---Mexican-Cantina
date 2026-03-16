import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';
import ProductDetailModal from './ProductDetailModal';
import { useStoreHours } from '../hooks/useStoreHours';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[], variations?: Variation[]) => void;
  onBuyNow: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  onBuyNow
}) => {
  const [showProductDetail, setShowProductDetail] = useState(false);
  const { isStoreOpen } = useStoreHours();

  const calcDiscount = () => {
    if (!item.basePrice || !item.discountPrice) return 0;
    return Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100);
  };

  const isAddDisabled = !isStoreOpen;

  return (
    <>
      <div
        className="group bg-white border border-gray-100 flex flex-col h-full cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-[0_24px_48px_-12px_rgba(127,0,255,0.12)] hover:border-brand-violet/30"
        onClick={() => setShowProductDetail(true)}
      >
        {item.isOnDiscount && (
          <div className="absolute top-4 left-4 z-20 bg-brand-violet text-white text-[10px] font-accent font-normal px-3 py-1.5 tracking-widest rounded-full uppercase shadow-lg shadow-violet-900/20">
            -{calcDiscount()}%
          </div>
        )}

        <div className="aspect-square overflow-hidden bg-brand-gray relative">
          <img
            src={item.image || "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=600"}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center">
            {item.isOnDiscount && item.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 line-through">
                  ₱{item.basePrice}
                </span>
                <span className="text-sm font-heading font-black text-green-600 uppercase">
                  ₱{item.discountPrice}
                </span>
              </div>
            ) : (
              <span className="text-sm font-heading font-black text-green-600 uppercase">
                ₱{item.basePrice}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow bg-white">
          <div className="mb-3 space-y-1">
            <h3 className="text-sm md:text-base font-heading font-black text-brand-black tracking-tight leading-tight group-hover:text-brand-violet transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="text-[10px] text-gray-500 font-sans font-medium line-clamp-2 min-h-[2.5em]">
              {item.description}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-center w-full pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isAddDisabled) onAddToCart(item);
              }}
              disabled={isAddDisabled}
              className={`flex items-center space-x-1 md:space-x-1.5 px-2.5 py-1.5 md:px-4 md:py-2.5 rounded-full w-full justify-center md:rounded-full text-[8px] md:text-[11px] font-black uppercase tracking-[0.2em] font-heading transition-all duration-300 transform ${!isAddDisabled
                ? 'bg-[#7F00FF] text-white hover:shadow-[0_0_20px_rgba(127,0,255,0.5)] hover:-translate-y-1 active:scale-95 shadow-[0_5px_15px_rgba(127,0,255,0.3)]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70'
                }`}
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4 stroke-[3]" />
              <span>{!isStoreOpen ? 'Closed' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
      {showProductDetail && (
        <ProductDetailModal
          item={item}
          onClose={() => setShowProductDetail(false)}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
        />
      )}
    </>
  );
};

export default MenuItemCard;