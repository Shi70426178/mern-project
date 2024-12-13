import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './UserProducts.module.css'; // Ensure this CSS module exists

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('https://mern-project-5-xoai.onrender.com/api/products/my-products', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching user products:', err);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`https://mern-project-5-xoai.onrender.com/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProducts(products.filter(product => product._id !== productId));
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Your Listed Products</h2>
            {products.length > 0 ? (
                <div className={styles.productGrid}>
                    {products.map(product => (
                        <div key={product._id} className={styles.productCard}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <Link to={`/edit-product/${product._id}`} className={styles.editButton}>Edit</Link>
                            <button onClick={() => handleDelete(product._id)} className={styles.deleteButton}>Delete</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found</p>
            )}
        </div>
    );
};

export default UserProducts;
