# ![Brahmashira Display Image](Brahmashira-display-image.png)

# Travique – AI-Powered Personalized Travel Planning Platform

### Team Brahmashira – Innovating travel planning with cutting-edge technology and intelligent automation.

## Team Members

**Pankaj Gupta** – pankajgupta0695@gmail.com  
**Sahil Tanwani** – 2023.sahil.tanwani@ves.ac.in  
**Priyanka Ochaney** – 2023.priyanka.ochaney@ves.ac.in  
**Harshita Sewani** – 2023.harshita.sewani@ves.ac.in

## Problem Statement

Planning multi-city trips is often complex, requiring coordination between destinations, activities, and budgets. Existing solutions are either too rigid, lack personalization, or don't provide real-time event information. Our platform simplifies this by:

- Providing AI-powered trip generation with personalized recommendations
- Enabling intelligent itinerary building with real-time event integration
- Offering comprehensive budget tracking and cost optimization
- Allowing seamless sharing and collaboration features
- Integrating live events and local insights for enhanced travel experiences

## About the Project

'Travique' is a next-generation AI-powered personalized travel planning platform built during the Odoo Hackathon 2025. Our solution leverages advanced technologies including Google's Gemini 2.5 Flash AI, real-time event data, and intelligent location services to empower travelers to plan, customize, budget, and share multi-city trips effortlessly.

This project transforms the often overwhelming process of trip planning into an intelligent, collaborative, budget-aware, and visually engaging experience powered by cutting-edge AI and real-time data integration.

## Key Features

1. **AI-Powered Trip Generation**

   - Google Gemini 2.5 Flash AI for intelligent trip planning
   - Personalized recommendations based on preferences and budget
   - Dynamic itinerary optimization

2. **User Authentication & Profile Management**

   - Secure signup/login with email & password
   - Profile customization and preferences
   - OTP verification for enhanced security

3. **Intelligent Dashboard & Trip Management**

   - Personalized dashboard with AI-curated suggestions
   - Past trips visualization with interactive calendar
   - Quick trip planning with smart recommendations
   - Budget insights and spending analytics

4. **Advanced Itinerary Builder**

   - AI-generated day-wise itineraries
   - Real-time event integration via PredictHQ API
   - Location-based activity suggestions
   - Drag-and-drop trip customization
   - Interactive 3D globe for destination exploration

5. **Comprehensive Budget Tracking**

   - Real-time cost calculations with local pricing
   - Detailed breakdowns (transport, accommodation, meals, activities)
   - Budget optimization suggestions
   - Visual spending analytics with charts

6. **Real-Time Event Integration**

   - Live event data from PredictHQ API
   - Local festivals, concerts, and cultural events
   - Event-based itinerary recommendations
   - Seasonal activity suggestions

7. **Smart Trip Visualization**

   - Interactive calendar and timeline views
   - 3D globe with Three.js for destination exploration
   - Day-wise itinerary layouts
   - Visual trip progress tracking

8. **Advanced Sharing & Collaboration**

   - Public itinerary sharing with custom links
   - Trip copying and customization
   - PDF export functionality
   - Social media integration

9. **Location Intelligence**

   - Comprehensive location database (countries, states, cities)
   - Real-time weather integration
   - Local cuisine and cultural insights
   - Geographic event mapping

10. **Admin Analytics & Management**
    - User engagement tracking
    - Trip analytics and insights
    - Content management system
    - User and itinerary administration

## Technology Stack

### Frontend Applications

- **Primary Frontend:** React 19.1.0 with Vite
- **Admin Panel:** React 19.1.1 with dedicated admin interface
- **UI Libraries:** React Icons, React Router DOM
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **Rich Text Editor:** React Quill
- **PDF Generation:** jsPDF, html2canvas
- **Build Tool:** Vite with ESLint configuration

### Backend Infrastructure

- **Runtime:** Node.js with Express.js 5.1.0
- **Database:** MongoDB Atlas with Mongoose ODM
- **Caching:** Redis for session management and performance
- **Authentication:** JWT tokens with bcrypt encryption
- **Validation:** Express Validator
- **Email Service:** Nodemailer for notifications
- **Development:** Nodemon for hot reloading

