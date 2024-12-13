import React from 'react';
import Navigation from './Navigation';

const ContactUs = ({ handleLogout }) => {
    return (
        <div className="container">
            <Navigation handleLogout={handleLogout} />
            <div className="form">
                <h2>Contact Us</h2>
                <p>You can reach us at contact@myapp.com for any inquiries.</p>
            </div>
        </div>
    );
};

export default ContactUs;
