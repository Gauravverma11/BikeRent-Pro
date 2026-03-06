import React from 'react';
import { Bike, Shield, Clock, MapPin, Award } from 'lucide-react';
import Footer from '../components/Footer';

const AboutUs = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-20 font-sans">
            {/* Hero Section */}
            {/* Hero Section */}
            <header className="relative py-24 px-8 rounded-[3rem] overflow-hidden shadow-2xl bg-gray-950 text-white border border-white/5">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-900/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-6xl font-black mb-6 tracking-tighter leading-tight uppercase">
                        Revolutionizing <br /><span className="text-blue-500">Urban Mobility.</span>
                    </h1>
                    <p className="text-lg text-gray-400 font-bold leading-relaxed mb-8 uppercase tracking-wide">
                        More than just a rental service. A team dedicated to providing affordable, reliable transportation.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-blue-600/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                            <Award className="w-5 h-5 text-blue-500" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Top Rated 2024</span>
                        </div>
                    </div>
                </div>
                <Bike className="absolute -bottom-20 -right-20 w-96 h-96 text-white/5 -rotate-12 pointer-events-none" />
            </header>

            {/* Our Story */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-4">
                <div className="space-y-6">
                    <h2 className="text-4xl font-black text-gray-900 leading-tight">Our Journey Started with a Simple Problem.</h2>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed">
                        Traffic in major Indian cities can be a nightmare. We realized that thousands of people were spending hours stuck in jams or waiting for expensive cabs. BikeRent Pro was born to give that time back to you.
                    </p>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed">
                        Starting with just 10 bikes in Bangalore, we've expanded to a fleet of over 500+ premium vehicles, including high-speed EVs, commute-friendly petrol bikes, and luxury rides.
                    </p>
                    <div className="grid grid-cols-2 gap-8 pt-8">
                        <div>
                            <span className="text-4xl font-black text-blue-600">50k+</span>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Active Users</p>
                        </div>
                        <div>
                            <span className="text-4xl font-black text-blue-600">100+</span>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Pick-up Points</p>
                        </div>
                    </div>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-2xl group-hover:bg-blue-600/20 transition-all duration-500"></div>
                    <img
                        src="https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=800"
                        alt="Our Fleet"
                        className="relative rounded-[3rem] shadow-2xl object-cover h-[500px] w-full"
                    />
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-blue-50 py-24 px-8 rounded-[4rem]">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-black text-gray-900 mb-4">What Drives Us Forward</h2>
                    <p className="text-gray-500 font-medium">We build our service on four pillars of excellence to ensure you have the best riding experience.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: <Shield className="w-8 h-8 text-blue-600" />, title: "Safety First", desc: "Every bike undergoes a 20-point quality check before every single ride." },
                        { icon: <Clock className="w-8 h-8 text-blue-600" />, title: "Instant Booking", desc: "No more waiting. Book your ride in under 60 seconds with our seamless app." },
                        { icon: <MapPin className="w-8 h-8 text-blue-600" />, title: "Wide Coverage", desc: "Available at all major tech parks, metro stations, and residential hubs." },
                        { icon: <Award className="w-8 h-8 text-blue-600" />, title: "Best Pricing", desc: "Zero security deposit and transparent hourly rates. No hidden charges." }
                    ].map((value, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-blue-100/50">
                            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">{value.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutUs;
