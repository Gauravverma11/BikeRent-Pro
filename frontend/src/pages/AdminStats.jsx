import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
    Users, TrendingUp, CreditCard, Bike, ChevronRight, ArrowUpRight, TrendingDown, ShieldCheck, AlertCircle, CheckCircle, XCircle, FileText, Check
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('analytics');

    const [pendingKYC, setPendingKYC] = useState([]);
    const [activeBookings, setActiveBookings] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, kycRes, bookingsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/users/pending-kyc'),
                api.get('/bookings/active')
            ]);
            setStats(statsRes.data.data.stats);
            setPendingKYC(kycRes.data.data.users);
            setActiveBookings(bookingsRes.data.data.bookings);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveKYC = async (id, status) => {
        try {
            await api.patch(`/admin/kyc/${id}`, { kycStatus: status });
            toast.success(`KYC ${status} successfully`);
            setPendingKYC(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            toast.error('Failed to update KYC');
        }
    };

    const handleReturnBike = async (id) => {
        try {
            const res = await api.post(`/bookings/${id}/return`);
            toast.success(`Bike returned! Refund Amount: ₹${res.data.data.refundAmount}`);
            setActiveBookings(prev => prev.filter(b => b._id !== id));
        } catch (err) {
            toast.error('Failed to mark bike as returned');
        }
    };

    const revenueData = {
        labels: stats?.monthlyRevenue.map(m => `Month ${m._id}`) || [],
        datasets: [{
            label: 'Monthly Revenue',
            data: stats?.monthlyRevenue.map(m => m.revenue) || [],
            backgroundColor: 'rgba(37, 99, 235, 0.8)',
            borderRadius: 10,
        }]
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Loading Admin Dashboard...</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto custom-scrollbar">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Command Center</h1>
                    <p className="text-gray-600">Manage operations, approve users, and process bike returns.</p>
                </div>
                <div className="flex bg-gray-100 p-1.5 rounded-xl shadow-inner">
                    <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 font-bold text-sm rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>Overview</button>
                    <button onClick={() => setActiveTab('kyc')} className={`px-4 py-2 font-bold text-sm rounded-lg transition-all flex items-center gap-2 ${activeTab === 'kyc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
                        KYC
                        {pendingKYC.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingKYC.length}</span>}
                    </button>
                    <button onClick={() => setActiveTab('rides')} className={`px-4 py-2 font-bold text-sm rounded-lg transition-all flex items-center gap-2 ${activeTab === 'rides' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
                        Active Rides
                        {activeBookings.length > 0 && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">{activeBookings.length}</span>}
                    </button>
                </div>
            </header>

            {activeTab === 'analytics' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} trend="+12%" trendColor="text-green-600" bg="bg-blue-50" iconColor="text-blue-600" />
                        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={CreditCard} trend="+8%" trendColor="text-green-600" bg="bg-emerald-50" iconColor="text-emerald-600" />
                        <StatCard title="Total Bookings" value={stats.totalBookings} icon={TrendingUp} trend="Active" trendColor="text-blue-600" bg="bg-orange-50" iconColor="text-orange-600" />
                        <StatCard title="Most Popular Bike" value={stats.mostRentedVehicle?.vehicleDetails?.name || 'N/A'} icon={Bike} trend="Top Tier" trendColor="text-purple-600" bg="bg-purple-50" iconColor="text-purple-600" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Revenue Performance</h3>
                            <div className="h-64"><Bar data={revenueData} options={{ maintainAspectRatio: false }} /></div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                            {stats.mostRentedVehicle ? (
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Highest Revenue Driver</p>
                                    <div className="inline-block p-6 bg-blue-50 rounded-full mb-6 relative">
                                        <Bike className="w-16 h-16 text-blue-600" />
                                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">#{stats.mostRentedVehicle.count} Rentouts</div>
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900">{stats.mostRentedVehicle.vehicleDetails.name}</h4>
                                    <p className="text-gray-500">{stats.mostRentedVehicle.vehicleDetails.city} • {stats.mostRentedVehicle.vehicleDetails.type}</p>
                                </div>
                            ) : <p className="text-center text-gray-500">Insufficient data.</p>}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'kyc' && (
                <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-blue-600" /> Pending KYC Approvals
                    </h2>

                    {pendingKYC.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl">
                            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                            <h3 className="text-gray-900 font-bold mb-1">All caught up!</h3>
                            <p className="text-gray-500 text-sm">No pending KYC approvals right now.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingKYC.map(user => (
                                <div key={user._id} className="border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 flex items-center gap-1">
                                                {user.name} <span className="bg-orange-100 text-orange-600 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">Pending</span>
                                            </h3>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{user.documentType || 'Document'}</p>
                                        <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}${user.documentUrl}`} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                                            <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}${user.documentUrl}`} alt="KYC Doc" className="w-full h-32 object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-black shadow-sm uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md">View Full Size</span>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApproveKYC(user._id, 'Verified')} className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button onClick={() => handleApproveKYC(user._id, 'Rejected')} className="flex-1 bg-red-50 text-red-700 hover:bg-red-500 hover:text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'rides' && (
                <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <Bike className="w-6 h-6 text-blue-600" /> Ongoing & Paid Rides
                    </h2>

                    {activeBookings.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl">
                            <Bike className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-gray-900 font-bold mb-1">No active rides</h3>
                            <p className="text-gray-500 text-sm">There are no books currently ongoing.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-y border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <th className="p-4 rounded-tl-xl">Rider Details</th>
                                        <th className="p-4">Vehicle</th>
                                        <th className="p-4">Expected Drop Time</th>
                                        <th className="p-4 rounded-tr-xl">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeBookings.map(b => (
                                        <tr key={b._id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold text-gray-900">{b.userId?.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500">{b.userId?.phone || b.userId?.email}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-bold text-gray-900">{b.vehicleId?.name}</p>
                                                <p className="text-xs text-gray-500 font-mono tracking-wider">{b.vehicleId?.registrationNumber || 'N/A'}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-bold text-gray-900">{new Date(b.endTime).toLocaleString('en-IN')}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {new Date(b.endTime) < new Date() ? (
                                                        <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-md uppercase">Overdue</span>
                                                    ) : (
                                                        <span className="text-[10px] bg-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded-md uppercase">On Time</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <button onClick={() => handleReturnBike(b._id)} className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all">
                                                    Mark Returned
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, trend, trendColor, bg, iconColor }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${bg}`}><Icon className={`w-6 h-6 ${iconColor}`} /></div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${bg} ${trendColor} flex items-center gap-1`}>
                {trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : null}
                {trend}
            </span>
        </div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
    </div>
);

export default AdminStats;
