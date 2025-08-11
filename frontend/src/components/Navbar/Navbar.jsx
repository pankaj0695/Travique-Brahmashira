import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useUser } from "../../UserContext";

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Travique</Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About us</Link>
        </li>
        <li>
          <Link to="/contact">Contact us</Link>
        </li>
        {user && (
          <li>
            <Link to="/plan" className={styles.exploreLink}>
              Explore
            </Link>
          </li>
        )}
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
          <>
            <Link to="/login">
              <button
                className={
                  styles.loginBtn +
                  (location.pathname === "/login" ? " " + styles.active : "")
                }
              >
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button
                className={
                  styles.signupBtn +
                  (location.pathname === "/signup" ? " " + styles.active : "")
                }
              >
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