### AI & Machine Learning

- **Primary AI:** Google Cloud Vertex AI
- **AI Model:** Gemini 2.5 Flash for trip generation and recommendations
- **Service Account:** Configured with vertex-ai-key.json

### External APIs & Services

- **Event Data:** PredictHQ API for real-time event information
- **Location Data:** RapidAPI GeoDB Cities for comprehensive location database
- **Food Images:** Spoonacular API for meal and restaurant imagery
- **General Images:** Pixabay API for destination and activity photos
- **Weather Data:** OpenWeather API for climate information
- **Search:** Google Custom Search API for enhanced content discovery

### Development & Deployment

- **Version Control:** Git with GitHub
- **Package Management:** npm
- **Environment:** Environment variables for API keys and configuration
- **Code Quality:** ESLint for code linting and formatting
- **Documentation:** Comprehensive README and inline documentation

### Database Schema

- **User Management:** User authentication and profile data
- **Trip Storage:** PastTrip model for storing generated itineraries
- **Location Data:** Country, State, City models with hierarchical relationships
- **Content Management:** Blog posts and travel content

### Security & Performance

- **Authentication:** JWT-based secure authentication
- **Password Security:** bcrypt hashing
- **CORS:** Configured for cross-origin requests
- **Rate Limiting:** API rate limiting for external service calls
- **Caching:** Redis for improved response times

## Project Architecture

```
Travique-Brahmashira/
├── frontend/                 # Main React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route-based page components
│   │   ├── contexts/       # React Context providers
│   │   └── utils/          # API utilities and helpers
│   └── public/             # Static assets
├── admin/                   # Admin panel React app
│   ├── src/
│   │   ├── components/     # Admin-specific components
│   │   ├── pages/         # Admin dashboard pages
│   │   └── context/       # Admin context management
│   └── public/            # Admin static assets
└── backend/                # Node.js Express server
    ├── controllers/        # Route handlers
    ├── models/            # Database schemas
    ├── routes/            # API route definitions
    ├── middleware/        # Custom middleware
    ├── config/            # Database and Redis config
    └── utils/             # Server utilities
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Required API keys (see Environment Variables section)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Configure your frontend environment variables
npm run dev
```

### Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_KEY=your_jwt_secret_key
PREDICTHQ_API_KEY=your_predicthq_api_key
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CX=your_google_custom_search_engine_id
REDIS_PASS=your_redis_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

#### Frontend (.env)

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_SPOONACULAR_API_KEY=your_spoonacular_api_key
VITE_PIXABAY_API_KEY=your_pixabay_api_key
VITE_RAPID_API_KEY=your_rapidapi_key
```

## Key Features Showcase

### AI-Powered Trip Generation

```javascript
// Example trip generation with Gemini AI
const tripData = await generateTrip({
  city: "Paris",
  checkin: "2025-08-15",
  checkout: "2025-08-20",
  preference: ["culture", "food", "history"],
  budget: 50000,
});
```

### Real-Time Event Integration

```javascript
// Fetch local events for trip dates
const events = await fetchPredictHQEvents("Paris", "2025-08-15", "2025-08-20");
```

## Performance & Scalability

### Current Optimizations

- **Redis Caching:** Improved API response times
- **Database Indexing:** Optimized MongoDB queries
- **CDN Integration:** Fast asset delivery
- **Lazy Loading:** Efficient component loading

### Planned Improvements

- **Microservices Architecture:** Scalable service separation
- **Load Balancing:** High availability infrastructure
- **Database Sharding:** Horizontal scaling capabilities
- **Edge Computing:** Global content distribution

### Data Protection

- **JWT Authentication:** Secure token-based authentication
- **Password Encryption:** bcrypt hashing for user credentials
- **API Rate Limiting:** Protection against abuse
- **CORS Configuration:** Secure cross-origin requests

## Acknowledgements

This project was built as part of the **Odoo Hackathon 2025 – Final Round**, under the "GlobeTrotter – Empowering Personalized Travel Planning" problem statement.

---

**Built with ❤️ by Team Brahmashira** | [GitHub Repository](https://github.com/pankaj0695/Travique-Brahmashira)
