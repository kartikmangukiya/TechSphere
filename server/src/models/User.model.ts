import { model, Schema, type Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  bio?: string;
  headline?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
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
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    headline: {
      type: String,
      trim: true,
      maxlength: [100, "Headline cannot exceed 100 characters"],
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    github: {
      type: String,
      trim: true,
      default: "",
    },
    twitter: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const User = model("User", userSchema);
