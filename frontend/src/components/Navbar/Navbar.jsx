import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useUser } from "../../UserContext";

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();

  const navItems = [
    { to: user ? "/dashboard" : "/", label: "Home" },
    { to: "/plan", label: "Plan Trip" },
    { to: "/posts", label: "Posts" },
    { to: "/about", label: "About us" },
  ];

  const isActive = (path) =>
    location.pathname === path ? styles.activeLink : "";

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Travique</Link>
      </div>
      <ul className={styles.navLinks}>
        {navItems.map((item) => (
          <li key={item.to}>
            <Link to={item.to} className={isActive(item.to)}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.profileRight}>
        {user && (
          <Link to="/profile" className={styles.userInfoLink}>
            <div className={styles.userInfo}>
              <img
                src={
                  user.image && user.image !== "default-profile.png"
                    ? user.image
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || "User"
                      )}&background=007bff&color=fff&size=40`
                }
                alt={user.name || "User"}
                className={styles.userAvatar}
              />
              <span className={styles.userName}>{user.name || "User"}</span>
            </div>
          </Link>
        )}
        {!user && (
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.btnWrapper}>
              <button
                className={`${styles.loginBtn} ${
                  location.pathname === "/login" ? styles.btnActive : ""
                }`}
              >
                Login
              </button>
            </Link>
            <Link to="/signup" className={styles.btnWrapper}>
              <button
                className={`${styles.signupBtn} ${
                  location.pathname === "/signup" ? styles.btnActive : ""
                }`}
              >
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
