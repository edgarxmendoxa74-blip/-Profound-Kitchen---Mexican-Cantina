import React from 'react';
import { Users, ShieldCheck, ArrowRight, ExternalLink, ArrowLeft } from 'lucide-react';

interface EventsSectionProps {
    onBackClick?: () => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({ onBackClick }) => {
    return (
        <section className="py-24 px-4 bg-white" id="events">
            <div className="max-w-7xl mx-auto">
                {onBackClick && (
                    <button
                        onClick={onBackClick}
                        className="mb-12 flex items-center space-x-3 group text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 hover:text-brand-violet transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Menu</span>
                    </button>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    <div className="space-y-12 animate-fade-in-left">
                        <div className="space-y-4">
                            <span className="text-brand-violet font-sans font-black uppercase tracking-[0.5em] text-[10px] block">
                                Private Gatherings
                            </span>
                            <h2 className="text-5xl md:text-6xl font-serif font-black text-brand-black leading-tight tracking-tighter">
                                Host Your <br />
                                <span className="text-brand-violet italic">Grand Event.</span>
                            </h2>
                        </div>

                        <p className="text-lg text-gray-500 font-sans font-medium leading-relaxed">
                            From intimate celebrations to grand corporate gatherings, Profound + Kitchen provides the perfect backdrop of vibrant Mexican culture and sophisticated elegance.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-4 p-6 bg-brand-gray/30 rounded-3xl border border-transparent hover:border-brand-violet/20 transition-all group">
                                <Users className="w-8 h-8 text-brand-black group-hover:text-brand-violet transition-colors" />
                                <h4 className="text-lg font-serif font-black text-brand-black uppercase tracking-tight">Flexible PAX</h4>
                                <p className="text-xs text-gray-400 font-sans font-medium">Customizable seating arrangements for any group size.</p>
                            </div>
                            <div className="space-y-4 p-6 bg-brand-gray/30 rounded-3xl border border-transparent hover:border-brand-violet/20 transition-all group">
                                <ShieldCheck className="w-8 h-8 text-brand-black group-hover:text-brand-violet transition-colors" />
                                <h4 className="text-lg font-serif font-black text-brand-black uppercase tracking-tight">Safe & Private</h4>
                                <p className="text-xs text-gray-400 font-sans font-medium">Dedicated event spaces with strict safety protocols.</p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <a
                                href="https://forms.gle/B4hsT2YbFSTEAtkH8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-brand inline-flex items-center space-x-4 w-full sm:w-auto justify-center"
                            >
                                <span>Inquire Now</span>
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div className="relative animate-fade-in-right">
                        <div className="absolute -inset-10 bg-brand-violet/5 rounded-full blur-3xl opacity-50" />
                        <div className="relative bg-brand-black p-10 md:p-16 rounded-[40px] shadow-2xl overflow-hidden border border-white/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                            <h3 className="text-3xl font-serif font-black text-white mb-8 tracking-tighter">Event Policies</h3>

                            <ul className="space-y-6">
                                {[
                                    { title: "Reservation Lead Time", desc: "Please inquire at least 2 weeks before your desired date." },
                                    { title: "Menu Customization", desc: "Special set menus are available for groups over 20 pax." },
                                    { title: "Downpayment", desc: "A 50% non-refundable downpayment is required to secure the date." },
                                    { title: "Cancellation", desc: "Cancellations must be made at least 7 days in advance." }
                                ].map((policy, i) => (
                                    <li key={i} className="flex items-start space-x-5 group">
                                        <div className="w-6 h-6 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center flex-shrink-0 group-hover:bg-brand-violet group-hover:text-white transition-all text-[10px] font-black">
                                            {i + 1}
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="text-[11px] font-sans font-black uppercase tracking-widest text-brand-violet">{policy.title}</h5>
                                            <p className="text-sm text-gray-400 font-sans font-medium">{policy.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-12 pt-10 border-t border-white/10 space-y-6">
                                <p className="text-xs text-gray-500 font-sans font-medium italic">
                                    "We make every celebration a profound experience."
                                </p>
                                <div className="flex flex-col space-y-3">
                                    <h5 className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-500">Official PAX Form</h5>
                                    <a
                                        href="https://forms.gle/B4hsT2YbFSTEAtkH8"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                                    >
                                        <span className="text-xs font-sans font-bold text-white uppercase tracking-tight">Access Google Form</span>
                                        <ExternalLink className="w-4 h-4 text-brand-violet" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default EventsSection;
