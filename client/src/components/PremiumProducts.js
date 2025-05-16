import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './PremiumProducts.module.css';

const PremiumProducts = () => {
    const [premiumProducts, setPremiumProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchPremiumProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products/premium');
                if (Array.isArray(res.data)) {
                    setPremiumProducts(res.data);
                } else {
                    console.error('Unexpected response data:', res.data);
                }
            } catch (err) {
                console.error('Error fetching premium products:', err);
                setMessage('Error fetching premium products');
            }
        };
        fetchPremiumProducts();
    }, []);

    const handleBuy = async (productId) => {
        try {
            const res = await axios.post(
                `http://localhost:5000/api/products/premium/${productId}/buy`,
                { username },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (res.data && res.data.message === 'Purchase successful') {
                setPurchasedProducts(prev => [...prev, productId]);
            } else {
                console.error('Unexpected response data:', res.data);
            }
        } catch (err) {
            console.error('Error purchasing product:', err);
            setMessage('Error purchasing product');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Premium Products</h2>
            {message && <p className={styles.error}>{message}</p>}
            <div className={styles.productGrid}>
                {premiumProducts.length > 0 ? (
                    premiumProducts.map(product => (
                        <div key={product._id} className={styles.productCard}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <p className={styles.description}>{product.description}</p>
                            <p className={styles.price}>Price: <span>${product.price.toFixed(2)}</span></p>
                            {purchasedProducts.includes(product._id) ? (
                                <a
                                    className={styles.downloadBtn}
                                    href={`http://localhost:5000/api/products/files/${product.fileUrl.split('/').pop()}`}
                                    download
                                >
                                    Download
                                </a>
                            ) : (
                                <button
                                    className={styles.buyBtn}
                                    onClick={() => handleBuy(product._id)}
                                >
                                    Buy Now
                                </button>
                            )}
                            <div className={styles.details}>
                                <p>👍 Likes: {product.likes}</p>
                                <p>💬 Comments: {product.comments.length}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.noProducts}>No premium products found.</p>
                )}
            </div>
        </div>
    );
};

export default PremiumProducts;
