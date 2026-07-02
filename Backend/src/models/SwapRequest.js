const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offeredProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
