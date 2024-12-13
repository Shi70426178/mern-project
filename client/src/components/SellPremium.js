import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './SellPremium.module.css';
import UserProducts from './UserProducts'; // Import the UserProducts component

const SellPremium = ({ username }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(''); // Add price state
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [showManageProducts, setShowManageProducts] = useState(false); // State to show/hide manage products section
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price); // Add price to formData
        formData.append('file', file);
        formData.append('username', username); // Ensure username is added
        formData.append('isPremium', true); // Mark the product as premium

        try {
            const res = await axios.post('https://mern-project-5-xoai.onrender.com/api/products/premium', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Premium product listed successfully');
            setName('');
            setDescription('');
            setPrice(''); // Reset price
            setFile(null);
            console.log('Premium product listed successfully:', res.data);
        } catch (err) {
            console.error('Error listing premium product:', err);
            setMessage('Error listing premium product');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Sell Your Premium Product</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Product Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="price">Product Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="file">Upload File</label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        accept=".zip,.rar,.7z,.doc,.docx,.pdf"
                        required
                    />
                </div>
                <button type="submit">List Premium Product</button>
            </form>
            <button onClick={() => setShowManageProducts(!showManageProducts)} className={styles.manageButton}>
                {showManageProducts ? 'Hide Manage Products' : 'Manage My Products'}
            </button>
            {showManageProducts && <UserProducts />}
        </div>
    );
};

export default SellPremium;
