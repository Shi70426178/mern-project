import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './PremiumProducts.module.css'; // Ensure this CSS module exists

const PremiumProducts = () => {
    const [premiumProducts, setPremiumProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const username = localStorage.getItem('username'); // Retrieve username from local storage

    useEffect(() => {
        const fetchPremiumProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products/premium');
                if (Array.isArray(res.data)) {
                    setPremiumProducts(res.data);
                } else {
                    console.error('Unexpected response data:', res.data);
                }
                console.log('Premium products fetched successfully:', res.data);
            } catch (err) {
                console.error('Error fetching premium products:', err);
                setMessage('Error fetching premium products');
            }
        };
        fetchPremiumProducts();
    }, []);

    const handleBuy = async (productId) => {
        console.log('Purchasing product ID:', productId); // Debugging line to verify product ID
        console.log('Username for purchase:', username); // Debugging line to verify username

        try {
            const res = await axios.post(`http://localhost:5000/api/products/premium/${productId}/buy`, { username }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.data && res.data.message === 'Purchase successful') {
                setPurchasedProducts([...purchasedProducts, productId]);
                console.log('Product purchased successfully:', res.data);
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
            <h2>Premium Products</h2>
            {message && <p className={styles.error}>{message}</p>}
            <div className={styles.productGrid}>
                {premiumProducts.length > 0 ? (
                    premiumProducts.map(product => (
                        <div key={product._id} className={styles.productCard}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            {purchasedProducts.includes(product._id) ? (
                                <a href={`http://localhost:5000/api/products/files/${product.fileUrl.split('/').pop()}`} download>Download</a>
                            ) : (
                                <button onClick={() => handleBuy(product._id)}>Buy Now</button>
                            )}
                            <div className={styles.details}>
                                <p>Likes: {product.likes}</p>
                                <p>Comments: {product.comments.length}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No premium products found</p>
                )}
            </div>
        </div>
    );
};

export default PremiumProducts;
