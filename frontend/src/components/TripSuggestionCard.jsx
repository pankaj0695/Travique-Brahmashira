import React from "react";

const TripSuggestionCard = ({ suggestions }) => {
  if (!suggestions) return null;

  return (
    <div style={{ color: "#000000" }}>
      {/* Hotel Section */}
      {suggestions.hotel && (
        <section style={{ marginBottom: "1.2rem" }}>
          <h4 style={{ marginBottom: 4, color: "#000000" }}>Hotel</h4>
          <p style={{ color: "#000000" }}>
            <b>{suggestions.hotel.name}</b> ({suggestions.hotel.type})
          </p>
          <p style={{ color: "#000000" }}>
            <b>Cost:</b> ₹{suggestions.hotel.totalCost}
          </p>
          <ul style={{ color: "#000000" }}>
            {suggestions.hotel.features?.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Meals Section */}
      {suggestions.meals && (
        <section style={{ marginBottom: "1.2rem" }}>
          <h4 style={{ marginBottom: 4, color: "#000000" }}>Meals</h4>
          {Object.entries(suggestions.meals).map(([meal, info]) => (
            <div key={meal} style={{ marginBottom: 8, color: "#000000" }}>
              <b>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</b>
              <div>Cuisine: {info.cuisineType}</div>
              <div>Famous Dish: {info.famousDish}</div>
              <div>Min Cost: ₹{info.minCost}</div>
              <div>Restaurants: {info.recommendedRestaurants?.join(", ")}</div>
            </div>
          ))}
        </section>
      )}

      {/* Itinerary Section */}
      {suggestions.itinerary && (
        <section style={{ marginBottom: "1.2rem" }}>
          <h4 style={{ marginBottom: 4, color: "#000000" }}>Itinerary</h4>
          {Array.isArray(suggestions.itinerary)
            ? // Handle array format (daywise itinerary)
              suggestions.itinerary.map((dayPlan, idx) => (
                <div key={idx} style={{ marginBottom: 12, color: "#000000" }}>
                  <b>{dayPlan.day || `Day ${idx + 1}`}</b>
                  {dayPlan.date && <div>Date: {dayPlan.date}</div>}
                  {dayPlan.activities && Array.isArray(dayPlan.activities) && (
                    <ul style={{ marginLeft: 16, color: "#000000" }}>
                      {dayPlan.activities.map((activity, actIdx) => (
                        <li key={actIdx}>
                          {activity.time && <b>{activity.time}:</b>}{" "}
                          {activity.description || activity.activity}
                          {activity.place && <> at {activity.place}</>}
                          {activity.minTransportCost && (
                            <> (Transport: ₹{activity.minTransportCost})</>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            : // Handle object format (legacy)
              Object.entries(suggestions.itinerary).map(([day, details]) => (
                <div key={day} style={{ marginBottom: 6, color: "#000000" }}>
                  <b>{day}</b>
                  <ul style={{ marginLeft: 16, color: "#000000" }}>
                    {Object.entries(details).map(([k, v]) => (
                      <li key={k}>
                        <b>{k}:</b>{" "}
                        {typeof v === "object"
                          ? v.place ||
                            v.description ||
                            v.activity ||
                            JSON.stringify(v)
                          : String(v)}
                        {v.minTransportCost && (
                          <> (Min Transport: ₹{v.minTransportCost})</>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
        </section>
      )}

      {/* Estimated Total */}
      {suggestions.estimatedTotal && (
        <section style={{ marginBottom: "1.2rem" }}>
          <h4 style={{ marginBottom: 4, color: "#000000" }}>
            Estimated Budget
          </h4>
          <ul style={{ color: "#000000" }}>
            {Object.entries(suggestions.estimatedTotal.breakdown || {}).map(
              ([k, v]) => (
                <li key={k}>
                  <b>{k}:</b>{" "}
                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </li>
              )
            )}
          </ul>
          <p style={{ color: "#000000" }}>
            <b>Total:</b> {suggestions.estimatedTotal.total}
          </p>
        </section>
      )}

      {/* Packing List */}
      {Array.isArray(suggestions.packingList) &&
        suggestions.packingList.length > 0 && (
          <section style={{ marginBottom: "1.2rem" }}>
            <h4 style={{ marginBottom: 4, color: "#000000" }}>Packing List</h4>
            <ul style={{ color: "#000000" }}>
              {suggestions.packingList.map((item, idx) => (
                <li key={idx}>
                  {typeof item === "object"
                    ? item.name || item.item || JSON.stringify(item)
                    : String(item)}
                </li>
              ))}
            </ul>
          </section>
        )}
    </div>
  );
};

export default TripSuggestionCard;
