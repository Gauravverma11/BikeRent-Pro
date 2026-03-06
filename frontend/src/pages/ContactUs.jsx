import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Star, CheckCircle, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const ContactUs = () => {
    const { user, updateUser } = useAuth();
    const [rating, setRating] = useState(user?.appRating || 0);
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loadingRating, setLoadingRating] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user?.appRating) {
            setRating(user.appRating);
        }
    }, [user]);

    const handleRating = async (val) => {
        if (!user) {
            toast.error('Please login to rate the app');
            return;
        }
        if (user.appRating > 0) return;

        try {
            setLoadingRating(true);
            const res = await api.post('/users/rate-app', { rating: val });
            setRating(val);
            toast.success('Thank you for your rating!');

            // Update user in context/localStorage
            const updatedUser = { ...user, appRating: val };
            updateUser(updatedUser);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit rating');
        } finally {
            setLoadingRating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Name Validation: at least 3 words, no numbers
        const nameVal = formData.name.trim();
        const words = nameVal.split(/\s+/).filter(w => w);
        if (words.length < 3) {
            toast.error("Name must contain at least three words.");
            return;
        }
        if (/\d/.test(nameVal)) {
            toast.error("Name must not contain numbers.");
            return;
        }

        // 2. Email Validation: must contain @
        if (!formData.email.includes('@')) {
            toast.error("This is not a valid email.");
            return;
        }

        // 3. Message Validation: max 200 words
        const msgWords = formData.message.trim().split(/\s+/).filter(w => w);
        if (msgWords.length > 200) {
            toast.error("No more than 200 words allowed in message.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await api.post('/contact', formData);

            if (res.data.status === 'success') {
                setSubmitted(true);
                toast.success('Message sent to Admin!');
                setTimeout(() => setSubmitted(false), 5000);
                setFormData({ ...formData, message: '' });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-20 font-sans">
            <header className="text-center py-12">
                <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Get in Touch</h1>
                <p className="text-gray-500 font-medium max-w-2xl mx-auto">Have questions or feedback? We'd love to hear from you. Our team typically responds within 24 hours.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-4">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-500/5 space-y-8">
                        <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-2xl">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                                <p className="text-gray-900 font-bold">support@bikerentpro.in</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-2xl">
                                <Phone className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                                <p className="text-gray-900 font-bold">+91 87198 34667</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-2xl">
                                <MapPin className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Visit Us</p>
                                <p className="text-gray-900 font-bold">123, Tech Park Road, HSR Layout, Bangalore - 560102</p>
                            </div>
                        </div>
                    </div>

                    {/* App Rating Section */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden">
                        <h3 className="text-xl font-bold mb-2">Rate Our App</h3>
                        <p className="text-blue-100 text-sm mb-6 font-medium">
                            {user?.appRating > 0 ? "You've already rated us. Thank you!" : "How would you describe your experience with BikeRent Pro?"}
                        </p>

                        <div className="flex gap-2 mb-4 relative z-10">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRating(star)}
                                    onMouseEnter={() => !user?.appRating && setHover(star)}
                                    onMouseLeave={() => !user?.appRating && setHover(0)}
                                    disabled={!!user?.appRating || loadingRating}
                                    className={`focus:outline-none transition-all ${!user?.appRating ? 'hover:scale-110 active:scale-90 cursor-pointer' : 'cursor-default opacity-80'}`}
                                >
                                    {loadingRating && star === hover ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    ) : (
                                        <Star
                                            className={`w-8 h-8 ${star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-blue-300'}`}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <div className="animate-in fade-in slide-in-from-left-2">
                                <p className="text-sm font-black uppercase tracking-tighter text-blue-200">
                                    {rating === 5 ? "Excellent! 🚀" : rating >= 4 ? "Great! 😊" : rating >= 3 ? "Good 👍" : "We'll improve! 🙏"}
                                </p>
                                {user?.appRating > 0 && (
                                    <p className="text-[10px] text-blue-300/80 mt-1 italic">Permanent Rating</p>
                                )}
                            </div>
                        )}

                        {/* Decorative background element */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden h-full flex flex-col justify-center">
                        {!user ? (
                            <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-700">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-10 h-10 text-blue-600 opacity-50" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Login Required</h3>
                                <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">Please sign in to your account to send us a message or report an issue.</p>
                                <a
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
                                >
                                    Sign In to Continue
                                </a>
                            </div>
                        ) : submitted ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Message Sent!</h3>
                                <p className="text-gray-500 font-medium">Thank you for reaching out. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your name"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium text-gray-700"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="Enter your email"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium text-gray-700"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between items-center pl-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Message</label>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${formData.message.trim().split(/\s+/).filter(w => w).length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {formData.message.trim().split(/\s+/).filter(w => w).length} / 200 Words
                                        </span>
                                    </div>
                                    <textarea
                                        rows="6"
                                        required
                                        placeholder="How can we help you?"
                                        className={`w-full bg-gray-50 border-none rounded-3xl p-4 text-sm focus:ring-2 transition-all outline-none font-medium text-gray-700 resize-none ${formData.message.trim().split(/\s+/).filter(w => w).length > 200 ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" /> Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactUs;
