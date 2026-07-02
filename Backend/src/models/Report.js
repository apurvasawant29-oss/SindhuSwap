const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Product", "User", "Book"], required: true },
    targetName: { type: String, required: true },
    targetId: { type: String, required: true },
    reporterName: { type: String, required: true },
    reason: { type: String, required: true },
    evidence: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Resolved", "Dismissed"], default: "Pending" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Report", reportSchema);
