const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use Stripe secret key

router.post('/', async (req, res) => {
    const { paymentMethodId, plan, email } = req.body;

    try {
        // Create a customer
        const customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            email: email,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                { price: plan }, // Price ID passed from frontend
            ],
            expand: ['latest_invoice.payment_intent'],
        });

        res.status(200).json(subscription); // Send back the subscription data
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;