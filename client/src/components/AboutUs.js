import React from 'react';
import Navigation from './Navigation';

const AboutUs = ({ handleLogout }) => {
    return (
        <div className="container">
            <Navigation handleLogout={handleLogout} />
            <div className="form">
                <h2>About Us</h2>
                <p>Welcome to MyApp. We are dedicated to providing the best services for our users
                We’re on a mission to connect buyers and sellers in a reliable and user-friendly marketplace. Whether you’re looking to declutter your home, start a side hustle, or find great deals on pre-loved items, we’re here to make that happen.

Our platform allows individuals and businesses to list items, negotiate prices, and close deals — all in one place. From electronics and fashion to vehicles and home essentials, you’ll find it all here.

Why Choose Us?
Secure Transactions: We prioritize user safety with smart verification and communication tools.

User-Friendly Experience: Clean design, easy navigation, and quick listing process.

Supportive Community: We’re building a community where users help each other buy smart and sell fast.

Responsive Support: Our team is always here to assist you if you have any issues.

Join us and be part of a smarter way to buy and sell online!

.</p>
            </div>
        </div>
    );
};

export default AboutUs;
