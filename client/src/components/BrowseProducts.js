import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './BrowseProducts.module.css'; // Ensure this CSS module exists
import Navigation from './Navigation';

const BrowseProducts = ({ username }) => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                } else {
                    console.error('Unexpected response data:', res.data);
                }
                console.log('Products fetched successfully:', res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setMessage('Error fetching products');
            }
        };
        fetchProducts();
    }, []);

    const handleLike = async (productId) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/products/${encodeURIComponent(productId)}/like`, { username });
            if (res.data && typeof res.data.likes === 'number') {
                setProducts(products.map(product =>
                    product._id === productId ? { ...product, likes: res.data.likes, likedBy: res.data.likedBy } : product
                ));
            } else {
                console.error('Unexpected response data:', res.data);
            }
        } catch (err) {
            console.error('Error toggling like on product:', err);
            setMessage('Error toggling like on product');
        }
    };

    const handleComment = async (productId, comment) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/products/${encodeURIComponent(productId)}/comment`, { comment });
            if (res.data && Array.isArray(res.data.comments)) {
                setProducts(products.map(product =>
                    product._id === productId ? { ...product, comments: res.data.comments } : product
                ));
            } else {
                console.error('Unexpected response data:', res.data);
            }
        } catch (err) {
            console.error('Error commenting on product:', err);
            setMessage('Error commenting on product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <Navigation />
            <h2>Browse Products</h2>
            {message && <p className={styles.error}>{message}</p>}
            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
            />
            <div className={styles.productGrid}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product._id} className={styles.productCard}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <a href={`http://localhost:5000/api/products/files/${product.fileUrl.split('/').pop()}`} download>Download</a>
                            <button onClick={() => handleLike(product._id)}>
                                {product.likedBy.includes(username) ? 'Unlike' : 'Like'} ({product.likes})
                            </button>
                            <div className={styles.commentsSection}>
                                {product.comments && product.comments.length > 0 ? product.comments.map((comment, index) => (
                                    <p key={index}>{comment}</p>
                                )) : <p>No comments yet.</p>}
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleComment(product._id, e.target.comment.value);
                                    e.target.comment.value = '';
                                }}>
                                    <input type="text" name="comment" placeholder="Add a comment..." required />
                                    <button type="submit">Comment</button>
                                </form>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default BrowseProducts;
