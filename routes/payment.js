// routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn("⚠️ Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env");
}

const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

// Create order (amount is in INR from client, we convert to paise)
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Valid amount (INR) required" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // to paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify payment signature (optional but recommended)
router.post("/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment fields" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto.createHmac("sha256", keySecret).update(sign).digest("hex");

    if (expected === razorpay_signature) {
      return res.json({ status: "ok" });
    } else {
      return res.status(400).json({ status: "failed", error: "Invalid signature" });
    }
  } catch (err) {
    console.error("verify error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;
