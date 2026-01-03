import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripsList from './pages/TripsList';
import TripDetail from './pages/TripDetail';
import ItineraryBuilder from './pages/ItineraryBuilder';
import CitySearch from './pages/CitySearch';
import TripBudget from './pages/TripBudget';
import Profile from './pages/Profile';
import SharedTrip from './pages/SharedTrip';
import AdminDashboard from './pages/AdminDashboard';
import Community from './pages/Community';
import CalendarView from './pages/CalendarView';
import Activities from './pages/Activities';
import Gamification from './pages/Gamification';

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(error => console.log('SW registration failed:', error));
  });
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/shared/:tripId" element={<SharedTrip />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/gamification" element={
            <ProtectedRoute>
              <Gamification />
            </ProtectedRoute>
          } />
          
          <Route path="/trips" element={
            <ProtectedRoute>
              <TripsList />
            </ProtectedRoute>
          } />
          
          <Route path="/trips/new" element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          } />
          
          <Route path="/trips/:tripId" element={
            <ProtectedRoute>
              <TripDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/trips/:tripId/edit" element={
            <ProtectedRoute>
              <ItineraryBuilder />
            </ProtectedRoute>
          } />
          
          <Route path="/trips/:tripId/budget" element={
            <ProtectedRoute>
              <TripBudget />
            </ProtectedRoute>
          } />
          
          <Route path="/cities" element={
            <ProtectedRoute>
              <CitySearch />
            </ProtectedRoute>
          } />
          
          <Route path="/activities" element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          } />
          
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />
          
          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarView />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
