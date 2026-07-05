import { ApiError } from "./ApiError.js";

export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // validation error
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  // mongo db duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];

    const formattedField = field.charAt(0).toUpperCase() + field.slice(1);

    message = `This ${formattedField} is already taken. Please choose another.`;
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    ...(process.env.MODE === "development" && { stack: err.stack }),
  });
};
