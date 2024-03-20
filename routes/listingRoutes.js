const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const { createNewListing, getListingsByCategory } = require("../controllers/listingController");
const router = express.Router();

router
  .route("/create")
  .post(isAuthenticated, upload.array("images", 10), createNewListing);

  router.route("/filter").get(getListingsByCategory);

module.exports = router;
