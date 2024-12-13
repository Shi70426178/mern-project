import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserUploads.module.css';
import Navigation from './Navigation';

const UserUploads = ({ username }) => {
    const [uploads, setUploads] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const res = await axios.get(`https://mern-project-5-xoai.onrender.com/api/products?username=${username}`);
                if (Array.isArray(res.data)) {
                    setUploads(res.data);
                } else {
                    console.error('Unexpected response data:', res.data);
                }
                console.log('Uploads fetched successfully:', res.data);
            } catch (err) {
                console.error('Error fetching uploads:', err);
                setMessage('Error fetching uploads');
            }
        };
        fetchUploads();
    }, [username]);

    return (
        <div className={styles.container}>
            <Navigation />
            <h2>Your Uploads</h2>
            {message && <p className={styles.error}>{message}</p>}
            <div className={styles.uploadGrid}>
                {uploads.length > 0 ? (
                    uploads.map(upload => (
                        <div key={upload._id} className={styles.uploadCard}>
                            <h3>{upload.name}</h3>
                            <p>{upload.description}</p>
                            <p>Likes: {upload.likes}</p>
                            <div className={styles.commentsSection}>
                                <h4>Comments:</h4>
                                {upload.comments.length > 0 ? upload.comments.map((comment, index) => (
                                    <p key={index}>{comment}</p>
                                )) : <p>No comments yet.</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No uploads found</p>
                )}
            </div>
        </div>
    );
};

export default UserUploads;
