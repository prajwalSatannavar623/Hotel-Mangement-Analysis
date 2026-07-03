import mongoose, { mongo, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },

    password: {
      type: String,
      select: false,
    },
    google: {
      id: {
        type: String,
        unique: true,
        sparse: true,
      },
      email: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export const User = mongoose.model("User", userSchema);
