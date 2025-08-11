const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 2,
      maxlength: 3,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    continent: {
      type: String,
      required: true,
      enum: [
        "Asia",
        "Europe",
        "North America",
        "South America",
        "Africa",
        "Oceania",
        "Antarctica",
      ],
    },
    currency: {
      type: String,
      required: false,
    },
    language: {
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

countrySchema.index({ code: 1 });
countrySchema.index({ name: 1 });

module.exports = mongoose.model("Country", countrySchema);
