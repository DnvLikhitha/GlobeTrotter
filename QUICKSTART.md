# GlobeTrotter - Quick Start Guide

Welcome to GlobeTrotter! This guide will help you get started quickly.

## 🚀 Quick Start

### 1. Installation
```bash
npm install
npm run dev
```

### 2. Access the Application
Open your browser to: `http://localhost:5173`

### 3. Login
- Use any email and password to login (e.g., `test@example.com` / `password`)
- Or click "Sign Up" to create a new account

## 📋 What You Can Do

### Creating Your First Trip
1. Click **"Plan New Trip"** on the dashboard
2. Enter trip name, dates, and description
3. Click **"Create Trip & Add Stops"**

### Building Your Itinerary
1. Click **"Add Stop"** to add cities
2. Select city, dates, and add notes
3. Click **"Add Activity"** to browse available activities
4. Add activities to your stops

### Viewing Budget
1. Go to any trip detail page
2. Click **"View Budget"** button
3. See visual breakdowns by category and city

### Sharing Your Trip
1. Open any trip detail
2. Click **"Share"** button
3. Copy the link to share with friends

### Exploring Cities
1. Click **"Explore"** in the navigation
2. Search and filter cities
3. View details and add to trips

## 🎯 Features at a Glance

| Feature | Location | Description |
|---------|----------|-------------|
| Dashboard | `/dashboard` | Overview of all trips and stats |
| My Trips | `/trips` | List all your trips |
| Create Trip | `/trips/new` | Start a new trip |
| Edit Itinerary | `/trips/:id/edit` | Build your trip |
| View Budget | `/trips/:id/budget` | See cost breakdown |
| Explore Cities | `/cities` | Discover destinations |
| Profile | `/profile` | Manage your account |
| Admin | `/admin` | Analytics dashboard |

## 🎨 Sample Data

The app includes:
- **10 Cities**: From Paris to Sydney
- **10+ Activities**: Across various categories
- **Activity Types**: Sightseeing, Food, Culture, Adventure, Entertainment

## 💡 Pro Tips

1. **Add Cover Photos**: Use URLs like `https://source.unsplash.com/800x600/?city,travel`
2. **Track Costs**: Activities automatically calculate trip budget
3. **Filter Trips**: Use "Upcoming" or "Past" tabs in My Trips
4. **Share Publicly**: Use the `/shared/:tripId` URL format
5. **Mobile Friendly**: Access from any device

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Styles Not Loading
```bash
# Rebuild Tailwind
npm run build
npm run dev
```

### Data Not Persisting
- Data is stored in localStorage
- Clear browser cache if you encounter issues
- Each browser has separate storage

## 🔐 Authentication

The app uses **mock authentication** for the hackathon:
- Any email/password combination works
- Data is stored locally per browser
- No actual backend server required

## 📱 Responsive Design

The app is fully responsive:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)

## 🎉 Enjoy Planning Your Adventures!

Happy travels with GlobeTrotter! ✈️🌍
