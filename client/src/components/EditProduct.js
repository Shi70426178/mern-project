import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditProduct.module.css'; // Ensure this CSS module exists

const EditProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setName(res.data.name);
                setDescription(res.data.description);
                setPrice(res.data.price);
            } catch (err) {
                console.error('Error fetching product:', err);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/api/products/${id}`, { name, description, price }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessage('Product updated successfully');
            navigate('/my-products');
        } catch (err) {
            console.error('Error updating product:', err);
            setMessage('Error updating product');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Edit Product</h2>
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
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default EditProduct;
