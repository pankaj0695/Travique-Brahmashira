const express = require("express");
const axios = require("axios");

const imageRouter = express.Router();

// Hotel Image Fetch Route
imageRouter.post("/fetchHotelImage", async (req, res) => {
  const { hotelName, city } = req.body;
  const query = city ? `${hotelName}, ${city}` : hotelName;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
        query
      )}&searchType=image&num=1&key=${process.env.GOOGLE_API_KEY}&cx=${
        process.env.GOOGLE_CX
      }`
    );

    const data = response.data;
    const imageUrl = data.items?.[0]?.link;

    if (imageUrl) {
      res.json({ success: true, imageUrl });
    } else {
      res.status(404).json({ success: false, error: "Image not found" });
    }
  } catch (err) {
    console.error("Image fetch error:", err.message);
    res.status(500).json({ success: false, error: "Image fetch failed" });
  }
});

// Meal Image Fetch Route
imageRouter.post("/fetchMealImage", async (req, res) => {
  const { mealName } = req.body;
  if (!mealName)
    return res
      .status(400)
      .json({ success: false, error: "mealName is required" });
  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?key=${
        process.env.GOOGLE_API_KEY
      }&cx=${process.env.GOOGLE_CX}&q=${encodeURIComponent(
        mealName
      )}&searchType=image&num=1`
    );
    const data = response.data;
    const imageUrl = data.items?.[0]?.link;
    if (imageUrl) {
      res.json({ success: true, imageUrl });
    } else {
      res.status(404).json({ success: false, error: "Image not found" });
    }
  } catch (err) {
    console.error("Meal image fetch error:", err.message);
    res.status(500).json({ success: false, error: "Image fetch failed" });
  }
});

module.exports = imageRouter;
