import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, dispatch } = useAuth();
    const navigate = useNavigate();
    const [showLocationSelect, setShowLocationSelect] = useState(false);
    const [currentCity, setCurrentCity] = useState(user?.preferredCity || 'Bangalore');

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        {/* Bykemania Logo */}
                        <div className="bg-[#8b5a2b] w-48 h-16 rounded-lg flex items-center justify-center relative overflow-hidden shadow-sm">
                            <div className="absolute inset-0 border-2 border-[#fff0d4] rounded-lg m-1"></div>
                            <div className="text-center">
                                <div className="text-[#fff0d4] font-black tracking-widest text-2xl uppercase font-serif drop-shadow-md">BYKEMANIA</div>
                            </div>
                        </div>
                    </div>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/faq" className="text-gray-500 hover:text-gray-900 font-semibold transition-colors text-sm uppercase tracking-wide">FAQ</Link>
                        <Link to="/tariff" className="text-gray-500 hover:text-gray-900 font-semibold transition-colors text-sm uppercase tracking-wide">Tariff</Link>
                        <Link to="/contact" className="text-gray-500 hover:text-gray-900 font-semibold transition-colors text-sm uppercase tracking-wide">Contact Us</Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-6">

                        {/* Call Info */}
                        <div className="hidden lg:block text-right">
                            <a href="tel:+918880570570" className="text-[#ff8c00] font-black text-sm hover:underline tracking-wider">+91 8880-570-570</a>
                        </div>

                        {/* Location Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLocationSelect(!showLocationSelect)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded text-gray-700 hover:border-[#ff8c00] transition-colors bg-white font-medium text-sm"
                            >
                                <MapPin className="w-4 h-4 text-[#ff8c00]" />
                                {currentCity}
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {showLocationSelect && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                    {['Bangalore', 'Delhi', 'Mumbai', 'Pune'].map(city => (
                                        <button
                                            key={city}
                                            onClick={() => {
                                                setCurrentCity(city);
                                                setShowLocationSelect(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ff8c00] transition-colors"
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Auth Button */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="text-gray-900 font-bold hover:text-[#0eb779] transition-colors text-sm uppercase tracking-wide">Dashboard</Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-[#0eb779] text-white px-8 py-2.5 rounded hover:bg-[#0b9c66] transition-colors shadow-sm font-bold text-sm tracking-wide"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-[#0eb779] text-white px-8 py-2.5 rounded hover:bg-[#0b9c66] transition-colors shadow-sm font-bold text-sm tracking-wide"
                            >
                                Login
                            </Link>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
