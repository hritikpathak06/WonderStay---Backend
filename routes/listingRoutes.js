const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const { createNewListing } = require("../controllers/listingController");
const router = express.Router();

router
  .route("/create")
  .post(isAuthenticated, upload.array("images", 5), createNewListing);

module.exports = router;
