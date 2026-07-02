const mongoose = require("mongoose");
const slugGenerator = require("../utils/slugGenerator");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true, versionKey: false }
);

categorySchema.pre("validate", function setSlug() {
  if (!this.slug && this.name) {
    this.slug = slugGenerator(this.name);
  }
});

module.exports = mongoose.model("Category", categorySchema);
