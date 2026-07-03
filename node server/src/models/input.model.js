import mongoose, { mongo, Schema } from "mongoose";

const inputSchema = new Schema(
  {
    review: {
      type: String,
      required: true,
    },
    images: [
      {
        imageUrl: {
          type: String,
          required,
        },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default Input = mongoose.model("Input", inputSchema);
