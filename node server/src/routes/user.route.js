import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { photoUploadMiddleware } from "../middlewares/multer.middleware.js";
import {
  getReviewAnalysis,
  getUserHistory,
  getParticularResult,
} from "../controllers/user.controller.js";

const router = Router();

// static routes
router
  .route("/get-review-analysis")
  .post(ensureAuthenticated, photoUploadMiddleware, getReviewAnalysis);
router.route("/me/history").get(ensureAuthenticated, getUserHistory);

// dynamic routes
router
  .route("/results/:resultId")
  .get(ensureAuthenticated, getParticularResult);

export default router;
