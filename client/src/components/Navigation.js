import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ handleLogout }) => {
    return (
        <div className="header">
            <button className='header-title' color='white'><Link to ="/dashboard">Home</Link> </button>
            <div className="dropdown">
                <button className="dropdown-button">Menu</button>
                <div className="dropdown-content">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/browse-products">Browse Products</Link>
                    <Link to="/premium-products">Premium Products</Link>
                    <Link to="/sell-premium">Sell Premium</Link>
                    <Link to="/sell">Sell</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/admin">Admin Dashboard</Link>
                
                    <a href="#logout" onClick={handleLogout}>Logout</a>
                </div>
            </div>
        </div>
    );
};

export default Navigation;
