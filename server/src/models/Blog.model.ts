import mongoose, { Document, Schema, Types } from "mongoose";

export type BlogStatus = "draft" | "published";

export interface IBlog extends Document {
  title: string;
  description: string;
  content: string;
  tags: string[];
  featuredImage: string | null;
  status: BlogStatus;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Blog description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
      minlength: [50, "Content must be at least 50 characters"],
    },
    tags: {
      type: [String],
      default: [],
      set: (tags: string[]) => tags.map((tag) => tag.trim().toLowerCase()),
    },
    featuredImage: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: "Status must be either draft or published",
      },
      default: "draft",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Blog author is required"],
    },
  },
  { timestamps: true },
);

blogSchema.index({ author: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: "text", description: "text", content: "text" });

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);
