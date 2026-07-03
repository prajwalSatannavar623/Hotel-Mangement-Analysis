import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  throw new ApiError(401, "User not Authenticated");
}

export { ensureAuthenticated };
