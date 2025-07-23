import express from "express";
import {
  createListing,
  getAllListings,
  getListingsByProvider,
  getListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";
import { checkRole } from "../middleware/checkRole.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  checkRole("provider", "admin"),
  upload.single("image"),
  createListing
);
router.delete(
  "/:id",
  verifyToken,
  checkRole("provider", "admin"),
  deleteListing
);

router.get("/", getAllListings);
router.get("/provider/:id", getListingsByProvider);
router.get("/:id", getListing);
router.post(
  "/",
  verifyToken,
  checkRole("provider", "admin"),
  upload.single("image"),
  createListing
);
router.put(
  "/:id",
  verifyToken,
  checkRole("provider", "admin"),
  upload.single("image"),
  updateListing
);
router.delete(
  "/:id",
  verifyToken,
  checkRole("provider", "admin"),
  deleteListing
);

export default router;
