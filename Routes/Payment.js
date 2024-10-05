const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use Stripe secret key
const nodemailer=require('nodemailer');

router.post('/', async (req, res) => {
    const { paymentMethodId, plan, email } = req.body;

    try {
        // Create a customer
        const customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            email:email,
        });

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                { price: plan }, // Price ID passed from frontend
            ],
            expand: ['latest_invoice.payment_intent'],
            invoice_settings:{
              default_payment_method:paymentMethodId,
            },
        });

        const invoiceId = subscription.latest_invoice;
        
        const invoice=await stripe.invoices.retrieve(invoiceId);

        const transporter=nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
           },
        });

        //Sending the mail with subscription details and invoice
        const mailOptions={
          from:process.env.EMAIL_USER,
          to:email,
          subject:'Subscription Confirmation and Invoice',
          text:`Thank you for subscribing to our plan.Here are your details:\n\n
          Plan:${plan}\n
          Amount Paid:${invoice.total/100} ${invoice.currency.toUpperCase()}\n
          Invoice URL:${invoice.hosted_inovice_url}\n\n
          Thank you..`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json(subscription); // Send back the subscription data
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;