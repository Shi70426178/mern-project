const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');

// Get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).send('Server error');
    }
});

// Update user details
router.put('/users/:id', adminAuth, async (req, res) => {
    const { name, email, username } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { name, email, username }, { new: true });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).send('Server error');
    }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).send('Server error');
    }
});

// Change user role
router.put('/users/:id/role', adminAuth, async (req, res) => {
    const { isAdmin } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isAdmin }, { new: true });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error updating user role:', err.message);
        res.status(500).send('Server error');
    }
});

// Get wallet balance
router.get('/users/:id/wallet', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ wallet: user.wallet });
    } catch (err) {
        console.error('Error fetching wallet balance:', err.message);
        res.status(500).send('Server error');
    }
});

// Add money to wallet
router.post('/users/:id/wallet/add', adminAuth, async (req, res) => {
    const { amount } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.wallet += amount;
        await user.save();
        res.json({ wallet: user.wallet });
    } catch (err) {
        console.error('Error adding money to wallet:', err.message);
        res.status(500).send('Server error');
    }
});

// Withdraw money from wallet
router.post('/users/:id/wallet/withdraw', adminAuth, async (req, res) => {
    const { amount } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (user.wallet < amount) {
            return res.status(400).json({ msg: 'Insufficient balance' });
        }
        user.wallet -= amount;
        await user.save();
        res.json({ wallet: user.wallet });
    } catch (err) {
        console.error('Error withdrawing money from wallet:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
