import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';
import { useStoreHours } from '../hooks/useStoreHours';

export const StoreClosedPopup: React.FC<{ forceShow?: boolean; onClose?: () => void }> = ({ forceShow = false, onClose }) => {
    const { isStoreOpen, openingTime, closingTime } = useStoreHours();
    const [isDismissed, setIsDismissed] = useState(false);

    // If store is open and not forced to show for testing, do not render
    if ((isStoreOpen && !forceShow) || isDismissed) return null;

    const handleClose = () => {
        setIsDismissed(true);
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 bg-brand-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-500">
            <div
                className="bg-brand-black rounded-[24px] shadow-2xl max-w-md w-full p-8 md:p-10 text-center relative border border-white/10 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-brand-violet rounded-full p-2"
                    aria-label="Close popup"
                    title="Close popup"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="w-20 h-20 bg-brand-violet/20 rounded-full flex items-center justify-center mb-8 text-brand-violet ring-8 ring-brand-violet/5">
                    <Clock className="w-10 h-10" />
                </div>

                <h3 className="text-3xl font-black font-heading tracking-tight text-white mb-4 uppercase">
                    We're Taking <br /> a Break
                </h3>

                <p className="text-sm font-sans text-gray-400 mb-8 leading-relaxed max-w-[280px]">
                    We can't accept new orders right now. Please come back during our normal operating hours to enjoy our meals!
                </p>

                <div className="bg-white/5 w-full p-8 rounded-2xl border border-white/10 mb-8 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-violet/5 blur-2xl"></div>
                    <h4 className="relative text-[10px] font-sans font-black uppercase tracking-[0.4em] text-brand-violet mb-6">
                        Operating Hours
                    </h4>
                    <div className="relative flex flex-col items-center justify-center gap-2">
                        <span className="text-5xl font-black font-heading tracking-tighter text-white">
                            {openingTime}
                        </span>
                        <span className="text-brand-violet font-black font-sans my-2">—</span>
                        <span className="text-5xl font-black font-heading tracking-tighter text-white">
                            {closingTime}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleClose}
                    className="w-full bg-brand-violet hover:bg-white hover:text-brand-black text-white px-8 py-5 rounded-full font-sans font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300"
                >
                    Got It
                </button>
            </div>
        </div>
    );
};

export default StoreClosedPopup;
