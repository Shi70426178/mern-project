import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Sell.module.css';
import Navigation from './Navigation';

const Sell = ({ username }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('file', file);
        formData.append('username', username);

        try {
            const res = await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Product listed successfully');
            setName('');
            setDescription('');
            setFile(null);
            console.log('Product listed successfully:', res.data);
        } catch (err) {
            console.error('Error listing product:', err);
            setMessage('Error listing product');
        }
    };

    const handleViewUploads = () => {
        navigate('/user-uploads'); // Redirect to User Uploads page
    };

    return (
        <div className={styles.container}>
            <Navigation />
            <h2>Sell Your Product</h2>
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
                    <label htmlFor="file">Upload ZIP File or Document</label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        accept=".zip,.rar,.7z,.doc,.docx,.pdf"
                        required
                    />
                </div>
                <button type="submit">List Product</button>
            </form>
            <button onClick={handleViewUploads} className={styles.viewUploadsButton}>
                See Your Uploads
            </button>
        </div>
    );
};

export default Sell;
