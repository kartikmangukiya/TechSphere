import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ILike extends Document {
  blog: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// One like per user per blog.
likeSchema.index({ blog: 1, user: 1 }, { unique: true });

const Like: Model<ILike> =
  (mongoose.models.Like as Model<ILike>) ||
  mongoose.model<ILike>("Like", likeSchema);

export default Like;
