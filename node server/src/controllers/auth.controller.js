import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { passport } from "../config/passport.js";
import { User } from "../models/user.model.js";

// utility functions:
function sanitizeUser(user) {
  return {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerified,
  };
}

// register
const registerUser = asyncHandler(async (req, res, next) => {
  console.log("Entered registerUser");
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    throw new ApiError(400, "Email and password are required");
  }

  // if (password.length < 8) {
  //   throw new ApiError(400, "Password must be at least 8 characters");
  // }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const user = await User.create({
    email: email.toLowerCase(),
    password,
    fullName,
  });

  req.login(user, (err) => {
    if (err) {
      return next(new ApiError(500, "Registered, but auto-login failed"));
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: sanitizeUser(user) },
          "User registered successfully",
        ),
      );
  });
});

// login
const loginUser = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(
        new ApiError(500, err?.message || "Internal authentication error"),
      );
    }

    if (!user) {
      return next(
        new ApiError(401, info?.message || "Invalid email or password"),
      );
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(
          new ApiError(
            500,
            loginErr?.message || "Session creation failed during login",
          ),
        );
      }

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user: sanitizeUser(user) },
            "User logged in successfully",
          ),
        );
    });
  })(req, res, next); // IIFE
});

// redirects
const initiateGoogleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// google redirects back
const handleGoogleCallback = asyncHandler(async (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";

    if (err) {
      return res.redirect(`${FRONTEND_URL}/signin?error=GoogleAuthFailed`);
    }

    if (!user) {
      return res.redirect(`${FRONTEND_URL}/signin?error=Unauthorized`);
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.redirect(
          `${FRONTEND_URL}/signin?error=SessionCreationFailed`,
        );
      }

      return res.redirect(`${FRONTEND_URL}/dashboard`);
    });
  })(req, res, next);
});

// logout
const logoutUser = asyncHandler(async (req, res, next) => {
  // Tell Passport to unbind the user object from req
  req.logout((err) => {
    if (err) {
      return next(
        new ApiError(500, "Something went wrong while logging out", [
          err.message,
        ]),
      );
    }

    // Completely destroy the session in MongoDB Atlas
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        return next(
          new ApiError(500, "Failed to destroy session in database", [
            destroyErr.message,
          ]),
        );
      }

      // Tell the browser to wipe the session cookie immediately
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: process.env.MODE === "production",
      });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
    });
  });
});

// get me
const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized access. No active session found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: sanitizeUser(req.user) },
        "User fetched Successfuly",
      ),
    );
});

export {
  registerUser,
  loginUser,
  handleGoogleCallback,
  initiateGoogleAuth,
  logoutUser,
  getCurrentUser,
};
