import React from 'react';
import { FileText } from 'lucide-react';
import Footer from '../components/Footer';

const TermsConditions = () => {
    return (
        <div className="max-w-4xl mx-auto font-sans space-y-12 pb-20">
            {/* Hero */}
            <header className="relative text-center py-20 px-8 bg-gray-950 rounded-[2.5rem] text-white shadow-2xl border border-white/5 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-900/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-600/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-3">Terms & <span className="text-blue-500">Conditions</span></h1>
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
                        title: "1. Acceptance of Terms",
                        content: `By accessing or using the BikeRent Pro platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services. We reserve the right to update these terms at any time with notice provided on the platform.`
                    },
                    {
                        title: "2. Eligibility",
                        content: `To use our services, you must:
                        \n• Be at least 18 years of age.
                        \n• Hold a valid driving license appropriate for the vehicle category you intend to rent.
                        \n• Provide accurate and complete registration information.
                        \n• Not be prohibited from using our services under applicable law.`
                    },
                    {
                        title: "3. Booking and Payments",
                        content: `• All bookings are subject to vehicle availability at the time of confirmation.
                        \n• Payment must be made in full at the time of booking through our secure payment gateway.
                        \n• Prices are inclusive of applicable taxes unless stated otherwise.
                        \n• BikeRent Pro reserves the right to modify pricing at any time. Changes will not affect already-confirmed bookings.`
                    },
                    {
                        title: "4. Cancellation Policy",
                        content: `• Cancellations made more than 24 hours before the scheduled pickup time are eligible for a full refund.
                        \n• Cancellations made within 24 hours of the pickup time will incur a 50% cancellation fee.
                        \n• No-shows (failure to collect the vehicle without prior cancellation) are non-refundable.
                        \n• Refunds will be processed within 5–7 business days.`
                    },
                    {
                        title: "5. Vehicle Use",
                        content: `The renter agrees to:
                        \n• Use the vehicle only for lawful purposes and in accordance with all traffic regulations.
                        \n• Not allow any unauthorised person to operate the vehicle.
                        \n• Not use the vehicle for racing, off-road activities, or any commercial purpose.
                        \n• Return the vehicle in the same condition as received, with the same fuel level.
                        \n• Report any accidents, theft, or damage to BikeRent Pro and local authorities immediately.`
                    },
                    {
                        title: "6. Damage and Liability",
                        content: `• The renter is liable for any damage caused to the vehicle during the rental period due to negligence or misuse.
                        \n• Minor wear and tear is expected and will not be charged.
                        \n• Significant damage will be assessed and the cost deducted from the security deposit, with the renter liable for any excess.
                        \n• BikeRent Pro is not liable for any personal injury, loss, or damage to the renter's property during the rental period.`
                    },
                    {
                        title: "7. Delay Charges",
                        content: `Late returns are charged at double the standard hourly rate for every hour past the agreed drop-off time. If you need to extend your rental, please contact us in advance to check availability and avoid additional charges.`
                    },
                    {
                        title: "8. Termination",
                        content: `BikeRent Pro reserves the right to terminate your account or cancel any booking without prior notice if you violate these terms, provide false information, or engage in any behaviour that could harm other users or the platform.`
                    },
                    {
                        title: "9. Governing Law",
                        content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka.`
                    },
                    {
                        title: "10. Contact Us",
                        content: `For questions about these Terms and Conditions, please contact:\n\nBikeRent Pro\nEmail: support@bikerentpro.in\nPhone: +91 87198 34667\nAddress: 123, Tech Park Road, HSR Layout, Bangalore – 560102`
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

export default TermsConditions;
