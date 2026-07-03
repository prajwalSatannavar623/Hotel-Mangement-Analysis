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

    passwordHash: {
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

userSchema.methods.isPasswordCorrect = async (password) => {
  const isMatch = await bcrypt.compare(password, this.passwordHash);
  return isMatch;
};

export default User = mongoose.model("User", userSchema);
