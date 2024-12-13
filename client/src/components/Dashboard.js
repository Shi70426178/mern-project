import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from './Navigation';
import './Dashboard.css'; // Ensure to import CSS

const Dashboard = ({ handleLogout }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await axios.get('http://localhost:5000/api/auth/dashboard', {
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
        <div className="dashboard-container">
            <Navigation handleLogout={handleLogout} />
            
            <div className="content">
                {user ? <p>Welcome, {user.name}!</p> : <p>Loading...</p>}
            </div>

            <div className="buttons-container">
                <Link to="/browse-products" className="button">
                    Browse Products
                </Link>
                <Link to="/sell" className="button">
                    Become a Seller
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
