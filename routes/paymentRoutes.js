const express = require("express");
const {
  checkout,
  paymentVerification,
  getKey,
} = require("../controllers/paymentController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/key").get(isAuthenticated, getKey);
router.route("/checkout").post( isAuthenticated,checkout);
router.route("/verify").post( isAuthenticated,  paymentVerification);

module.exports = router;
