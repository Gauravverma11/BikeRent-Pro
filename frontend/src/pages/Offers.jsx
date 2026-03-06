import React, { useState, useEffect } from 'react';
import { Tag, Ticket, Clock, Zap, CheckCircle, Copy, Loader2, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const Offers = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await api.get('/coupons');
                setCoupons(res.data.data.coupons);
            } catch (err) {
                console.error('Error fetching coupons:', err);
                // Fallback dummy data if API fails or is empty
                setCoupons([
                    { code: 'WELCOME50', discountType: 'percentage', discountAmount: 50, minPurchase: 500, expiry: '2025-12-31' },
                    { code: 'RIDER20', discountType: 'percentage', discountAmount: 20, minPurchase: 0, expiry: '2025-12-31' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, []);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Code ${code} copied!`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-20 font-sans">
            {/* Hero */}
            <header className="relative py-24 px-10 bg-gray-950 rounded-[3rem] overflow-hidden text-white border border-white/5 shadow-2xl">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full translate-x-1/3 translate-y-1/3 blur-[120px]"></div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-6">
                        <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Exclusive Deals</span>
                    </div>
                    <h1 className="text-6xl font-black mb-6 tracking-tighter leading-tight uppercase italic">
                        Unbeatable <span className="text-blue-500">Offers</span> & Promotions.
                    </h1>
                    <p className="text-lg text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        Fuel your adventure with our exclusive rental deals and seasonal discounts.
                    </p>
                </div>
            </header>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                ) : (
                    coupons.map((coupon, i) => (
                        <div key={i} className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden flex flex-col justify-between">
                            {/* Decorative Cutout (Voucher style) */}
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full border border-gray-100 shadow-inner"></div>
                            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full border border-gray-100 shadow-inner"></div>

                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100/50">
                                        <Ticket className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-gray-900 leading-none">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `₹${coupon.discountAmount}`}
                                        </p>
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">OFF</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {coupon.code === 'WELCOME50' ? 'First Ride Special' : 'Seasonal Discount'}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium mb-6">
                                    Valid on all {coupon.minPurchase > 0 ? `rentals above ₹${coupon.minPurchase}` : 'bookings'}. Limited time only.
                                </p>
                            </div>

                            <div className="pt-6 border-t border-dashed border-gray-200 mt-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Expires {new Date(coupon.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(coupon.code)}
                                    className="w-full bg-gray-50 border border-gray-100 text-gray-900 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-between group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                                >
                                    <span>{coupon.code}</span>
                                    <Copy className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* Upcoming/Referral Static Card */}
                <div className="group relative bg-gray-950 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden flex flex-col justify-between text-white lg:col-span-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>

                    <div>
                        <div className="w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                            <Zap className="w-7 h-7 text-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Refer & <span className="text-blue-500">Earn</span></h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                            Share your referral code with friends and get ₹100 credit for every successful rental they complete.
                        </p>
                    </div>

                    <div className="mt-8">
                        <button className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-colors">
                            Invite Now <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Loyalty Program Teaser */}
            <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-xl shadow-blue-500/5 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Join the Pro Club</h2>
                    <p className="text-gray-500 font-medium max-w-xl mx-auto mb-8 leading-relaxed">
                        Become a member of our exclusive loyalty program to unlock early access to new bikes, zero security deposit, and premium roadside assistance.
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm uppercase tracking-widest border border-blue-100">
                        Coming Soon
                    </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-50 rounded-full blur-[80px]"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full blur-[80px]"></div>
            </div>

            <Footer />
        </div>
    );
};

export default Offers;
