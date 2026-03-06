import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="site-footer" className="bg-gray-900 text-gray-300 pt-14 pb-8 px-8 mt-20 w-screen relative left-1/2 -translate-x-1/2">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-700">
                    {/* Brand & Contact */}
                    <div className="space-y-4">
                        <h1 className="text-white font-black text-lg tracking-wider uppercase">BikeRent Pro</h1>
                        <div className="w-10 h-0.5 bg-blue-500"></div>
                        <div className="flex items-center gap-3 text-sm">
                            <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span>support@bikerentpro.in</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <span>+91 87198 34667</span>
                        </div>
                    </div>
                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-xs tracking-widest uppercase">Company</h4>
                        <div className="w-8 h-0.5 bg-blue-500"></div>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                            <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                    {/* Policies */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-xs tracking-widest uppercase">Policies</h4>
                        <div className="w-8 h-0.5 bg-blue-500"></div>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms &amp; Conditions</Link></li>
                        </ul>
                    </div>
                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-xs tracking-widest uppercase">Quick Links</h4>
                        <div className="w-8 h-0.5 bg-blue-500"></div>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/tariff" className="hover:text-blue-400 transition-colors">Tariff</Link></li>
                            <li><Link to="/offers" className="hover:text-blue-400 transition-colors">Offers</Link></li>
                            <li><a href="https://www.amazon.in/s?k=motorcycle+riding+gear" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Riding Gear</a></li>
                        </ul>
                    </div>
                </div>
                {/* Bottom: social + copyright */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-3">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Connect with Developer</p>
                        <div className="flex gap-4">
                            <a href="https://github.com/Gauravverma11" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors group">
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </a>
                            <a href="https://www.linkedin.com/in/gauravverma111" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors group">
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Developed by Gaurav Verma</p>
                        <p className="text-[10px] text-gray-700 font-semibold">&copy; {new Date().getFullYear()} BikeRent Pro. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
