const express = require("express");
const { registerUser, loginUser, getMyProfile, logoutUser } = require("../controllers/authController");
const upload = require("../middlewares/multer");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(upload.single("image"), registerUser);

router.route("/login").post(loginUser);

router.route("/me").get(isAuthenticated,getMyProfile);

router.route("/logout").get(isAuthenticated,logoutUser);

module.exports = router;
