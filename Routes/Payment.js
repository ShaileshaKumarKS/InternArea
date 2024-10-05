const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key

// Endpoint to create a subscription
router.post('/', async (req, res) => {
    const { paymentMethodId, plan } = req.body;

    try {
        // Assuming you have a user object that contains the customer ID
        const customerId = req.user.stripeCustomerId; // Retrieve from your user session or database

        if (!customerId) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }

        // Create the subscription with Stripe
        const subscription = await stripe.subscriptions.create({
            customer: customerId, // Use the customer ID
            items: [{ price: plan }], // Price ID corresponding to the selected plan
            default_payment_method: paymentMethodId,
        });

        res.status(200).json(subscription);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
});

// Export the router
module.exports = router;