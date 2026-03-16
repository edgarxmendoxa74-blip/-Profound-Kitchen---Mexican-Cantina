import React, { useState } from 'react';
import { Utensils, ShoppingBag, MapPin, Phone, CheckCircle2, ChevronRight } from 'lucide-react';

const OrderOptions: React.FC = () => {
    const [option, setOption] = useState<'dine-in' | 'pick-up' | 'delivery'>('pick-up');

    return (
        <section className="py-24 px-4 bg-brand-gray/30" id="order-options">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                    <span className="text-brand-violet font-accent font-normal uppercase tracking-[0.4em] text-[11px] mb-3 text-center">Service Excellence</span>
                    <h3 className="text-4xl md:text-5xl font-heading font-black text-brand-black tracking-tighter text-center uppercase">How would you like to <br /> <span className="text-brand-violet italic">enjoy your meal?</span></h3>
                    <div className="w-16 h-1 bg-brand-violet mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Dine In Option */}
                    <button
                        onClick={() => setOption('dine-in')}
                        className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 text-left overflow-hidden h-full ${option === 'dine-in'
                            ? 'border-brand-violet bg-white shadow-2xl shadow-brand-violet/10'
                            : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'
                            }`}
                    >
                        <div className={`p-4 rounded-2xl inline-block mb-6 transition-colors ${option === 'dine-in' ? 'bg-brand-violet text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-brand-violet group-hover:text-white'
                            }`}>
                            <Utensils className="w-8 h-8" />
                        </div>
                        <h4 className="text-2xl font-heading font-black text-brand-black mb-3 uppercase">Dine In</h4>
                        <p className="text-sm text-gray-500 font-sans font-medium mb-6">Experience the atmosphere and freshly prepared delights in our kitchen.</p>
                        <div className={`flex items-center text-[11px] font-accent font-normal uppercase tracking-widest mt-auto ${option === 'dine-in' ? 'text-brand-violet' : 'text-gray-400'
                            }`}>
                            {option === 'dine-in' ? 'Selected' : 'Select Option'} {option === 'dine-in' ? <CheckCircle2 className="ml-2 w-4 h-4" /> : <ChevronRight className="ml-2 w-4 h-4" />}
                        </div>
                    </button>

                    {/* Pick Up Option */}
                    <button
                        onClick={() => setOption('pick-up')}
                        className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 text-left overflow-hidden h-full ${option === 'pick-up'
                            ? 'border-brand-violet bg-white shadow-2xl shadow-brand-violet/10'
                            : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'
                            }`}
                    >
                        <div className={`p-4 rounded-2xl inline-block mb-6 transition-colors ${option === 'pick-up' ? 'bg-brand-violet text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-brand-violet group-hover:text-white'
                            }`}>
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        <h4 className="text-2xl font-heading font-black text-brand-black mb-3 uppercase">Pick Up</h4>
                        <p className="text-sm text-gray-500 font-sans font-medium mb-6">Choose from our convenient pick-up options and enjoy the flavors anywhere.</p>
                        <div className={`flex items-center text-[11px] font-accent font-normal uppercase tracking-widest mt-auto ${option === 'pick-up' ? 'text-brand-violet' : 'text-gray-400'
                            }`}>
                            {option === 'pick-up' ? 'Selected' : 'Select Option'} {option === 'pick-up' ? <CheckCircle2 className="ml-2 w-4 h-4" /> : <ChevronRight className="ml-2 w-4 h-4" />}
                        </div>
                    </button>

                    {/* Delivery Option */}
                    <button
                        onClick={() => setOption('delivery')}
                        className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 text-left overflow-hidden h-full ${option === 'delivery'
                            ? 'border-brand-violet bg-white shadow-2xl shadow-brand-violet/10'
                            : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'
                            }`}
                    >
                        <div className={`p-4 rounded-2xl inline-block mb-6 transition-colors ${option === 'delivery' ? 'bg-brand-violet text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-brand-violet group-hover:text-white'
                            }`}>
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h4 className="text-2xl font-heading font-black text-brand-black mb-3 uppercase">Delivery</h4>
                        <p className="text-sm text-gray-500 font-sans font-medium mb-6">Have your favorites brought straight to your doorstep with our reliable delivery.</p>
                        <div className={`flex items-center text-[11px] font-accent font-normal uppercase tracking-widest mt-auto ${option === 'delivery' ? 'text-brand-violet' : 'text-gray-400'
                            }`}>
                            {option === 'delivery' ? 'Selected' : 'Select Option'} {option === 'delivery' ? <CheckCircle2 className="ml-2 w-4 h-4" /> : <ChevronRight className="ml-2 w-4 h-4" />}
                        </div>
                    </button>
                </div>

                {/* Pick Up Details (Conditional) */}
                <div className={`mt-12 transition-all duration-500 transform ${option === 'pick-up' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none absolute'
                    }`}>
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-50 max-w-5xl mx-auto space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <h5 className="text-[11px] font-accent font-normal uppercase tracking-widest text-brand-violet">Pick Up Options</h5>
                                <ul className="space-y-3">
                                    {['Self Pick Up', 'Curbside Pick Up', 'Third Party Delivery'].map(item => (
                                        <li key={item} className="flex items-center text-sm font-sans font-bold text-brand-black">
                                            <div className="w-1.5 h-1.5 bg-brand-violet rounded-full mr-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <h5 className="text-[11px] font-accent font-normal uppercase tracking-widest text-brand-violet">Where to find us</h5>
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-5 h-5 text-brand-violet flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-lg font-heading font-black text-brand-black uppercase">Profound + Kitchen</p>
                                        <p className="text-sm text-gray-500 font-sans font-medium">26-B Sct Borromeo, South Triangle, Quezon City</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h5 className="text-[11px] font-accent font-normal uppercase tracking-widest text-brand-violet">How it works</h5>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl">
                                        <div className="w-8 h-8 rounded-full bg-brand-violet text-white flex items-center justify-center font-accent font-normal text-xs">1</div>
                                        <p className="text-xs font-accent font-normal text-brand-black uppercase tracking-tight">Send Payment Confirmation via Viber</p>
                                    </div>
                                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl">
                                        <div className="w-8 h-8 rounded-full bg-brand-violet text-white flex items-center justify-center font-accent font-normal text-xs">2</div>
                                        <p className="text-xs font-accent font-normal text-brand-black uppercase tracking-tight">Provide Date & Time of Pick Up</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 border-2 border-dashed border-brand-violet/20 rounded-2xl bg-brand-violet/5">
                                    <Phone className="w-5 h-5 text-brand-violet mr-4" />
                                    <span className="text-sm font-accent font-normal text-brand-violet uppercase tracking-widest">Viber: 09062066175</span>
                                </div>
                            </div>
                            <div className="space-y-6 bg-brand-black p-8 rounded-[32px] text-white">
                                <h5 className="text-[11px] font-accent font-normal uppercase tracking-widest text-brand-violet">Customer Must Provide:</h5>
                                <ul className="space-y-4">
                                    {['Date of pick up', 'Time of pick up', 'Payment confirmation'].map(item => (
                                        <li key={item} className="flex items-center text-sm font-accent font-normal group uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-sm border border-brand-violet mr-4 group-hover:bg-brand-violet transition-colors" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderOptions;
