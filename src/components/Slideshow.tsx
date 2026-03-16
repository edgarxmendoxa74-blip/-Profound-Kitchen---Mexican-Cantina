import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';

// No default AI images allowed. Fallback will be handled in the component.
const defaultImages: string[] = [
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=1200", // Tacos
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200", // Interior
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200", // Cocktails
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200", // Mexican Spread
    "https://images.unsplash.com/photo-1550966842-28c2929e7019?auto=format&fit=crop&q=80&w=1200", // Restaurant Detail
    "https://images.unsplash.com/photo-1626700051175-656a42def4e6?auto=format&fit=crop&q=80&w=1200", // Salsa & Chips
    "https://images.unsplash.com/photo-1583338917451-face2751d8d5?auto=format&fit=crop&q=80&w=1200", // Burrito
    "https://images.unsplash.com/photo-1463183547458-6a2c760d0912?auto=format&fit=crop&q=80&w=1200", // Street Corn
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200", // Atmosphere
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200"  // Kitchen
];

const Slideshow: React.FC = () => {
    const { siteSettings } = useSiteSettings();
    const images = siteSettings?.hero_images && siteSettings.hero_images.length > 0
        ? siteSettings.hero_images
        : defaultImages;

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(timer);
    }, [images.length]);


    return (
        <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden rounded-sm shadow-2xl border border-violet-100 bg-white">
            {/* Fallback/Empty State */}
            {(!images || images.length === 0) && (
                <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden rounded-sm shadow-2xl border border-violet-100 bg-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/50">
                        <div className="relative">
                            <div className="absolute -inset-8 bg-[#7F00FF]/10 blur-2xl rounded-full" />
                            <h2 className="text-5xl font-black text-[#7F00FF] uppercase tracking-tighter font-montserrat animate-pulse">
                                Profound
                            </h2>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#9D00FF] mt-4 font-inter">
                            Est. 2024
                        </p>
                    </div>
                </div>
            )}

            {/* Actual Slideshow */}
            {images && images.length > 0 && (
                <div className="relative group w-full h-[320px] md:h-[400px] overflow-hidden rounded-sm shadow-2xl border border-violet-100">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent" />
                        </div>
                    ))}

                    {/* Dots Navigation */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-20">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    title={`Go to slide ${index + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex
                                        ? 'bg-[#7F00FF] w-6'
                                        : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Slideshow;
