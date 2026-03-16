import React, { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Clock, Utensils } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { useStoreHours } from '../hooks/useStoreHours';

interface CheckoutProps {
  cartItems: CartItem[];
  appliedCoupon?: Coupon | null;
  onBack: () => void;
  onStepChange?: (step: 'details' | 'payment') => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  appliedCoupon,
  onBack,
  onStepChange
}) => {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [orderType, setOrderType] = useState<'delivery' | 'pick-up' | 'dine-in'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');
  const { paymentMethods } = usePaymentMethods();
  const { isStoreOpen } = useStoreHours();

  // Set default payment method once loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentId) {
      setSelectedPaymentId(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentId]);

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedPaymentId);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
  }, [cartItems]);

  const discountTotal = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'fixed') {
      return appliedCoupon.discountValue;
    }
    return subtotal * (appliedCoupon.discountValue / 100);
  }, [subtotal, appliedCoupon]);

  const shippingFee = 0;
  const grandTotal = subtotal - discountTotal + shippingFee;
  const serviceType = selectedPaymentMethod?.id === 'cod' ? 'cod' : 'regular';

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleProceedToPayment = () => {
    setStep('payment');
    onStepChange?.('payment');
  };

  const handlePlaceOrder = () => {
    const orderDetails = `
ORDER TYPE: ${orderType.toUpperCase()}
${orderType === 'dine-in' ? `Table: ${tableNumber}` : ''}
Customer: ${customerName}
Contact: ${contactNumber}
${orderType === 'delivery' ? `Address: ${address}${landmark ? `\nLandmark: ${landmark}` : ''}` : ''}
${orderType === 'pick-up' ? `Time: ${pickupTime}` : ''}

ORDER DETAILS:
${cartItems.map(item => {
      let itemDetails = `- ${item.name}`;
      if (item.selectedVariations && item.selectedVariations.length > 0) {
        itemDetails += ` (${item.selectedVariations.map(v => v.name).join(' + ')})`;
      } else if (item.selectedVariation) {
        itemDetails += ` (${item.selectedVariation.name})`;
      }
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        itemDetails += ` + ${item.selectedAddOns.map(addOn =>
          addOn.quantity && addOn.quantity > 1
            ? `${addOn.name} x${addOn.quantity}`
            : addOn.name
        ).join(', ')}`;
      }
      itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
      return itemDetails;
    }).join('\n')}

SUBTOTAL: ₱${subtotal}
${discountTotal > 0 ? `DISCOUNT${appliedCoupon ? ` (${appliedCoupon.code})` : ''}: -₱${discountTotal}\n` : ''}TOTAL: ₱${grandTotal}

Payment: ${orderType === 'dine-in' ? 'Pay at Counter' : (selectedPaymentMethod?.name || 'GCash')}
${orderType === 'dine-in' ? 'Pay at the counter when you finish your meal!' : (orderType === 'delivery' || orderType === 'pick-up' ? 'Payment Screenshot: Please attach your payment receipt screenshot' : '')}

${notes ? `Notes: ${notes}` : ''}

Please confirm this order to proceed. Experience the flavor of Profound+Kitchen!
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/profoundpluskitchen?text=${encodedMessage}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = messengerUrl;
    } else {
      window.open(messengerUrl, '_blank');
    }
  };

  const isDetailsValid = useMemo(() => {
    if (!customerName || !contactNumber) return false;
    if (orderType === 'dine-in' && !tableNumber) return false;
    if (orderType === 'pick-up' && !pickupTime) return false;
    if (orderType === 'delivery' && !address) return false;
    return true;
  }, [customerName, contactNumber, orderType, tableNumber, pickupTime, address]);

  if (step === 'details') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center mb-10 border-b border-violet-100 pb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-black hover:text-[#7F00FF] transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-[12px] font-normal uppercase tracking-[0.2em] font-accent">Back</span>
          </button>
          <h1 className="text-3xl font-black text-[#7F00FF] ml-8 uppercase tracking-tighter font-heading">Order Information</h1>
        </div>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
          {/* Selection Summary */}
          <div className="order-2 lg:order-1 bg-white border border-violet-100 rounded-2xl shadow-[0_20px_50px_rgba(127,0,255,0.03)] p-6 md:p-10 relative overflow-hidden h-fit">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#7F00FF]/5 -ml-16 -mt-16 rounded-full blur-3xl"></div>

            <h2 className="text-2xl font-black text-[#7F00FF] mb-10 uppercase tracking-tight font-heading flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-violet-50 text-[#7F00FF] flex items-center justify-center text-sm border border-violet-100">🛒</span>
              Your Selection
            </h2>

            <div className="space-y-2 mb-10">
              {cartItems.map((item) => (
                <div key={item.id} className="group flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-violet-100 hover:bg-violet-50/30 transition-all duration-300">
                  <div className="flex-1">
                    <h4 className="font-black text-black text-sm uppercase tracking-tight font-heading group-hover:text-[#7F00FF] transition-colors">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                      QTY: {item.quantity} × ₱{item.totalPrice}
                    </p>
                  </div>
                  <span className="font-black text-[#7F00FF] font-heading text-sm">₱{(item.totalPrice * item.quantity).toFixed(2).replace(/\.00$/, '')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-violet-100/50">
              <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">
                <span>Subtotal</span>
                <span>₱{subtotal.toFixed(2).replace(/\.00$/, '')}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex items-center justify-between text-[11px] font-black text-[#7F00FF] uppercase tracking-[0.2em] px-2 bg-violet-50 py-2 rounded-lg">
                  <span className="flex items-center gap-2">✨ Voucher ({appliedCoupon?.code})</span>
                  <span>-₱{discountTotal.toFixed(2).replace(/\.00$/, '')}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-3xl font-black text-black font-heading pt-6 px-2">
                <span className="text-xl opacity-40 italic">TOTAL DUE</span>
                <span className="text-[#7F00FF]">₱{grandTotal.toFixed(2).replace(/\.00$/, '')}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="order-1 lg:order-2 bg-white border border-violet-100 rounded-2xl shadow-[0_20px_50px_rgba(127,0,255,0.05)] p-6 md:p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7F00FF]/5 -mr-16 -mt-16 rounded-full blur-3xl text-right"></div>

            <h2 className="text-2xl font-black text-[#7F00FF] mb-10 uppercase tracking-tight font-heading flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#7F00FF] text-white flex items-center justify-center text-sm">01</span>
              Order Essentials
            </h2>

            <form className="space-y-10">
              {/* Order Type Selection */}
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black opacity-60 ml-1">Fulfillment Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'delivery', label: 'Delivery', icon: MapPin },
                    { id: 'pick-up', label: 'Pick Up', icon: Clock },
                    { id: 'dine-in', label: 'Dine In', icon: Utensils }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setOrderType(type.id as any)}
                      className={`relative group p-5 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center gap-3 overflow-hidden ${orderType === type.id
                        ? 'border-[#7F00FF] bg-[#7F00FF]/5 text-[#7F00FF] shadow-[0_10px_25px_rgba(127,0,255,0.1)]'
                        : 'border-violet-50 hover:border-violet-200 text-violet-400 bg-white hover:bg-violet-50/30'
                        }`}
                    >
                      {/* Active indicator */}
                      {orderType === type.id && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#7F00FF] animate-pulse"></div>
                      )}

                      <div className={`p-3 rounded-xl transition-colors duration-300 ${orderType === type.id ? 'bg-[#7F00FF] text-white shadow-lg shadow-violet-500/30' : 'bg-violet-50 text-violet-400 group-hover:bg-violet-100'}`}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.1em] font-heading">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black opacity-60 ml-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-5 py-4 bg-violet-50/50 border border-violet-100 rounded-xl focus:ring-4 focus:ring-[#7F00FF]/10 focus:border-[#7F00FF] transition-all duration-300 font-bold text-sm text-black placeholder:text-violet-200"
                        placeholder="Ex. John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black opacity-60 ml-1">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full px-5 py-4 bg-violet-50/50 border border-violet-100 rounded-xl focus:ring-4 focus:ring-[#7F00FF]/10 focus:border-[#7F00FF] transition-all duration-300 font-bold text-sm text-black placeholder:text-violet-200"
                        placeholder="09XX XXX XXXX"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Conditional Fields with transitions */}
                <div className="bg-violet-50/30 p-8 rounded-2xl border border-dashed border-violet-100 space-y-6">
                  {/* Dine In Fields */}
                  {orderType === 'dine-in' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black opacity-60">Table Number</label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-violet-100 rounded-xl focus:ring-4 focus:ring-[#7F00FF]/10 focus:border-[#7F00FF] transition-all duration-300 font-bold text-sm text-black placeholder:text-violet-200"
                        placeholder="Enter Table #"
                        required
                      />
                    </div>
                  )}

                  {/* Pick Up Fields */}
                  {orderType === 'pick-up' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black opacity-60">Pickup Time</label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-violet-100 rounded-xl focus:ring-4 focus:ring-[#7F00FF]/10 focus:border-[#7F00FF] transition-all duration-300 font-bold text-sm text-black"
                        required
                      />
                    </div>
                  )}

                  {/* Delivery Fields */}
                  {orderType === 'delivery' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black opacity-60">Complete Address</label>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-5 py-4 bg-white border border-violet-100 rounded-xl focus:ring-4 focus:ring-[#7F00FF]/10 focus:border-[#7F00FF] transition-all duration-300 font-bold text-sm text-black placeholder:text-violet-200"
                          rows={2}
                          placeholder="House #, Street, Brgy, City"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black opacity-60">Landmark (Optional)</label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="w-full px-5 py-4 bg-white border border-violet-100 rounded-xl focus:ring-4 focus:ring-[#7F00FF]/10 focus:border-[#7F00FF] transition-all duration-300 font-bold text-sm text-black placeholder:text-violet-200"
                          placeholder="Near [Famous Spot]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black opacity-60 ml-1">Order Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-5 py-4 bg-violet-50/50 border border-violet-100 rounded-xl focus:ring-4 focus:ring-[#7F00FF]/10 focus:border-[#7F00FF] transition-all duration-300 font-bold text-sm text-black placeholder:text-violet-200"
                    placeholder="Any special instructions or allergies?"
                    rows={2}
                  />
                </div>
              </div>

              <div className="pt-6 relative">
                {isDetailsValid && isStoreOpen && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7F00FF] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg animate-bounce z-10">
                    Ready to Fulfill
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={!isDetailsValid || !isStoreOpen}
                  className={`group relative w-full py-7 rounded-2xl font-black text-base uppercase tracking-[0.3em] font-heading transition-all duration-500 transform overflow-hidden ${isDetailsValid && isStoreOpen
                    ? 'bg-[#7F00FF] text-white hover:bg-[#9D00FF] shadow-[0_20px_40px_rgba(127,0,255,0.25)] hover:shadow-[0_25px_50px_rgba(127,0,255,0.35)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]'
                    : 'bg-violet-50 text-violet-300 cursor-not-allowed border border-violet-100'
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isStoreOpen ? (
                      <>
                        <span className="text-xl">🔥</span> Proceed to Payment
                      </>
                    ) : 'STORE IS CLOSED'}
                  </span>
                  {isDetailsValid && isStoreOpen && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer-fast"></div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full mt-4 py-4 rounded-xl font-black text-sm text-gray-400 hover:bg-violet-50 hover:text-[#7F00FF] transition-colors uppercase tracking-widest font-heading"
                >
                  Back to Cart
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-10 border-b border-violet-100 pb-6">
        <button
          onClick={() => setStep('details')}
          className="flex items-center space-x-2 text-black hover:text-[#7F00FF] transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-[12px] font-normal uppercase tracking-[0.2em] font-accent">Back</span>
        </button>
        <h1 className="text-3xl font-black text-[#7F00FF] ml-8 uppercase tracking-tighter font-heading">
          {serviceType === 'cod' ? 'Confirm Choice' : 'Selection & Payment'}
        </h1>
      </div>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
        {/* Payment Details */}
        <div className="order-2 lg:order-1 bg-white border border-violet-100 p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-2xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#7F00FF]/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>

          {serviceType === 'regular' ? (
            <>
              <h2 className="text-3xl font-black text-[#7F00FF] mb-10 uppercase tracking-tight font-heading border-b-2 border-violet-100 pb-4">
                Payment Method
              </h2>

              {/* Payment Method Selection */}
              <div className="flex space-x-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentId(method.id)}
                    className={`flex-shrink-0 py-4 px-8 border-2 transition-all duration-300 rounded-xl font-black text-[11px] uppercase tracking-widest whitespace-nowrap font-heading ${selectedPaymentId === method.id
                      ? 'border-[#7F00FF] bg-[#7F00FF] text-white shadow-lg shadow-violet-500/20'
                      : 'border-violet-50 bg-white text-violet-300 hover:border-violet-200 hover:text-[#7F00FF]'
                      }`}
                  >
                    {method.name}
                  </button>
                ))}
              </div>

              {selectedPaymentMethod ? (
                <div className="bg-white border-2 border-[#7F00FF] p-10 mb-8 relative overflow-hidden group rounded-2xl shadow-[0_25px_50px_rgba(127,0,255,0.15)] ring-4 ring-[#7F00FF]/5">
                  <div className="flex items-center space-x-4 mb-8 relative z-10">
                    <div className="w-14 h-14 bg-[#7F00FF] flex items-center justify-center rounded-xl shadow-lg shadow-violet-500/30">
                      <span className="text-white font-black text-2xl font-heading italic">{selectedPaymentMethod.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-black text-xl uppercase tracking-tighter font-heading">{selectedPaymentMethod.name}</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Safe Gateway</p>
                    </div>
                  </div>

                  <div className="bg-violet-50/50 p-8 mb-8 relative z-10 border border-violet-100 rounded-2xl shadow-inner">
                    <p className="text-2xl font-black text-[#7F00FF] mb-8 text-center tracking-tighter font-heading flex flex-col items-center">
                      <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black mb-1">SETTLEMENT AMOUNT</span>
                      ₱{grandTotal.toFixed(2).replace(/\.00$/, '')}
                    </p>

                    <div className="flex justify-center mb-8">
                      <div className="w-80 h-80 border-2 border-[#7F00FF]/10 overflow-hidden bg-white p-6 flex items-center justify-center rounded-2xl shadow-xl">
                        <img
                          src={selectedPaymentMethod.qr_code_url}
                          alt={`${selectedPaymentMethod.name} QR Code`}
                          className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105 transform"
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-[12px] text-[#7F00FF] font-black uppercase tracking-[0.3em] mb-3 font-heading italic">📱 READY FOR SCANNING</p>
                      <div className="w-20 h-1.5 bg-gradient-to-r from-[#7F00FF] to-[#9D00FF] mx-auto rounded-full shadow-lg animate-pulse"></div>
                    </div>
                  </div>

                  <div className="bg-black p-8 space-y-6 relative z-10 rounded-2xl shadow-2xl border border-violet-500/20">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-[10px] font-black text-violet-400/60 uppercase tracking-widest">GATEWAY ID</span>
                      <span className="font-black text-white tracking-widest text-base font-heading italic">{selectedPaymentMethod.account_number}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[10px] font-black text-violet-400/60 uppercase tracking-widest">HOLDER IDENTITY</span>
                      <span className="font-black text-white uppercase text-base font-heading tracking-tight">{selectedPaymentMethod.account_name}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-violet-50 border-2 border-dashed border-violet-100 p-16 text-center rounded-2xl">
                  <Utensils className="w-12 h-12 text-violet-100 mx-auto mb-4 animate-bounce" />
                  <p className="text-[11px] font-black text-violet-300 uppercase tracking-[0.2em] font-heading">
                    {paymentMethods.length === 0 ? 'ESTABLISHING SECURE CHANNELS...' : 'SELECT PAYMENT MODE ABOVE'}
                  </p>
                </div>
              )}

              <div className="bg-violet-50/80 border border-violet-100 p-8 rounded-2xl mt-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-[#7F00FF] text-white text-[8px] font-black rounded-bl-xl uppercase tracking-widest">Required Step</div>
                <h4 className="font-black text-[#7F00FF] mb-6 flex items-center uppercase tracking-[0.2em] text-[12px] font-heading gap-2">
                  SETTLEMENT PROTOCOL
                </h4>
                <ol className="text-[10px] text-black font-black space-y-4 list-none uppercase tracking-widest">
                  <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-white border border-violet-100 flex items-center justify-center text-[#7F00FF]">1</span> SCAN QR OR COPY ID ABOVE</li>
                  <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-white border border-violet-100 flex items-center justify-center text-[#7F00FF]">2</span> SEND PHP {grandTotal.toFixed(2).replace(/\.00$/, '')}</li>
                  <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-white border border-violet-100 flex items-center justify-center text-[#7F00FF]">3</span> CAPTURE SUCCESSFUL RECEIPT</li>
                  <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-[#7F00FF] text-white flex items-center justify-center">4</span> ATTACH TO MESSENGER CHAT</li>
                </ol>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-black text-[#7F00FF] mb-10 uppercase tracking-tight font-heading border-b-2 border-violet-100 pb-4">
                Choice Confirmed
              </h2>
              <div className="bg-white border-2 border-[#7F00FF] p-12 mb-8 text-center rounded-2xl shadow-[0_25px_50px_rgba(127,0,255,0.1)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#7F00FF]/5 to-transparent"></div>
                <div className="text-6xl mb-8 filter drop-shadow-xl animate-bounce">🌮</div>
                <h3 className="font-black text-[#7F00FF] text-2xl uppercase tracking-tighter font-heading mb-6 relative z-10">Payment on Arrival</h3>
                <p className="text-sm text-black font-black uppercase tracking-widest leading-relaxed max-w-sm mx-auto relative z-10 opacity-80">
                  EXPERIENCE THE FLAVOR SOON! PREPARE <span className="text-[#9D00FF] font-black text-xl italic underline underline-offset-4">₱{grandTotal.toFixed(2).replace(/\.00$/, '')}</span> FOR SETTLEMENT.
                </p>
              </div>
              <div className="bg-violet-50/50 border border-violet-100 p-8 rounded-2xl">
                <h4 className="font-black text-[#7F00FF] mb-6 uppercase tracking-[0.2em] text-[12px] font-heading border-b border-violet-100 pb-3 w-fit">NEXT MOVEMENTS</h4>
                <ul className="text-[11px] text-black font-black space-y-5 list-none uppercase tracking-widest">
                  <li className="flex items-center space-x-4"><div className="w-2 h-2 bg-[#7F00FF] rounded-full shadow-[0_0_10px_rgba(127,0,255,1)] animate-pulse"></div><span>BROADCAST ORDER VIA MESSENGER</span></li>
                  <li className="flex items-center space-x-4"><div className="w-2 h-2 bg-[#7F00FF] rounded-full opacity-40"></div><span>WAIT FOR KITCHEN VERIFICATION</span></li>
                  <li className="flex items-center space-x-4"><div className="w-2 h-2 bg-[#7F00FF] rounded-full opacity-40"></div><span>PREPARE EXACT SETTLEMENT AMOUNT</span></li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Order Summary */}
        <div className="order-1 lg:order-2 bg-white border border-violet-100 p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#7F00FF]/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>

          <h2 className="text-3xl font-black text-[#7F00FF] mb-10 uppercase tracking-tight font-heading border-b-2 border-violet-100 pb-4">
            Order Review
          </h2>

          <div className="space-y-6 mb-12">
            <div className="bg-violet-50/50 p-8 border border-violet-100 rounded-2xl relative shadow-inner">
              <h4 className="font-black text-[#7F00FF] mb-6 uppercase text-[11px] tracking-[0.3em] font-heading opacity-60 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> FULFILLMENT DESTINATION
              </h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient Name</span>
                  <p className="text-sm font-black text-black uppercase tracking-tight">{customerName}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Access</span>
                  <p className="text-sm font-black text-black uppercase tracking-tight">{contactNumber}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address Logic</span>
                  <p className="text-sm font-black text-black leading-relaxed uppercase tracking-tight">{address}</p>
                  {landmark && (
                    <span className="text-[10px] font-bold text-[#7F00FF] bg-white w-fit px-3 py-1 rounded-full border border-violet-100 mt-1">📍 {landmark}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-1">KITCHEN QUEUE</h4>
            {cartItems.map((item) => {
              return (
                <div key={item.id} className="flex items-center gap-5 p-4 rounded-xl hover:bg-violet-50/30 border border-transparent hover:border-violet-100 transition-all duration-300">
                  {item.selectedVariation?.image ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-violet-50 flex-shrink-0 border border-violet-100 shadow-sm">
                      <img
                        src={item.selectedVariation.image}
                        alt={item.selectedVariation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-violet-50 flex items-center justify-center text-violet-200 border border-dashed border-violet-200">
                      <Utensils className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-black uppercase tracking-tight font-heading text-base group-hover:text-[#7F00FF]">{item.name}</h4>
                    <div className="space-y-1 mt-1">
                      {item.selectedVariations && item.selectedVariations.length > 0 ? (
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Variation: {item.selectedVariations.map(v => v.name).join(' + ')}</p>
                      ) : item.selectedVariation ? (
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Variation: {item.selectedVariation.name}</p>
                      ) : null}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <p className="text-[10px] text-violet-500 font-black uppercase tracking-widest bg-violet-50 w-fit px-2 rounded">
                          EXTRA: {item.selectedAddOns.map(addOn =>
                            addOn.quantity && addOn.quantity > 1
                              ? `${addOn.name} x${addOn.quantity}`
                              : addOn.name
                          ).join(', ')}
                        </p>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7F00FF] font-black tracking-widest mt-2">
                      {item.quantity} × ₱{item.totalPrice.toFixed(2).replace(/\.00$/, '')}
                    </p>
                  </div>
                  <span className="font-black text-black font-heading text-lg">₱{(item.totalPrice * item.quantity).toFixed(2).replace(/\.00$/, '')}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t-2 border-violet-100 space-y-4">
            <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">
              <span>Subtotal</span>
              <span className="font-heading">₱{subtotal.toFixed(2).replace(/\.00$/, '')}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex items-center justify-between text-[11px] font-black text-[#7F00FF] uppercase tracking-[0.2em] px-2 bg-violet-50 py-2 rounded-lg">
                <span>Voucher Applied</span>
                <span className="font-heading">-₱{discountTotal.toFixed(2).replace(/\.00$/, '')}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 pb-6">
              <span>Delivery Logistics</span>
              <span className="font-heading">₱{shippingFee.toFixed(2).replace(/\.00$/, '')}</span>
            </div>
            <div className="flex items-center justify-between py-6 px-10 bg-black rounded-2xl border-2 border-violet-500 shadow-xl">
              <span className="text-xl font-black text-violet-400 font-heading tracking-widest uppercase">FINAL TOTAL</span>
              <span className="text-4xl font-black text-white font-heading">₱{grandTotal.toFixed(2).replace(/\.00$/, '')}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handlePlaceOrder}
              disabled={!isStoreOpen}
              className={`w-full py-7 rounded-2xl font-black text-xl uppercase tracking-[0.2em] font-heading transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] ${isStoreOpen
                ? 'bg-[#7F00FF] text-white shadow-[0_15px_30px_rgba(127,0,255,0.3)] hover:bg-[#9D00FF]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                }`}
            >
              {isStoreOpen ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="text-xl">🔥</span>
                  <span>Confirm Order</span>
                </span>
              ) : 'STORE IS CLOSED'}
            </button>

            <button
              onClick={() => setStep('details')}
              className="w-full mt-4 py-4 rounded-xl font-black text-sm text-gray-400 hover:bg-violet-50 hover:text-[#7F00FF] transition-colors uppercase tracking-widest font-heading"
            >
              Back to Details
            </button>
          </div>

          {/* Keyframe animations */}
          <style>{`
            @keyframes shimmer-sweep {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            @keyframes shimmer-bg {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}</style>

          <p className="text-[11px] text-gray-500 font-bold text-center mt-6 uppercase tracking-[0.2em] italic opacity-70">
            {serviceType === 'regular' ? 'Send receipt & details to start the kitchen' : 'Confirm via Messenger to start firing up!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
