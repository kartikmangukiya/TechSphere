import mongoose, { Document, Schema } from "mongoose";
export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers, and hyphens",
      ],
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
      minlength: [20, "Category description must be at least 20 characters"],
      maxlength: [300, "Category description cannot exceed 300 characters"],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const Category = mongoose.model<ICategory>("Category", categorySchema);
