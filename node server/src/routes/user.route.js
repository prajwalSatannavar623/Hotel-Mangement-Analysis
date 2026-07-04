import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { photoUploadMiddleware } from "../middlewares/multer.middleware.js";
import {
  getReviewAnalysis,
  getUserHistory,
  getParticularHistory,
} from "../controllers/user.controller.js";

const router = Router();

// static routes
router
  .route("/get-review-analysis")
  .post(ensureAuthenticated, photoUploadMiddleware, getReviewAnalysis);
router.route("/me/history").get(ensureAuthenticated, getUserHistory);

// dynamic routes
router
  .route("/:inputId/history")
  .get(ensureAuthenticated, getParticularHistory);

export default router;
