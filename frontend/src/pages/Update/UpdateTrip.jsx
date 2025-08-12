import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import { backend_url } from "../../utils/helper";
import styles from "./UpdateTrip.module.css";
import Footer from "../../components/Footer/Footer";
import {
  FaArrowLeft,
  FaSpinner,
  FaPaperPlane,
  FaCalendarAlt,
  FaWallet,
  FaMapMarkerAlt,
  FaHotel,
  FaUtensils,
  FaLandmark,
  FaTicketAlt,
  FaInfoCircle,
  FaStar,
} from "react-icons/fa";

const UpdateTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [trip, setTrip] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchTripDetails();
  }, [user, tripId]);

  const fetchTripDetails = async () => {
    try {
      const response = await fetch(
        `${backend_url}/api/trips/getPastTrips/${user._id}`
      );
      if (response.ok) {
        const data = await response.json();
        const foundTrip = data.trips.find((t) => t._id === tripId);
        if (foundTrip) {
          setTrip(foundTrip);
        } else {
          setError("Trip not found");
        }
      } else {
        setError("Failed to fetch trip details");
      }
    } catch (err) {
      setError("Error loading trip details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a prompt for updating the trip");
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const response = await fetch(
        `${backend_url}/api/trips/updateTrip/${tripId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTrip(data.trip);
        setPrompt("");
        alert("Trip updated successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update trip");
      }
    } catch (err) {
      setError("Error updating trip");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <FaSpinner className={styles.spinner} />
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button
            onClick={() => navigate("/profile")}
            className={styles.backBtn}
          >
            <FaArrowLeft /> Back to Profile
          </button>
        </div>
      </div>
    );
  }

  // Normalize suggestions into sections the UI can render as cards
  const parseSuggestions = (raw) => {
    if (!raw) return null;
    try {
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      return raw;
    }
  };

  const pick = (obj, keys) => {
    for (const k of keys) {
      const v = obj?.[k];
      if (v !== undefined && v !== null && v !== "") return v;
    }
    return undefined;
  };

  const asArray = (val) => {
    if (!val) return [];
    return Array.isArray(val) ? val : typeof val === "object" ? Object.values(val) : [val];
  };

  const toSections = (suggestions) => {
    if (!suggestions) return [];
    const titleMap = {
      hotels: "Hotels",
      accommodations: "Hotels",
      stays: "Hotels",
      restaurants: "Restaurants",
      food: "Restaurants",
      eateries: "Restaurants",
      events: "Local Events",
      activities: "Activities",
      sightseeing: "Sightseeing",
      attractions: "Attractions",
      itinerary: "Itinerary",
      pointsOfInterest: "Points of Interest",
    };

    // If it's a plain array, treat as Highlights
    if (Array.isArray(suggestions)) {
      return [
        { key: "highlights", title: "Highlights", items: suggestions },
      ];
    }

    const sections = [];
    for (const [key, value] of Object.entries(suggestions)) {
      if (value === undefined || value === null) continue;
      const title = titleMap[key] || key.replace(/[_-]/g, " ");
      sections.push({ key, title, items: value });
    }
    return sections;
  };

  const renderIconForSection = (key) => {
    const k = key.toLowerCase();
    if (/(hotel|accom|stay)/.test(k)) return <FaHotel />;
    if (/(restaurant|food|eat|dine)/.test(k)) return <FaUtensils />;
    if (/(event|ticket)/.test(k)) return <FaTicketAlt />;
    if (/(sight|attraction|poi|landmark)/.test(k)) return <FaLandmark />;
    if (/(itinerary|day)/.test(k)) return <FaCalendarAlt />;
    return <FaInfoCircle />;
  };

  const defaultTitleForSection = (sectionKey) => {
    const k = (sectionKey || "").toLowerCase();
    if (/(hotel|accom|stay)/.test(k)) return "Hotel";
    if (/(restaurant|food|eat|dine)/.test(k)) return "Restaurant";
    if (/(event|ticket)/.test(k)) return "Event";
    if (/(sight|attraction|poi|landmark)/.test(k)) return "Attraction";
    if (/(activity|activities)/.test(k)) return "Activity";
    if (/(highlight)/.test(k)) return "Highlight";
    return "Place";
  };

  const renderCard = (item, idx, sectionKey) => {
    if (item == null) return null;
    // If primitive, render as a chip-like card
    if (typeof item !== "object") {
      return (
        <div key={idx} className={styles.card + " " + styles.cardCompact}>
          <div className={styles.cardBody}>
            <div className={styles.cardTitle}>{String(item)}</div>
          </div>
        </div>
      );
    }

    const title =
      pick(item, ["name", "title", "place", "label"]) || defaultTitleForSection(sectionKey);
    const subtitle =
      pick(item, [
        "address",
        "location",
        "city",
        "area",
        "venue",
        "neighborhood",
      ]) || "";
    const desc = pick(item, ["description", "summary", "details", "notes"]);
    const rating = pick(item, ["rating", "stars"]);
    const price = pick(item, ["price", "cost", "budget"]);
    const category = pick(item, ["category", "type", "cuisine", "kind"]);
    const time = pick(item, ["time", "startTime", "open", "when"]);
    const image = pick(item, [
      "image",
      "imageUrl",
      "imageURL",
      "photo",
      "thumbnail",
      "cover",
      "img",
    ]);

    return (
      <div key={idx} className={styles.card}>
        {image && (
          <div className={styles.cardImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} />
          </div>
        )}
        <div className={styles.cardBody}>
          <div className={styles.cardTitle}>{title}</div>
          {subtitle && <div className={styles.cardSubtitle}>{subtitle}</div>}
          <div className={styles.cardMetaRow}>
            {rating && (
              <span className={styles.badge}>
                <FaStar /> {rating}
              </span>
            )}
            {price && <span className={styles.badge}>₹ {price}</span>}
            {category && <span className={styles.badge}>{category}</span>}
            {time && <span className={styles.badge}>{time}</span>}
          </div>
          {desc && <p className={styles.cardDesc}>{desc}</p>}
        </div>
      </div>
    );
  };

  const renderItinerary = (it) => {
    // it could be array of days or object keyed by day
    const days = Array.isArray(it) ? it : typeof it === "object" ? Object.entries(it).map(([k,v])=>({ day:k, items:v })) : [];
    if (!days.length) return null;
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          {renderIconForSection("itinerary")}
          <h4>Itinerary</h4>
        </div>
        <div className={styles.dayList}>
          {days.map((d, idx) => (
            <div key={idx} className={styles.dayCard}>
              <div className={styles.dayTitle}>{d.day || `Day ${idx + 1}`}</div>
              <ul className={styles.dayItems}>
                {asArray(d.items).map((x, i) => (
                  <li key={i}>
                    {typeof x === "object"
                      ? pick(x, ["name", "title", "place"]) || "Activity"
                      : String(x)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            onClick={() => navigate("/profile")}
            className={styles.backBtn}
          >
            <FaArrowLeft /> Back to Profile
          </button>
          <h1 className={styles.title}>Update Trip</h1>
        </div>

        {trip && (
          <div className={styles.tripInfo}>
            <h2>{trip.city}</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <FaCalendarAlt />
                <span>
                  {trip.checkIn} – {trip.checkOut}
                </span>
              </div>
              <div className={styles.infoItem}>
                <FaWallet />
                <span>₹{trip.budget?.toLocaleString()}</span>
              </div>
              <div className={styles.infoItem}>
                <FaMapMarkerAlt />
                <span>{trip.city}</span>
              </div>
            </div>
            {trip.preference && (
              <div className={styles.chipGroup}>
                {(Array.isArray(trip.preference)
                  ? trip.preference
                  : String(trip.preference).split(',').map((s) => s.trim())
                 ).filter(Boolean).map((pref, idx) => (
                  <span className={styles.chip} key={idx}>{pref}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={styles.updateForm}>
          <h3>What would you like to update?</h3>
          <form onSubmit={handleUpdate}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your update request (e.g., 'Add more adventure activities', 'Change hotel preferences to luxury', 'Include vegetarian restaurants only')"
              className={styles.promptInput}
              rows={4}
              disabled={updating}
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
            <button
              type="submit"
              disabled={updating || !prompt.trim()}
              className={styles.updateBtn}
            >
              {updating ? (
                <>
                  <FaSpinner className={styles.spinner} /> Updating...
                </>
              ) : (
                <>
                  <FaPaperPlane /> Update Trip
                </>
              )}
            </button>
          </form>
        </div>

        {trip?.suggestions && (() => {
          const parsed = parseSuggestions(trip.suggestions);
          const sections = toSections(parsed);
          if (!sections.length) return null;
          return (
            <div className={styles.currentPlan}>
              <h3>Current Trip Plan</h3>
              {sections.map((sec, idx) => {
                // special-case itinerary
                if (sec.key.toLowerCase().includes("itinerary")) {
                  return <React.Fragment key={idx}>{renderItinerary(sec.items)}</React.Fragment>;
                }
                const items = asArray(sec.items);
                if (!items.length) return null;
                return (
                  <div key={idx} className={styles.section}>
                    <div className={styles.sectionHeader}>
                      {renderIconForSection(sec.key)}
                      <h4>{sec.title}</h4>
                    </div>
                    <div className={styles.cardGrid}>
                      {items.map((it, i) => renderCard(it, i, sec.key))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
      <Footer />
    </>
  );
};

export default UpdateTrip;
