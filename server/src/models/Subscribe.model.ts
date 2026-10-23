import mongoose, { Schema, type Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  isSubscribed: boolean;
  subscribedAt: Date;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    isSubscribed: {
      type: Boolean,
      default: true,
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Subscriber = mongoose.model<ISubscriber>(
  "Subscriber",
  subscriberSchema,
);