import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, TrendingUp, Sparkles, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user, getUserTrips, cities } = useApp();
  const [userTrips, setUserTrips] = useState([]);
  const [popularCities, setPopularCities] = useState([]);

  useEffect(() => {
    setUserTrips(getUserTrips());
    setPopularCities(cities.sort((a, b) => b.popularity - a.popularity).slice(0, 6));
  }, []);

  const getUpcomingTrips = () => {
    return userTrips.filter(trip => new Date(trip.startDate) >= new Date())
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 3);
  };

  const getTotalBudget = () => {
    return userTrips.reduce((total, trip) => {
      const tripBudget = trip.stops?.reduce((stopTotal, stop) => {
        const activityCost = stop.activities?.reduce((actTotal, act) => actTotal + (act.cost || 0), 0) || 0;
        return stopTotal + activityCost;
      }, 0) || 0;
      return total + tripBudget;
    }, 0);
  };

  return (
    <Layout>
      {/* Video Background Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/globetrotter.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent dark:from-gray-900/80 dark:via-gray-800/60"></div>
        
        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome back, {user?.name}! ✈️
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
              Ready to plan your next adventure?
            </p>
            
            {/* Search Bar */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-full shadow-2xl p-2 flex items-center gap-3 max-w-lg">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-4" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 text-lg"
              />
              <Link
                to="/trips/new"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-colors whitespace-nowrap"
              >
                Plan Trip
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{userTrips.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Upcoming Trips</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{getUpcomingTrips().length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">${getTotalBudget()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Cities Visited</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {new Set(userTrips.flatMap(t => t.stops?.map(s => s.cityId) || [])).size}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Trips */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upcoming Trips</h2>
              <Link to="/trips/new" className="btn-primary flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Trip</span>
              </Link>
            </div>

            {getUpcomingTrips().length > 0 ? (
              <div className="space-y-4">
                {getUpcomingTrips().map((trip) => (
                  <Link
                    key={trip.id}
                    to={`/trips/${trip.id}`}
                    className="card p-6 block hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {trip.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {trip.description || 'No description'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{trip.stops?.length || 0} stops</span>
                          </div>
                        </div>
                      </div>
                      {trip.coverPhoto && (
                        <img
                          src={trip.coverPhoto}
                          alt={trip.name}
                          className="w-24 h-24 rounded-lg object-cover ml-4"
                        />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
                    <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No upcoming trips
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start planning your next adventure today!
                </p>
                <Link to="/trips/new" className="btn-primary inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Plan Your First Trip
                </Link>
              </div>
            )}

            <div className="mt-6">
              <Link
                to="/trips"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all trips →
              </Link>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Popular Destinations
            </h2>
            <div className="space-y-3">
              {popularCities.map((city) => (
                <div key={city.id} className="card p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{city.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{city.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>{city.popularity}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {'$'.repeat(city.costIndex)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                to="/cities"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Explore more cities →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
