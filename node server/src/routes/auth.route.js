import passport from "passport";
import { User } from "../models/user.model.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  initiateGoogleAuth,
  handleGoogleCallback,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = Router();

// local auth
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(ensureAuthenticated, logoutUser);

// google auth
router.route("/google").get(initiateGoogleAuth);
router.route("/google/callback").get(handleGoogleCallback);

export default router;
