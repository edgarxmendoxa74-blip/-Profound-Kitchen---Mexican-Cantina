import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, Tag, X } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { useCoupons } from '../hooks/useCoupons';
import { useStoreHours } from '../hooks/useStoreHours';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: (coupon?: Coupon) => void;
  appliedCoupon?: Coupon | null;
  applyCoupon?: (coupon: Coupon) => void;
  removeCoupon?: () => void;
  getSubtotal: () => number;
  getDiscountTotal: () => number;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout,
  appliedCoupon,
  applyCoupon,
  removeCoupon,
  getSubtotal,
  getDiscountTotal
}) => {
  const [couponCode, setCouponCode] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [isValidating, setIsValidating] = React.useState(false);
  const { validateCoupon } = useCoupons();
  const { isStoreOpen } = useStoreHours();

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidating(true);
    setCouponError('');
    try {
      const coupon = await validateCoupon(couponCode);
      if (coupon) {
        const subtotal = getSubtotal();
        if (subtotal < coupon.minSpend) {
          setCouponError(`Min. spend for this code is ₱${coupon.minSpend}`);
        } else {
          applyCoupon?.(coupon);
          setCouponCode('');
        }
      } else {
        setCouponError('Invalid or expired promo code');
      }
    } catch (err) {
      setCouponError('Error validating code');
    } finally {
      setIsValidating(false);
    }
  };
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center py-24 bg-white border border-violet-100 shadow-sm rounded-sm">
          <div className="text-6xl mb-8 grayscale">🌮</div>
          <h2 className="text-3xl font-black text-[#7F00FF] mb-4 uppercase tracking-tighter font-heading">Your order is empty</h2>
          <p className="text-[12px] font-normal text-black mb-12 uppercase tracking-[0.3em] font-accent">Taste the flavor of our Mexican Cantina</p>
          <button
            onClick={onContinueShopping}
            className="bg-[#7F00FF] text-white px-12 py-5 rounded-sm transition-all duration-300 font-normal text-[13px] uppercase tracking-[0.4em] font-accent hover:scale-[1.05] active:scale-95 shadow-xl shadow-violet-900/10"
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-10 border-b border-violet-100 pb-8">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-3 text-[#7F00FF] hover:text-[#9D00FF] transition-colors duration-300 font-normal text-[12px] uppercase tracking-[0.2em] font-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Add More Food</span>
        </button>
        <h1 className="text-3xl font-black text-[#7F00FF] uppercase tracking-tighter font-heading">Your Order</h1>
        <button
          onClick={clearCart}
          className="text-violet-400 hover:text-[#7F00FF] transition-colors duration-300 font-normal text-[12px] uppercase tracking-[0.2em] font-accent"
        >
          Clear Order
        </button>
      </div>

      <div className="bg-white overflow-hidden mb-12 border border-violet-100 rounded-sm shadow-sm">
        {cartItems.map((item, index) => {
          return (
            <div key={item.id} className={`p-8 ${index !== cartItems.length - 1 ? 'border-b border-violet-50' : ''} hover:bg-violet-50/30 transition-colors duration-300`}>
              <div className="flex items-start space-x-6">
                {/* Variation Image */}
                {item.selectedVariation?.image && (
                  <div className="w-24 h-24 rounded-sm overflow-hidden bg-violet-50 flex-shrink-0 border border-violet-100">
                    <img
                      src={item.selectedVariation.image}
                      alt={item.selectedVariation.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-[#4B0082] mb-1 uppercase tracking-tight font-heading">{item.name}</h3>
                  {item.selectedVariations && item.selectedVariations.length > 0 ? (
                    <p className="text-[11px] text-violet-500 font-bold uppercase tracking-[0.2em] mb-1 italic">Options: {item.selectedVariations.map(v => v.name).join(' + ')}</p>
                  ) : item.selectedVariation ? (
                    <p className="text-[11px] text-violet-500 font-bold uppercase tracking-[0.2em] mb-1 italic">Option: {item.selectedVariation.name}</p>
                  ) : null}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-[11px] text-violet-500 font-bold uppercase tracking-[0.2em] mb-4 italic">
                      Add-ons: {item.selectedAddOns.map(addOn =>
                        addOn.quantity && addOn.quantity > 1
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                  <p className="text-base font-black text-[#7F00FF] font-heading">₱{item.totalPrice.toFixed(2).replace(/\.00$/, '')} <span className="text-[10px] font-normal text-violet-300 tracking-wider uppercase ml-1 font-accent">each</span></p>

                  <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center space-x-1 bg-[#4B0082] text-white p-1 rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:text-violet-200 transition-all duration-300"
                        title="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-black min-w-[36px] text-center text-[12px]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:text-violet-200 transition-all duration-300"
                        title="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-6">
                      <p className="text-xl font-black text-[#7F00FF] font-heading tracking-tight">₱{(item.totalPrice * item.quantity).toFixed(2).replace(/\.00$/, '')}</p>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2.5 text-violet-400 hover:text-white hover:bg-[#7F00FF] rounded-sm transition-all duration-500 border border-transparent active:scale-90"
                        title="Remove from order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-violet-100 p-10 shadow-xl shadow-violet-900/5 rounded-sm">
        <div className="flex items-center justify-between text-base font-bold mb-4 tracking-[0.2em] text-[#4B0082] uppercase">
          <span>Item Subtotal</span>
          <span>₱{getSubtotal().toFixed(2)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex items-center justify-between text-base font-bold mb-6 tracking-[0.2em] text-[#7F00FF] uppercase italic">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Promo Applied ({appliedCoupon.code})</span>
            </div>
            <span>-₱{getDiscountTotal().toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-6 px-10 bg-black rounded-2xl border-2 border-violet-500 shadow-xl mb-10">
          <span className="text-xl font-black text-violet-400 font-heading tracking-widest uppercase">ORDER TOTAL</span>
          <span className="text-4xl font-black text-white font-heading">₱{getTotalPrice().toFixed(2)}</span>
        </div>

        {!appliedCoupon ? (
          <div className="mb-10">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="VOUCHER CODE"
                className="flex-1 px-5 py-4 border border-violet-100 outline-none focus:border-[#7F00FF] font-black text-[11px] tracking-[0.3em] uppercase rounded-sm bg-violet-50/30"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isValidating || !couponCode}
                className="px-8 py-4 bg-[#7F00FF] text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#9D00FF] transition-all disabled:bg-violet-100 disabled:text-violet-300 rounded-sm"
              >
                {isValidating ? '...' : 'Redeem'}
              </button>
            </div>
            {couponError && <p className="text-[10px] text-[#7F00FF] font-black mt-3 uppercase tracking-[0.2em]">{couponError}</p>}
          </div>
        ) : (
          <div className="mb-10 p-5 bg-violet-50/30 border border-violet-100 flex items-center justify-between animate-in fade-in duration-500 rounded-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-[#7F00FF] text-white p-2 rounded-sm shadow-lg">
                <Tag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4B0082]">{appliedCoupon.code}</p>
                <p className="text-[10px] font-bold text-[#7F00FF] uppercase tracking-[0.2em]">
                  {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% SAVINGS` : `₱${appliedCoupon.discountValue} OFF`} applied
                </p>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-violet-400 hover:text-[#7F00FF] transition-colors p-2"
              title="Remove Code"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <button
          onClick={() => onCheckout(appliedCoupon || undefined)}
          disabled={!isStoreOpen}
          className={`w-full py-6 rounded-2xl transition-all duration-300 transform font-black text-lg uppercase tracking-[0.2em] font-heading shadow-xl active:scale-[0.98] hover:-translate-y-1 ${isStoreOpen
            ? 'bg-[#7F00FF] text-white hover:bg-[#9D00FF] shadow-violet-500/30'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
            }`}
        >
          {isStoreOpen ? (
            <span className="flex items-center justify-center gap-3">
              <span>Checkout</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black">Now</span>
            </span>
          ) : 'Store is Closed'}
        </button>
      </div>
    </div>
  );
};

export default Cart;