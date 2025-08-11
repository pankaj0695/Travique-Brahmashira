const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    countryCode: {
      type: String,
      required: true,
      uppercase: true,
      ref: "Country",
    },
    type: {
      type: String,
      enum: [
        "state",
        "province",
        "region",
        "territory",
        "district",
        "prefecture",
      ],
      default: "state",
    },
    capital: {
      type: String,
      required: false,
    },
    population: {
      type: Number,
      required: false,
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

// Compound index to ensure uniqueness within a country
stateSchema.index({ countryCode: 1, code: 1 }, { unique: true });
stateSchema.index({ countryCode: 1, name: 1 });

module.exports = mongoose.model("State", stateSchema);
