const PastTrip = require("../models/PastTrip");

// Get the latest planned trips (default 5). By default returns only shared trips.
// Query params:
//   - limit: number of trips to return (max 20)
//   - sharedOnly: 'true' | 'false' (default 'true')
exports.getLatestTrips = async (req, res) => {
  try {
    const limitParam = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 20) : 5;
    const sharedOnly = (req.query.sharedOnly ?? 'true') !== 'false';

    const filter = sharedOnly ? { shared: true } : {};

    const trips = await PastTrip.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("city checkIn checkOut preference budget shared createdAt");

    return res.json({ success: true, trips });
  } catch (error) {
    console.error("❌ Error in getLatestTrips:", error);
    return res.status(500).json({ error: "Failed to fetch latest trips" });
  }
};

// Admin/backoffice: Get all trips (paginated). Defaults: page=1, limit=20
// Query params:
//   - page: 1-based page number
//   - limit: results per page (max 100)
//   - sharedOnly: 'true' | 'false' (optional)
//   - userId: filter by userId (optional)
exports.getAllTrips = async (req, res) => {
  try {
    const pageParam = parseInt(req.query.page, 10);
    const limitParam = parseInt(req.query.limit, 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (typeof req.query.sharedOnly !== 'undefined') {
      filter.shared = String(req.query.sharedOnly) === 'true';
    }

    const [trips, total] = await Promise.all([
      PastTrip.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      PastTrip.countDocuments(filter),
    ]);

    return res.json({ success: true, page, limit, total, trips });
  } catch (error) {
    console.error("❌ Error in getAllTrips:", error);
    return res.status(500).json({ error: "Failed to fetch trips" });
  }
};
