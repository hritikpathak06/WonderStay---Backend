const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const cloudinary = require("cloudinary");

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
    // origin: "*",
    origin:"http://localhost:5173",
    credentials:true
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));

// Routes
app.use("/api/v1/auth",authRoutes);


app.get("/",(req,res) => {
  res.send("hello Server")
})

//Port config
const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server Started Running Successfuly on the port:${port} `);
});
