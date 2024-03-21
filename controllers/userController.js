const Booking = require("../models/bookingModel");
const Listing = require("../models/listingModel");
const User = require("../models/userModel");

// Get Trip List Controller
exports.getTripList = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Booking.find({
      customerId: userId,
    }).populate("customerId hostId listingId");
    if (!trips) {
      return res.status(400).json({
        success: false,
        message: "No trips Found",
      });
    }
    return res.status(200).json({
      success: true,
      total: trips.length,
      trips,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// Add To Wishlist Controller
exports.addToWhishList = async (req, res) => {
  try {
    const { listingId } = req.params;
    const user = await User.findById(req.user._id);
    const listing = await Listing.findById(listingId).populate("creator");
    const favoriteListing = user.wishList.find(
      (item) => item._id.toString() === listingId
    );
    if (favoriteListing) {
      user.wishList = user.wishList.filter(
        (item) => item._id.toString() !== listingId
      );
      await user.save();
      res.status(200).json({
        message: "Listing is removed from wish list",
        wishList: user.wishList,
      });
    } else {
      user.wishList.push(listing);
      await user.save();
      res.status(200).json({
        message: "Listing is added to wish list",
        wishList: user.wishList,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};


// GET Property List
exports.getPropertyList = async (req, res) => {
  try {
    const properties = await Listing.find({
      creator: req.user._id,
    }).populate("creator");
    if (!properties) {
      return res.status(404).json({
        success: false,
        message: "No Property Found",
      });
    }
    return res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    console.log(err);
    res.status(404).json({ error: error.message });
  }
};
