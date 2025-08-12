import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaTrash,
  FaEye,
  FaSuitcase,
  FaSignOutAlt,
  FaEdit,
  FaShare,
  FaTimes,
  FaCalendarPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import TripSuggestionCard from "../../components/TripSuggestionCard";
import styles from "./Profile.module.css";
import { backend_url } from "../../utils/helper";

const Profile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("month"); // month, week, day

  // Fetch past trips when user is available
  useEffect(() => {
    if (user?._id) {
      fetchPastTrips();
    }
  }, [user]);

  const fetchPastTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${backend_url}/api/trips/getPastTrips/${user._id}`
      );
      if (response.ok) {
        const data = await response.json();
        setPastTrips(data.trips || []);
      } else {
        setError("Failed to fetch past trips");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/");
    }
  };

  const deleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await fetch(
        `${backend_url}/api/trips/deleteTrip/${tripId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setPastTrips((prev) => prev.filter((trip) => trip._id !== tripId));
      } else {
        alert("Failed to delete trip");
      }
    } catch (err) {
      alert("Error deleting trip");
    }
  };

  const shareTrip = async (tripId) => {
    try {
      const response = await fetch(
        `${backend_url}/api/trips/shareTrip/${tripId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPastTrips((prev) =>
          prev.map((trip) =>
            trip._id === tripId ? { ...trip, shared: true } : trip
          )
        );
        alert("Trip shared successfully!");
      } else {
        alert("Failed to share trip");
      }
    } catch (err) {
      alert("Error sharing trip");
    }
  };

  const updateTrip = (tripId) => {
    navigate(`/update-trip/${tripId}`);
  };

  const addToCalendar = (trip) => {
    const calendarEvent = {
      id: trip._id,
      title: `Trip to ${trip.city}`,
      start: trip.checkIn,
      end: trip.checkOut,
      description: `${trip.preference} trip to ${trip.city}. Budget: ₹${
        trip.budget?.toLocaleString() || "N/A"
      }`,
      location: trip.city,
      tripData: trip,
    };

    // Check if event already exists
    const existingEvent = calendarEvents.find((event) => event.id === trip._id);
    if (existingEvent) {
      alert("This trip is already added to your calendar!");
      return;
    }

    // Add to calendar events
    setCalendarEvents((prev) => [...prev, calendarEvent]);

    // Store in localStorage for persistence
    const storedEvents = JSON.parse(
      localStorage.getItem(`calendar_${user._id}`) || "[]"
    );
    const updatedEvents = [...storedEvents, calendarEvent];
    localStorage.setItem(`calendar_${user._id}`, JSON.stringify(updatedEvents));

    alert("Trip added to calendar successfully!");
  };

  // Load calendar events from localStorage on component mount
  useEffect(() => {
    if (user?._id) {
      const storedEvents = JSON.parse(
        localStorage.getItem(`calendar_${user._id}`) || "[]"
      );
      setCalendarEvents(storedEvents);
    }
  }, [user]);

  const viewTripDetails = (trip) => {
    console.log("View trip details clicked", trip);
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

  // Calendar utility functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isDateInRange = (date, startDate, endDate) => {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return checkDate >= start && checkDate <= end;
  };

  const getEventsForDate = (date) => {
    return calendarEvents.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return isDateInRange(date, eventStart, eventEnd);
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const events = getEventsForDate(date);
      days.push({
        date: day,
        fullDate: date,
        events: events,
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }

    return days;
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
              <p>No past trips found.</p>
              <button
                onClick={() => navigate("/plan")}
                className={styles.planNewTripBtn}
              >
                Plan a new trip
              </button>
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
                      <strong>Budget:</strong>{" "}
                      {trip.budget ? trip.budget.toLocaleString() : "N/A"}
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

        {/* Calendar Section */}
        <div className={styles.calendarSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FaCalendarAlt />
              My Trip Calendar
            </h2>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={styles.toggleCalendarButton}
            >
              {showCalendar ? "Hide Calendar" : "Show Calendar"}
            </button>
          </div>

          {showCalendar && (
            <div className={styles.calendarContainer}>
              {/* Calendar Navigation */}
              <div className={styles.calendarNav}>
                <button
                  onClick={() => navigateMonth(-1)}
                  className={styles.navButton}
                >
                  <FaChevronLeft />
                </button>
                <h3 className={styles.monthTitle}>
                  {getMonthName(currentDate)}
                </h3>
                <button
                  onClick={() => navigateMonth(1)}
                  className={styles.navButton}
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className={styles.calendarGrid}>
                {/* Day Headers */}
                <div className={styles.dayHeaders}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day} className={styles.dayHeader}>
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Days */}
                <div className={styles.calendarDays}>
                  {generateCalendarDays().map((day, index) => (
                    <div
                      key={index}
                      className={`${styles.calendarDay} ${
                        day?.isToday ? styles.today : ""
                      } ${day === null ? styles.emptyDay : ""}`}
                    >
                      {day && (
                        <>
                          <span className={styles.dayNumber}>{day.date}</span>
                          {day.events.length > 0 && (
                            <div className={styles.dayEvents}>
                              {day.events
                                .slice(0, 2)
                                .map((event, eventIndex) => (
                                  <div
                                    key={eventIndex}
                                    className={styles.dayEvent}
                                    title={event.title}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 4,
                                    }}
                                  >
                                    <FaCalendarAlt
                                      style={{
                                        fontSize: "0.9rem",
                                        color: "#1282a2",
                                      }}
                                    />
                                    <span className={styles.eventText}>
                                      {event.title.length > 12
                                        ? event.title.substring(0, 12) + "..."
                                        : event.title}
                                    </span>
                                  </div>
                                ))}
                              {day.events.length > 2 && (
                                <div className={styles.moreEvents}>
                                  +{day.events.length - 2} more
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Event List Below Calendar */}
              {calendarEvents.length > 0 && (
                <div className={styles.eventsList}>
                  <h4 className={styles.eventsListTitle}>All Trip Events</h4>
                  {calendarEvents.map((event) => (
                    <div key={event.id} className={styles.eventItem}>
                      <div className={styles.eventInfo}>
                        <div className={styles.eventTitle}>{event.title}</div>
                        <div className={styles.eventDates}>
                          {formatDate(event.start)} - {formatDate(event.end)}
                        </div>
                        <div className={styles.eventLocation}>
                          <FaMapMarkerAlt /> {event.location}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updatedEvents = calendarEvents.filter(
                            (e) => e.id !== event.id
                          );
                          setCalendarEvents(updatedEvents);
                          localStorage.setItem(
                            `calendar_${user._id}`,
                            JSON.stringify(updatedEvents)
                          );
                        }}
                        className={styles.removeEventButton}
                        title="Remove from calendar"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {calendarEvents.length === 0 && (
                <div className={styles.emptyCalendar}>
                  <FaCalendarAlt className={styles.emptyStateIcon} />
                  <p>No trips added to calendar yet.</p>
                  <p>
                    Add trips to calendar from trip details to see them here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trip Details Modal */}
      {showTripModal && selectedTrip && (
        <div
          className={styles.modal}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTripModal(false);
            }
          }}
        >
          <div className={styles.modalContent}>
            <button
              onClick={() => setShowTripModal(false)}
              className={styles.closeButton}
            >
              <FaTimes />
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
                  ₹
                  {selectedTrip.budget
                    ? selectedTrip.budget.toLocaleString()
                    : "N/A"}
                </div>
              </div>
            </div>

            <div>
              <h3 className={styles.suggestionsTitle}>Trip Suggestions</h3>
              <TripSuggestionCard suggestions={selectedTrip.suggestions} />
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={() => updateTrip(selectedTrip._id)}
                className={styles.updateButton}
              >
                <FaEdit /> Update
              </button>
              <button
                onClick={() => shareTrip(selectedTrip._id)}
                className={styles.shareButton}
                disabled={selectedTrip.shared}
              >
                <FaShare /> {selectedTrip.shared ? "Shared" : "Share"}
              </button>
              <button
                onClick={() => addToCalendar(selectedTrip)}
                className={styles.calendarButton}
              >
                <FaCalendarPlus /> Add To Calendar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Profile;
