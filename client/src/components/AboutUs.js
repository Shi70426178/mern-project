import React from 'react';
import Navigation from './Navigation';

const AboutUs = ({ handleLogout }) => {
    return (
        <div className="container">
            <Navigation handleLogout={handleLogout} />
            <div className="form">
                <h2>About Us</h2>
                <p>Welcome to MyApp. We are dedicated to providing the best services for our users.</p>
            </div>
        </div>
    );
};

export default AboutUs;
