import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Plus, Trash2, Edit } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';

const TripsList = () => {
  const { getUserTrips, deleteTrip } = useApp();
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    loadTrips();
  }, [filter]);

  const loadTrips = () => {
    let allTrips = getUserTrips();
    const now = new Date();

    if (filter === 'upcoming') {
      allTrips = allTrips.filter(trip => new Date(trip.startDate) >= now);
    } else if (filter === 'past') {
      allTrips = allTrips.filter(trip => new Date(trip.endDate) < now);
    }

    setTrips(allTrips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
  };

  const handleDelete = (tripId, e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
      loadTrips();
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Trips</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all your travel plans in one place</p>
          </div>
          <Link to="/trips/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Trip
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'upcoming', 'past'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Trips Grid */}
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="card overflow-hidden group">
                <Link to={`/trips/${trip.id}`}>
                  {trip.coverPhoto ? (
                    <img
                      src={trip.coverPhoto}
                      alt={trip.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                </Link>

                <div className="p-6">
                  <Link to={`/trips/${trip.id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-primary-600 transition-colors">
                      {trip.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {trip.description || 'No description'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{trip.stops?.length || 0} stops</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Link
                      to={`/trips/${trip.id}/edit`}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={(e) => handleDelete(trip.id, e)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full">
                <MapPin className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No trips found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'upcoming' 
                ? "You don't have any upcoming trips yet."
                : filter === 'past'
                ? "You don't have any past trips yet."
                : "Start planning your first adventure!"}
            </p>
            <Link to="/trips/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Your First Trip
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TripsList;
