const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const cloudinary = require("cloudinary");
const listingRoutes = require("./routes/listingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentsRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Config
dotenv.config();
connectDB();


// Clodinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Midllewares
app.use(express.json({}));
app.use(cookieParser());
app.use(
  cors({
    origin:"http://localhost:5173",
    // origin: "https://wonderstay.vercel.app",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));



// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/listing", listingRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/payment", paymentsRoutes);
app.use("/api/v1/user",userRoutes);


// Test Server
app.get("/", (req, res) => {
  res.send("hello Server");
});

//Port config
const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server Started Running Successfuly on the port:${port} `);
});
