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
        creator:req.user._id,
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
  
