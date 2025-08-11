import React, { useState } from "react";
import { backend_url } from "../util/helper";
import styles from "./AdminRegister.module.css";

const AdminRegister = ({ onClose, onSuccess }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const { confirmPassword, ...registerData } = formData;

      const response = await fetch(`${backend_url}/api/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Register New Admin</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageUploading}
            />
            {imageUploading && (
              <div style={{ color: "#22d3ee" }}>Uploading image...</div>
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  marginTop: "0.5rem",
                  objectFit: "cover"
                }}
              />
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter admin's full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              name="emailId"
              placeholder="Enter admin's email"
              value={formData.emailId}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneno"
              placeholder="Enter admin's phone number"
              value={formData.phoneno}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter admin's city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter admin's state"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Country</label>
            <input
              type="text"
              name="country"
              placeholder="Enter admin's country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Bio (Optional)</label>
            <textarea
              name="bio"
              placeholder="Tell us about the admin"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm the password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
