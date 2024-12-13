const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const User = require('../models/User'); // Ensure to import your User model

// Middleware for parsing raw body
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Find user and update wallet amount
        const userId = session.client_reference_id;
        const amount = session.amount_total / 100; // Convert from cents to dollars

        try {
            // Update user's wallet in the database
            const user = await User.findById(userId);
            user.wallet += amount;
            await user.save();
            console.log(`Successfully added ${amount} to wallet of user ${userId}`);
        } catch (err) {
            console.error('Error updating user wallet:', err);
        }
    }

    // Return a response to acknowledge receipt of the event
    res.status(200).json({ received: true });
});

module.exports = router;
