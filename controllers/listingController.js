const Listing = require("../models/listingModel");
const cloudinary = require("cloudinary").v2;

exports.createNewListing = async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    // Upload images to Cloudinary
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "listings",
      });
      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    // Create the listing
    const listing = new Listing({
      creator: req.user._id,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      images: uploadedImages,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });
    await listing.save();

    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create listing", error: err.message });
  }
};

// Get Listing By Categories Controller
exports.getListingsByCategory = async (req, res) => {
  try {
    const qCategory = req.query.category;
    let listings;
    if (qCategory) {
      listings = await Listing.find({
        category: qCategory,
      }).populate("creator");
    } else {
      listings = await Listing.find().populate("creator");
    }
    res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create listing", error: error.message });
  }
};

// Get Details Of Single Listing
exports.getSingleListingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("creator");
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "No List Found",
      });
    }
    return res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create listing", error: error.message });
  }
};
