import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";

// register
const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    throw new ApiError(400, "Email and password are required");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
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
      return next(new ApiError(500, "Internal authentication error"));
    }

    if (!user) {
      return next(
        new ApiError(401, info?.message || "Invalid email or password"),
      );
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(
          new ApiError(500, "Session creation failed during login", [
            loginErr.message,
          ]),
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
    if (err) {
      return next(
        new ApiError(500, "Google authentication failed", [err.message]),
      );
    }

    if (!user) {
      // You can either redirect to a frontend error page or throw an ApiError
      return res.redirect("/login-failed");
    }

    // Log the user in to establish the session
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(
          new ApiError(500, "Failed to create session after Google login", [
            loginErr.message,
          ]),
        );
      }

      return res.redirect("/");
    });
  })(req, res, next);
});

// login-failed
const handleLoginFailed = (req, res) => {
  // You can return an ApiError/ApiResponse here, or redirect to your frontend error page
  res.status(401).json({ error: "Google authentication failed" });
};

export {
  registerUser,
  loginUser,
  handleGoogleCallback,
  initiateGoogleAuth,
  handleLoginFailed,
};
