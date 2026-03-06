import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, MapPin, Bike, CheckCircle, ShieldCheck, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search State
    const [activeTab, setActiveTab] = useState('Commute Bikes');
    const [city, setCity] = useState('Bangalore');
    const [area, setArea] = useState('');
    const [availableAreas, setAvailableAreas] = useState([]);
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [dropDate, setDropDate] = useState('');
    const [dropTime, setDropTime] = useState('');

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const { user } = useAuth();
    const [expandedFaq, setExpandedFaq] = useState(0);
    const navigate = useNavigate();

    // Redirect logged-in users to the real app interface
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // Initial Fetch for Bangalore
    useEffect(() => {
        fetchVehicles('Bangalore');
    }, []);

    // Fetch vehicles from API
    const fetchVehicles = async (searchCity = city, searchArea = area, searchType = activeTab) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchCity) params.append('city', searchCity);
            if (searchArea) params.append('area', searchArea);

            // Map UI tabs to backend Vehicle schema 'type' enum: ['EV', 'Petrol']
            if (searchType === 'Electric Bikes') params.append('type', 'EV');
            else if (searchType === 'Commute Bikes') params.append('type', 'Petrol');
            // For 'Premium Bikes', we'll just not filter by type since there's no 'premium' enum.

            const res = await api.get(`/vehicles?${params.toString()}`);
            setVehicles(res.data.data.vehicles);

            if (searchCity) {
                const allRes = await api.get(`/vehicles?city=${searchCity}`);
                const areas = [...new Set(allRes.data.data.vehicles.map(v => v.area))];
                setAvailableAreas(areas);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!user && city && area && pickupDate && pickupTime && dropDate && dropTime) {
            navigate('/login');
            return;
        }
        fetchVehicles(city, area, activeTab);
    };

    // Update results instantly when tab changes
    useEffect(() => {
        if (city) fetchVehicles(city, area, activeTab);
    }, [activeTab, city]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-sans">

            <header className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex flex-col md:flex-row border border-gray-100 min-h-[640px] mt-2 group">
                {/* Left side (Text + Form) */}
                <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center relative z-10 order-2 md:order-1">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter text-gray-900 leading-[1.1]">
                        Luxury Mobility, <br /><span className="text-blue-600">Simplified.</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-md font-medium mb-12">
                        Find premium bikes and EVs in your area with zero hassle. Experience the ride you deserve.
                    </p>

                    {/* Minimal Search Box */}
                    <div className="relative z-20 bg-white rounded-3xl border border-gray-100 w-full max-w-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            {['Electric Bikes', 'Commute Bikes', 'Premium Bikes'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-5 text-center text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-2 transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                >
                                    <Bike className={`w-5 h-5 ${activeTab === tab ? 'text-white' : 'text-gray-400'}`} />
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Search Form */}
                        <div className="p-8 space-y-6">
                            {/* Location */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Location</label>
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <select
                                            value={city}
                                            onChange={(e) => { setCity(e.target.value); setArea(''); }}
                                            className="w-full border-b-2 border-gray-100 rounded-none pb-3 text-base appearance-none outline-none focus:border-gray-900 transition-colors bg-transparent font-bold text-gray-900 cursor-pointer"
                                        >
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Mumbai">Mumbai</option>
                                        </select>
                                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="relative flex-1">
                                        <select
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            className="w-full border-b-2 border-gray-100 rounded-none pb-3 text-base appearance-none outline-none focus:border-gray-900 disabled:opacity-50 transition-colors bg-transparent font-bold text-gray-900 cursor-pointer"
                                            disabled={availableAreas.length === 0}
                                        >
                                            <option value="">Select Area</option>
                                            {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Pickup */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Pickup</label>
                                    <div className="flex flex-col gap-4">
                                        <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full border-b-2 border-gray-100 rounded-none pb-3 text-sm outline-none focus:border-gray-900 bg-transparent text-gray-900 font-bold" />
                                        <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="w-full border-b-2 border-gray-100 rounded-none pb-3 text-sm outline-none focus:border-gray-900 bg-transparent text-gray-900 font-bold" />
                                    </div>
                                </div>

                                {/* Drop */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Drop</label>
                                    <div className="flex flex-col gap-4">
                                        <input type="date" value={dropDate} onChange={e => setDropDate(e.target.value)} className="w-full border-b-2 border-gray-100 rounded-none pb-3 text-sm outline-none focus:border-gray-900 bg-transparent text-gray-900 font-bold" />
                                        <input type="time" value={dropTime} onChange={e => setDropTime(e.target.value)} className="w-full border-b-2 border-gray-100 rounded-none pb-3 text-sm outline-none focus:border-gray-900 bg-transparent text-gray-900 font-bold" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-gray-900/20 active:scale-95 mt-4 text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                            >
                                <Search className="w-5 h-5" />
                                Find Your Ride
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side (Background Photo - Half Width) */}
                <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full overflow-hidden order-1 md:order-2 bg-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1558980394-0a06c4631733?auto=format&fit=crop&w=1600&q=80"
                        alt="Luxury Motorcycle"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent md:block hidden w-1/3"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent md:hidden block h-1/2 bottom-0 w-full flex"></div>
                </div>
            </header>

            {/* MILESTONES */}
            <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 py-16 px-8 rounded-[2.5rem] shadow-2xl mt-4 overflow-hidden border border-white/5 group">
                {/* Right side (Background Photo - Half Width) */}
                <div className="absolute right-0 top-0 w-1/2 h-full z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-indigo-800/80 to-transparent z-10 w-full"></div>
                    <img
                        src="https://images.unsplash.com/photo-1558980394-0a06c4631733?auto=format&fit=crop&w=1600&q=80"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out mix-blend-overlay opacity-30"
                    />
                    <div className="absolute right-0 top-0 w-full h-full bg-white/5 backdrop-blur-3xl -skew-x-12 translate-x-1/4 z-20"></div>
                </div>

                <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_50px_rgba(255,255,255,0.08)] z-10"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full translate-x-1/3 translate-y-1/3 z-10"></div>
                <Bike className="absolute -top-10 -right-10 w-64 h-64 text-white/5 -rotate-12 pointer-events-none z-10" />

                <div className="relative z-20 flex flex-col items-center gap-12 max-w-5xl mx-auto">
                    <div className="text-center w-full">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Key <span className="text-blue-200">Milestones</span></h2>
                        <p className="text-blue-100/80 text-lg font-medium">Numbers that speak for themselves</p>
                    </div>

                    <div className="flex gap-8 md:gap-16 flex-wrap justify-center w-full">
                        {/* Kms Running */}
                        <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] px-10 py-8 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 min-w-[200px] shadow-2xl group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <svg className="w-10 h-10 text-blue-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <div className="text-white text-5xl font-black tracking-tighter drop-shadow-lg">20<span className="text-blue-400 text-2xl ml-1">M+</span></div>
                                <p className="text-blue-100/60 font-black text-xs mt-3 uppercase tracking-[0.2em] group-hover:text-blue-200 transition-colors">Kms Running</p>
                            </div>
                        </div>

                        {/* Customers */}
                        <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] px-10 py-8 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 min-w-[200px] shadow-2xl group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <svg className="w-10 h-10 text-blue-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <div className="text-white text-5xl font-black tracking-tighter drop-shadow-lg">100<span className="text-blue-400 text-2xl ml-1">K+</span></div>
                                <p className="text-blue-100/60 font-black text-xs mt-3 uppercase tracking-[0.2em] group-hover:text-blue-200 transition-colors">Customers</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] px-10 py-8 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 min-w-[200px] shadow-2xl group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <svg className="w-10 h-10 text-blue-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                </div>
                                <div className="text-white text-5xl font-black tracking-tighter drop-shadow-lg">4.5<span className="text-blue-400 text-2xl ml-1">+</span></div>
                                <p className="text-blue-100/60 font-black text-xs mt-3 uppercase tracking-[0.2em] group-hover:text-blue-200 transition-colors">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CUSTOMER FAVOURITES GRID */}
            <section className="pt-8">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-1">Customer Favourites</h2>
                        <p className="text-gray-500 font-medium">Bikes that are trending this month 🔥</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-gray-100 rounded-[2rem] animate-pulse"></div>)}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No rides found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or searching for another location.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 flex flex-col">
                                <div className="relative h-56 bg-gray-50 overflow-hidden w-full p-6 flex items-center justify-center">
                                    {vehicle.images?.[0] ? (
                                        <img src={vehicle.images[0]} alt={vehicle.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
                                    ) : (
                                        <Bike className="w-16 h-16 text-gray-200" />
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-gray-800 shadow-sm uppercase tracking-wider">
                                            {vehicle.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">{vehicle.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-4">
                                        <MapPin className="w-4 h-4 text-blue-400" />
                                        {vehicle.city}, {vehicle.area}
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Price / Day</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-black text-blue-600">₹{vehicle.basePricePerHour * 24}</span>
                                                </div>
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                <Bike className="w-5 h-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!user) {
                                                    navigate('/login', { state: { message: "Please log in to book a vehicle" } });
                                                } else {
                                                    setSelectedVehicle(vehicle);
                                                }
                                            }}
                                            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Check Availability
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* WHY CHOOSE US SECTION */}
            <section className="py-24 px-8 mt-16 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
                    <div className="md:w-1/3 md:sticky md:top-24">
                        <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Why Choose Us</span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight leading-tight">You Made the <br /><span className="text-blue-600">Right Choice.</span></h2>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            BikeRent Pro was founded with a mission to make bike rentals easy and address India's growing urban mobility challenges. We are proud to offer reliable, hassle-free rental services that empower thousands of commuters with a convenient and affordable way to get around the city.
                        </p>
                    </div>

                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        <div className="p-8 rounded-[2rem] bg-gray-50/50 hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-blue-600 border border-gray-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">Our support team is available round the clock to assist customers with any queries.</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-gray-50/50 hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-blue-600 border border-gray-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Well-Maintained</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">Every bike undergoes a strict quality check before each ride to ensure your safety.</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-gray-50/50 hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all group sm:col-span-2">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-blue-600 border border-gray-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No questions asked refund</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">We ensure customers receive a full refund without any questions asked, providing maximum flexibility.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-20 px-8 bg-blue-50">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-14">
                        <h2 className="text-3xl font-black text-gray-900 mb-3">How It Works –<br />Book Your Ride in Just 3 Easy Steps</h2>
                        <p className="text-gray-500 font-medium text-sm max-w-xl">
                            Renting your dream ride with <span className="font-bold text-blue-600">BikeRent Pro</span> is fast, simple, and completely online. Follow these easy steps and hit the road in no time.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="flex flex-col items-start gap-5">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md border border-blue-100">
                                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="28" cy="28" r="16" stroke="#2563EB" strokeWidth="4" fill="#DBEAFE" />
                                    <path d="M40 40L52 52" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
                                    <circle cx="28" cy="28" r="8" fill="#3B82F6" opacity="0.4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Explore &amp; Select</h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">Browse our wide range of well-maintained bikes and choose the one that best fits your journey and budget.</p>
                            </div>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-start gap-5">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md border border-blue-100">
                                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="10" y="14" width="44" height="36" rx="5" fill="#DBEAFE" stroke="#2563EB" strokeWidth="3" />
                                    <path d="M10 24H54" stroke="#2563EB" strokeWidth="3" />
                                    <circle cx="44" cy="44" r="10" fill="#3B82F6" />
                                    <path d="M40 44L43 47L49 41" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Book &amp; Confirm</h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">Pick your pickup and drop-off dates, confirm your booking details, and make a secure online payment in seconds.</p>
                            </div>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-start gap-5">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md border border-blue-100">
                                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="20" cy="48" rx="8" ry="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="3" />
                                    <ellipse cx="48" cy="48" rx="8" ry="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="3" />
                                    <path d="M12 48H8V36L18 24H44L54 36V48H56" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M28 48H40" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
                                    <path d="M18 24V36H54" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="34" cy="16" r="5" fill="#3B82F6" />
                                    <path d="M34 21V30" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Ride &amp; Enjoy</h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">Collect your bike at the scheduled time and enjoy a smooth, hassle-free ride wherever your destination takes you.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CUSTOMER REVIEWS SECTION */}
            <section className="py-24 px-8 relative overflow-hidden bg-white">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 relative z-10">
                        <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Testimonials</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Rider <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Stories</span></h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-10 relative z-10">
                        {/* Review 1 */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(37,99,235,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center w-full md:w-[320px] lg:w-[350px] group relative md:translate-y-8">
                            <div className="absolute top-8 right-8 text-blue-100 font-serif text-8xl leading-none opacity-50 group-hover:text-blue-200 transition-colors pointer-events-none">"</div>
                            <div className="relative mb-6 z-10">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200" alt="Anita Sharma" className="relative w-24 h-24 rounded-full object-cover border-[3px] border-white shadow-xl group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex text-amber-400 my-2 gap-1 z-10">
                                {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                            </div>
                            <h4 className="font-black text-gray-900 text-xl mb-1 mt-2 z-10">Anita Sharma</h4>
                            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-5 z-10">Verified Rider</p>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium z-10">"Awesome customer service and timely response for every query...!! Would highly recommend Rentelo to everyone in need of two wheelers."</p>
                        </div>

                        {/* Review 2 - Highlighted Center */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(37,99,235,0.2)] hover:shadow-[0_20px_80px_rgba(37,99,235,0.4)] hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center w-full md:w-[320px] lg:w-[360px] group relative z-20">
                            <div className="absolute top-8 right-8 text-white/10 font-serif text-8xl leading-none group-hover:text-white/20 transition-colors pointer-events-none">"</div>
                            <div className="relative mb-6 z-10">
                                <div className="absolute inset-0 bg-white rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" alt="Ashish Rao" className="relative w-28 h-28 rounded-full object-cover border-[4px] border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex text-amber-300 my-2 gap-1 z-10">
                                {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                            </div>
                            <h4 className="font-black text-white text-2xl mb-1 mt-2 z-10">Ashish Rao</h4>
                            <p className="text-blue-200 font-bold text-[10px] uppercase tracking-widest mb-5 z-10">Verified Rider</p>
                            <p className="text-blue-50 text-[15px] leading-relaxed font-medium z-10">"The service was absolutely amazing. The vehicle was really useful and the customer support is equally great. Will surely book again."</p>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(37,99,235,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center w-full md:w-[320px] lg:w-[350px] group relative md:translate-y-8">
                            <div className="absolute top-8 right-8 text-blue-100 font-serif text-8xl leading-none opacity-50 group-hover:text-blue-200 transition-colors pointer-events-none">"</div>
                            <div className="relative mb-6 z-10">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200" alt="Raju Vallapu" className="relative w-24 h-24 rounded-full object-cover border-[3px] border-white shadow-xl group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex text-amber-400 my-2 gap-1 z-10">
                                {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                            </div>
                            <h4 className="font-black text-gray-900 text-xl mb-1 mt-2 z-10">Raju Vallapu</h4>
                            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-5 z-10">Verified Rider</p>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium z-10">"It was my first experience, I took bike from this end. Bike condition was fine. Those bikes are new one's. I was satisfied."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="relative py-24 px-10 bg-[#f0f7ff] w-full overflow-hidden border-t border-b border-blue-100 mt-16">
                {/* Full Width Background Photo with Vertical Fades */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                        src="https://images.unsplash.com/photo-1558981000-f294a6ed32b2?auto=format&fit=crop&w=1600&q=80"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply"
                        style={{
                            maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
                        }}
                    />
                    {/* Left/Right Subtle Fade to center focus */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f0f7ff] via-transparent to-[#f0f7ff] opacity-60"></div>
                </div>

                <div className="max-w-6xl mx-auto relative z-30">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Got Questions?</h2>
                        <p className="text-gray-600 font-medium text-lg leading-relaxed max-w-xl mx-auto">
                            Everything you need to know about BikeRent Pro's bike rental services.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start relative px-4">
                        {/* Decorative floating elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                        {[
                            {
                                q: "What documents are required?",
                                a: "Original Hard Copy of Driving License or Passport need to submit as a security measure. This helps ensure the validity and authenticity of the booking.",
                                offset: "md:mt-0"
                            },
                            {
                                q: "What is the Damage Policy?",
                                a: "Any damages incurred during the rental period will be assessed upon return. Minor scratches are covered, but significant damage will be deducted from your security deposit.",
                                offset: "md:mt-24"
                            },
                            {
                                q: "What is the cancellation Policy?",
                                a: "You can cancel your booking up to 24 hours before the pickup time for a full refund. Cancellations made within 24 hours will incur a 50% cancellation fee.",
                                offset: "md:-mt-12"
                            },
                            {
                                q: "What is the Delay Charges?",
                                a: "Late returns are charged at double the hourly rate for every hour past the scheduled drop-off time. Please extend your booking in advance if you need more time.",
                                offset: "md:mt-12"
                            }
                        ].map((faq, idx) => (
                            <div
                                key={idx}
                                className={`bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:-translate-y-2 transition-all duration-500 group relative ${faq.offset}`}
                            >
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-[#f0f7ff] group-hover:bg-blue-600 group-hover:scale-110 transition-all z-10">
                                    ?
                                </div>
                                <h4 className="font-black text-gray-900 text-xl md:text-2xl mb-4 pt-2 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">{faq.q}</h4>
                                <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />

            {selectedVehicle && (
                <BookingModal
                    vehicle={selectedVehicle}
                    onClose={() => setSelectedVehicle(null)}
                    onSuccess={() => {
                        setSelectedVehicle(null);
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 5000);
                    }}
                />
            )}

            {showSuccess && (
                <div className="fixed bottom-10 right-10 bg-gray-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 border border-white/10 backdrop-blur-lg z-50">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="font-black text-sm uppercase tracking-wider">Booking Initiated</p>
                        <p className="text-gray-400 text-xs font-bold">Check your dashboard for updates.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
