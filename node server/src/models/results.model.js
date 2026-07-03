import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
  {
    input: {
      type: Schema.Types.ObjectId,
      ref: "Input",
    },
    results: [
      {
        aspect: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          required: String,
        },
      },
    ],
  },
  { timestamps: true },
);

export const Result = mongoose.model("Result", resultSchema);
