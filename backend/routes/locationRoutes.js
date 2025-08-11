const express = require("express");
const router = express.Router();
const Country = require("../models/Country");
const State = require("../models/State");
const City = require("../models/City");

// Get all countries
router.get("/countries", async (req, res) => {
  try {
    const countries = await Country.find({ isActive: true })
      .select("code name continent currency language population")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: countries,
      count: countries.length,
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch countries",
      error: error.message,
    });
  }
});

// Get states by country
router.get("/countries/:countryCode/states", async (req, res) => {
  try {
    const { countryCode } = req.params;

    // Validate country exists
    const country = await Country.findOne({
      code: countryCode.toUpperCase(),
      isActive: true,
    });
    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    const states = await State.find({
      countryCode: countryCode.toUpperCase(),
      isActive: true,
    })
      .select("code name type capital population")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: states,
      count: states.length,
      country: {
        code: country.code,
        name: country.name,
      },
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch states",
      error: error.message,
    });
  }
});

// Get cities by country and state
router.get(
  "/countries/:countryCode/states/:stateCode/cities",
  async (req, res) => {
    try {
      const { countryCode, stateCode } = req.params;
      const { limit = 50, majorOnly = false } = req.query;

      // Validate state exists
      const state = await State.findOne({
        countryCode: countryCode.toUpperCase(),
        code: stateCode.toUpperCase(),
        isActive: true,
      });

      if (!state) {
        return res.status(404).json({
          success: false,
          message: "State not found",
        });
      }

      let query = {
        countryCode: countryCode.toUpperCase(),
        stateCode: stateCode.toUpperCase(),
        isActive: true,
      };

      // Filter for major cities only if requested
      if (majorOnly === "true") {
        query.$or = [{ isMajorCity: true }, { isCapital: true }];
      }

      const cities = await City.find(query)
        .select(
          "name latitude longitude population isCapital isMajorCity timezone"
        )
        .sort({
          isCapital: -1, // Capitals first
          isMajorCity: -1, // Then major cities
          population: -1, // Then by population
          name: 1, // Finally alphabetically
        })
        .limit(parseInt(limit));

      res.json({
        success: true,
        data: cities,
        count: cities.length,
        state: {
          code: state.code,
          name: state.name,
        },
        filters: {
          limit: parseInt(limit),
          majorOnly: majorOnly === "true",
        },
      });
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch cities",
        error: error.message,
      });
    }
  }
);

// Search cities by name (useful for autocomplete)
router.get("/cities/search", async (req, res) => {
  try {
    const { q, countryCode, limit = 20 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters long",
      });
    }

    let query = {
      name: { $regex: q, $options: "i" },
      isActive: true,
    };

    // Filter by country if provided
    if (countryCode) {
      query.countryCode = countryCode.toUpperCase();
    }

    const cities = await City.find(query)
      .select(
        "name stateCode countryCode latitude longitude population isCapital isMajorCity"
      )
      .sort({
        isMajorCity: -1,
        population: -1,
        name: 1,
      })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: cities,
      count: cities.length,
      query: q,
    });
  } catch (error) {
    console.error("Error searching cities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search cities",
      error: error.message,
    });
  }
});

// Get popular destinations (major cities)
router.get("/destinations/popular", async (req, res) => {
  try {
    const { limit = 20, countryCode } = req.query;

    let query = {
      isMajorCity: true,
      isActive: true,
    };

    if (countryCode) {
      query.countryCode = countryCode.toUpperCase();
    }

    const cities = await City.find(query)
      .select(
        "name stateCode countryCode latitude longitude population isCapital"
      )
      .sort({ population: -1, name: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: cities,
      count: cities.length,
    });
  } catch (error) {
    console.error("Error fetching popular destinations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular destinations",
      error: error.message,
    });
  }
});

module.exports = router;
