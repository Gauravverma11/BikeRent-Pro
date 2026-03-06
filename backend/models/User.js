const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: function () { return this.isRegistrationComplete; },
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  referredBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  isReferralRewarded: {
    type: Boolean,
    default: false
  },
  preferredCity: {
    type: String,
    trim: true
  },
  preferredArea: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  dob: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    default: 'Prefer not to say'
  },
  avatar: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isRegistrationComplete: {
    type: Boolean,
    default: false
  },
  signupOTP: String,
  signupOTPExpires: Date,
  passwordResetOTP: String,
  passwordResetOTPExpires: Date,
  refreshToken: String,
  appRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  usedCoupons: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon'
  }],
  kycStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  documentUrl: {
    type: String
  },
  documentType: {
    type: String,
    enum: ['Driving License', 'Aadhaar Card', 'Passport']
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
