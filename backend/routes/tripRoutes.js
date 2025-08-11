const express = require("express");
const axios = require("axios");
const PastTrip = require("../models/PastTrip");

const tripRouter = express.Router();

// Generate trip suggestions using Gemini 2.5 Flash (Vertex AI)
const { VertexAI } = require("@google-cloud/vertexai");
const path = require("path");

tripRouter.post("/generate-trip", async (req, res) => {
  const { city, checkin, checkout, preference, budget } = req.body;

  const preferenceText =
    Array.isArray(preference) && preference.length
      ? preference.join(", ")
      : preference || "a mix of experiences";

  // Derive trip length from dates instead of hardcoding 5 days
  const daysText =
    checkin && checkout ? `from ${checkin} to ${checkout}` : "for 5 days";

  const prompt = `You are a smart travel planner.
Plan a budget-friendly trip to ${city} ${daysText} for a traveler who prefers ${preferenceText}.
The total budget is ₹${budget}.

Reply in valid JSON with these keys only: hotels, meals, itinerary, estimatedTotal, packingList.
- hotels: array of at least 3 hotels (name, type, location, totalCost, features[])
- meals: for breakfast, lunch, dinner (cuisineType, famousDish, minCost, recommendedRestaurants[])
- itinerary: day-wise plan with date labels, each place/activity with minTransportCost
- estimatedTotal: object with breakdown and total
- packingList: array of items based on weather
No extra text, no markdown, just the JSON object as response.`;

  try {
    const vertexAi = new VertexAI({
      project: "massive-graph-465922-i8",
      location: "us-central1",
      googleAuthOptions: {
        keyFilename: path.join(__dirname, "../vertex-ai-key.json"),
      },
    });

    const model = vertexAi.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const resp = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.3,
      },
    });

    // Extract text safely
    const text =
      resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    // Parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse error:", e, "raw:", text);
      return res.status(502).json({
        error: "Model did not return valid JSON",
        raw: text,
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("❌ Error in /generate-trip:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch trip suggestions from Vertex AI" });
  }
});

// Get events from PredictHQ
tripRouter.post("/predicthq-events", async (req, res) => {
  const { city, checkin, checkout } = req.body;
  const PREDICTHQ_API_KEY = process.env.PREDICTHQ_API_KEY;

  if (!PREDICTHQ_API_KEY)
    return res.status(500).json({ error: "PredictHQ key missing" });

  try {
    /* 1️⃣  Get lat/lon with free OpenStreetMap Nominatim */
    const geoResp = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          format: "json",
          q: city,
          limit: 1,
        },
        headers: {
          "User-Agent": "https://github.com/SakshiKukreja04/Travel--Buddy",
          Referer: "https://travel-buddy-orpin.vercel.app",
        },
      }
    );
    const geoJson = geoResp.data;
    if (!geoJson.length) throw new Error("City not found by geocoder");

    const { lat, lon, display_name } = geoJson[0];

    /* 2️⃣  Query PredictHQ — return LOCAL start/end times */
    const startIso = new Date(checkin).toISOString();
    const endIso = new Date(checkout).toISOString();

    const phqResp = await axios.get(
      `https://api.predicthq.com/v1/events?within=50km@${lat},${lon}` +
        `&start.gte=${startIso}&start.lte=${endIso}` +
        `&limit=20&utc_offset=local`,
      {
        headers: {
          Authorization: `Bearer ${PREDICTHQ_API_KEY}`,
          Accept: "application/json",
        },
      }
    );
    if (phqResp.status !== 200) {
      throw new Error(`PredictHQ ${phqResp.status}`);
    }

    const { results } = phqResp.data;

    /* 3️⃣  Shape for the React front‑end */
    const events = results.map((e) => ({
      id: e.id,
      name: e.title,
      description: e.description || "",
      start: e.start, // already local
      end: e.end,
      category: e.category,
      venue: {
        name: e.entities?.[0]?.name || "TBD",
        address: e.entities?.[0]?.formatted_address || "TBD",
      },
      phq_attendance: e.phq_attendance,
      url: e.url || null,
      cityDisplay: display_name,
    }));

    res.json({ success: true, events });
  } catch (err) {
    console.error("❌ Error in /predicthq-events:", err);
    res
      .status(500)
      .json({ error: "PredictHQ fetch failed", details: err.message });
  }
});

// Save a new trip suggestion
tripRouter.post("/saveTrip", async (req, res) => {
  try {
    const { userId, city, checkIn, checkOut, preference, budget, suggestions } =
      req.body;

    console.log("Sending to /saveTrip:", {
      userId,
      city,
      checkIn,
      checkOut,
      preference,
      budget,
      suggestions,
    });

    if (
      !userId ||
      !city ||
      !checkIn ||
      !checkOut ||
      !preference ||
      !budget ||
      !suggestions
    ) {
      console.log("Missing required fields:", {
        userId: !!userId,
        city: !!city,
        checkIn: !!checkIn,
        checkOut: !!checkOut,
        preference: !!preference,
        budget: !!budget,
        suggestions: !!suggestions,
      });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTrip = new PastTrip({
      userId,
      city,
      checkIn,
      checkOut,
      preference: Array.isArray(preference) ? preference : [preference],
      budget: Number(budget),
      suggestions,
    });

    const savedTrip = await newTrip.save();
    console.log("✅ Trip saved:", savedTrip._id);
    res.status(201).json({ success: true, trip: savedTrip });
  } catch (error) {
    console.error("❌ Error in saveTrip:", error);
    res
      .status(500)
      .json({ error: "Failed to save trip", details: error.message });
  }
});

// Get all past trips for a user
tripRouter.get("/getPastTrips/:userId", async (req, res) => {
  console.log("--- getPastTrips endpoint hit ---");
  try {
    console.log("Request params:", req.params);
    const { userId } = req.params;

    if (!userId) {
      console.log("User ID is missing!");
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Querying PastTrip for userId:", userId);
    const trips = await PastTrip.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    console.log("Trips found:", trips.length);
    res.json({ success: true, trips });
  } catch (error) {
    console.error("Error fetching past trips:", error);
    res.status(500).json({
      error: "Failed to fetch past trips",
      details: error.message || error.toString(),
    });
  }
});

// Delete a specific trip
tripRouter.delete("/deleteTrip/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({ error: "Trip ID is required" });
    }

    const deletedTrip = await PastTrip.findByIdAndDelete(tripId);

    if (!deletedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

module.exports = tripRouter;
