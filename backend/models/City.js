const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stateCode: {
      type: String,
      required: true,
      uppercase: true,
    },
    countryCode: {
      type: String,
      required: true,
      uppercase: true,
      ref: "Country",
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    population: {
      type: Number,
      required: false,
    },
    elevation: {
      type: Number,
      required: false,
    },
    timezone: {
      type: String,
      required: false,
    },
    isCapital: {
      type: Boolean,
      default: false,
    },
    isMajorCity: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
citySchema.index({ countryCode: 1, stateCode: 1 });
citySchema.index({ countryCode: 1, name: 1 });
citySchema.index({ stateCode: 1, name: 1 });
citySchema.index({ name: 1 });
citySchema.index({ isMajorCity: 1 });

module.exports = mongoose.model("City", citySchema);
