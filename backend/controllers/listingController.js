import Listing from "../models/Listing.js";

// Add Listing (POST /api/listings)
export const createListing = async (req, res) => {
  try {
    let {
      residenceName,
      distanceToUniversity,
      nearbyUniversity,
      nearestTown,
      description,
      location,
    } = req.body;

    // Validate required text fields presence
    if (
      !residenceName ||
      !distanceToUniversity ||
      !nearbyUniversity ||
      !nearestTown ||
      !description ||
      !location
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Parse location JSON if it's a string
    if (typeof location === "string") {
      try {
        location = JSON.parse(location);
      } catch (parseErr) {
        return res
          .status(400)
          .json({ message: "Invalid JSON format for location." });
      }
    }

    // Validate location object has lat and lng
    if (
      location.lat === undefined ||
      location.lng === undefined ||
      isNaN(location.lat) ||
      isNaN(location.lng)
    ) {
      return res
        .status(400)
        .json({ message: "Location must include valid lat and lng numbers." });
    }

    // Extract number from distanceToUniversity (e.g. "2 km" => 2)
    const distanceNumberMatch = distanceToUniversity
      .toString()
      .match(/\d+(\.\d+)?/);
    if (!distanceNumberMatch) {
      return res
        .status(400)
        .json({ message: "distanceToUniversity must contain a number." });
    }
    const distanceNumber = parseFloat(distanceNumberMatch[0]);

    // Prepare image filename if file uploaded
    const image = req.file ? req.file.filename : null;

    // Create Listing
    const listing = new Listing({
      residenceName,
      distanceToUniversity: distanceNumber,
      nearbyUniversity,
      nearestTown,
      description,
      location,
      image,
      createdBy: req.user.id,
    });

    await listing.save();

    res.status(201).json(listing);
  } catch (err) {
    console.error("❌ Error creating listing:", err);
    res.status(500).json({
      message: "Failed to create listing",
      error: err.message,
    });
  }
};

// Get all listings (GET /api/listings)
export const getAllListings = async (req, res) => {
  const listings = await Listing.find().populate(
    "createdBy",
    "name email role"
  );
  res.json(listings);
};

// Get listings by provider (GET /api/listings/provider/:id)
export const getListingsByProvider = async (req, res) => {
  const listings = await Listing.find({ createdBy: req.params.id });
  res.json(listings);
};

// Get single listing (GET /api/listings/:id)
export const getListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  res.json(listing);
};

// Update listing (PUT /api/listings/:id)
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Only owner or admin can update
    if (
      listing.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedData = {
      ...req.body,
      location: req.body.location
        ? JSON.parse(req.body.location)
        : listing.location,
      image: req.file ? req.file.filename : listing.image,
    };

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Delete listing (DELETE /api/listings/:id)
export const deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  // Only provider who created it or admin can delete
  if (
    listing.createdBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "You can't delete this listing" });
  }

  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: "Listing deleted successfully" });
};
