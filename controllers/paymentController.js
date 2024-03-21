const Payment = require("../models/paymentModel");
const RazorPay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv").config();

const instance = new RazorPay({
  key_id: process.env.RAZORPAY_PUBLIC_KEY,
  key_secret:process.env.RAZORPAY_SECRET_KEY,
});

// Checkout Handler
exports.checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
  }
};

// Verification Handler
exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");
  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

      res.redirect(
        `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

exports.getKey = async (req, res) => {
  try {
    res.status(200).json({
      key: "rzp_test_GzEfKJiOtnPEpR",
    });
  } catch (error) {
    console.log(error);
  }
};
