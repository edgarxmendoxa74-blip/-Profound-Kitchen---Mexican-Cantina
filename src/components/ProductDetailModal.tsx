import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';
import ProductGallery from './ProductGallery';
import { useStoreHours } from '../hooks/useStoreHours';

interface ProductDetailModalProps {
    item: MenuItem;
    onClose: () => void;
    onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
    onBuyNow?: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    item,
    onClose,
    onAddToCart,
    onBuyNow
}) => {
    const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
        item.variations?.[0]
    );
    const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);
    const [quantity, setQuantity] = useState(1);
    const { isStoreOpen } = useStoreHours();

    const activeImage = (selectedVariation?.image) || item.image;
    const displayImages = activeImage ? [activeImage] : [];

    const calculatePrice = () => {
        let price = item.effectivePrice || item.basePrice;
        if (selectedVariation) {
            price += selectedVariation.price;
        }
        selectedAddOns.forEach(addOn => {
            price += addOn.price * addOn.quantity;
        });
        return price;
    };

    const handleAddToCart = () => {
        const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn =>
            Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
        );
        onAddToCart(item, quantity, selectedVariation, addOnsForCart);
        onClose();
    };

    const updateAddOnQuantity = (addOn: AddOn, q: number) => {
        setSelectedAddOns(prev => {
            const existing = prev.find(a => a.id === addOn.id);
            if (q <= 0) return prev.filter(a => a.id !== addOn.id);
            if (existing) {
                return prev.map(a => a.id === addOn.id ? { ...a, quantity: q } : a);
            }
            return [...prev, { ...addOn, quantity: q }];
        });
    };

    const isAddDisabled = !isStoreOpen;

    return (
        <div className="fixed inset-0 bg-brand-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-500">
            <div
                className="bg-white rounded-[24px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 duration-500 border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2.5 bg-white/80 backdrop-blur-sm border border-gray-100 hover:bg-white text-brand-black rounded-full shadow-lg z-20 transition-all duration-300"
                    title="Close"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
                    {/* Left Column: Gallery */}
                    <div className="space-y-6">
                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                            <ProductGallery images={displayImages} name={item.name} />
                        </div>
                    </div>

                    {/* Right Column: Info & Options */}
                    <div className="flex flex-col h-full">
                        <div className="flex flex-col space-y-10">
                            <div className="space-y-4">
                                <span className="text-brand-violet font-accent font-normal uppercase tracking-[0.4em] text-[11px] block">
                                    Product Details
                                </span>
                                <h1 className="text-3xl md:text-4xl font-heading font-black text-brand-black tracking-tight leading-tight uppercase">
                                    {item.name}
                                </h1>
                                {item.description && (
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed whitespace-pre-wrap">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            <div className="bg-brand-black p-6 rounded-2xl shadow-xl">
                                <div className="flex items-center justify-center">
                                    <div className="flex flex-col text-center">
                                        <span className="text-3xl font-heading font-black text-white italic">₱{calculatePrice()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Variations selection */}
                            {item.variations && item.variations.length > 0 && (
                                <div className="space-y-6">
                                    <label className="block text-[10px] font-sans font-black text-brand-black uppercase tracking-[0.3em]">
                                        Customize Selection *
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {item.variations.map((v) => {
                                            const isSelected = selectedVariation?.id === v.id;
                                            return (
                                                <button
                                                    key={v.id}
                                                    onClick={() => setSelectedVariation(v)}
                                                    className={`px-6 py-4 border-2 transition-all duration-300 flex items-center space-x-4 rounded-2xl ${isSelected
                                                        ? 'border-brand-violet text-brand-violet bg-brand-violet/5 shadow-2xl scale-105'
                                                        : 'border-gray-100 text-brand-black hover:border-brand-violet hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="text-[12px] font-accent font-normal uppercase tracking-widest">{v.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Add-ons selection */}
                            {item.addOns && item.addOns.length > 0 && (
                                <div className="space-y-6">
                                    <label className="block text-[11px] font-accent font-normal text-brand-black uppercase tracking-[0.3em]">
                                        Enhancements
                                    </label>
                                    <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        {item.addOns.map((addOn) => {
                                            const selected = selectedAddOns.find(a => a.id === addOn.id);
                                            return (
                                                <div key={addOn.id} className="flex items-center justify-between group">
                                                    <div className="flex flex-col">
                                                        <span className="text-[12px] font-accent font-normal text-gray-600 uppercase tracking-widest">{addOn.name}</span>
                                                        <span className="text-[11px] font-heading font-black text-brand-violet mt-0.5 uppercase">₱{addOn.price}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3 bg-white border border-gray-100 rounded-full p-1 shadow-sm">
                                                        <button
                                                            onClick={() => updateAddOnQuantity(addOn, (selected?.quantity || 0) - 1)}
                                                            className="p-1.5 hover:bg-gray-50 text-brand-violet transition-all disabled:opacity-20"
                                                            disabled={!selected}
                                                            title={`Decrease ${addOn.name} quantity`}
                                                            aria-label={`Decrease ${addOn.name} quantity`}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="text-xs font-black min-w-[20px] text-center text-brand-black">{selected?.quantity || 0}</span>
                                                        <button
                                                            onClick={() => updateAddOnQuantity(addOn, (selected?.quantity || 0) + 1)}
                                                            className="p-1.5 hover:bg-gray-50 text-brand-violet transition-all"
                                                            title={`Increase ${addOn.name} quantity`}
                                                            aria-label={`Increase ${addOn.name} quantity`}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selection */}
                            <div className="flex flex-col space-y-6 pt-10 border-t border-gray-100">
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-[11px] font-accent font-black text-brand-black uppercase tracking-[0.3em] pl-2">Quantity</span>
                                    <div className="flex items-center bg-brand-black rounded-full p-1 shadow-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="h-10 w-10 flex items-center justify-center text-white hover:text-brand-violet transition-colors"
                                            title="Decrease quantity"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-12 text-center text-base font-black border-none focus:ring-0 text-white bg-transparent outline-none"
                                            title="Quantity"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="h-10 w-10 flex items-center justify-center text-white hover:text-brand-violet transition-colors"
                                            title="Increase quantity"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAddDisabled}
                                        className={`flex-1 flex items-center justify-center py-4 rounded-full transition-all duration-300 transform font-accent font-black text-[13px] uppercase tracking-[0.3em] ${isAddDisabled
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70'
                                            : 'bg-brand-violet text-white shadow-xl shadow-violet-900/40 hover:bg-brand-deep hover:scale-[1.02] active:scale-95'
                                            }`}
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-3" />
                                        {!isStoreOpen ? 'Closed' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
