const mongoose = require("mongoose");
const slugGenerator = require("../utils/slugGenerator");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Excellent", "Good", "Fair", "Readable", "Poor"],
    },
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    district: {
      type: String,
      trim: true,
      default: "Sindhudurg",
    },
    taluka: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    productType: {
      type: String,
      enum: ["Sale", "Swap", "Both"],
      default: "Sale",
    },
    exchangePreference: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Available", "Pending Approval", "Rejected", "Reserved", "Sold", "Exchanged"],
      default: "Pending Approval",
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
  },
  { timestamps: true, versionKey: false }
);

productSchema.pre("validate", function setSlug() {
  if (!this.slug && this.title) {
    this.slug = `${slugGenerator(this.title)}-${Date.now().toString(36)}`;
  }
});

module.exports = mongoose.model("Product", productSchema);
