import passport from "passport";
import User from "../models/user.model.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  registerUser,
  loginUser,
  initiateGoogleAuth,
  handleGoogleCallback,
  handleLoginFailed,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/google").get(initiateGoogleAuth);
router.route("/google/callback").get(handleGoogleCallback);

router.route("/login-failed").get(handleLoginFailed);

export default router;
