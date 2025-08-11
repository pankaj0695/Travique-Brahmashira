import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import Footer from "../components/Footer/Footer";
import { useUser } from "../UserContext";
import { backend_url } from "../utils/helper";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    phoneno: "",
    city: "",
    state: "",
    country: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    setError("");
    setImagePreview(URL.createObjectURL(file));
    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", "Travique");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnfkcjujc/image/upload",
        {
          method: "POST",
          body: formDataCloud,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
      } else {
        setError("Image upload failed");
      }
    } catch (err) {
      setError("Image upload error");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      // Ensure image field is present
      if (!signupData.image) {
        setError("Please upload a profile image");
        setLoading(false);
        return;
      }
      const response = await fetch(`${backend_url}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token and user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.centerBox}>
          <div className={styles.icon}>✈️</div>
          <h2 className={styles.title}>Join Travique</h2>
          <p className={styles.subtitle}>
            Create your free account to start planning
          </p>
          {error && (
            <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
          )}
          <form
            className={styles.form}
            onSubmit={handleSignup}
            encType="multipart/form-data"
          >
            <label>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageUploading}
            />
            {imageUploading && (
              <div style={{ color: "#007bff" }}>Uploading image...</div>
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  marginBottom: 8,
                }}
              />
            )}
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="emailId"
              placeholder="Enter your email"
              value={formData.emailId}
              onChange={handleInputChange}
              required
            />
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneno"
              placeholder="Enter your phone number"
              value={formData.phoneno}
              onChange={handleInputChange}
              required
            />
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
            <label>Country</label>
            <input
              type="text"
              name="country"
              placeholder="Enter your country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
            <label>Bio (Optional)</label>
            <textarea
              type="text"
              name="bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button
              className={styles.signupBtn}
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          <div className={styles.bottomText}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
