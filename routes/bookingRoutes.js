const express = require("express");
const { createBooking } = require("../controllers/bookingController");
const router = express.Router();

router.route("/create").post(createBooking);

module.exports = router;
