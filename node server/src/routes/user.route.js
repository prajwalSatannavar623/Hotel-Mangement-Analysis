import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { photoUploadMiddleware } from "../middlewares/multer.middleware.js";
import { getReviewAnalysis } from "../controllers/user.controller.js";

const router = Router();

router
  .route("/get-review-analysis")
  .post(ensureAuthenticated, photoUploadMiddleware, getReviewAnalysis);

export default router;
