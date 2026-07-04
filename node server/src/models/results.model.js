import mongoose, { Schema } from "mongoose";

const evidenceSchema = new Schema(
  {
    photo_url: {
      type: String,
      required: true,
    },
    bbox_2d: {
      type: [Number],
      required: true,
      validate: {
        validator: function (val) {
          return !val || val.length === 4;
        },
        message:
          "Bounding box must contain exactly 4 coordinates [x1, y1, x2, y2]",
      },
    },
  },
  { _id: false },
);

const aspectSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      required: true,
    },
    claim: {
      type: String,
      required: true,
    },
    evidence: {
      type: evidenceSchema,
      default: null,
    },
  },
  { _id: true },
);

const resultSchema = new Schema(
  {
    input: {
      type: Schema.Types.ObjectId,
      ref: "Input",
    },
    aspects: [aspectSchema],
  },
  { timestamps: true },
);

export const Result = mongoose.model("Result", resultSchema);
