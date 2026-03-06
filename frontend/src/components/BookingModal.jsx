import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, Calendar, Clock, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

const BookingModal = ({ vehicle, onClose, onSuccess }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [walletUsed, setWalletUsed] = useState(0);
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateEstimation = async () => {
        if (!startTime || !endTime) {
            setError('');
            return;
        }
        try {
            // Mock pricing check or real API call for estimation
            const start = new Date(startTime);
            const end = new Date(endTime);
            const hours = Math.ceil((end - start) / (1000 * 60 * 60));

            if (hours <= 0) {
                setError('End time must be after start time');
                setPricing(null);
                return;
            }

            if (hours > 120) {
                setError('Rental duration cannot exceed 5 days (120 hours)');
                setPricing(null);
                return;
            }

            setError('');
            let base = hours * vehicle.basePricePerHour;

            // Mirror backend weekend logic
            const isWeekend = (day) => day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
            let weekendFound = false;
            let tempDate = new Date(start);
            while (tempDate < end) {
                if (isWeekend(tempDate.getDay())) {
                    weekendFound = true;
                    break;
                }
                tempDate.setHours(tempDate.getHours() + 1);
            }

            const weekendMultiplier = vehicle.weekendMultiplier || 1.2;
            if (weekendFound) {
                base *= weekendMultiplier;
            }

            const gst = base * 0.18;
            const deposit = 1000;
            setPricing({
                hours,
                base,
                gst,
                deposit,
                isWeekendPrice: weekendFound,
                weekendMultiplier,
                total: base + gst + deposit
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        calculateEstimation();
    }, [startTime, endTime]);

    const handleBooking = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/bookings', {
                vehicleId: vehicle._id,
                startTime,
                endTime,
                walletBalanceUsed: walletUsed
            });

            const { booking, razorpayOrder } = res.data.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use env var
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "BikeRent Pro",
                description: `Rental for ${vehicle.name}`,
                order_id: razorpayOrder.id,
                handler: function (response) {
                    // Success handled via webhook, but we can redirect or show success
                    onSuccess();
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                },
                theme: {
                    color: "#2563eb",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Book {vehicle.name}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-600 text-white p-4 rounded-xl text-sm font-bold shadow-lg animate-pulse border-2 border-red-400">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Start Time</label>
                            <input
                                type="datetime-local"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">End Time</label>
                            <input
                                type="datetime-local"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>

                    {pricing && (
                        <div className="bg-blue-50 rounded-2xl p-5 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Rental Fee ({pricing.hours} hrs)</span>
                                <span className="font-bold">₹{pricing.base.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">GST (18%)</span>
                                <span className="font-bold">₹{pricing.gst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Security Deposit (Refundable)</span>
                                <span className="font-bold">₹{pricing.deposit}</span>
                            </div>
                            <div className="pt-3 border-t border-blue-100 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total Amount</span>
                                <span className="text-2xl font-black text-blue-600">₹{pricing.total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    {pricing && pricing.isWeekendPrice && (
                        <div className="flex items-start gap-3 p-4 bg-orange-50/80 rounded-2xl border border-orange-200">
                            <div className="font-black text-orange-600 shrink-0 text-xl tracking-tighter">⚡</div>
                            <p className="text-xs text-orange-800 font-medium">
                                <strong className="font-bold uppercase tracking-wide">Dynamic Pricing Applied:</strong> Your schedule includes the weekend (Saturday/Sunday), adding a {(pricing.weekendMultiplier - 1) * 100}% surge to the base rate.
                            </p>
                        </div>
                    )}

                    <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <p className="text-xs text-emerald-800">
                            Your security deposit is 100% refundable upon safe return of the vehicle.
                        </p>
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={!pricing || loading}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Pay & Book Now</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
