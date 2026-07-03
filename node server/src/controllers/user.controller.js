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
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const fastApiModelResponse = await fetch(process.env.FASTAPI_SERVER_URL, {
    method: "POST",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      review: review,
      photoUrls: photoUrls,
    }),
  });
  clearTimeout(timeoutId);

  if (!fastApiModelResponse.ok) {
    // const errorData = await fastApiResponse.json().catch(() => null);
    throw new ApiError(502, "Failed to fetch analysis from AI server");
  }

  const analysisResult = await fastApiModelResponse.json();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { analysis: analysisResult },
        "Review analysis generated successfully",
      ),
    );
});

export { getReviewAnalysis };
