import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Clock, Share2, Edit3, ArrowLeft, Download, Cloud, CloudRain, CloudSnow, Sun, Wind, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { format, differenceInDays } from 'date-fns';
import { getWeatherForecast, convertCurrency } from '../services/apiIntegrations';
import { calculateCarbonFootprint } from '../services/aiService';

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTripById, cities } = useApp();
  const [trip, setTrip] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // timeline or calendar
  const [weather, setWeather] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [convertedBudget, setConvertedBudget] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    const foundTrip = getTripById(tripId);
    if (foundTrip) {
      setTrip(foundTrip);
      loadWeatherData(foundTrip);
      calculateCarbon(foundTrip);
    } else {
      navigate('/trips');
    }
  }, [tripId]);

  const loadWeatherData = async (tripData) => {
    if (!tripData.stops || tripData.stops.length === 0) return;
    
    setLoadingWeather(true);
    try {
      const firstStop = tripData.stops[0];
      const forecast = await getWeatherForecast(
        firstStop.city, 
        tripData.startDate, 
        tripData.endDate
      );
      setWeather(forecast);
    } catch (error) {
      console.error('Weather fetch failed:', error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const calculateCarbon = (tripData) => {
    const distance = (tripData.stops?.length || 1) * 500; // Mock distance calculation
    const carbon = calculateCarbonFootprint({
      transportation: 'flight',
      distance
    });
    setCarbonData(carbon);
  };

  const handleCurrencyChange = async (newCurrency) => {
    setCurrency(newCurrency);
    if (trip) {
      const total = getTotalCost();
      const converted = await convertCurrency(total, 'USD', newCurrency);
      setConvertedBudget(converted);
    }
  };

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

  const getActivityBreakdown = () => {
    if (!trip?.stops) return [];
    
    const breakdown = {};
    trip.stops.forEach(stop => {
      stop.activities?.forEach(activity => {
        if (!breakdown[activity.type]) {
          breakdown[activity.type] = { count: 0, cost: 0 };
        }
        breakdown[activity.type].count++;
        breakdown[activity.type].cost += activity.cost || 0;
      });
    });
    
    return Object.entries(breakdown).map(([type, data]) => ({
      type,
      ...data
    }));
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/${tripId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  if (!trip) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Trips
        </button>

        {/* Header with Cover Photo */}
        <div className="card overflow-hidden mb-6">
          {trip.coverPhoto ? (
            <div className="relative h-64 md:h-80">
              <img
                src={trip.coverPhoto}
                alt={trip.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{trip.name}</h1>
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
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{trip.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
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
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex flex-wrap gap-3">
            <Link
              to={`/trips/${tripId}/edit`}
              className="btn-primary flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Itinerary
            </Link>
            <button
              onClick={handleShare}
              className="btn-secondary flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <Link
              to={`/trips/${tripId}/budget`}
              className="btn-secondary flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              View Budget
            </Link>
          </div>
        </div>

        {trip.description && (
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">About This Trip</h2>
            <p className="text-gray-600 dark:text-gray-400">{trip.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Trip Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Budget</span>
                <span className="text-xl font-bold text-primary-600">${getTotalCost()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Avg per Day</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  ${getTripDuration() > 0 ? Math.round(getTotalCost() / getTripDuration()) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Activities</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {trip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Types */}
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Activity Breakdown</h3>
            {getActivityBreakdown().length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {getActivityBreakdown().map(({ type, count, cost }) => (
                  <div key={type} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{type}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">${cost} total</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No activities added yet</p>
            )}
          </div>
        </div>

        {/* Itinerary */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Detailed Itinerary</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                By City
              </button>
            </div>
          </div>

          {trip.stops && trip.stops.length > 0 ? (
            <div className="space-y-8">
              {trip.stops.map((stop, index) => {
                const city = getCityById(stop.cityId);
                const stopCost = stop.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0;
                const stopDuration = stop.activities?.reduce((sum, act) => sum + (act.duration || 0), 0) || 0;

                return (
                  <div key={stop.id} className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-600 last:border-0">
                    <div className="absolute left-0 top-0 -ml-3 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{city?.name}, {city?.country}</h3>
                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(stop.startDate), 'MMM d')} - {format(new Date(stop.endDate), 'MMM d')}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${stopCost}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {stopDuration}h total
                            </span>
                          </div>
                        </div>
                      </div>

                      {stop.notes && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4 italic">{stop.notes}</p>
                      )}

                      {stop.activities && stop.activities.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Activities</h4>
                          <div className="space-y-2">
                            {stop.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg flex justify-between items-start"
                              >
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 dark:text-gray-100">{activity.name}</h5>
                                  {activity.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>
                                  )}
                                  <div className="flex gap-3 mt-2">
                                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                                      {activity.type}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {activity.duration}h
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <DollarSign className="w-3 h-3" />
                                      ${activity.cost}
                                    </span>
                                  </div>
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
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No stops added yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Start building your itinerary</p>
              <Link
                to={`/trips/${tripId}/edit`}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Add Stops
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TripDetail;
