const express = require("express");
const {
  getTripList,
  addToWhishList,
  getPropertyList,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/trip/:userId").get(getTripList);

router.route("/wishlist/:listingId").put(isAuthenticated, addToWhishList);

router.route("/myProperties").get(isAuthenticated, getPropertyList);


module.exports = router;
