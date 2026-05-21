    const express = require("express");
    const router = express.Router();
    const Stripe = require("stripe");
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    router.post("/create-checkout-session", async (req, res) => {
    const { amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
            price_data: {
                currency: "inr",
                product_data: {
                name: "Ride Fare",
                },
                unit_amount: Math.round(amount * 100), // Convert ₹ to paise
            },
            quantity: 1,
            },
        ],
        success_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-failed",
        });

        res.json({ id: session.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    });

    module.exports = router;
