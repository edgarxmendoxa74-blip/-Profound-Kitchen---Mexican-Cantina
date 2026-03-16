import React from 'react';
import Slideshow from './Slideshow';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeroProps {
  onEventsClick: () => void;
  onFeedbackClick: () => void;
  onContactClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEventsClick, onFeedbackClick, onContactClick }) => {
  const { siteSettings } = useSiteSettings();
  const subtitle = siteSettings?.hero_subtitle || "Vibrant flavors, authentic Mexican vibes, and the best culinary experience in South Triangle.";

  return (
    <div className="bg-white pt-10 md:pt-24 pb-12 md:pb-24 px-4 overflow-hidden border-b border-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left Side: Content */}
        <div className="text-center lg:text-left space-y-0 md:space-y-10 animate-fade-in-left order-last lg:order-first">
          <div className="space-y-0 md:space-y-8">
            <div className="space-y-4">
              <span className="hidden md:block text-brand-violet font-accent font-normal uppercase tracking-[0.4em] text-[11px] md:text-[12px] mb-4">
                {subtitle}
              </span>
              <h1 className="hidden md:block text-5xl md:text-7xl lg:text-9xl font-heading font-black text-brand-black leading-[0.85] tracking-tighter">
                Profound<br />
                <span className="text-brand-violet">+Kitchen.</span>
              </h1>
            </div>

            {/* Mobile-Only CTA Buttons */}
            <div className="flex flex-col gap-3 md:hidden px-4">
              <button
                onClick={onEventsClick}
                className="w-full py-4 bg-brand-violet text-white text-[12px] font-accent font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-brand-violet/20 hover:scale-[1.02] active:scale-95 active:shadow-sm transition-all duration-200"
              >
                📅 Book an Event
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onFeedbackClick}
                  className="py-4 bg-green-500 text-white border-none text-[12px] font-accent font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 active:shadow-sm transition-all duration-200"
                >
                  💬 Feedback
                </button>
                <button
                  onClick={onContactClick}
                  className="py-4 bg-brand-black text-white text-[12px] font-accent font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-95 active:shadow-sm transition-all duration-200"
                >
                  ✉️ Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Slideshow Banner */}
        <div className="relative animate-fade-in-right order-first lg:order-last">
          <div className="absolute -inset-12 bg-brand-violet/5 blur-[120px] rounded-full opacity-60" />
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border-8 border-white bg-white">
            <Slideshow />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
