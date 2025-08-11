import React, { useState } from "react";
import styles from "./dashboard.module.css";
import banff from './assets/banff.webp'
import santorini from './assets/santorini.jpeg'
import taj from './assets/taj.jpeg'
import machu from './assets/machu.jpeg'

const bannerImages = [
  {
    url: banff,
    alt: "Banff National Park, Canada",
  },
  {
    url: santorini,
    alt: "Santorini, Greece",
  },
  {
    url: taj,
    alt: "Taj Mahal, India",
  },
  {
    url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
    alt: "Eiffel Tower, Paris",
  },
  {
    url: machu,
    alt: "Machu Picchu, Peru",
  },
];

const regionalSelections = [
  {
    name: "Leh-Ladakh",
    img: "https://akhilbharat.in/wp-content/uploads/2025/05/explore-ladakh.jpg",
  },
  {
    name: "Great Barrier Reef",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kyoto Temples",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Swiss Alps",
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kerala Backwaters",
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/f3/1b/4a/alleppey-backwater-cruise.jpg?w=900&h=500&s=1",
  },
];

const previousTrips = [
  {
    name: "Goa Beach",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "London City",
    img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "New York",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Dashboard() {
  const [bannerIdx, setBannerIdx] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBannerIdx((idx) => (idx + 1) % bannerImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.fullPageDashboard}>
      <header className={styles.header}>
       
      </header>
      <div className={styles.bannerSection}>
        <img
          src={bannerImages[bannerIdx].url}
          alt={bannerImages[bannerIdx].alt}
          className={styles.bannerImage}
        />
        <div className={styles.carouselDots}>
          {bannerImages.map((_, i) => (
            <span
              key={i}
              className={i === bannerIdx ? styles.activeDot : styles.dot}
              onClick={() => setBannerIdx(i)}
            />
          ))}
        </div>
      </div>
      <div className={styles.searchBarRow}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Search bar ......"
        />
        <button className={styles.actionBtn}>Group by</button>
        <button className={styles.actionBtn}>Filter</button>
        <button className={styles.actionBtn}>Sort by...</button>
      </div>
      <section>
        <h3 className={styles.sectionTitle}>Top Regional Selections</h3>
        <div className={styles.regionalGridFull}>
          {regionalSelections.map((place) => (
            <div className={styles.regionBlock} key={place.name}>
              <img src={place.img} alt={place.name} />
              <span>{place.name}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className={styles.sectionTitle}>Previous Trips</h3>
        <div className={styles.previousGridFull}>
          {previousTrips.map((trip) => (
            <div className={styles.prevBlock} key={trip.name}>
              <img src={trip.img} alt={trip.name} />
              <span>{trip.name}</span>
            </div>
          ))}
        </div>
      </section>
      <div className={styles.planTripBtnContainerFull}>
        <button className={styles.planTripBtn}>+ Plan a trip</button>
      </div>
    </div>
  );
}