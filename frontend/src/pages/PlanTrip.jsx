import React, { useState, useEffect } from "react";
import styles from "./PlanTrip.module.css";
import { FaMapMarkerAlt, FaPlane, FaUserCircle } from "react-icons/fa";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer/Footer";

const RAPIDAPI_KEY = import.meta.env.VITE_RAPID_API_KEY; // Set this in your .env file

const PlanTrip = () => {
  const { user, setTripDetails } = useUser();
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
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

  // Fetch countries on mount
  useEffect(() => {
    fetch("https://wft-geo-db.p.rapidapi.com/v1/geo/countries", {
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY, // Use your own RapidAPI key
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    })
      .then((res) => res.json())
      .then((data) => setCountries(data.data || []));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!country) return setStates([]);
    fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${country}/regions`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setStates(data.data || []));
  }, [country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!country || !state) return setCities([]);
    fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${country}/regions/${state}/cities?limit=10`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setCities(data.data || []));
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
            Tell us about your trip and let TravelBuddy take care of the rest.
          </p>
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
                  }}
                  className={styles.input}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
                    }}
                    className={styles.input}
                    required
                  >
                    <option value="">Select State/Region</option>
                    {states.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {state && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <FaMapMarkerAlt className={styles.inputIcon} />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={styles.input}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((cityObj) => (
                      <option key={cityObj.id} value={cityObj.name}>
                        {cityObj.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <div className={styles.datesRow}>
              <label className={styles.dateLabel}>
                Check-in Date
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.dateLabel}>
                Check-out Date
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
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
