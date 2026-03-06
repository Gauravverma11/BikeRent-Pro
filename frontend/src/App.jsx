import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import AdminStats from './pages/AdminStats';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Careers from './pages/Careers';
import Offers from './pages/Offers';
import Tariff from './pages/Tariff';
import CustomerSupport from './components/CustomerSupport';

import { Toaster } from 'react-hot-toast';

const App = () => {
  React.useEffect(() => {
    console.log(
      "%c🚀 Welcome to BikeRent Pro!",
      "color: #3b82f6; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);"
    );
    console.log(
      "%cCrafted with ❤️ by Gaurav Verma",
      "color: #6366f1; font-size: 14px; font-weight: bold;"
    );
    console.log(
      "%cGitHub: https://github.com/Gauravverma11 \nLinkedIn: https://www.linkedin.com/in/gauravverma111",
      "color: #64748b; font-size: 12px; font-style: italic;"
    );
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-1 pt-24 pb-12 px-4 md:px-8 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminStats />
                </ProtectedRoute>
              } />

              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/tariff" element={<Tariff />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<TermsConditions />} />
            </Routes>
          </main>
        </div>
        <CustomerSupport />
      </Router>
    </AuthProvider>
  );
};

export default App;
