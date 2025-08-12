import React, { useState, useEffect, useRef } from "react";
import styles from "./TripSuggestions.module.css";
import {
  FaHotel,
  FaCloudSun,
  FaShoppingBag,
  FaUtensils,
  FaCalendarAlt,
  FaRupeeSign,
  FaDownload,
  FaSuitcase,
  FaCheckCircle,
} from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../UserContext";
import { generateTrip } from "../../utils/tripPlannerAPI";
import {
  fetchPredictHQEvents,
  getEventCategoryIcon,
  formatEventDate,
  getAttendanceLabel,
} from "../../utils/predicthqAPI";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { fetchMealImage as fetchMealImageFromAPI } from "../../utils/mealImageAPI";
import { backend_url } from "../../utils/helper";

const TripSuggestions = () => {
  const { tripDetails, user } = useUser();
  const pageRef = useRef(null);
  const [weather, setWeather] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  const [deepSeekResult, setDeepSeekResult] = useState(null);
  const [loadingDeepSeek, setLoadingDeepSeek] = useState(false);
  const [deepSeekError, setDeepSeekError] = useState(null);

  const [phqEvents, setPhqEvents] = useState([]);
  const [loadingPhq, setLoadingPhq] = useState(false);
  const [phqErr, setPhqErr] = useState(null);

  const hasSavedRef = useRef(false); // guard to ensure single save

  const [hotelImage, setHotelImage] = useState("");

  const [mealImages, setMealImages] = useState({});

  const city = tripDetails.city || "";
  const checkin = tripDetails.checkin || "";
  const checkout = tripDetails.checkout || "";
  const preference = tripDetails.preference || "";
  const budget = tripDetails.budget || 10000;

  // Function to save trip to MongoDB
  const saveTrip = async (suggestions) => {
    if (hasSavedRef.current) {
      return; // prevent duplicate save attempts
    }
    // Ensure we have an authenticated user with an id
    const userId = user?._id || user?.id; // fallback if backend returns id
    if (!userId) {
      console.log("No authenticated user id found; trip not persisted.");
      return;
    }

    try {
      const requestBody = {
        userId,
        city,
        checkIn: checkin,
        checkOut: checkout,
        preference,
        budget,
        suggestions,
      };

      console.log("Sending saveTrip request:", requestBody);

      const response = await fetch(`${backend_url}/api/trips/saveTrip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        hasSavedRef.current = true;
        console.log("Trip saved successfully:\n", result);
      } else {
        const errorData = await response.json();
        console.error("Failed to save trip:", response.status, errorData);
      }
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  const fetchHotelImage = async (hotelName, city) => {
    try {
      const response = await fetch(
        `${backend_url}/api/images/fetchHotelImage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotelName, city }),
        }
      );
      const data = await response.json();
      return data.imageUrl || "";
    } catch (err) {
      console.error("Error fetching hotel image:", err.message);
      return "";
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setWeatherError(
          "OpenWeatherMap API key not found. Please add it to your client/.env file."
        );
        setLoadingWeather(false);
        return;
      }
      setLoadingWeather(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=${apiKey}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch weather data.");
        }
        const data = await response.json();
        const dailyForecasts = data.list
          .filter((item) => item.dt_txt.includes("12:00:00"))
          .slice(0, 4);
        if (dailyForecasts.length === 0 && data.list.length > 0) {
          const seenDays = new Set();
          const fallbackForecasts = [];
          for (const item of data.list) {
            const day = new Date(item.dt * 1000).toISOString().split("T")[0];
            if (!seenDays.has(day) && fallbackForecasts.length < 4) {
              fallbackForecasts.push(item);
              seenDays.add(day);
            }
          }
          dailyForecasts.push(...fallbackForecasts);
        }
        const formattedWeather = dailyForecasts.map((item) => ({
          day: new Date(item.dt * 1000).toLocaleDateString("en-US", {
            weekday: "long",
          }),
          temp: `${Math.round(item.main.temp)}°C`,
          icon: item.weather[0].main,
          description: item.weather[0].description,
        }));
        setWeather(formattedWeather);
      } catch (err) {
        setWeatherError(err.message);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, [city]);

  useEffect(() => {
    if (!city || !checkin || !checkout || !preference || !budget) return;
    // Reset state for a fresh generation
    setLoadingDeepSeek(true);
    setDeepSeekError(null);
    setDeepSeekResult(null);
    setHotelImage("");
    // Allow exactly one save for each new generation
    hasSavedRef.current = false;

    generateTrip({ city, checkin, checkout, preference, budget })
      .then(async (result) => {
        let parsed = null;
        if (typeof result === "string") {
          // Try to extract JSON from within markdown or extra text
          const firstBrace = result.indexOf("{");
          const lastBrace = result.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonString = result.substring(firstBrace, lastBrace + 1);
            try {
              parsed = JSON.parse(jsonString);
            } catch (e) {
              setDeepSeekResult(result);
              return;
            }
            setDeepSeekResult(parsed);
            // Save trip after successful parsing
            saveTrip(parsed);
          } else {
            setDeepSeekResult(result);
            // Save trip even if it's a string response
            saveTrip(result);
          }
        } else {
          setDeepSeekResult(result);
          // Save trip after successful response
          saveTrip(result);
        }
        // Fetch hotel image if hotel name exists
        const hotelName =
          parsed?.hotels?.[0]?.name || result?.hotels?.[0]?.name;
        if (hotelName) {
          const img = await fetchHotelImage(hotelName, city);
          setHotelImage(img);
        }
      })
      .catch((err) => setDeepSeekError(err.message))
      .finally(() => setLoadingDeepSeek(false));
  }, [city, checkin, checkout, preference, budget]);

  useEffect(() => {
    if (!city || !checkin || !checkout) return;
    setLoadingPhq(true);
    setPhqErr(null);

    fetchPredictHQEvents(city, checkin, checkout)
      .then(setPhqEvents)
      .catch((err) => setPhqErr(err.message))
      .finally(() => setLoadingPhq(false));
  }, [city, checkin, checkout]);

  useEffect(() => {
    if (!deepSeekResult?.meals) return;
    const loadImages = async () => {
      const imgs = {};
      for (const [mealType, info] of Object.entries(deepSeekResult.meals)) {
        const q = info.famousDish || info.cuisineType;
        const img = await fetchMealImageFromAPI(q);
        if (img) imgs[mealType] = img;
      }
      setMealImages(imgs);
    };
    loadImages();
  }, [deepSeekResult]);

  const weatherIconMap = {
    Clear: "☀️",
    Clouds: "⛅",
    Rain: "🌧️",
    Drizzle: "��️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Smoke: "🌫️",
    Haze: "🌫️",
    Dust: "🌫️",
    Fog: "🌫️",
    Sand: "🌫️",
    Ash: "🌫️",
    Squall: "🌬️",
    Tornado: "🌪️",
  };

  const formatLocal = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleDownloadPdf = async () => {
    if (!pageRef.current) return;

    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `TripPlan_${city}_${checkin}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.mainTitle}>Your Perfect Trip Awaits</h1>
            <p className={styles.mainSubtitle}>
              AI-curated recommendations tailored just for you
            </p>
            <div className={styles.tripSummary}>
              <div className={styles.summaryCard}>
                <span className={styles.summaryIcon}>📍</span>
                <div>
                  <strong>{city}</strong>
                  <p>
                    {checkin} to {checkout}
                  </p>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryIcon}>💰</span>
                <div>
                  <strong>₹{budget.toLocaleString()}</strong>
                  <p>Budget</p>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryIcon}>🎯</span>
                <div>
                  <strong>
                    {Array.isArray(preference)
                      ? preference.join(", ")
                      : preference}
                  </strong>
                  <p>Preferences</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={pageRef} className={styles.contentContainer}>
          <div className={styles.mainContent}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <span className={styles.titleIcon}>🤖</span>
                  Trip Plan
                </h2>
              </div>

              {loadingDeepSeek ? (
                <div className={styles.loadingCard}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Creating your perfect itinerary...</p>
                </div>
              ) : deepSeekError ? (
                <div className={styles.errorCard}>
                  <span className={styles.errorIcon}>❌</span>
                  <p>{deepSeekError}</p>
                </div>
              ) : deepSeekResult && typeof deepSeekResult === "object" ? (
                <>
                  {/* Trip save status messages intentionally hidden per requirements */}
                  {Array.isArray(deepSeekResult.hotels) &&
                    deepSeekResult.hotels.length > 0 && (
                      <section>
                        <h3>
                          <FaHotel /> Accommodation Options
                        </h3>
                        {hotelImage && (
                          <img
                            src={hotelImage}
                            alt="Hotel"
                            className={styles.hotelImage}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className={styles.hotelsRow}>
                          {deepSeekResult.hotels.map((hotel, idx) => (
                            <div
                              key={hotel.name + idx}
                              className={styles.hotelCard}
                            >
                              <div className={styles.hotelHeader}>
                                <h4>{hotel.name}</h4>
                                <span className={styles.hotelType}>
                                  {hotel.type}
                                </span>
                              </div>

                              {hotel.location && (
                                <div className={styles.hotelLocation}>
                                  <span className={styles.locationIcon}>
                                    📍
                                  </span>
                                  {hotel.location}
                                </div>
                              )}

                              <div className={styles.hotelCost}>
                                <FaRupeeSign />
                                <span>{hotel.totalCost}</span>
                                <small>per night</small>
                              </div>

                              {hotel.link && (
                                <a
                                  href={hotel.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.hotelLink}
                                >
                                  View Details & Book
                                </a>
                              )}

                              {Array.isArray(hotel.features) &&
                                hotel.features.length > 0 && (
                                  <div className={styles.hotelFeatures}>
                                    <strong>Features:</strong>
                                    <div className={styles.featuresList}>
                                      {hotel.features.map((feature, fidx) => (
                                        <span
                                          key={fidx}
                                          className={styles.featureTag}
                                        >
                                          {feature}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  {deepSeekResult.meals && (
                    <section>
                      <h3>
                        <FaUtensils /> Recommended Meals
                      </h3>
                      <div className={styles.mealGrid}>
                        {Object.entries(deepSeekResult.meals).map(
                          ([mealType, mealInfo]) => (
                            <div key={mealType} className={styles.mealCard}>
                              <div className={styles.mealHeader}>
                                <h4>
                                  {mealType.charAt(0).toUpperCase() +
                                    mealType.slice(1)}
                                </h4>
                                <span className={styles.mealCost}>
                                  ₹{mealInfo.minCost}+
                                </span>
                              </div>

                              <div className={styles.mealImageWrapper}>
                                {mealImages[mealType] && (
                                  <img
                                    src={mealImages[mealType]}
                                    alt={mealInfo.famousDish || mealType}
                                    className={styles.mealImage}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/no-image.svg";
                                    }}
                                  />
                                )}
                                <span className={styles.mealTypeOverlay}>
                                  {mealType.charAt(0).toUpperCase() +
                                    mealType.slice(1)}
                                </span>
                              </div>

                              <div className={styles.mealDetails}>
                                {mealInfo.cuisineType && (
                                  <div className={styles.mealInfo}>
                                    <strong>Cuisine:</strong>{" "}
                                    {mealInfo.cuisineType}
                                  </div>
                                )}

                                {mealInfo.famousDish && (
                                  <div className={styles.mealInfo}>
                                    <strong>Famous Dishes:</strong>{" "}
                                    {mealInfo.famousDish}
                                  </div>
                                )}

                                {mealInfo.recommendedRestaurants &&
                                  Array.isArray(
                                    mealInfo.recommendedRestaurants
                                  ) &&
                                  mealInfo.recommendedRestaurants.length >
                                    0 && (
                                    <div className={styles.restaurantsList}>
                                      <strong>Recommended Restaurants:</strong>
                                      {mealInfo.recommendedRestaurants.map(
                                        (restaurant, rIdx) => (
                                          <div
                                            key={rIdx}
                                            className={styles.restaurantItem}
                                          >
                                            <span
                                              className={styles.restaurantName}
                                            >
                                              {typeof restaurant === "string"
                                                ? restaurant
                                                : restaurant.name}
                                            </span>
                                            {restaurant.googleMapLocation && (
                                              <a
                                                href={
                                                  restaurant.googleMapLocation
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.mapLink}
                                              >
                                                📍 View on Map
                                              </a>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  )}{" "}
                  {deepSeekResult.itinerary &&
                    Array.isArray(deepSeekResult.itinerary) && (
                      <section className={styles.itinerarySection}>
                        <h3>
                          <FaCalendarAlt /> Daywise Itinerary
                        </h3>
                        <div className={styles.itineraryGrid}>
                          {deepSeekResult.itinerary.map((dayPlan, idx) => (
                            <div
                              className={styles.itineraryDayCard}
                              key={dayPlan.date || idx}
                            >
                              <h4>{dayPlan.day}</h4>
                              <p className={styles.itineraryDate}>
                                📅{" "}
                                {new Date(dayPlan.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                              <div className={styles.activitiesList}>
                                {dayPlan.activities &&
                                  Array.isArray(dayPlan.activities) &&
                                  dayPlan.activities.map((activity, actIdx) => (
                                    <div
                                      key={actIdx}
                                      className={styles.activityItem}
                                    >
                                      <div className={styles.activityTime}>
                                        🕐 {activity.time}
                                      </div>
                                      <div
                                        className={styles.activityDescription}
                                      >
                                        {activity.description}
                                      </div>
                                      {activity.place && (
                                        <div className={styles.activityPlace}>
                                          📍 <strong>{activity.place}</strong>
                                        </div>
                                      )}
                                      {activity.minTransportCost !==
                                        undefined &&
                                        activity.minTransportCost > 0 && (
                                          <div className={styles.activityCost}>
                                            🚗 Transport: ₹
                                            {activity.minTransportCost}
                                          </div>
                                        )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  {deepSeekResult.estimatedTotal && (
                    <section>
                      <h3>Estimated Budget</h3>
                      <table className={styles.budgetTable}>
                        <tbody>
                          {Object.entries(
                            deepSeekResult.estimatedTotal.breakdown || {}
                          ).map(([k, v]) => (
                            <tr key={k}>
                              <td>{k.charAt(0).toUpperCase() + k.slice(1)}</td>
                              <td>{v}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>
                              <strong>Total</strong>
                            </td>
                            <td>
                              <strong>
                                {deepSeekResult.estimatedTotal.total}
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </section>
                  )}
                  {deepSeekResult.packingList &&
                    Array.isArray(deepSeekResult.packingList) &&
                    deepSeekResult.packingList.length > 0 && (
                      <section>
                        <h3>
                          <FaSuitcase /> Packing List
                        </h3>
                        <div className={styles.packingList}>
                          {deepSeekResult.packingList.map((item, idx) => (
                            <div key={idx} className={styles.packingListItem}>
                              <FaCheckCircle className={styles.packingIcon} />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                </>
              ) : typeof deepSeekResult === "string" ? (
                <pre>{deepSeekResult}</pre>
              ) : null}
            </div>
          </div>

          <div className={styles.sidebarContent}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <FaCloudSun className={styles.titleIcon} />
                  Weather Forecast
                </h2>
              </div>
              {loadingWeather ? (
                <div className={styles.loadingCard}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading weather...</p>
                </div>
              ) : weatherError ? (
                <div className={styles.errorCard}>
                  <span className={styles.errorIcon}>❌</span>
                  <p>{weatherError}</p>
                </div>
              ) : (
                <div className={styles.weatherGrid}>
                  {weather.map((day, idx) => {
                    const weatherIconMap = {
                      Clear: "☀️",
                      Clouds: "☁️",
                      Rain: "🌧️",
                      Snow: "❄️",
                      Thunderstorm: "⛈️",
                      Drizzle: "🌦️",
                      Mist: "🌫️",
                      Fog: "🌫️",
                    };

                    const checkInDate = new Date(checkin);
                    const currentDate = new Date(checkInDate);
                    currentDate.setDate(checkInDate.getDate() + idx);
                    const dateLabel = currentDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <div key={dateLabel} className={styles.weatherCard}>
                        <div className={styles.weatherDay}>{day.day}</div>
                        <div className={styles.weatherDate}>{dateLabel}</div>
                        <div className={styles.weatherIcon}>
                          {weatherIconMap[day.icon] || "❓"}
                        </div>
                        <div className={styles.weatherTemp}>{day.temp}</div>
                        <div className={styles.weatherDesc}>
                          {day.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <span className={styles.titleIcon}>🎉</span>
                  Local Events
                </h2>
                <div className={styles.aiProvider}>Powered by PredictHQ</div>
              </div>

              {loadingPhq ? (
                <div className={styles.loadingCard}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading events...</p>
                </div>
              ) : phqErr ? (
                <div className={styles.errorCard}>
                  <span className={styles.errorIcon}>❌</span>
                  <p>{phqErr}</p>
                </div>
              ) : phqEvents.length === 0 ? (
                <div className={styles.emptyCard}>
                  <span className={styles.emptyIcon}>📅</span>
                  <p>No events found for your dates.</p>
                </div>
              ) : (
                <div className={styles.eventsGrid}>
                  {phqEvents.map((ev) => (
                    <div key={ev.id} className={styles.eventCard}>
                      <div className={styles.eventHeader}>
                        <span className={styles.eventIcon}>
                          {getEventCategoryIcon(ev.category)}
                        </span>
                        <h3 className={styles.eventTitle}>
                          {ev.url ? (
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {ev.name}
                            </a>
                          ) : (
                            ev.name
                          )}
                        </h3>
                      </div>

                      <div className={styles.eventDetails}>
                        <p className={styles.eventDate}>
                          📅 {formatLocal(ev.start)}
                        </p>
                        <p className={styles.eventVenue}>📍 {ev.venue.name}</p>
                        <p className={styles.eventAddress}>
                          🏠 {ev.venue.address}
                        </p>

                        {ev.phq_attendance && (
                          <p className={styles.eventAttendance}>
                            👥 {getAttendanceLabel(ev.phq_attendance)}
                          </p>
                        )}

                        {ev.description && (
                          <p className={styles.eventDescription}>
                            {ev.description.length > 150
                              ? `${ev.description.slice(0, 150)}…`
                              : ev.description}
                          </p>
                        )}

                        <span className={styles.eventCategory}>
                          {ev.category.replace("-", " ").toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ------------ Download & footer ------------ */}
        <div className={styles.downloadSection}>
          <button className={styles.downloadBtn} onClick={handleDownloadPdf}>
            <FaDownload /> Download Trip Plan (PDF)
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TripSuggestions;
