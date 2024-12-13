import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import Navigation from './Navigation';
import styles from './Profile.module.css'; // Correctly import CSS module

// Load Stripe using the publishable key from the environment variable
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Profile = ({ handleLogout }) => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [amount, setAmount] = useState(0);

    const fetchProfileDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const res = await axios.get('https://mern-project-5-xoai.onrender.com/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            localStorage.setItem('user_id', res.data._id); // Store user ID
            setProfile(res.data);
            console.log('Profile fetched successfully:', res.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    useEffect(() => {
        fetchProfileDetails();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const res = await axios.post('https://mern-project-5-xoai.onrender.com/api/auth/profile/update', {
                name: profile.name
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(res.data);
            setMessage('Profile updated successfully');
            setEditMode(false);
            console.log('Profile updated successfully:', res.data);
        } catch (err) {
            console.error('Error updating profile:', err);
            setMessage('Error updating profile');
        }
    };
    

 

    
    


    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const res = await axios.post('https://mern-project-5-xoai.onrender.com/api/auth/user/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage(res.data.msg);
            setCurrentPassword('');
            setNewPassword('');
            console.log('Password changed successfully:', res.data.msg);
        } catch (err) {
            console.error('Error changing password:', err);
            setMessage('Error changing password');
        }
    };

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!profileImage) return;

        const formData = new FormData();
        formData.append('profileImage', profileImage);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const res = await axios.post('https://mern-project-5-xoai.onrender.com/api/auth/profile/upload-image', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProfile(res.data);
            setMessage('Profile image updated successfully');
            console.log('Profile image updated successfully:', res.data);
        } catch (err) {
            console.error('Error uploading profile image:', err);
            setMessage('Error uploading profile image');
        }
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleAddMoney = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id'); // Fetch user ID
            if (!token || !userId) {
                console.error('No token or user ID found');
                return;
            }
            const res = await axios.post('https://mern-project-5-xoai.onrender.com/api/payment/create-checkout-session', 
            { 
                amount: parseFloat(amount),
                client_reference_id: userId  // Include client reference ID
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                sessionId: res.data.id,
            });
            if (error) {
                console.error('Stripe error:', error);
                setMessage('Error adding money');
            }
        } catch (err) {
            console.error('Error adding money:', err);
            setMessage('Error adding money');
        }
    };

    const handleWithdrawMoney = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const res = await axios.post('https://mern-project-5-xoai.onrender.com/api/auth/wallet/withdraw', { amount: parseFloat(amount) }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile({ ...profile, wallet: res.data.wallet });
            setMessage('Money withdrawn successfully');
            console.log('Money withdrawn successfully:', res.data);
        } catch (err) {
            console.error('Error withdrawing money:', err);
            setMessage('Error withdrawing money');
        }
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <Navigation handleLogout={handleLogout} />
            <Elements stripe={stripePromise}>
                <div className={styles.form}>
                    <h2>Profile</h2>
                    <div>
                        <img
                            src={profile.profilePicture ? `https://mern-project-5-xoai.onrender.com${profile.profilePicture}` : '/assets/logo192.png'}
                            alt="Profile"
                            onClick={() => document.getElementById('profileImageInput').click()}
                            className={styles.profileImage}
                        />
                        <input
                            type="file"
                            id="profileImageInput"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <button onClick={handleImageUpload}>Upload Image</button>
                    </div>
                    <div className={styles.profileInfo}>
                        <div>
                            <label>Name: </label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profile.name}</span>
                            )}
                        </div>
                        <div>
                            <label>Email: </label>
                            <span>{profile.email}</span>
                        </div>
                        <div>
                            <label>Username: </label>
                            <span>{profile.username}</span>
                        </div>
                        {editMode ? (
                            <div>
                                <button onClick={handleProfileUpdate}>Save</button>
                                <button onClick={() => setEditMode(false)}>Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setEditMode(true)}>Edit</button>
                        )}
                        {message && <p>{message}</p>}
                    </div>
                    <div className={styles.wallet}>
                        <h3>Wallet</h3>
                        <div>
                            <label>Balance: </label>
                            <span>{profile.wallet}</span>
                        </div>
                        <div>
                            <input
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Enter amount"
                            />
                            <button onClick={handleAddMoney}>Add Money</button>
                            <button onClick={handleWithdrawMoney}>Withdraw Money</button>
                        </div>
                    </div>
                    <form onSubmit={handlePasswordChange}>
                        <h3>Change Password</h3>
                        <div>
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Change Password</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </Elements>
        </div>
    );
};

export default Profile;
