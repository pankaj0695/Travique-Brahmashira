import React, { useState, useEffect, useMemo } from "react";
import styles from "./PlanTrip.module.css";
import {
  FaMapMarkerAlt,
  FaPlane,
  FaUserCircle,
  FaSpinner,
} from "react-icons/fa";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

// Backend API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const PlanTrip = () => {
  const { user, setTripDetails } = useUser();
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  // Date helpers to ensure correct local date formatting
  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const addDays = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return formatDateLocal(d);
  };
  const today = useMemo(() => formatDateLocal(new Date()), []);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(addDays(today, 1));
  const [preferences, setPreferences] = useState(["relaxation"]);
  const [budget, setBudget] = useState(25000);
  const [minBudget, setMinBudget] = useState(5000);
  const [maxBudget, setMaxBudget] = useState(50000);

  // Location dropdown states
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Loading states
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState("");

  // Utility function for API calls
  const fetchFromAPI = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/locations${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "API request failed");
      }

      return data.data;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      setError("");

      try {
        const countriesData = await fetchFromAPI("/countries");
        setCountries(countriesData);
      } catch (error) {
        console.error("Failed to fetch countries:", error.message);
        setError("Failed to load countries. Please refresh the page.");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!country) {
        setStates([]);
        return;
      }

      setLoadingStates(true);

      try {
        const statesData = await fetchFromAPI(`/countries/${country}/states`);
        setStates(statesData);
      } catch (error) {
        console.error("Failed to fetch states:", error.message);
        setError("Failed to load states. Please try again.");
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [country]);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!country || !state) {
        setCities([]);
        return;
      }

      setLoadingCities(true);

      try {
        const citiesData = await fetchFromAPI(
          `/countries/${country}/states/${state}/cities?limit=50&majorOnly=false`
        );
        setCities(citiesData);
      } catch (error) {
        console.error("Failed to fetch cities:", error.message);
        setError("Failed to load cities. Please try again.");
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [country, state]);

  const handlePreferenceChange = (e) => {
    const { value, checked } = e.target;
    setPreferences((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((item) => item !== value);
      }
    });
  };

  const handleSlider = (e) => {
    setBudget(Number(e.target.value));
    setMinBudget(5000);
    setMaxBudget(Number(e.target.value));
  };

  const handleMinBudget = (e) => {
    setMinBudget(Number(e.target.value));
  };
  const handleMaxBudget = (e) => {
    setMaxBudget(Number(e.target.value));
    setBudget(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guard: ensure checkout is after checkin
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError("Checkout date must be after check-in date.");
      return;
    }
    setTripDetails({
      city,
      country,
      state,
      checkin: checkIn,
      checkout: checkOut,
      preference: preferences,
      budget,
      minBudget,
      maxBudget,
    });
    navigate("/results");
  };

  const preferenceOptions = [
    "adventure",
    "culture",
    "nature",
    "food",
    "history",
    "shopping",
    "relaxation",
  ];

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.centerCard}>
          <h2 className={styles.title}>Plan Your Trip</h2>
          <p className={styles.subtitle}>
            Tell us about your trip and let Travique take care of the rest.
          </p>

          {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaMapMarkerAlt className={styles.inputIcon} />
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setState("");
                    setCity("");
                    setError(""); // Clear error when user makes selection
                  }}
                  className={styles.input}
                  required
                  disabled={loadingCountries}
                >
                  <option value="">
                    {loadingCountries
                      ? "Loading countries..."
                      : "Select Country"}
                  </option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {loadingCountries && <FaSpinner className={styles.spinner} />}
              </label>
            </div>

            {country && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <FaMapMarkerAlt className={styles.inputIcon} />
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setCity("");
                      setError("");
                    }}
                    className={styles.input}
                    required
                    disabled={loadingStates}
                  >
                    <option value="">
                      {loadingStates
                        ? "Loading states..."
                        : "Select State/Region"}
                    </option>
                    {states.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {loadingStates && <FaSpinner className={styles.spinner} />}
                </label>
              </div>
            )}

            {state && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <FaMapMarkerAlt className={styles.inputIcon} />
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setError("");
                    }}
                    className={styles.input}
                    required
                    disabled={loadingCities}
                  >
                    <option value="">
                      {loadingCities ? "Loading cities..." : "Select City"}
                    </option>
                    {cities.map((cityObj) => (
                      <option key={cityObj._id} value={cityObj.name}>
                        {cityObj.name}
                        {cityObj.isCapital && " (Capital)"}
                        {cityObj.isMajorCity &&
                          !cityObj.isCapital &&
                          " (Major City)"}
                      </option>
                    ))}
                  </select>
                  {loadingCities && <FaSpinner className={styles.spinner} />}
                </label>
              </div>
            )}
            <div className={styles.datesRow}>
              <label className={styles.dateLabel}>
                Check-in Date
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => {
                    const newIn = e.target.value;
                    setCheckIn(newIn);
                    // Auto adjust checkout if now invalid
                    if (!checkOut || checkOut <= newIn) {
                      setCheckOut(addDays(newIn, 1));
                    }
                    // Clear date-related error
                    if (error) setError("");
                  }}
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.dateLabel}>
                Check-out Date
                <input
                  type="date"
                  value={checkOut}
                  min={addDays(checkIn || today, 1)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val <= checkIn) {
                      // ignore invalid manual selection; auto-correct
                      const corrected = addDays(checkIn, 1);
                      setCheckOut(corrected);
                      setError("Checkout adjusted to be after check-in.");
                      return;
                    }
                    setCheckOut(val);
                    if (error) setError("");
                  }}
                  className={styles.input}
                  required
                />
              </label>
            </div>
            <div className={styles.preferenceSection}>
              <span className={styles.preferenceTitle}>Travel Preferences</span>
              <div className={styles.checkboxGroup}>
                {preferenceOptions.map((option) => (
                  <label key={option} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={preferences.includes(option)}
                      onChange={handlePreferenceChange}
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.budgetSection}>
              <span>Budget Range</span>
              <input
                type="range"
                min={5000}
                max={1000000}
                step={1000}
                value={budget}
                onChange={handleSlider}
                className={styles.slider}
              />
              <div className={styles.budgetLabels}>
                <span>₹5,000</span>
                <span>₹{budget.toLocaleString()}</span>
                <span>₹10,00,000</span>
              </div>
              <div className={styles.budgetInputs}>
                <input
                  type="number"
                  min={5000}
                  max={maxBudget}
                  value={minBudget}
                  onChange={handleMinBudget}
                  className={styles.input}
                  placeholder="Min Budget"
                />
                <input
                  type="number"
                  min={minBudget}
                  max={1000000}
                  value={maxBudget}
                  onChange={handleMaxBudget}
                  className={styles.input}
                  placeholder="Max Budget"
                />
              </div>
            </div>
            <button className={styles.submitBtn} type="submit">
              <FaPlane className={styles.planeIcon} /> Generate Trip Plan
            </button>
          </form>
          <div className={styles.infoText}>
            Your information is secure and will only be used to create your
            personalized trip plan.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PlanTrip;

// To fix API rate limit errors, get your own RapidAPI key from https://rapidapi.com/wirefreethought/api/geodb-cities and set it in a .env file as REACT_APP_RAPIDAPI_KEY=your_key_here
