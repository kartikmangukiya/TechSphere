import { model, Schema, type Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = IUser & Document;

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const User = model("User", userSchema);
