import React, { useState } from 'react';
import { MessageCircle, X, Phone, Mail, MessageSquare, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CustomerSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Hide on Login and Signup pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
        return null;
    }

    const options = [
        {
            icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
            label: 'Contact Us',
            sub: 'Send us a message',
            action: () => { navigate('/contact'); setIsOpen(false); }
        },
        {
            icon: <Phone className="w-5 h-5 text-emerald-600" />,
            label: 'Call Us',
            sub: '+91 87198 34667',
            action: () => window.open('tel:+918719834667')
        },
        {
            icon: <Mail className="w-5 h-5 text-indigo-600" />,
            label: 'Email Us',
            sub: 'support@bikerentpro.in',
            action: () => window.open('mailto:support@bikerentpro.in')
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Panel */}
            {isOpen && (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-72 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-black text-sm">BikeRent Pro Support</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                    <p className="text-blue-100 text-xs font-medium">We're here to help</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="p-3 space-y-2">
                        {options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={opt.action}
                                className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all group text-left"
                            >
                                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    {opt.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                                    <p className="text-xs text-gray-500 truncate">{opt.sub}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-4 text-center">
                        <p className="text-[10px] text-gray-400 font-semibold">Avg. response time: &lt; 1 hour</p>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95 ${isOpen
                    ? 'bg-gray-800 shadow-gray-900/30'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-110'
                    }`}
            >
                {isOpen
                    ? <X className="w-6 h-6 text-white" />
                    : <MessageCircle className="w-6 h-6 text-white" />
                }
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>
        </div>
    );
};

export default CustomerSupport;
