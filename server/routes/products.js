const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const User = require('../models/User');
const path = require('path');
const sendEmail = require('../utils/email');
const fs = require('fs');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });



// Fetch products by user
router.get('/my-products', auth, async (req, res) => {
    try {
        const products = await Product.find({ username: req.user.username });
        res.json(products);
    } catch (err) {
        console.error('Error fetching user products:', err);
        res.status(500).send('Server error');
    }
});

// Update a product
router.put('/:id', auth, async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        if (product.username !== req.user.username) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Server error');
    }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('Attempting to delete product with ID:', req.params.id); // Log product ID
        const product = await Product.findById(req.params.id);
        if (!product) {
            console.error('Product not found:', req.params.id);
            return res.status(404).json({ msg: 'Product not found' });
        }

        if (product.username !== req.user.username) {
            console.error('User not authorized:', req.user.username);
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Product.deleteOne({ _id: req.params.id }); // Use deleteOne method
        console.log('Product removed:', req.params.id); // Log successful removal
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error('Error deleting product:', err); // Log error
        res.status(500).send('Server error');
    }
});







// List a new product
router.post('/', upload.single('file'), async (req, res) => {
    const { name, description, username } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    try {
        const product = new Product({
            name,
            description,
            fileUrl,
            username,
            isPremium: false, // Explicitly mark as not premium
            likes: 0,
            likedBy: [],
            comments: []
        });
        await product.save();
        res.json(product);
    } catch (err) {
        console.error('Error listing product:', err.message);
        res.status(500).send('Server error');
    }
});

// List a new premium product
router.post('/premium', upload.single('file'), async (req, res) => {
    const { name, description, price, username } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    try {
        const product = new Product({
            name,
            description,
            fileUrl,
            username,
            price, // Add price
            isPremium: true, // Mark the product as premium
            likes: 0,
            likedBy: [],
            comments: []
        });
        await product.save();
        res.json(product);
    } catch (err) {
        console.error('Error listing premium product:', err.message);
        res.status(500).send('Server error');
    }
});

// Serve uploaded files
router.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Server error');
        }
    });
});

// Toggle like a product
router.post('/:id/like', async (req, res) => {
    try {
        const { username } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        if (product.likedBy.includes(username)) {
            product.likes -= 1;
            product.likedBy = product.likedBy.filter(name => name !== username);
        } else {
            product.likes += 1;
            product.likedBy.push(username);
        }
        await product.save();
        res.json({ likes: product.likes, likedBy: product.likedBy });
    } catch (err) {
        console.error('Error toggling like on product:', err.message);
        res.status(500).send('Server error');
    }
});

// Comment on a product
router.post('/:id/comment', async (req, res) => {
    const { comment } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        product.comments.push(comment);
        await product.save();
        res.json({ comments: product.comments });
    } catch (err) {
        console.error('Error commenting on product:', err.message);
        res.status(500).send('Server error');
    }
});

// Get all products or filter by username
router.get('/', async (req, res) => {
    const { username } = req.query;
    try {
        const query = username ? { username, isPremium: false } : { isPremium: false }; // Exclude premium products
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).send('Server error');
    }
});

// Get all premium products
router.get('/premium', async (req, res) => {
    try {
        const products = await Product.find({ isPremium: true });
        res.json(products);
    } catch (err) {
        console.error('Error fetching premium products:', err.message);
        res.status(500).send('Server error');
    }
});







// Buy a premium product
router.post('/premium/:id/buy', async (req, res) => {
    console.log('Request body:', req.body); // Log the request body to verify the username

    const { username } = req.body;
    console.log('Username received in request:', username); // Log the received username

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            console.error('Product not found:', req.params.id);
            return res.status(404).send('Product not found');
        }
        console.log('Product found with ID:', req.params.id); // Log product found

        const user = await User.findOne({ username });
        if (!user) {
            console.error('User not found:', username);
            return res.status(404).send('User not found');
        }
        console.log('User found:', user.username); // Log user found

        if (user.wallet < product.price) {
            console.error('Insufficient funds for user:', username, 'Wallet:', user.wallet, 'Price:', product.price);
            return res.status(400).send('Insufficient funds');
        }

        // Deduct the price from the user's wallet
        user.wallet -= product.price;
        await user.save();

        // Send email with the purchased file
        const filePath = path.join(__dirname, '../uploads', product.fileUrl.split('/').pop());
        console.log('File path for attachment:', filePath); // Log the file path

        // Ensure the file exists before sending email
        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            return res.status(500).send('Server error: File not found');
        }

        const emailOptions = {
            email: user.email,
            subject: 'Your Purchased File',
            message: `Hi ${user.username},\n\nThank you for your purchase! Please find your file attached.`,
            attachments: [
                {
                    filename: product.fileUrl.split('/').pop(),
                    path: filePath
                }
            ]
        };

        await sendEmail(emailOptions);
        console.log('Email sent successfully to:', user.email); // Log successful email sending

        res.json({ message: 'Purchase successful, email sent', fileUrl: product.fileUrl });
    } catch (err) {
        console.error('Error purchasing premium product:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
