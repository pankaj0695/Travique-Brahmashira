import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import WhyChoose from './components/WhyChoose/WhyChoose';
import Footer from './components/Footer/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PlanTrip from './pages/PlanTrip';
import TripSuggestions from './pages/TripSuggestions';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Dashboard from './components/Dashboard/dashboard';
import Blog from './pages/Blog';

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
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plan" element={<PlanTrip />} />
        <Route path="/results" element={<TripSuggestions />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;



