import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bike, Loader2, User, Mail, Lock, Gift } from 'lucide-react';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup, requestSignupOTP, verifySignupOTP } = useAuth();
    const navigate = useNavigate();

    const handleNextStep1 = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await requestSignupOTP(formData.name, formData.email);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await verifySignupOTP(formData.email, formData.otp);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await signup(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mesh-background flex items-center justify-center p-6">
            <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden group">
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                                <Bike className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">
                                {step === 1 ? 'Join Us' : step === 2 ? 'Check Mail' : 'Set Password'}
                            </h2>
                            <p className="text-gray-500 font-medium text-center">
                                {step === 1 ? 'Start your premium riding journey' : step === 2 ? 'We sent a code to your email' : 'Create a secure access key'}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50/50 backdrop-blur-md text-red-600 p-4 rounded-2xl text-sm mb-8 border border-red-100/50 flex items-center gap-3 animate-pulse">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <form onSubmit={handleNextStep1} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group/input">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-blue-600 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-gray-900 font-medium placeholder:text-gray-300"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-blue-600 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-gray-900 font-medium placeholder:text-gray-300"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-gray-900/20 disabled:opacity-70 mt-4 uppercase tracking-tighter"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-blue-400" /> : 'Continue'}
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center block mb-2">Verification Code</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        className="glass-input w-full px-4 py-6 rounded-3xl outline-none text-gray-900 text-center text-4xl font-black tracking-[0.5em] placeholder:tracking-normal placeholder:font-normal placeholder:text-lg"
                                        placeholder="000000"
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 disabled:opacity-70 mt-4 uppercase tracking-tighter"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Code'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-center text-sm text-gray-400 font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
                                >
                                    ← Edit Email
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleCompleteSignup} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Create Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-blue-600 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-gray-900 font-medium placeholder:text-gray-300"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-blue-600 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-gray-900 font-medium placeholder:text-gray-300"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        Referral Code <span className="text-[10px] font-medium lowercase">(optional)</span>
                                    </label>
                                    <div className="relative group/input">
                                        <Gift className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5 transition-colors" />
                                        <input
                                            type="text"
                                            className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-gray-900 font-medium placeholder:text-emerald-200"
                                            placeholder="GIFT50"
                                            value={formData.referralCode}
                                            onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 disabled:opacity-70 mt-4 uppercase tracking-tighter"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Complete Setup'}
                                </button>
                            </form>
                        )}

                        {step === 1 && (
                            <div className="mt-10 pt-8 border-t border-gray-100/50 text-center">
                                <p className="text-sm text-gray-500 font-medium">
                                    Existing member?{' '}
                                    <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors ml-1">
                                        Log In
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
