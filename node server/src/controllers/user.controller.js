import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// A protected dashboard or user-profile controller
const getDashboardData = asyncHandler(async (req, res) => {
  // Because ensureAuthenticated ran first, req.user is guaranteed to exist!
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: req.user,
          message: `Welcome ${req.user.fullName || req.user.email}`,
        },
        "Dashboard fetched successfully",
      ),
    );
});

export { getDashboardData };
