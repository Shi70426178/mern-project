import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BrowseProducts from './components/BrowseProducts';
import Sell from './components/Sell';
import UserUploads from './components/UserUploads';
import PremiumProducts from './components/PremiumProducts';
import SellPremium from './components/SellPremium';
import Navigation from './components/Navigation';

const App = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/';
    };

    const username = localStorage.getItem('username');
    const location = useLocation();
    const noNavRoutes = ['/', '/signup']; // Routes where Navigation should not appear

    return (
        <>
            {!noNavRoutes.includes(location.pathname) && <Navigation />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard handleLogout={handleLogout} />} />
                <Route path="/about" element={<AboutUs handleLogout={handleLogout} />} />
                <Route path="/contact" element={<ContactUs handleLogout={handleLogout} />} />
                <Route path="/profile" element={<Profile handleLogout={handleLogout} />} />
                <Route path="/sell" element={<Sell username={username} />} />
                <Route path="/admin" element={<AdminDashboard />} /> {/* Use ProtectedRoute for Admin Dashboard */}
                <Route path="/browse-products" element={<BrowseProducts username={username} />} />
                <Route path="/user-uploads" element={<UserUploads username={username} />} />
                <Route path="/premium-products" element={<PremiumProducts />} />
                <Route path="/sell-premium" element={<SellPremium username={username} />} />
                {/* Add other routes as needed */}
            </Routes>
        </>
    );
};

export default App;
