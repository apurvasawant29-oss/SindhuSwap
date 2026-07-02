const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "General" },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Unread", "Read", "Archived"],
      default: "Unread",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
