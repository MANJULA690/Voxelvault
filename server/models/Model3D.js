const mongoose = require("mongoose");

const model3DSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    thumbnail: { type: String, required: true },
    embedUrl: { type: String, default: "" },
    tags: [{ type: String, lowercase: true, trim: true }],
    category: {
      type: String,
      enum: ["architecture", "character", "vehicle", "nature", "product", "abstract", "other"],
      default: "other",
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Model3D", model3DSchema);
