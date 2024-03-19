const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const upload = require("../middlewares/multer");
const router = express.Router();

router.route("/register").post(upload.single("image"), registerUser);
router.route("/login").post(loginUser);

module.exports = router;
