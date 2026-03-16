import React from 'react';

interface StepIndicatorProps {
    currentStep: 1 | 2 | 3 | 4;
}

const steps = [
    { number: 1, label: 'MENU' },
    { number: 2, label: 'ORDER' },
    { number: 3, label: 'CONFIRM' },
    { number: 4, label: 'ENJOY' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    return (
        <div className="bg-white border-b border-violet-100 px-4 py-3 flex justify-center shadow-sm">
            <div className="flex items-center space-x-4 md:space-x-8">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex items-center space-x-2">
                            <span
                                className={`text-[9px] font-black uppercase tracking-[0.3em] font-montserrat transition-colors duration-300 ${currentStep >= step.number ? 'text-[#7F00FF]' : 'text-violet-200'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="h-px w-4 bg-violet-100" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;
