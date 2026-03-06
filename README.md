# 🏍️ BikeRent Pro - Premium Bike Rental Platform

BikeRent Pro is a high-performance, full-stack bike rental application built with the **MERN** stack. It features a stunning glassmorphic UI, advanced booking logic, secure KYC verification, and seamless Razorpay payment integration.

---

## ✨ Key Features

### 👤 User Features
- **Modern Dashboard:** Explore available bikes with a premium search and filtering interface.
- **Smart Booking:** Prevents overlapping bookings for the same vehicle across specific time slots.
- **Secure KYC:** Upload Driving License or ID documents for admin verification before booking.
- **OTP Authentication:** Secure signup and password changes using Gmail OTP services.
- **Dynamic Pricing:** Automatic calculation of costs based on duration, including weekend surges.
- **Referral System:** Earn rewards in your virtual wallet by inviting friends.

### 🛠️ Admin Features (Command Center)
- **Analytics Overview:** Real-time stats on total users, revenue, and popular vehicles.
- **KYC Management:** Review, approve, or reject user-submitted documents with a single click.
- **Active Ride Tracking:** Real-time monitoring of ongoing rides with "Mark as Returned" functionality and automatic late fine calculation.
- **Fleet Management:** Complete control over vehicle availability and status.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Lucide React (Icons), Chart.js (Analytics).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (with Mongoose ODM).
- **Payments:** Razorpay Integration (Test Mode).
- **Verification:** Nodemailer (Gmail SMTP) for OTPs.
- **Security:** JWT (JSON Web Tokens) with Refresh Token logic, Bcrypt for password hashing.

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Gauravverma11/BikeRent-Pro.git
cd BikeRent-Pro
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add your credentials:
```env
PORT=3000
DATABASE=your_mongodb_connection_string
JWT_SECRET=your_generated_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📈 Database Seeding
To quickly populate the app with vehicles and data:
```bash
cd backend
node seed.js
```

---

## 🛡️ Security Measures
- **Rate Limiting:** Prevents brute-force attacks on OTP and login routes.
- **Input Validation:** Powered by `Joi` to ensure data integrity.
- **Protected Routes:** Both frontend and backend verify user roles (User/Admin).

---

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo and submit a Pull Request.

---

Developed with ❤️ by **Gaurav Verma**
