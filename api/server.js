// api/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const serverless = require("serverless-http");

// Routers
const productRouter = require("../Routes/Route");
const authRouter = require("../Routes/AuthRoute");
const paymentRouter = require("../Routes/PaymentRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection middleware for serverless environment
const connectDB = async (req, res, next) => {
  if (mongoose.connection.readyState >= 1) {
    return next();
  }
  try {
    if (!process.env.MONGO_DB) {
      throw new Error("MONGO_DB environment variable is not defined on Vercel!");
    }
    await mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDB Connected Successfully (Serverless)");
    next();
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    return res.status(500).json({ message: "Database connection failed", error: err.message });
  }
};

app.use(connectDB);

// Routes
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/payment", paymentRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Express Backend is running on Vercel!");
});

// Export as serverless function
module.exports = app;
module.exports.handler = serverless(app);



















// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();  // <-- IMPORTANT

// const productRouter = require("./Routes/Route");
// const authRouter = require("./Routes/AuthRoute");
// const paymentRouter = require("./Routes/PaymentRoute");

// const app = express();


// app.use(cors());
// app.use(express.json());

// // Auth Routes
// app.use("/api/auth", authRouter);

// // Product Routes
// app.use("/api/product", productRouter);

// // Payment Routes
// app.use("/api/payment", paymentRouter);

// mongoose.connect(process.env.MONGO_DB)
//   .then(() => console.log("MongoDB Connected Successfully"))
//   .catch(err => console.log("MongoDB Connection Failed:", err));

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on http://localhost:${process.env.PORT}`);
// });
