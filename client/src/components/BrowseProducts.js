import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation';
import styles from './BrowseProducts.module.css'; // ✅ using CSS module
import { FaHeart, FaRegHeart, FaDownload, FaComment } from 'react-icons/fa';

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
          console.error('Unexpected response:', res.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setMessage('Error loading products.');
      }
    };

    fetchProducts();
  }, []);

  const handleLike = async (productId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/products/${encodeURIComponent(productId)}/like`, { username });
      if (res.data && typeof res.data.likes === 'number') {
        setProducts(products.map(product =>
          product._id === productId
            ? { ...product, likes: res.data.likes, likedBy: res.data.likedBy }
            : product
        ));
      }
    } catch (err) {
      console.error('Like error:', err);
      setMessage('Failed to like product.');
    }
  };

  const handleComment = async (productId, comment) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/products/${encodeURIComponent(productId)}/comment`, { comment });
      if (res.data && Array.isArray(res.data.comments)) {
        setProducts(products.map(product =>
          product._id === productId
            ? { ...product, comments: res.data.comments }
            : product
        ));
      }
    } catch (err) {
      console.error('Comment error:', err);
      setMessage('Failed to post comment.');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.browseContainer}>
      <Navigation />
      <div className={styles.browseWrapper}>
        <h2 className={styles.browseTitle}>Browse Products</h2>
        {message && <p className={styles.browseMessage}>{message}</p>}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.productsGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className={styles.productCard}>
                <div>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <p className={styles.productDesc}>{product.description}</p>

                  <a
                    href={`http://localhost:5000/api/products/files/${product.fileUrl.split('/').pop()}`}
                    className={styles.downloadLink}
                    download
                  >
                    <FaDownload /> Download
                  </a>
                </div>

                <div className={styles.likeSection}>
                  <button onClick={() => handleLike(product._id)} className={styles.likeButton}>
                    {product.likedBy.includes(username) ? <FaHeart /> : <FaRegHeart />}
                    <span>{product.likes}</span>
                  </button>
                </div>

                <div className={styles.commentsSection}>
                  <h4>Comments:</h4>
                  <div className={styles.commentsList}>
                    {product.comments?.length > 0 ? (
                      product.comments.map((comment, index) => (
                        <p key={index}>- {comment}</p>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleComment(product._id, e.target.comment.value);
                      e.target.comment.value = '';
                    }}
                    className={styles.commentForm}
                  >
                    <input type="text" name="comment" placeholder="Add a comment..." required />
                    <button type="submit">
                      <FaComment />
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noProducts}>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProducts;
