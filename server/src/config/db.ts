import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("DB connection failed:", error.message);
    } else {
      console.error("DB connection failed:", error);
    }
    process.exit(1);
  }
};
