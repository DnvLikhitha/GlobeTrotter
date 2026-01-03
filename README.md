# GlobeTrotter - Empowering Personalized Travel Planning

A comprehensive travel planning application built with React, Tailwind CSS, and modern web technologies. GlobeTrotter enables users to create customized multi-city itineraries, manage budgets, discover activities, and share their travel plans with others.

## 🌟 Features

### ✅ All Implemented Features

#### 1. **Login / Signup Screen**
- Email and password authentication
- Form validation with error handling
- Beautiful gradient background with responsive design
- Toggle between login and signup modes
- "Forgot Password" functionality

#### 2. **Dashboard / Home Screen**
- Welcome message with personalized greeting
- Statistics cards showing total trips, upcoming trips, total budget, and cities visited
- Upcoming trips preview with quick actions
- Popular destinations showcase
- Fully responsive layout

#### 3. **Create Trip Screen**
- Trip name, start/end dates, and description inputs
- Cover photo URL upload support
- Date validation (end date must be after start date)
- Real-time photo preview
- Form validation with error messages

#### 4. **My Trips (Trip List) Screen**
- Grid layout of all user trips
- Filter by: All, Upcoming, Past trips
- Trip cards with cover images
- Quick edit and delete actions
- Empty state with call-to-action
- Responsive grid (1, 2, or 3 columns)

#### 5. **Itinerary Builder Screen**
- Add multiple stops to trips
- Select cities from dropdown
- Set dates for each stop
- Add activities from curated list
- Remove stops and activities
- Real-time cost tracking
- Activity categorization by type
- Notes field for each stop

#### 6. **Itinerary View Screen**
- Beautiful timeline layout
- Day-wise breakdown
- Activity cards with details
- Cost and duration summaries
- Switch between timeline and calendar views
- Share and edit actions
- Budget overview cards

#### 7. **City Search**
- Search cities by name or country
- Filter by country
- Sort by: popularity, cost, or name
- City cards with popularity ratings, cost level indicators, and descriptions
- "Add to Trip" action
- Responsive grid layout

#### 8. **Trip Budget & Cost Breakdown Screen**
- Total budget summary
- Average cost per day
- Pie chart for budget by activity type
- Bar charts for budget by city and daily cost estimates
- Detailed breakdown table
- Visual data representations using Recharts

#### 9. **Trip Calendar / Timeline Screen**
- Integrated into Trip Detail view
- Timeline visualization with date ranges for each stop
- Activity scheduling and duration indicators

#### 10. **Shared/Public Itinerary View Screen**
- Public URL for trip sharing
- Read-only view of complete itinerary
- Social sharing buttons
- "Copy Trip" functionality
- Beautiful presentation layout
- Call-to-action for new users

#### 11. **User Profile / Settings Screen**
- Edit profile information (name, email, avatar)
- User statistics dashboard
- Language and currency preferences
- Account deletion option
- Profile picture display

#### 12. **Admin / Analytics Dashboard**
- Platform statistics (total users, trips, average stops, total budget)
- Charts for top destinations, popular activity types, and trip creation trends
- Recent trips list
- System information panel

## 🎨 Design Features

- ✅ **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- ✅ **Modern UI**: Clean, professional design with Tailwind CSS
- ✅ **Smooth Animations**: Hover effects and transitions throughout
- ✅ **Intuitive Navigation**: Clear menu structure with active states
- ✅ **Visual Feedback**: Loading states, success/error messages
- ✅ **Accessible**: Semantic HTML and keyboard navigation support

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **State Management**: React Context API
- **Data Persistence**: LocalStorage

## 📦 Installation

