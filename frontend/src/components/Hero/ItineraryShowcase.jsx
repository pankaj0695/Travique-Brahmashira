import React from 'react';
import styles from './ItineraryShowcase.module.css';

const sample = {
  destination: 'Jaipur, Rajasthan, India',
  days: 3,
  budget: '₹18,000 – ₹25,000',
  weather: 'Sunny • 28°C',
  cover:
    'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1600&auto=format&fit=crop',
  highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Chokhi Dhani'],
  hotels: [
    { name: 'Trident Jaipur', rating: 4.5, price: '₹6,800/night',
      img: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Alsisar Haveli', rating: 4.4, price: '₹5,200/night',
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop' }
  ],
  restaurants: [
    { name: 'LMB (Laxmi Mishthan Bhandar)', type: 'Rajasthani Thali',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Spice Court', type: 'Laal Maas',
      img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop' }
  ],
  events: [
    { name: 'Jaipur Literature Festival', date: 'Jan 24–28',
      img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Light & Sound Show – Amber', date: 'Daily 7:30 PM',
      img: 'https://images.unsplash.com/photo-1475724017904-b712052c192a?q=80&w=1200&auto=format&fit=crop' }
  ],
  sightseeing: [
    { name: 'Amber Fort', time: 'Morning',
      img: 'https://images.unsplash.com/photo-1627588423685-673eee1268db?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Hawa Mahal', time: 'Noon',
      img: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Nahargarh Sunset Point', time: 'Evening',
      img: 'https://images.unsplash.com/photo-1603874235517-d588d3ad29fe?q=80&w=1200&auto=format&fit=crop' }
  ],
  plan: [
    {
      day: 1,
      title: 'Heritage & Forts',
      items: ['Amber Fort & Panna Meena Ka Kund', 'City Palace & Jantar Mantar', 'Evening shopping at Bapu Bazaar']
    },
    {
      day: 2,
      title: 'Old City Charms',
      items: ['Hawa Mahal photo stop', 'Albert Hall Museum', 'Chokhi Dhani cultural village dinner']
    },
    {
      day: 3,
      title: 'Hill Views & Local Bites',
      items: ['Nahargarh Fort sunrise', 'Patrika Gate', 'Street food trail – Pyaz Kachori, Ghewar']
    }
  ]
};

export default function ItineraryShowcase() {
  return (
    <section className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Plan like a pro — crafted itineraries at a glance</h2>
        <p className={styles.subtitle}>
          Smart suggestions for hotels, restaurants, events, and sights — tailored for your dates and budget.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.cardPrimary}>
          {sample.cover && (
            <img src={sample.cover} alt="Jaipur cover" className={styles.coverImg} />
          )}
          <div className={styles.meta}>
            <span className={styles.badge}>Destination</span>
            <h3 className={styles.city}>{sample.destination}</h3>
            <div className={styles.quickFacts}>
              <span>{sample.days} days</span>
              <span>•</span>
              <span>{sample.budget}</span>
              <span>•</span>
              <span>{sample.weather}</span>
            </div>
          </div>
          <ul className={styles.highlights}>
            {sample.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Recommended Hotels</h4>
          <ul className={styles.list}>
            {sample.hotels.map((h) => (
              <li key={h.name} className={styles.listItem}>
                <div className={styles.itemLeft}>
                  {h.img && <img className={styles.thumb} src={h.img} alt={h.name} />}
                  <div>
                    <div className={styles.itemName}>{h.name}</div>
                    <div className={styles.itemSub}>⭐ {h.rating} · {h.price}</div>
                  </div>
                </div>
                <button className={styles.btnGhost}>View</button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Great Places to Eat</h4>
          <ul className={styles.list}>
            {sample.restaurants.map((r) => (
              <li key={r.name} className={styles.listItem}>
                <div className={styles.itemLeft}>
                  {r.img && <img className={styles.thumb} src={r.img} alt={r.name} />} 
                  <div>
                    <div className={styles.itemName}>{r.name}</div>
                    <div className={styles.itemSub}>{r.type}</div>
                  </div>
                </div>
                <button className={styles.btnGhost}>Menu</button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Local Events</h4>
          <ul className={styles.list}>
            {sample.events.map((e) => (
              <li key={e.name} className={styles.listItem}>
                <div className={styles.itemLeft}>
                  {e.img && <img className={styles.thumb} src={e.img} alt={e.name} />}
                  <div>
                    <div className={styles.itemName}>{e.name}</div>
                    <div className={styles.itemSub}>{e.date}</div>
                  </div>
                </div>
                <button className={styles.btnGhost}>Details</button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Sightseeing</h4>
          <ul className={styles.list}>
            {sample.sightseeing.map((s) => (
              <li key={s.name} className={styles.listItem}>
                <div className={styles.itemLeft}>
                  {s.img && <img className={styles.thumb} src={s.img} alt={s.name} />}
                  <div>
                    <div className={styles.itemName}>{s.name}</div>
                    <div className={styles.itemSub}>{s.time}</div>
                  </div>
                </div>
                <button className={styles.btnGhost}>Map</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

  {/* Day-wise timeline removed per request */}
    </section>
  );
}
