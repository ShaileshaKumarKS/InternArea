const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // Replace with your Secret Key
const nodemailer = require('nodemailer');

// Payment intent creation
router.post('/create-payment-intent', async (req, res) => {
  const { payment_method, plan } = req.body;

  const price = plan.price * 100;  // Convert to smallest currency unit

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'inr',
      payment_method: payment_method,
      confirm: true,
    });

    res.send({
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

// Send invoice email after payment
router.post('/send-email', async (req, res) => {
  const { plan, paymentIntent, userEmail } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',  // Replace with your email
      pass: 'your-email-password',   // Replace with your email password
    },
  });

  const mailOptions = {
    from: 'shailesh4ks@gmail.com',
    to: userEmail,
    subject: `Subscription Confirmation: ${plan.name} Plan`,
    text: `You have successfully subscribed to the ${plan.name} Plan. Amount: ₹${plan.price}/month.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('Email sent');
  } catch (error) {
    res.status(500).send({ error: 'Email sending failed' });
  }
});

module.exports = router;