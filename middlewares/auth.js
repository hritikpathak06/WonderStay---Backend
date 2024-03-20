const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please Login To Continue",
      });
    }
    const decodedData = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = await User.findById(decodedData._id);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Intarnal Server Error",
      error: error.message,
    });
  }
};
