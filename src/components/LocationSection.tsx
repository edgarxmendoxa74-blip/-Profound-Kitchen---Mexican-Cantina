import { MapPin, Phone, Clock, ArrowLeft } from 'lucide-react';
import { useStoreHours } from '../hooks/useStoreHours';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface LocationSectionProps {
    onBackClick?: () => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({ onBackClick }) => {
    const { storeHours } = useStoreHours();
    const { siteSettings } = useSiteSettings();

    // Default fallbacks matching original component text
    const subtitle = siteSettings?.location_subtitle || 'Find Your Sanctuary';
    const title = siteSettings?.location_title || 'Visit Our <br />\n<span class="text-brand-violet italic">Kitchen.</span>';
    const address = siteSettings?.location_address || 'Profound + Kitchen<br />26-B Sct Borromeo, South Triangle, Quezon City';
    const phone = siteSettings?.location_phone || '09062066175';
    const mapTitle = siteSettings?.location_map_title || 'Interactive Map';
    const mapDesc = siteSettings?.location_map_desc || "Located in the heart of South Triangle's culinary district.";
    const btnText = siteSettings?.location_button_text || 'Get Directions';
    const btnUrl = siteSettings?.location_button_url || 'https://maps.app.goo.gl/9ZQXQXQXQXQXQXQX9';

    return (
        <section className="py-24 px-4 bg-white" id="contact">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-brand-violet font-sans font-black uppercase tracking-[0.5em] text-[10px] block">
                                {subtitle}
                            </span>
                            <h2
                                className="text-5xl md:text-6xl font-serif font-black text-brand-black leading-tight tracking-tighter"
                                dangerouslySetInnerHTML={{ __html: title }}
                            />
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-start space-x-6">
                                <div className="bg-brand-violet/10 p-4 rounded-2xl flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-brand-violet" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-widest">Our Address</h4>
                                    <p
                                        className="text-lg font-sans font-bold text-brand-black leading-tight"
                                        dangerouslySetInnerHTML={{ __html: address }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="bg-brand-black/5 p-4 rounded-2xl flex-shrink-0">
                                    <Clock className="w-6 h-6 text-brand-black" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-widest">Store Hours</h4>
                                    <div className="grid grid-cols-1 gap-y-2 font-sans font-medium text-sm text-gray-500">
                                        {storeHours.map((entry, index) => (
                                            <div key={index} className="flex justify-between w-full max-w-sm">
                                                <span className="font-sans font-black text-brand-black uppercase text-[10px]">{entry.label}</span>
                                                <span>{entry.hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="bg-brand-violet/10 p-4 rounded-2xl flex-shrink-0">
                                    <Phone className="w-6 h-6 text-brand-violet" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-widest">Viber / Mobile</h4>
                                    <p className="text-lg font-sans font-bold text-brand-black">{phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 bg-brand-violet/5 rounded-[40px] transition-all group-hover:bg-brand-violet/10" />
                        <div className="relative aspect-video lg:aspect-square bg-gray-50 rounded-[32px] overflow-hidden border-8 border-white shadow-2xl flex flex-col items-center justify-center p-12 text-center group">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 group-hover:scale-110 transition-transform mb-6">
                                <MapPin className="w-10 h-10 text-brand-violet" />
                            </div>
                            <h3 className="text-xl font-serif font-black text-brand-black mb-2">{mapTitle}</h3>
                            <p className="text-sm text-gray-400 font-sans font-medium">{mapDesc}</p>
                            <a
                                href={btnUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 text-[10px] font-sans font-black uppercase tracking-[0.3em] text-brand-violet hover:tracking-[0.5em] transition-all"
                            >
                                {btnText}
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LocationSection;
