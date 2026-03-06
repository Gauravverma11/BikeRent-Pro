import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Calendar, Mail, Shield, ChevronRight, CheckCircle, AlertCircle, Loader2, Save, Key, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProfileDrawer = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'security', 'kyc'
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        dob: user?.dob ? user.dob.split('T')[0] : '',
        gender: user?.gender || 'Prefer not to say'
    });

    // Password State
    const [otpRequested, setOtpRequested] = useState(false);
    const [passwordData, setPasswordData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                phone: user.phone || '',
                dob: user.dob ? user.dob.split('T')[0] : '',
                gender: user.gender || 'Prefer not to say'
            });
        }
    }, [user, isOpen]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.patch('/users/update-profile', formData);
            updateUser(res.data.data.user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleRequestOTP = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('/users/request-password-otp');
            setOtpRequested(true);
            setMessage({ type: 'success', text: 'OTP sent to your registered email!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send OTP' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }

        setLoading(true);
        try {
            await api.post('/users/change-password', {
                otp: passwordData.otp,
                password: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setOtpRequested(false);
            setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.patch('/users/update-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser(res.data.data.user);
            setMessage({ type: 'success', text: 'Profile picture updated!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update avatar' });
        } finally {
            setLoading(false);
        }
    };

    const handleKYCUpload = async (e) => {
        e.preventDefault();
        const file = e.target.kycDocument.files[0];
        const docType = e.target.documentType.value;

        if (!file) return setMessage({ type: 'error', text: 'Please select an image to upload.' });

        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', docType);

        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.post('/users/upload-kyc', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser(res.data.data.user);
            setMessage({ type: 'success', text: 'KYC Document uploaded for review!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload KYC' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'N/A';

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={onClose}
            ></div>

            {/* Sidebar Drawer */}
            <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 rounded-l-[2rem]">
                {/* Header */}
                <div className="px-8 py-8 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">User Profile</h2>
                        <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1">Manage your account</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all border border-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Overview */}
                <div className="px-8 py-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20 overflow-hidden">
                                {user?.avatar ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}${user.avatar}`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user?.name?.charAt(0) || 'U'
                                )}
                            </div>
                            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all text-blue-600 hover:scale-110 active:scale-95">
                                <Camera className="w-4 h-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={loading} />
                            </label>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-tight">{user?.name || 'User'}</h3>
                            <p className="text-gray-500 text-sm font-medium">{user?.email}</p>
                            <div className="flex items-center gap-2.5 mt-2.5 px-3.5 py-1.5 bg-white inline-flex rounded-full border border-gray-200 shadow-sm">
                                <Shield className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.05em]">Member since {memberSince}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-4 pt-4 border-b border-gray-100 flex-wrap">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap px-2 ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Personal Details
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap px-2 ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab('kyc')}
                        className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap px-2 ${activeTab === 'kyc' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        KYC Docs
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <p className="text-sm font-bold">{message.text}</p>
                        </div>
                    )}

                    {activeTab === 'profile' ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 00000 00000"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                        <input
                                            type="date"
                                            value={formData.dob}
                                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Update Profile
                            </button>
                        </form>
                    ) : activeTab === 'security' ? (
                        <div className="space-y-8">
                            {!otpRequested ? (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                                        <Key className="w-8 h-8 text-blue-600 mb-4" />
                                        <h4 className="text-lg font-black text-gray-900 mb-2">Change Password</h4>
                                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                            For security, changing your password requires an OTP verification sent to your registered email address.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleRequestOTP}
                                        disabled={loading}
                                        className="w-full py-4 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                                        Request OTP on Email
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Enter OTP</label>
                                        <input
                                            type="text"
                                            value={passwordData.otp}
                                            onChange={(e) => setPasswordData({ ...passwordData, otp: e.target.value })}
                                            placeholder="6-digit code from email"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-center text-lg font-black tracking-[0.5em] text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setOtpRequested(false)}
                                            className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                                            Verify & Update
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : activeTab === 'kyc' ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield className="w-8 h-8 text-blue-600" />
                                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm text-white ${user?.kycStatus === 'Verified' ? 'bg-emerald-500' : user?.kycStatus === 'Rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                        Status: {user?.kycStatus || 'Pending'}
                                    </span>
                                </div>
                                <h4 className="text-lg font-black text-gray-900 mb-2">Verification Documents</h4>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                    Upload your Driving License, Aadhaar, or Passport to become a verified rider. Verified riders can book instantly.
                                </p>
                            </div>

                            <form onSubmit={handleKYCUpload} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Document Type</label>
                                    <select
                                        name="documentType"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                                        required
                                    >
                                        <option value="Driving License">Driving License</option>
                                        <option value="Aadhaar Card">Aadhaar Card</option>
                                        <option value="Passport">Passport</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Upload Image (JPG/PNG)</label>
                                    <input
                                        type="file"
                                        name="kycDocument"
                                        accept="image/jpeg, image/png, image/jpg"
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Upload Document
                                </button>
                            </form>
                        </div>
                    ) : null}
                </div>

                {/* Footer / Logout */}
                <div className="p-8 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                <Shield className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-xs font-bold text-gray-500">Security verified</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProfileDrawer;
