import React, { useState } from 'react';
import { Calendar, Users, Clock, Utensils } from 'lucide-react';

const ReservationSection: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        guests: '2',
        date: '',
        time: ''
    });

    return (
        <section className="py-24 px-4 bg-brand-black text-white overflow-hidden relative">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-violet/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-violet/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-brand-violet font-sans font-black uppercase tracking-[0.5em] text-[10px] block">
                                Exclusive Access
                            </span>
                            <h2 className="text-5xl md:text-6xl font-serif font-black text-white leading-tight tracking-tighter">
                                Reserve Your <br />
                                <span className="text-brand-violet italic">Moment.</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 font-sans font-medium text-lg leading-relaxed border-l-4 border-brand-violet pl-6">
                            Skip the wait and secure your place at the kitchen. We craft experiences, not just meals.
                        </p>

                        <div className="flex items-center space-x-6 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-black bg-brand-violet flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-gray-400">
                                Join <span className="text-white">+500</span> Happy Diners
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-gray-100">
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-sans font-black text-gray-400 uppercase tracking-widest flex items-center">
                                        <Users className="w-3 h-3 mr-2 text-brand-violet" /> Number of Guests
                                    </label>
                                    <select
                                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-sans font-bold text-brand-black focus:border-brand-violet transition-colors outline-none text-sm appearance-none"
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                        title="Number of Guests"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                            <option key={n} value={n}>{n} Persons</option>
                                        ))}
                                        <option value="large">Large Party (9+)</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-sans font-black text-gray-400 uppercase tracking-widest flex items-center">
                                        <Calendar className="w-3 h-3 mr-2 text-brand-violet" /> Select Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-sans font-bold text-brand-black focus:border-brand-violet transition-colors outline-none text-sm"
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        title="Select Date"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-sans font-black text-gray-400 uppercase tracking-widest flex items-center">
                                    <Clock className="w-3 h-3 mr-2 text-brand-violet" /> Preferred Time
                                </label>
                                <select
                                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-sans font-bold text-brand-black focus:border-brand-violet transition-colors outline-none text-sm appearance-none"
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    title="Preferred Time"
                                >
                                    <option>Select Time Slot</option>
                                    <option>11:00 AM - 1:00 PM</option>
                                    <option>5:00 PM - 7:00 PM</option>
                                    <option>9:00 PM - 11:00 PM</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                className="group relative w-full bg-brand-violet text-white py-5 rounded-xl font-sans font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-brand-deep shadow-2xl shadow-violet-900/20 active:scale-[0.98]"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative flex items-center justify-center space-x-3">
                                    <Utensils className="w-4 h-4" />
                                    <span>Confirm Reservation</span>
                                </span>
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ReservationSection;
