import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CreditCard, ChevronRight, CheckCircle2, XCircle, AlertCircle, TrendingUp, History, ShoppingBag } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/my');
            setBookings(res.data.data.bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Spending Statistics
    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const paidBookings = bookings.filter(b => b.status === 'paid');

        return {
            totalSpend: paidBookings.reduce((sum, b) => sum + (b.finalAmount || 0), 0),
            monthlySpend: paidBookings
                .filter(b => {
                    const d = new Date(b.startTime);
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                })
                .reduce((sum, b) => sum + (b.finalAmount || 0), 0),
            yearlySpend: paidBookings
                .filter(b => new Date(b.startTime).getFullYear() === currentYear)
                .reduce((sum, b) => sum + (b.finalAmount || 0), 0),
            count: paidBookings.length
        };
    }, [bookings]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-50 text-green-700 border-green-100';
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <CheckCircle2 className="w-4 h-4" />;
            case 'pending': return <AlertCircle className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 font-sans">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">My Bookings</h1>
                    <p className="text-gray-500 font-medium">Track your personal rental history and expenses.</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 flex flex-col items-center min-w-[180px] border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Wallet Balance</span>
                    <span className="text-3xl font-black">₹{user?.walletBalance || 0}</span>
                </div>
            </header>

            {/* Spending Calculator Tool */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">Monthly</span>
                    </div>
                    <div>
                        <span className="text-2xl font-black text-gray-900 block">₹{stats.monthlySpend}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Spent this month</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-tighter">Yearly</span>
                    </div>
                    <div>
                        <span className="text-2xl font-black text-gray-900 block">₹{stats.yearlySpend}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Spent this year</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <div className="w-5 h-5 text-emerald-600 flex items-center justify-center font-black">₹</div>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">All Time</span>
                    </div>
                    <div>
                        <span className="text-2xl font-black text-gray-900 block">₹{stats.totalSpend}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total lifetime spend</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 rounded-2xl">
                            <History className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">Bookings</span>
                    </div>
                    <div>
                        <span className="text-2xl font-black text-gray-900 block">{stats.count}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total rides booked</span>
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-100 rounded-[2rem] animate-pulse"></div>)}
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                            <div className="md:w-56 h-40 bg-gray-50 flex items-center justify-center p-4">
                                {booking.vehicleId?.images?.[0] ? (
                                    <img src={booking.vehicleId.images[0]} alt={booking.vehicleId.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <Bike className="w-12 h-12 text-gray-200" />
                                )}
                            </div>
                            <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.vehicleId?.name}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(booking.startTime).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {booking.hours} hours
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="block text-xl font-bold text-gray-900">₹{booking.finalAmount}</span>
                                        <span className="text-xs text-gray-500">Total Paid</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        {booking.status.toUpperCase()}
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {bookings.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">You haven't booked any rides yet. Ready to experience the thrill?</p>
                            <Link to="/dashboard" className="inline-block px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 uppercase tracking-widest text-xs">
                                Start Your First Journey
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
