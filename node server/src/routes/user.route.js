import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { getDashboardData } from "../controllers/user.controller.js";

const router = Router();

// Protect all routes in this file or apply it route-by-route:
router.route("/dashboard").get(ensureAuthenticated, getDashboardData);

export default router;
