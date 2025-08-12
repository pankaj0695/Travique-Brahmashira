import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import WhyChoose from "./components/WhyChoose/WhyChoose";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import PlanTrip from "./pages/PlanTrip/PlanTrip";
import TripSuggestions from "./pages/TripSuggestions/TripSuggestions";
import UpdateTrip from "./pages/Update/UpdateTrip";
import AboutUs from "./pages/AboutUS/AboutUs";
import Dashboard from "./components/Dashboard/dashboard";
import Blog from "./pages/Blog/blog";

function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhyChoose />
      <Footer />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plan" element={<PlanTrip />} />
        <Route path="/results" element={<TripSuggestions />} />
        <Route path="/update-trip/:tripId" element={<UpdateTrip />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<Blog />} />
      </Routes>
    </>
  );
}

export default App;
