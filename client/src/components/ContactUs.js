import React from 'react';
import Navigation from './Navigation';

const ContactUs = ({ handleLogout }) => {
    return (
        <div className="container">
            <Navigation handleLogout={handleLogout} />
            <div className="form">
                <h2>Contact Us</h2>
                <p>You can reach us at contact@myapp.com for any inquiries.
                We’re here to help! Whether you have a question, feedback, or need assistance, feel free to reach out to us anytime.

📧 Email
support@[yourwebsite].com
For general inquiries, account support, or technical issues.

📞 Phone
+91-XXXXXXXXXX
Available Monday to Friday, 10 AM – 6 PM IST

📍 Address
[Your Company Name]
[Street Address]
[City, State, ZIP Code]
[Country]

🕒 Support Hours
Monday – Friday: 10 AM to 6 PM
Saturday – Sunday: Closed

Or simply fill out our contact form and we’ll get back to you as soon as possible!
                </p>
            </div>
        </div>
    );
};

export default ContactUs;
