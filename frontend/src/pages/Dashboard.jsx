import React, { useState, useEffect } from 'react';

import api from '../utils/api';
import { Search, MapPin, Bike, CheckCircle, ShieldCheck, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const resultsRef = React.useRef(null);

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
    const [sortBy, setSortBy] = useState('name');

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

    const handleSearchWithScroll = async () => {
        await fetchVehicles(city, area, activeTab);
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Update results instantly when tab changes or area changes
    useEffect(() => {
        if (city) fetchVehicles(city, area, activeTab);
    }, [activeTab, city, area]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-sans">

            <header
                className="relative py-20 px-8 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between"
                style={{
                    backgroundImage: "linear-gradient(to right, rgba(29, 78, 216, 0.9), rgba(49, 46, 129, 0.8)), url('/dashboard-hero.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="relative z-10 text-white w-full md:w-1/2 pr-8 mb-8 md:mb-0">
                    <h1 className="text-4xl font-black mb-3 tracking-tight">Book a Ride</h1>
                    <p className="text-blue-50 text-base font-medium max-w-sm">Find premium bikes and EVs in your area instantly.</p>
                </div>

                {/* Floating Search Box adapted for Blue theme */}
                <div className="relative z-20 bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden mt-8 md:mt-0 text-gray-900 border border-gray-100">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {['Electric Bikes', 'Commute Bikes', 'Premium Bikes'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-2 transition-colors ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-800 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Bike className={`w-5 h-5 ${activeTab === tab ? 'text-blue-600' : 'text-gray-400'}`} />
                                {tab.replace(' ', '\n')}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <div className="p-6 space-y-5">
                        {/* Location */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Location</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select
                                        value={city}
                                        onChange={(e) => { setCity(e.target.value); setArea(''); }}
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 font-medium text-gray-700"
                                    >
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Mumbai">Mumbai</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative flex-1">
                                    <select
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 bg-gray-50 font-medium text-gray-700"
                                        disabled={availableAreas.length === 0}
                                    >
                                        <option value="">Select Area</option>
                                        {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Pickup */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Pickup</label>
                            <div className="flex gap-2">
                                <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-gray-700 font-medium" />
                                <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-gray-700 font-medium" />
                            </div>
                        </div>

                        {/* Drop */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Drop</label>
                            <div className="flex gap-2">
                                <input type="date" value={dropDate} onChange={e => setDropDate(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-gray-700 font-medium" />
                                <input type="time" value={dropTime} onChange={e => setDropTime(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-gray-700 font-medium" />
                            </div>
                        </div>

                        <button
                            onClick={handleSearchWithScroll}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95 mt-2 text-sm uppercase tracking-wider"
                        >
                            Search your ride
                        </button>
                    </div>
                </div>
            </header>

            {/* AVAILABLE RIDES GRID */}
            <section className="pt-8" ref={resultsRef}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 px-2 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-1">Available Rides</h2>
                        <p className="text-gray-500 font-medium">Explore our full fleet of premium vehicles</p>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Sort By</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-transparent text-sm font-bold text-gray-700 outline-none pr-8 pl-1 cursor-pointer"
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="popularity">Popularity</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
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
                        {[...vehicles].sort((a, b) => {
                            if (sortBy === 'price_asc') return (a.basePricePerHour * 24) - (b.basePricePerHour * 24);
                            if (sortBy === 'price_desc') return (b.basePricePerHour * 24) - (a.basePricePerHour * 24);
                            if (sortBy === 'name') return a.name.localeCompare(b.name);
                            return 0;
                        }).map((vehicle) => (
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
                                        {user && (
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm uppercase tracking-wider flex items-center gap-1 ${vehicle.isCurrentlyAvailable !== false
                                                ? "bg-emerald-500 text-white"
                                                : "bg-red-500 text-white"
                                                }`}>
                                                {vehicle.isCurrentlyAvailable !== false ? (
                                                    <><ShieldCheck className="w-3 h-3" /> Available</>
                                                ) : (
                                                    <><AlertCircle className="w-3 h-3" /> Occupied</>
                                                )}
                                            </span>
                                        )}
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
                                            onClick={() => setSelectedVehicle(vehicle)}
                                            disabled={vehicle.isCurrentlyAvailable === false}
                                            className={`w-full py-3.5 font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${user && vehicle.isCurrentlyAvailable === false
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                                                }`}
                                        >
                                            {vehicle.isCurrentlyAvailable === false ? "Currently Rented" : "Check Availability"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── PROMO + BRANDED SECTION ── */}
            <div className="mt-16 space-y-0">

                {/* Promo Card */}
                <div className="bg-blue-50 rounded-[2.5rem] p-10 flex items-center justify-between gap-10 border border-blue-100 shadow-sm">
                    <div className="space-y-4 max-w-sm">
                        <h3 className="text-3xl font-black text-gray-900 leading-snug">
                            Book your ride in <em className="not-italic text-blue-600">minutes,</em><br />
                            zero hassle. Zero hidden charges.
                        </h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">Cancel anytime. Instant confirmation on every booking. Find the best bikes near you.</p>
                        <button
                            onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className="mt-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                        >
                            Search rides ↗
                        </button>
                    </div>

                    {/* Ticket-style badge */}
                    <div className="flex-shrink-0 relative">
                        <div className="w-44 h-28 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl flex flex-col items-center justify-center shadow-2xl shadow-blue-500/30 border-2 border-blue-400/30 relative overflow-hidden">
                            {/* Ticket notches */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-50 rounded-full -translate-x-1/2 border-r border-blue-400/20" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-50 rounded-full translate-x-1/2 border-l border-blue-400/20" />
                            <svg className="w-10 h-10 text-white/90 mb-1" fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth="2">
                                <path d="M8 44H56M8 20H56M14 20V44M50 20V44" strokeLinecap="round" />
                                <ellipse cx="32" cy="32" rx="10" ry="6" fill="white" fillOpacity="0.15" />
                                <circle cx="32" cy="32" r="4" fill="white" fillOpacity="0.5" />
                            </svg>
                            <span className="text-white text-xs font-black tracking-widest uppercase">Ride Pass</span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-emerald-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                            INSTANT
                        </div>
                    </div>
                </div>

                {/* Branded Hashtag Section */}
                <div className="relative overflow-hidden bg-gray-50 rounded-b-[2.5rem] pt-14 pb-16 px-10 border border-t-0 border-gray-100">
                    {/* Watermark transport icons */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none flex flex-wrap gap-10 p-6 overflow-hidden">
                        {[...Array(12)].map((_, i) => (
                            <svg key={i} className="w-24 h-24 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth="1.2">
                                {i % 3 === 0 ? (
                                    // Bike
                                    <>
                                        <circle cx="16" cy="44" r="8" /><circle cx="48" cy="44" r="8" />
                                        <path d="M16 44L24 24H40L48 44M24 24L32 36M32 36L40 24M32 36L32 44" strokeLinecap="round" />
                                    </>
                                ) : i % 3 === 1 ? (
                                    // Map pin
                                    <>
                                        <path d="M32 8C23.2 8 16 15.2 16 24C16 35 32 56 32 56C32 56 48 35 48 24C48 15.2 40.8 8 32 8Z" />
                                        <circle cx="32" cy="24" r="6" />
                                    </>
                                ) : (
                                    // Key / shield
                                    <>
                                        <path d="M32 8L38 20H52L42 28L46 42L32 34L18 42L22 28L12 20H26L32 8Z" />
                                    </>
                                )}
                            </svg>
                        ))}
                    </div>

                    {/* Text */}
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-6xl font-black text-gray-200 tracking-tight italic">#BikeRentPro</h2>
                        <div className="space-y-2">
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-2">🇮🇳 Made in Bengaluru</p>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-2">❤️ Crafted by Gaurav</p>
                        </div>
                    </div>
                </div>
            </div>

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

export default Dashboard;
