import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { uploadOnCloudinary } from "../services/cloudinary.service.js";
import { response } from "express";

const getReviewAnalysis = asyncHandler(async (req, res) => {
  const { review } = req.body;

  if (!review) {
    throw new ApiError(400, "Review text is needed");
  }

  let photoUrls = [];

  if (req.files?.photos?.length > 0) {
    // parallel uploads
    const uploadPromises = req.files.photos.map((photo) =>
      uploadOnCloudinary(photo.path),
    );

    const results = await Promise.all(uploadPromises);
    // get urls
    photoUrls = results
      .filter((result) => result !== null)
      .map((result) => result.secure_url);
  }

  // fastApi server call:
  const controller = new AbortController();
  // one minute window
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  let fastApiModelResponse;

  try {
    fastApiModelResponse = await fetch(process.env.FASTAPI_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review: review,
        photos: photoUrls,
      }),
    });
  } catch (networkError) {
    // network error
    throw new ApiError(
      503,
      networkError?.message ||
        "AI analysis microservice is currently unreachable or offline",
    );
  }
  clearTimeout(timeoutId);

  // error handling
  if (!fastApiModelResponse.ok) {
    const errorData = await fastApiModelResponse.json().catch(() => null);

    const errorMessage =
      errorData?.detail ||
      errorData?.message ||
      `AI Service failed with status: ${fastApiModelResponse.status}`;

    throw new ApiError(fastApiModelResponse.status, errorMessage);
  }

  // success
  const analysisResult = await fastApiModelResponse.json();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        analysisResult,
        "Review analysis generated successfully",
      ),
    );
});

export { getReviewAnalysis };
