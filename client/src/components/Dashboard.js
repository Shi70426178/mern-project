import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from './Navigation';
import './Dashboard.css';
import ImageSlider from './ImageSlider';

const Dashboard = ({ handleLogout }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await axios.get('https://mern-project-5-xoai.onrender.com/api/auth/dashboard', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setUser(res.data.user);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard-page">
            <Navigation handleLogout={handleLogout} />
            <ImageSlider />
            <div className="content">
                {user ? <p>Welcome, {user.name}!</p> : <p>Loading...</p>}
                <h4 className="welcome-text">The ultimate platform for seamless transactions! Whether you're looking to sell your Projects or discover amazing Projects</h4>
            </div>
            <div className="buttons-container">
                <Link to="/browse-products" className="button">
                    Browse Products
                </Link>
                <Link to="/sell" className="button">
                    Become a Seller
                </Link>
            </div>
            <div className="extra-containers">
                <div className="extra-container">
                    <h1>Javascript</h1>
                    <p>Browse Projects Based on Javascript</p>
                    <img src="/assets/image2.jpg" alt="Innovative Solutions" />
                </div>
                <div className="extra-container">
                    <h1>Python</h1>
                    <p>1000+ Python Projects</p>
                    <img src="/assets/image1.jpg" alt="Global Community" />
                </div>
                <div className="extra-container">
                    <h1>Android</h1>
                    <p>100+ Android Projects</p>
                    <img src="/assets/image3.jpg" alt="Exclusive Offers" />
                </div>
                <div className="extra-container">
                    <h1>Java</h1>
                    <p>500+ Java Projects</p>
                    <img src="/assets/image4.jpg" alt="Expert Support" />
                </div>
            </div>
            <footer className="footer">
                <div className="bottom-nav">
                    <Link to="/home" className="bottom-nav-link">Home</Link>
                    <Link to="/about-us" className="bottom-nav-link">About Us</Link>
                    <Link to="/contact" className="bottom-nav-link">Contact</Link>
                </div>
                <div className="about-us">
                    <h4>About Us</h4>
                    <p>We are dedicated to providing a seamless platform for buying and selling projects. Our mission is to connect sellers with buyers and create a vibrant community of innovative thinkers. Join us on this journey to discover and showcase amazing projects!</p>
                </div>
                <div className="copyright">
                    &copy; 2024 Your Company. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
