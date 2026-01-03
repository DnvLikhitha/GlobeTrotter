import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, DollarSign, Clock, ArrowLeft, Trash2, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTripById, cities, activities, addStopToTrip, updateStop, deleteStop, addActivityToStop, removeActivityFromStop } = useApp();
  
  const [trip, setTrip] = useState(null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(null);
  const [newStop, setNewStop] = useState({
    cityId: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const loadTrip = () => {
    const foundTrip = getTripById(tripId);
    if (foundTrip) {
      setTrip(foundTrip);
    } else {
      navigate('/trips');
    }
  };

  const getCityById = (cityId) => {
    return cities.find(c => c.id === cityId);
  };

  const getCityActivities = (cityId) => {
    return activities.filter(a => a.cityId === cityId);
  };

  const handleAddStop = () => {
    if (!newStop.cityId || !newStop.startDate || !newStop.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const city = getCityById(parseInt(newStop.cityId));
    addStopToTrip(trip.id, {
      ...newStop,
      cityId: parseInt(newStop.cityId),
      cityName: city.name,
    });

    setNewStop({ cityId: '', startDate: '', endDate: '', notes: '' });
    setShowAddStop(false);
    loadTrip();
  };

  const handleDeleteStop = (stopId) => {
    if (window.confirm('Are you sure you want to delete this stop?')) {
      deleteStop(trip.id, stopId);
      loadTrip();
    }
  };

  const handleAddActivity = (stopId, activity) => {
    addActivityToStop(trip.id, stopId, activity);
    loadTrip();
    setShowAddActivity(null);
  };

  const handleRemoveActivity = (stopId, activityId) => {
    removeActivityFromStop(trip.id, stopId, activityId);
    loadTrip();
  };

  const getTotalCost = () => {
    if (!trip?.stops) return 0;
    return trip.stops.reduce((total, stop) => {
      const stopCost = stop.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0;
      return total + stopCost;
    }, 0);
  };

  if (!trip) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/trips/${tripId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Trip
        </button>

        {/* Trip Header */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {trip.stops?.length || 0} stops
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${getTotalCost()} total
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddStop(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Stop
            </button>
          </div>
        </div>

        {/* Add Stop Form */}
        {showAddStop && (
          <div className="card p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Stop</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  value={newStop.cityId}
                  onChange={(e) => setNewStop({ ...newStop, cityId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={newStop.startDate}
                    onChange={(e) => setNewStop({ ...newStop, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={newStop.endDate}
                    onChange={(e) => setNewStop({ ...newStop, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={newStop.notes}
                onChange={(e) => setNewStop({ ...newStop, notes: e.target.value })}
                rows={2}
                className="input-field resize-none"
                placeholder="Any special notes for this stop..."
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAddStop(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddStop} className="btn-primary">
                Add Stop
              </button>
            </div>
          </div>
        )}

        {/* Stops List */}
        {trip.stops && trip.stops.length > 0 ? (
          <div className="space-y-6">
            {trip.stops.map((stop, index) => {
              const city = getCityById(stop.cityId);
              const cityActivities = getCityActivities(stop.cityId);
              const stopCost = stop.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0;

              return (
                <div key={stop.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {city?.name}, {city?.country}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-11">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(stop.startDate).toLocaleDateString()} - {new Date(stop.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${stopCost}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStop(stop.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {stop.notes && (
                    <p className="text-gray-600 ml-11 mb-4">{stop.notes}</p>
                  )}

                  {/* Activities */}
                  <div className="ml-11">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900">Activities</h4>
                      <button
                        onClick={() => setShowAddActivity(stop.id)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Activity
                      </button>
                    </div>

                    {showAddActivity === stop.id && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Available activities in {city?.name}:
                        </p>
                        {cityActivities.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2">
                            {cityActivities.map(activity => (
                              <div
                                key={activity.id}
                                className="bg-white p-3 rounded-lg flex justify-between items-start hover:shadow-md transition-shadow"
                              >
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{activity.name}</h5>
                                  <p className="text-sm text-gray-600">{activity.description}</p>
                                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {activity.duration}h
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="w-3 h-3" />
                                      ${activity.cost}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                      {activity.type}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleAddActivity(stop.id, activity)}
                                  className="ml-3 btn-primary px-3 py-1 text-sm"
                                >
                                  Add
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No activities available for this city.</p>
                        )}
                        <button
                          onClick={() => setShowAddActivity(null)}
                          className="mt-3 text-sm text-gray-600 hover:text-gray-900"
                        >
                          Close
                        </button>
                      </div>
                    )}

                    {stop.activities && stop.activities.length > 0 ? (
                      <div className="space-y-2">
                        {stop.activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{activity.name}</h5>
                              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.duration}h
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  ${activity.cost}
                                </span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                  {activity.type}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveActivity(stop.id, activity.id)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No activities added yet</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stops added yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your itinerary by adding your first stop
            </p>
            <button
              onClick={() => setShowAddStop(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Stop
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {trip.stops && trip.stops.length > 0 && (
          <div className="flex gap-4 mt-8">
            <Link
              to={`/trips/${tripId}`}
              className="btn-primary flex-1 text-center"
            >
              View Complete Itinerary
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ItineraryBuilder;