1. **Clone the repository**:
```bash
cd GlobalTrotter
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open your browser** and navigate to:
```
http://localhost:5173
```

## 🚀 Usage

### Getting Started

1. **Sign Up / Login**: Create an account or login with any email/password
2. **Explore Dashboard**: View your trip statistics and popular destinations
3. **Create a Trip**: Click "New Trip" and fill in the details
4. **Build Itinerary**: Add stops and activities to your trip
5. **Manage Budget**: Track costs and view budget breakdowns
6. **Share Your Trip**: Generate a shareable link for your itinerary

### Sample Data

The app comes with pre-populated data:
- **10 Cities**: Paris, Tokyo, New York, Barcelona, Bangkok, London, Rome, Dubai, Bali, Sydney
- **10+ Activities**: Various activities across different cities
- Activity types: Sightseeing, Food, Culture, Adventure, Entertainment

## 📱 Screens Overview

### Public Screens
- Login/Signup
- Shared Trip View

### Protected Screens (Require Authentication)
- Dashboard
- My Trips
- Create/Edit Trip
- Trip Detail
- Itinerary Builder
- City Search
- Budget View
- Profile Settings
- Admin Dashboard

## 🎯 Key Features Breakdown

### Trip Management
- ✅ Create, edit, and delete trips
- ✅ Add multiple stops per trip
- ✅ Assign activities to each stop
- ✅ Set dates and durations
- ✅ Add notes and descriptions

### Budget Tracking
- ✅ Automatic cost calculation
- ✅ Per-day cost breakdown
- ✅ Category-wise expenses
- ✅ Visual charts and graphs
- ✅ Export-ready format

### Discovery
- ✅ Browse cities and activities
- ✅ Search and filter functionality
- ✅ Popularity ratings
- ✅ Cost indicators
- ✅ Detailed descriptions

### Sharing
- ✅ Generate public URLs
- ✅ Beautiful shared view
- ✅ Copy trip functionality
- ✅ Social media integration
- ✅ Read-only mode

### Analytics (Admin)
- ✅ Platform-wide statistics
- ✅ User engagement metrics
- ✅ Popular destinations
- ✅ Trend analysis
- ✅ Visual dashboards

## 🎨 Color Scheme

- **Primary Blue**: #3b82f6 (Blue-600)
- **Primary Dark**: #2563eb (Blue-700)
- **Background**: #f9fafb (Gray-50)
- **Text**: #111827 (Gray-900)
- **Secondary Text**: #6b7280 (Gray-600)
- **Accents**: Purple, Pink, Green, Yellow variations

## 📂 Project Structure

```
GlobalTrotter/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with navigation
│   │   └── ProtectedRoute.jsx  # Route protection component
│   ├── context/
│   │   └── AppContext.jsx      # Global state management
│   ├── pages/
│   │   ├── Login.jsx           # Login/Signup screen
│   │   ├── Dashboard.jsx       # Home dashboard
│   │   ├── CreateTrip.jsx      # Trip creation form
│   │   ├── TripsList.jsx       # All trips list
│   │   ├── TripDetail.jsx      # Trip overview
│   │   ├── ItineraryBuilder.jsx # Build itinerary
│   │   ├── CitySearch.jsx      # Explore cities
│   │   ├── TripBudget.jsx      # Budget analysis
│   │   ├── Profile.jsx         # User profile
│   │   ├── SharedTrip.jsx      # Public trip view
│   │   └── AdminDashboard.jsx  # Analytics dashboard
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles with Tailwind
├── public/                     # Static assets
├── index.html                  # HTML template
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is part of a hackathon submission.

## 👥 Contributors

Built with ❤️ for the GlobeTrotter Hackathon

## 🚀 Future Enhancements

Potential features for future iterations:
- Real backend integration with API
- User authentication with OAuth
- Real-time collaboration
- Map integration
- Weather forecasts
- Hotel and flight booking integration
- Currency conversion
- Multi-language support
- Mobile app version
- AI-powered trip suggestions

## 📞 Support

For questions or issues, please create an issue in the repository.

---

**GlobeTrotter** - Empowering Personalized Travel Planning ✈️🌍
