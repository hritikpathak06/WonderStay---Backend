const User = require("../models/userModel");
const cloudinary = require("cloudinary");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill Out All The Fields",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const file = req.file;
    // Upload profile image to Cloudinary
    const myCloud = await cloudinary.uploader.upload(file.path);

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      profileImage: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Sever Error",
      error: error.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill Out All The Fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    // Compare Password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = await user.generateToken();
    res.cookie("token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Sever Error",
      error: error.message,
    });
  }
};

// Get My Profile
exports.getMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.status(200).json({
    success: true,
    user,
  });
};


// Logout
exports.logoutUser = async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "user logged out successfully",
    });
};
