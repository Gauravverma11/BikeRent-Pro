import React from 'react';
import { Briefcase, Search, AlertCircle, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

const Careers = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-20 font-sans min-h-[60vh] flex flex-col justify-between">
            <div className="flex-1 space-y-20">
                {/* Hero */}
                <header className="relative py-24 px-10 bg-gray-950 rounded-[3rem] overflow-hidden text-white border border-white/5 shadow-2xl">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full translate-x-1/3 translate-y-1/3 blur-[120px]"></div>

                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-6xl font-black mb-6 tracking-tighter leading-tight uppercase italic text-blue-500">
                            Build the <span className="text-white">Future</span> of Mobility.
                        </h1>
                        <p className="text-lg text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                            Join our mission to revolutionize urban transport in India.
                        </p>
                    </div>
                </header>

                {/* Search & Filter (Static) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-gray-100">
                    <div className="relative group max-w-md w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search roles (e.g. Engineer, Marketing)"
                            disabled
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 outline-none font-medium text-gray-400 placeholder:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 opacity-50 grayscale cursor-not-allowed">
                        {['All Departments', 'Engineering', 'Operations', 'Design', 'Marketing'].map(cat => (
                            <button
                                key={cat}
                                disabled
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gray-50 text-gray-400`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-700">
                    <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8 border border-blue-100/50 shadow-inner">
                        <Briefcase className="w-10 h-10 text-blue-600 opacity-60" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">No Openings Right Now</h2>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed italic">
                        "We are currently at full throttle, but we're always looking for exceptional talent."
                    </p>
                    <div className="inline-flex items-center gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 pr-6">
                        <div className="bg-white px-4 py-2 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest border border-gray-100">Tip</div>
                        <p className="text-xs font-bold text-gray-500">Check back in a few weeks or follow us on LinkedIn!</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Careers;
