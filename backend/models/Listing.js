import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  residenceName: { type: String, required: true },
  distanceToUniversity: { type: Number, required: true },
  nearbyUniversity: { type: String, required: true },
  nearestTown: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  image: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Listing", listingSchema);
