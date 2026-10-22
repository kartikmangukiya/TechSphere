import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

}, { timestamps: true });

export const Subscribe = mongoose.model("Subscribe", subscribeSchema);