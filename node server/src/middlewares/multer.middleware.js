import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  {
    name: "photos",
    maxCount: 5,
  },
]);

export const photoUploadMiddleware = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // validation error
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(
          new ApiError(
            400,
            "Validation error: You have uploaded maximum of 5 photos.",
          ),
        );
      }

      // other multer errors:
      return next(new ApiError(400, `Multer Error: ${err?.message}`));
    } else if (err) {
      // non multer errors
      return next(new ApiError(500, err?.message || "Internal server error"));
    }

    next();
  });
};
