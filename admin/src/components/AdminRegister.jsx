import React, { useState } from "react";
import { backend_url } from "../util/helper";

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
    image: "", // Added to prevent undefined errors
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1 = register, Step 2 = verify
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload to Cloudinary
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage("Uploading image...");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_upload_preset_here"); // replace with your Cloudinary preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/your_cloud_name_here/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const imgData = await res.json();
      setFormData((prev) => ({ ...prev, image: imgData.secure_url }));
      setMessage("Image uploaded successfully!");
    } catch (err) {
      setMessage("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Submit registration form
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${backend_url}/api/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setMessage(data.message);
  setStep(2); // Move to OTP verification
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${backend_url}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: formData.emailId, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      setMessage("Email verified successfully! You can now log in.");
      // Only after successful OTP verification, close modal and refresh admin list
      setTimeout(() => {
        if (typeof onSuccess === "function") {
          onSuccess(); // Refresh admin list
        }
        if (typeof onClose === "function") {
          onClose(); // Close modal
        }
      }, 1200); // Show success message for 1.2s before closing
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minWidth: 350,
      maxWidth: 420,
      margin: "0 auto",
      padding: "32px 28px 24px 28px",
      position: "relative",
      background: "#E4DFDA",
      borderRadius: 18,
      boxShadow: "0 8px 32px rgba(1,29,77,0.18)",
      fontFamily: "inherit",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      border: "2px solid #011D4D"
    }}>
      <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, fontSize: 28, background: "none", border: "none", cursor: "pointer", color: "#034078" }}>×</button>
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 8, color: "#011D4D", letterSpacing: 1 }}>Admin Registration</h2>
      <div style={{ fontSize: 15, color: "#034078", marginBottom: 18 }}>Create a new admin account for Travique</div>
      {message && <div style={{
        marginBottom: 16,
        color: message.toLowerCase().includes("success") ? "#63372C" : "#ef4444",
        fontWeight: 500,
        background: message.toLowerCase().includes("success") ? "#f7f3ef" : "#fef2f2",
        borderRadius: 6,
        padding: "8px 12px",
        border: message.toLowerCase().includes("success") ? "1px solid #63372C" : "1px solid #ef4444"
      }}>{message}</div>}

      {step === 1 && (
        <form onSubmit={handleRegister} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontWeight: 500, color: "#034078" }}>Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 6, background: "#fff" }} />
          </div>
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 10, fontSize: 16, background: "#fff" }} />
          <input name="emailId" type="email" placeholder="Email" value={formData.emailId} onChange={handleChange} required style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 10, fontSize: 16, background: "#fff" }} />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 10, fontSize: 16, background: "#fff" }} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 10, fontSize: 16, background: "#fff" }} />
          <input name="phoneno" placeholder="Phone Number" value={formData.phoneno} onChange={handleChange} style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 10, fontSize: 16, background: "#fff" }} />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 10, fontSize: 16, background: "#fff" }} />
          <input name="state" placeholder="State" value={formData.state} onChange={handleChange} style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 10, fontSize: 16, background: "#fff" }} />
          <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 10, fontSize: 16, background: "#fff" }} />
          <textarea name="bio" placeholder="Bio (optional)" value={formData.bio} onChange={handleChange} rows={2} style={{ border: "1px solid #1282A2", borderRadius: 6, padding: 10, fontSize: 16, resize: "vertical", background: "#fff" }} />

          <button type="submit" disabled={loading} style={{
            background: loading ? "#034078" : "linear-gradient(90deg,#034078,#1282A2)",
            color: "#E4DFDA",
            fontWeight: 600,
            fontSize: 17,
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            marginTop: 8,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(1,29,77,0.08)"
          }}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      )}

      {step === 2 && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: "#034078", marginBottom: 4 }}>Verify Email</div>
          <div style={{ fontSize: 15, color: "#1282A2", marginBottom: 8 }}>Enter the OTP sent to your email</div>
          <form onSubmit={handleVerifyOtp} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{ border: "2px solid #034078", borderRadius: 8, padding: 12, fontSize: 20, textAlign: "center", letterSpacing: 2, width: "80%", background: "#fff", color: "#011D4D" }}
              maxLength={6}
            />
            <button type="submit" disabled={loading} style={{
              background: loading ? "#1282A2" : "linear-gradient(90deg,#1282A2,#034078)",
              color: "#E4DFDA",
              fontWeight: 600,
              fontSize: 17,
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              marginTop: 4,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(1,29,77,0.08)",
              width: "80%"
            }}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          {message.toLowerCase().includes("success") && (
            <div style={{ color: "#63372C", fontWeight: 600, marginTop: 8, fontSize: 18 }}>
              <span style={{ fontSize: 22, marginRight: 6 }}>✔</span>Verified!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminRegister;
