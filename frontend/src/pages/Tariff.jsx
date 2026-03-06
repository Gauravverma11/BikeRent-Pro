import React, { useState, useEffect } from 'react';
import { IndianRupee, Info, ShieldCheck, Percent, Zap, Bike, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';
import api from '../utils/api';

const Tariff = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await api.get('/vehicles');
                setVehicles(res.data.data.vehicles);
            } catch (err) {
                console.error('Error fetching vehicles:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    // Summarize unique categories/bikes for the table
    const uniqueVehicles = vehicles.reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-20 font-sans">
            {/* Hero */}
            <header className="relative py-24 px-10 bg-gray-950 rounded-[3.5rem] overflow-hidden text-white border border-white/5 shadow-2xl">
                <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[120px]"></div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <h1 className="text-6xl font-black mb-6 tracking-tighter leading-tight uppercase italic drop-shadow-2xl">
                        Our <span className="text-blue-500">Tariff</span> Structure.
                    </h1>
                    <p className="text-lg text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        Transparent pricing. No hidden costs. Just pure riding joy.
                    </p>
                </div>
            </header>

            {/* Price Table Section */}
            <div className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-blue-500/5 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <IndianRupee className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Rental Rates</h2>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-[2rem] border border-gray-50">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Vehicle Name</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Type</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Hourly Rate</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-center">Daily Rate (24h)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {uniqueVehicles.map((v, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                                                    <img src={v.images[0]} alt="" className="w-full h-full object-cover opacity-80" />
                                                </div>
                                                <span className="font-bold text-gray-900">{v.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${v.type === 'EV' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                {v.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-gray-900 italic">₹{v.basePricePerHour}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-blue-600 font-black italic">₹{v.basePricePerHour * 24}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Additional Costs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-500/5 group hover:border-blue-100 transition-all">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-7 h-7 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Security Deposit</h3>
                    <p className="text-gray-500 font-bold italic text-3xl mb-4">₹1,000</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Fully refundable after vehicle inspection. No interest accrued. Simple and direct.</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-500/5 group hover:border-blue-100 transition-all">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Percent className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Service Tax (GST)</h3>
                    <p className="text-gray-500 font-bold italic text-3xl mb-4">18%</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Applicable as per Government regulations on the base rental amount. Calculated at checkout.</p>
                </div>

                <div className="bg-gray-950 p-8 rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col justify-center relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="w-5 h-5 text-blue-500" />
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Pro Tips</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">Book for <span className="text-white font-bold">24+ hours</span> to get the best effective rate.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">Late returns are charged <span className="text-white font-bold">2x hourly rate</span>. Extend early!</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Tariff;
