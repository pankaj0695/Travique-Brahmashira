import React from 'react';
import styles from './ItineraryBenefits.module.css';

const ItineraryBenefits = () => {
  const benefits = [
    {
      icon: '🏨',
      title: 'Curated Hotels',
      description: 'Handpicked accommodations that match your budget and preferences, from luxury resorts to cozy boutique hotels.'
    },
    {
      icon: '🍽️',
      title: 'Local Cuisine Guide',
      description: 'Discover authentic local restaurants, street food spots, and must-try dishes recommended by locals and food experts.'
    },
    {
      icon: '📅',
      title: 'Day-wise Itinerary',
      description: 'Perfectly planned daily schedules with optimal routes, timing, and activity recommendations for maximum enjoyment.'
    },
    {
      icon: '💰',
      title: 'Estimated Budget',
      description: 'Transparent cost breakdowns including accommodation, meals, transportation, and activities to help you plan better.'
    },
    {
      icon: '🌤️',
      title: 'Weather Forecast',
      description: 'Real-time weather updates and seasonal recommendations to pack appropriately and plan activities accordingly.'
    },
    {
      icon: '🎭',
      title: 'Local Events',
      description: 'Stay updated with festivals, concerts, exhibitions, and cultural events happening during your visit.'
    },
    {
      icon: '🗺️',
      title: 'Interactive Maps',
      description: 'Detailed maps with marked attractions, restaurants, and points of interest with navigation assistance.'
    },
    {
      icon: '📱',
      title: 'Mobile-Friendly',
      description: 'Access your complete itinerary on any device, offline maps, and real-time updates during your journey.'
    }
  ];

  const plannerSteps = [
    {
      step: '1',
      title: 'Tell Us Your Preferences',
      description: 'Share your destination, travel dates, budget range, and interests to get personalized recommendations.',
      icon: '✍️'
    },
    {
      step: '2',
      title: 'AI Analyzes & Plans',
      description: 'Our advanced AI analyzes thousands of options, reviews, and real-time data to create your perfect itinerary.',
      icon: '🤖'
    },
    {
      step: '3',
      title: 'Get Your Custom Itinerary',
      description: 'Receive a detailed day-by-day plan with hotels, restaurants, activities, and all the information you need.',
      icon: '📋'
    },
    {
      step: '4',
      title: 'Book & Travel',
      description: 'Book directly through our platform or use our recommendations to make reservations and enjoy your trip.',
      icon: '🎯'
    }
  ];

  return (
    <section className={styles.itineraryBenefits}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Your Perfect Trip, Planned in Minutes
            </h1>
            <p className={styles.heroSubtitle}>
              Experience the future of travel planning with Travique's AI-powered itinerary generator. 
              Get personalized recommendations for hotels, meals, activities, and more - all tailored to your preferences and budget.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className={styles.howItWorksSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How Travique Creates Your Perfect Itinerary</h2>
          <div className={styles.stepsGrid}>
            {plannerSteps.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Everything You Need for the Perfect Trip</h2>
          <p className={styles.sectionSubtitle}>
            Travique provides comprehensive travel planning with all the details you need for an unforgettable journey.
          </p>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Itinerary Preview */}
      <div className={styles.previewSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Sample Itinerary Preview</h2>
          <div className={styles.itineraryPreview}>
            <div className={styles.dayCard}>
              <div className={styles.dayHeader}>
                <span className={styles.dayNumber}>Day 1</span>
                <span className={styles.dayTitle}>Arrival & City Exploration</span>
              </div>
              <div className={styles.dayContent}>
                <div className={styles.activityItem}>
                  <span className={styles.time}>09:00 AM</span>
                  <span className={styles.activity}>🏨 Check-in at Hotel Paradise (4.5★)</span>
                </div>
                <div className={styles.activityItem}>
                  <span className={styles.time}>11:00 AM</span>
                  <span className={styles.activity}>🗽 Visit City Center & Main Square</span>
                </div>
                <div className={styles.activityItem}>
                  <span className={styles.time}>01:00 PM</span>
                  <span className={styles.activity}>🍝 Lunch at Authentic Local Bistro</span>
                </div>
                <div className={styles.activityItem}>
                  <span className={styles.time}>03:00 PM</span>
                  <span className={styles.activity}>🎨 Explore Art Museum & Gallery District</span>
                </div>
                <div className={styles.activityItem}>
                  <span className={styles.time}>07:00 PM</span>
                  <span className={styles.activity}>🌅 Sunset dinner at Rooftop Restaurant</span>
                </div>
              </div>
              <div className={styles.dayBudget}>
                <span className={styles.budgetLabel}>Estimated Day Budget:</span>
                <span className={styles.budgetAmount}>$120 - $180</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Plan Your Perfect Trip?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of travelers who trust Travique for their travel planning needs.
            </p>
            <button className={styles.ctaButton} onClick={() => window.location.href = '/plan'}>
              <span className={styles.ctaIcon}>🚀</span>
              Start Planning Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryBenefits;
