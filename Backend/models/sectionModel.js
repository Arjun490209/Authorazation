import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Section = mongoose.model("section", sectionSchema);
