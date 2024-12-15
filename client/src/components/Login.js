import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://mern-project-5-xoai.onrender.com/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username); // Store username in local storage
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Invalid credentials or server error');
        }
    };

    return (
        <div className="form">
            <h3 className='header' id='he1'>Welcome To Website</h3>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Signup here</Link>
            </p>
        </div>
    );
};

export default Login;
