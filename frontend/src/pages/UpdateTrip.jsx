import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { backend_url } from "../utils/helper";
import styles from "./UpdateTrip.module.css";
import Footer from "../components/Footer/Footer";
import { FaArrowLeft, FaSpinner, FaPaperPlane } from "react-icons/fa";

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
            <p>
              {trip.checkIn} to {trip.checkOut}
            </p>
            <p>Budget: ₹{trip.budget?.toLocaleString()}</p>
            <p>
              Preferences:{" "}
              {Array.isArray(trip.preference)
                ? trip.preference.join(", ")
                : trip.preference}
            </p>
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

        {trip?.suggestions && (
          <div className={styles.currentPlan}>
            <h3>Current Trip Plan</h3>
            <div className={styles.planContent}>
              <pre>{JSON.stringify(trip.suggestions, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UpdateTrip;
