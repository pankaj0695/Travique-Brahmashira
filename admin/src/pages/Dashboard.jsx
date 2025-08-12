import React, { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { backend_url } from "../util/helper";
import styles from "./Dashboard.module.css";
import AdminRegister from "../components/AdminRegister";

const Dashboard = () => {
  const { admin, logoutAdmin } = useAdmin();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [trips, setTrips] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [listLoading, setListLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
    fetchTrips();
    fetchBlogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${backend_url}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${backend_url}/api/admin/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins(data.admins || []);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
  };

  const fetchTrips = async () => {
    try {
      setListLoading(true);
      const response = await fetch(`${backend_url}/api/trips/all?limit=50`);
      const data = await response.json();
      if (response.ok) setTrips(data.trips || []);
    } catch (err) {
      console.error("Error fetching trips:", err);
    } finally {
      setListLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setListLoading(true);
      const response = await fetch(`${backend_url}/api/blogs`);
      const data = await response.json();
      if (response.ok) setBlogs(Array.isArray(data) ? data : data.blogs || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setListLoading(false);
    }
  };

  // Filter admins based on current admin's role
  const getFilteredAdmins = () => {
    return admins.filter((adminUser) => {
      // If current admin is not a superadmin, hide superadmins from the list
      if (admin?.role !== "superadmin" && adminUser.role === "superadmin") {
        return false;
      }
      return true;
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Travique Admin Dashboard</h1>
          <div className={styles.adminInfo}>
            <span>Welcome, {admin?.name}</span>
            <span className={styles.role}>({admin?.role})</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "users" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users ({users.length})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "admins" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("admins")}
          >
            Admins ({getFilteredAdmins().length})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "trips" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("trips")}
          >
            Trips ({trips.length})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "blogs" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("blogs")}
          >
            Blogs ({blogs.length})
          </button>
        </div>

        {admin?.role === "superadmin" && (
          <div className={styles.actions}>
            <button
              onClick={() => setShowRegisterModal(true)}
              className={styles.registerBtn}
            >
              + Register New Admin
            </button>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.tableContainer}>
          {activeTab === "users" ? (
            <div>
              <h2 className={styles.paletteTitle}>Users</h2>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Country</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className={styles.userImage}
                            />
                          ) : (
                            <div className={styles.noImage}>No Image</div>
                          )}
                        </td>
                        <td>{user.name}</td>
                        <td>{user.emailId}</td>
                        <td>{user.phoneno || "N/A"}</td>
                        <td>{user.city || "N/A"}</td>
                        <td>{user.state || "N/A"}</td>
                        <td>{user.country || "N/A"}</td>
                        <td>
                          <span className={styles.roleBadge}>{user.role}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
      ) : activeTab === "admins" ? (
            <div>
        <h2 className={styles.paletteTitle}>Admins</h2>
              {getFilteredAdmins().length === 0 ? (
                <p>No admins found.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredAdmins().map((adminUser) => (
                      <tr key={adminUser._id}>
                        <td>{adminUser.name}</td>
                        <td>{adminUser.emailId}</td>
                        <td>
                          <span
                            className={`${styles.roleBadge} ${styles.admin}`}
                          >
                            {adminUser.role}
                          </span>
                        </td>
                        <td>
                          {adminUser.createdAt
                            ? new Date(adminUser.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : activeTab === "trips" ? (
            <div>
              <h2 className={styles.paletteTitle}>Trips</h2>
              {listLoading ? (
                <p>Loading trips…</p>
              ) : trips.length === 0 ? (
                <p>No trips found.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Dates</th>
                      <th>Preference</th>
                      <th>Budget</th>
                      <th>Shared</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((t) => (
                      <tr key={t._id}>
                        <td>{t.city || "—"}</td>
                        <td>
                          {(t.checkIn && new Date(t.checkIn).toLocaleDateString()) || "—"} — {(t.checkOut && new Date(t.checkOut).toLocaleDateString()) || "—"}
                        </td>
                        <td>{Array.isArray(t.preference) ? t.preference.join(", ") : t.preference || "—"}</td>
                        <td>{typeof t.budget === 'number' ? `₹${t.budget.toLocaleString()}` : "—"}</td>
                        <td>
                          <span className={`${styles.badge} ${t.shared ? styles.badgeOk : styles.badgeMuted}`}>
                            {t.shared ? "Yes" : "No"}
                          </span>
                        </td>
                        <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div>
              <h2 className={styles.paletteTitle}>Blogs</h2>
              {listLoading ? (
                <p>Loading blogs…</p>
              ) : blogs.length === 0 ? (
                <p>No blogs found.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Created</th>
                      <th>Id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((b) => (
                      <tr key={b._id}>
                        <td>{b.title || "Untitled"}</td>
                        <td>{b.author || "—"}</td>
                        <td>{b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '.85rem' }}>{b._id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {showRegisterModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <AdminRegister
            onClose={() => setShowRegisterModal(false)}
            onSuccess={() => {
              setShowRegisterModal(false);
              fetchAdmins();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
