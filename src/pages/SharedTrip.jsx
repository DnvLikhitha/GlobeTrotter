import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Clock, Copy, Share2, Plane } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, differenceInDays } from 'date-fns';

const SharedTrip = () => {
  const { tripId } = useParams();
  const { getTripById, cities } = useApp();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const foundTrip = getTripById(tripId);
    if (foundTrip) {
      setTrip(foundTrip);
    }
  }, [tripId]);

  const getCityById = (cityId) => {
    return cities.find(c => c.id === cityId);
  };

  const getTotalCost = () => {
    if (!trip?.stops) return 0;
    return trip.stops.reduce((total, stop) => {
      const stopCost = stop.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0;
      return total + stopCost;
    }, 0);
  };

  const getTripDuration = () => {
    if (!trip) return 0;
    return differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
  };

  const handleCopyTrip = () => {
    alert('Trip copied to your account! You can now customize it.');
    // In a real app, this would create a copy of the trip for the current user
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out my trip: ${trip.name}`;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip not found</h2>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Explore GlobeTrotter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GlobeTrotter</span>
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handleCopyTrip}
                className="btn-secondary flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy Trip</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="btn-primary flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Header */}
        <div className="card overflow-hidden mb-6">
          {trip.coverPhoto ? (
            <div className="relative h-80">
              <img
                src={trip.coverPhoto}
                alt={trip.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent dark:from-gray-900/80"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="mb-3">
                  <span className="bg-teal-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    Shared Itinerary
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{trip.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trip.stops?.length || 0} stops
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {getTripDuration()} days
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${getTotalCost()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="mb-3">
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                  Shared Itinerary
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{trip.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {trip.stops?.length || 0} stops
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getTripDuration()} days
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${getTotalCost()}
                </span>
              </div>
            </div>
          )}
        </div>

        {trip.description && (
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Trip</h2>
            <p className="text-gray-600">{trip.description}</p>
          </div>
        )}

        {/* Itinerary */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
          
          {trip.stops && trip.stops.length > 0 ? (
            <div className="space-y-8">
              {trip.stops.map((stop, index) => {
                const city = getCityById(stop.cityId);
                const stopCost = stop.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0;

                return (
                  <div key={stop.id} className="relative pl-8 pb-8 border-l-2 border-primary-200 last:border-0">
                    <div className="absolute left-0 top-0 -ml-3 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{city?.name}, {city?.country}</h3>
                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(stop.startDate), 'MMM d')} - {format(new Date(stop.endDate), 'MMM d')}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${stopCost}
                            </span>
                          </div>
                        </div>
                      </div>

                      {stop.notes && (
                        <p className="text-gray-600 mb-4 italic">{stop.notes}</p>
                      )}

                      {stop.activities && stop.activities.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Activities</h4>
                          <div className="space-y-2">
                            {stop.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="bg-white p-4 rounded-lg"
                              >
                                <h5 className="font-medium text-gray-900">{activity.name}</h5>
                                {activity.description && (
                                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                )}
                                <div className="flex gap-3 mt-2">
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                    {activity.type}
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {activity.duration}h
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    ${activity.cost}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No itinerary details available</p>
          )}
        </div>

        {/* CTA */}
        <div className="card p-8 mt-8 text-center bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <h2 className="text-2xl font-bold mb-3">Love this itinerary?</h2>
          <p className="mb-6 text-blue-100">
            Create your own personalized travel plans with GlobeTrotter
          </p>
          <Link
            to="/"
            className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors inline-flex items-center gap-2"
          >
            <Plane className="w-5 h-5" />
            Start Planning Your Trip
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; 2026 GlobeTrotter. Empowering Personalized Travel Planning.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SharedTrip;
