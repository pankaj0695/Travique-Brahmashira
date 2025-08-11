import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaTrash,
  FaEye,
  FaSuitcase,
  FaSignOutAlt,
} from "react-icons/fa";
import Footer from "../components/Footer/Footer";
import TripSuggestionCard from "../components/TripSuggestionCard";
import styles from "./Profile.module.css";
import { backend_url } from "../utils/helper";

const Profile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);

  // Fetch past trips when user is available
  useEffect(() => {
    if (user?._id) {
      // fetchPastTrips();
    }
  }, [user]);

  // Dummy content for Past Trip Suggestions
  useEffect(() => {
    if (!user?._id) return;
    // If no trips, set dummy data for demo
    if (pastTrips.length === 0 && !loading && !error) {
      setPastTrips([
        {
          _id: "dummy1",
          city: "Paris",
          checkIn: "2024-05-10",
          checkOut: "2024-05-15",
          preference: "Romantic, Culture",
          budget: 120000,
          createdAt: "2024-04-20",
          suggestions: [
            {
              title: "Eiffel Tower",
              description: "Visit the iconic landmark.",
            },
            {
              title: "Louvre Museum",
              description: "Explore world-class art.",
            },
            {
              title: "Seine River Cruise",
              description: "Enjoy a scenic boat ride.",
            },
          ],
        },
        {
          _id: "dummy2",
          city: "Tokyo",
          checkIn: "2024-06-01",
          checkOut: "2024-06-07",
          preference: "Food, Technology",
          budget: 150000,
          createdAt: "2024-05-10",
          suggestions: [
            {
              title: "Tsukiji Market",
              description: "Try fresh sushi.",
            },
            {
              title: "Akihabara",
              description: "Experience tech and anime culture.",
            },
            {
              title: "Shibuya Crossing",
              description: "See the world's busiest crossing.",
            },
          ],
        },
      ]);
    }
  }, [user, pastTrips.length, loading, error]);

  // const fetchPastTrips = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch(
  //       `${backend_url}/api/getPastTrips/${user._id}`
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       setPastTrips(data.trips || []);
  //     } else {
  //       setError("Failed to fetch past trips");
  //     }
  //   } catch (err) {
  //     setError("Error connecting to server");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/");
    }
  };

  const deleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await fetch(`${backend_url}/api/deleteTrip/${tripId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPastTrips(pastTrips.filter((trip) => trip._id !== tripId));
      } else {
        alert("Failed to delete trip");
      }
    } catch (err) {
      alert("Error deleting trip");
    }
  };

  const viewTripDetails = (trip) => {
    setSelectedTrip(trip);
    setShowTripModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user)
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <FaUserCircle className={styles.emptyStateIcon} />
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );

  return (
    <>
      <div className={styles.container}>
        {/* User Info Section */}
        <div className={styles.profileHeader}>
          <img
            src={
              user.image && user.image !== "default-profile.png"
                ? user.image
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "User"
                  )}&background=667eea&color=fff&size=120`
            }
            alt={user.name || "User"}
            className={styles.userAvatar}
          />
          <h1 className={styles.userName}>{user.name || "User"}</h1>
          <p className={styles.userEmail}>{user.emailId}</p>

          <div className={styles.userDetails}>
            {user.city && (
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>City</div>
                <div className={styles.detailValue}>{user.city}</div>
              </div>
            )}
            {user.state && (
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>State</div>
                <div className={styles.detailValue}>{user.state}</div>
              </div>
            )}
            {user.country && (
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Country</div>
                <div className={styles.detailValue}>{user.country}</div>
              </div>
            )}
            {user.phoneno && (
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Phone</div>
                <div className={styles.detailValue}>{user.phoneno}</div>
              </div>
            )}
          </div>

          <button onClick={handleLogout} className={styles.logoutButton}>
            <FaSignOutAlt style={{ marginRight: "0.5rem" }} />
            Logout
          </button>
        </div>

        {/* Past Trips Section */}
        <div className={styles.tripsSection}>
          <h2 className={styles.sectionTitle}>
            <FaSuitcase />
            Past Trip Suggestions
          </h2>

          {loading ? (
            <div className={styles.loadingState}>
              <p>Loading your past trips...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
            </div>
          ) : pastTrips.length === 0 ? (
            <div className={styles.emptyState}>
              <FaSuitcase className={styles.emptyStateIcon} />
              <p>No past trips found. Plan your first trip to see it here!</p>
            </div>
          ) : (
            <div className={styles.tripsGrid}>
              {pastTrips.map((trip) => (
                <div key={trip._id} className={styles.tripCard}>
                  <div className={styles.tripCardHeader}>
                    <h4 className={styles.tripTitle}>
                      <FaMapMarkerAlt />
                      {trip.city}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTrip(trip._id);
                      }}
                      className={styles.deleteButton}
                      title="Delete trip"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className={styles.tripInfo}>
                    <div className={styles.tripInfoItem}>
                      <FaCalendarAlt />
                      {formatDate(trip.checkIn)} - {formatDate(trip.checkOut)}
                    </div>
                    <div className={styles.tripInfoItem}>
                      <strong>Preference:</strong> {trip.preference}
                    </div>
                    <div className={styles.tripInfoItem}>
                      <FaRupeeSign />
                      <strong>Budget:</strong> {trip.budget.toLocaleString()}
                    </div>
                  </div>

                  <div className={styles.tripDate}>
                    Created: {formatDate(trip.createdAt)}
                  </div>

                  <button
                    onClick={() => viewTripDetails(trip)}
                    className={styles.viewDetailsButton}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trip Details Modal */}
      {showTripModal && selectedTrip && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              onClick={() => setShowTripModal(false)}
              className={styles.closeButton}
            >
              ×
            </button>

            <h2 className={styles.modalTitle}>
              <FaMapMarkerAlt />
              {selectedTrip.city} Trip Details
            </h2>

            <div className={styles.tripDetailsGrid}>
              <div className={styles.tripDetailItem}>
                <div className={styles.tripDetailLabel}>Check-in</div>
                <div className={styles.tripDetailValue}>
                  {formatDate(selectedTrip.checkIn)}
                </div>
              </div>
              <div className={styles.tripDetailItem}>
                <div className={styles.tripDetailLabel}>Check-out</div>
                <div className={styles.tripDetailValue}>
                  {formatDate(selectedTrip.checkOut)}
                </div>
              </div>
              <div className={styles.tripDetailItem}>
                <div className={styles.tripDetailLabel}>Preference</div>
                <div className={styles.tripDetailValue}>
                  {selectedTrip.preference}
                </div>
              </div>
              <div className={styles.tripDetailItem}>
                <div className={styles.tripDetailLabel}>Budget</div>
                <div className={styles.tripDetailValue}>
                  ₹{selectedTrip.budget.toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <h3 className={styles.suggestionsTitle}>Trip Suggestions</h3>
              <TripSuggestionCard suggestions={selectedTrip.suggestions} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Profile;
