import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bike, History, User, LogOut, ShieldCheck, Menu, X, UserPlus, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileDrawer from './ProfileDrawer';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                            <Bike className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-black text-gray-900 tracking-tight">BikeRent<span className="text-blue-600">Pro</span></span>
                    </NavLink>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`
                            }
                        >
                            Rent a Bike
                        </NavLink>
                        <NavLink
                            to="/my-bookings"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`
                            }
                        >
                            My Bookings
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`
                            }
                        >
                            About Us
                        </NavLink>
                        <NavLink
                            to="/blog"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`
                            }
                        >
                            Blog
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`
                            }
                        >
                            Contact
                        </NavLink>
                        {user?.role === 'admin' && (
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`
                                }
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Admin
                            </NavLink>
                        )}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setProfileOpen(true)}
                                    className="flex items-center gap-3 px-3 py-1.5 bg-white/50 rounded-full border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all group shadow-sm"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                                        {user?.avatar ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}${user.avatar}`}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            user?.name?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    <div className="text-left pr-2">
                                        <p className="text-[11px] font-black text-gray-900 leading-tight flex items-center gap-1 uppercase tracking-widest">
                                            {user?.name || 'User'}
                                            <ChevronDown className="w-3 h-3 text-gray-400" />
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-bold">₹{user?.walletBalance || 0}</p>
                                    </div>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="flex items-center gap-2 px-6 py-2.5 border-2 border-blue-600 text-blue-600 text-[13px] font-bold uppercase tracking-wider rounded-full hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
                                >
                                    <User className="w-4 h-4" />
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-[13px] font-bold uppercase tracking-wider rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Sign Up
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 space-y-1">
                        <NavLink to="/" onClick={() => setMobileOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            Rent a Bike
                        </NavLink>
                        <NavLink to="/my-bookings" onClick={() => setMobileOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            My Bookings
                        </NavLink>
                        <NavLink to="/about" onClick={() => setMobileOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            About Us
                        </NavLink>
                        <NavLink to="/blog" onClick={() => setMobileOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            Blog
                        </NavLink>
                        <NavLink to="/contact" onClick={() => setMobileOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            Contact
                        </NavLink>
                        {user?.role === 'admin' && (
                            <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                                Admin Stats
                            </NavLink>
                        )}
                        <div className="pt-3 border-t border-gray-100">
                            {user ? (
                                <div className="flex items-center justify-between px-4 py-3">
                                    <button
                                        onClick={() => { setProfileOpen(true); setMobileOpen(false); }}
                                        className="flex items-center gap-2 text-left"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                                            {user?.avatar ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}${user.avatar}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                user?.name?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                                {user?.name || 'User'}
                                                <ChevronDown className="w-3 h-3 text-gray-400" />
                                            </p>
                                            <p className="text-xs text-gray-500">₹{user?.walletBalance || 0}</p>
                                        </div>
                                    </button>
                                    <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <NavLink to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-center border-2 border-blue-600 text-blue-600 text-sm font-bold rounded-xl">
                                        Login
                                    </NavLink>
                                    <NavLink to="/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-center bg-blue-600 text-white text-sm font-bold rounded-xl">
                                        Sign Up
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Profile Drawer */}
            <ProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </nav>
    );
};

export default Navbar;
