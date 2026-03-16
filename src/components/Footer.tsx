import React from 'react';
import { Facebook, Instagram, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { useStoreHours } from '../hooks/useStoreHours';

const Footer: React.FC = () => {
    const { storeHours } = useStoreHours();

    return (
        <footer className="bg-brand-black text-white pt-20 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand Info */}
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <span className="text-2xl font-serif font-black tracking-tighter uppercase text-white">
                                Profound <span className="text-brand-violet">+</span> Kitchen
                            </span>
                            <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-gray-500 mt-1">
                                Mexican Culinary District
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed font-sans font-medium">
                            Experience the vibrant flavors and authentic vibes of South Triangle's premier Mexican kitchen.
                        </p>
                        <div className="flex items-center space-x-5">
                            <a href="#" title="Facebook" className="p-2 bg-white/5 rounded-full hover:bg-brand-violet transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" title="Instagram" className="p-2 bg-white/5 rounded-full hover:bg-brand-violet transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Store Info */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-brand-violet">Location & Contact</h4>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 group">
                                <MapPin className="w-5 h-5 text-gray-500 group-hover:text-brand-violet transition-colors flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-400 font-sans font-medium">
                                    26-B Sct Borromeo,<br />South Triangle, Quezon City
                                </p>
                            </div>
                            <div className="flex items-center space-x-4 group">
                                <Phone className="w-5 h-5 text-gray-500 group-hover:text-brand-violet transition-colors flex-shrink-0" />
                                <p className="text-sm text-gray-400 font-sans font-medium">
                                    09062066175 (Viber)
                                </p>
                            </div>
                            <div className="flex items-center space-x-4 group">
                                <Mail className="w-5 h-5 text-gray-500 group-hover:text-brand-violet transition-colors flex-shrink-0" />
                                <p className="text-sm text-gray-400 font-sans font-medium">
                                    hello@profoundplus.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Store Hours */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-brand-violet">Store Hours</h4>
                        <div className="space-y-3 font-sans">
                            {storeHours.map((entry, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-bold">{entry.label}</span>
                                    <span className="text-gray-400 font-medium">{entry.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-brand-violet">Inquiries</h4>
                        <div className="flex flex-col space-y-4 font-sans">
                            <a
                                href="https://forms.gle/B4hsT2YbFSTEAtkH8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-violet transition-all group"
                            >
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-200">Event Inquiry</span>
                                <ExternalLink className="w-4 h-4 text-brand-violet group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="https://forms.gle/mXqsDJo8f3uutbJ18"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-violet transition-all group"
                            >
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-200">Feedback Form</span>
                                <ExternalLink className="w-4 h-4 text-brand-violet group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                </div>

                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-gray-600">
                        &copy; 2024 Profound + Kitchen. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-8 text-[10px] font-sans font-black uppercase tracking-widest text-gray-600">
                        <a href="#" className="hover:text-brand-violet transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-violet transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
