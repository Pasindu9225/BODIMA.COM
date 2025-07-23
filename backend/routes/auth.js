import express from "express";
import {
  register,
  login,
  deleteUser,
  resetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyToken, verifyUser);
router.post("/reset-password", resetPassword);
router.delete("/delete", verifyToken, deleteUser);

export default router;
