import React from 'react';
import { Shield } from 'lucide-react';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto font-sans space-y-12 pb-20">
            {/* Hero */}
            <header className="relative text-center py-20 px-8 bg-gray-950 rounded-[2.5rem] text-white shadow-2xl border border-white/5 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-900/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-600/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-3"><span className="text-blue-500">Privacy</span> Policy</h1>
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Last updated: March 2025</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10 space-y-10">
                {[
                    {
                        title: "1. Information We Collect",
                        content: `We collect information you provide directly to us when you create an account, make a booking, or contact our support team. This includes:
                        \n• Personal information such as your name, email address, phone number, and address.
                        \n• Identity documents such as driving license or passport details for verification purposes.
                        \n• Payment information processed securely through our payment partners.
                        \n• Usage data including how you interact with our platform, search queries, and booking history.`
                    },
                    {
                        title: "2. How We Use Your Information",
                        content: `We use the information we collect to:
                        \n• Process your bookings and payments.
                        \n• Communicate with you about your rentals, including booking confirmations and receipts.
                        \n• Send you important updates about our services, safety notices, and policy changes.
                        \n• Improve our platform, personalise your experience, and develop new features.
                        \n• Comply with legal obligations and enforce our terms of service.`
                    },
                    {
                        title: "3. Sharing Your Information",
                        content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:
                        \n• With service providers who assist us in operating our platform (payment processors, cloud providers).
                        \n• With law enforcement or regulatory authorities when required by law.
                        \n• In connection with a business transfer such as a merger or acquisition, with appropriate notice to you.`
                    },
                    {
                        title: "4. Data Security",
                        content: `We implement industry-standard security measures to protect your personal information from unauthorised access, disclosure, alteration, or destruction. This includes SSL encryption for data in transit and secure storage practices. However, no method of transmission over the internet is 100% secure.`
                    },
                    {
                        title: "5. Your Rights",
                        content: `You have the right to:
                        \n• Access the personal information we hold about you.
                        \n• Request correction of inaccurate or incomplete data.
                        \n• Request deletion of your account and associated data.
                        \n• Opt out of promotional communications at any time by clicking "unsubscribe" in any email.
                        \n\nTo exercise any of these rights, contact us at support@bikerentpro.in.`
                    },
                    {
                        title: "6. Cookies",
                        content: `We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie settings through your browser, though disabling certain cookies may affect platform functionality.`
                    },
                    {
                        title: "7. Contact Us",
                        content: `If you have any questions about this Privacy Policy or our data practices, please contact us at:\n\nBikeRent Pro\nEmail: support@bikerentpro.in\nPhone: +91 87198 34667\nAddress: 123, Tech Park Road, HSR Layout, Bangalore – 560102`
                    }
                ].map((section, i) => (
                    <div key={i} className="border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                        <h2 className="text-xl font-black text-gray-900 mb-4">{section.title}</h2>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium whitespace-pre-line">{section.content}</p>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
