const paymentService = require("../Services/paymentService");

const createOrder = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: "Order creation failed",
        error: "RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables on Vercel.",
      });
    }

    const { amount } = req.body;
    const order = await paymentService.createOrder(amount);
    res.status(200).json({ orderId: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    console.error("Payment Order Creation Error:", error);
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const isValid = await paymentService.verifyPayment(req.body);
    res.status(200).json({ success: isValid });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
