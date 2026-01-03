import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, differenceInDays } from 'date-fns';

const TripBudget = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTripById, cities } = useApp();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const foundTrip = getTripById(tripId);
    if (foundTrip) {
      setTrip(foundTrip);
    } else {
      navigate('/trips');
    }
  }, [tripId]);

  const getCityById = (cityId) => {
    return cities.find(c => c.id === cityId);
  };

  const getBudgetByType = () => {
    if (!trip?.stops) return [];
    
    const typeBreakdown = {};
    trip.stops.forEach(stop => {
      stop.activities?.forEach(activity => {
        const type = activity.type || 'Other';
        typeBreakdown[type] = (typeBreakdown[type] || 0) + (activity.cost || 0);
      });
    });

    return Object.entries(typeBreakdown).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getBudgetByCity = () => {
    if (!trip?.stops) return [];
    
    return trip.stops.map(stop => {
      const city = getCityById(stop.cityId);
      const cost = stop.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0;
      return {
        name: city?.name || 'Unknown',
        cost
      };
    });
  };

  const getDailyCosts = () => {
    if (!trip?.stops) return [];
    
    const dailyCosts = {};
    trip.stops.forEach(stop => {
      const startDate = new Date(stop.startDate);
      const endDate = new Date(stop.endDate);
      const days = differenceInDays(endDate, startDate) + 1;
      const stopCost = stop.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0;
      const costPerDay = days > 0 ? stopCost / days : 0;

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = format(date, 'MMM d');
        dailyCosts[dateStr] = (dailyCosts[dateStr] || 0) + costPerDay;
      }
    });

    return Object.entries(dailyCosts).map(([date, cost]) => ({
      date,
      cost: Math.round(cost)
    }));
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

  const getAverageDailyCost = () => {
    const duration = getTripDuration();
    return duration > 0 ? Math.round(getTotalCost() / duration) : 0;
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Budget & Cost Breakdown</h1>
          <p className="text-gray-600">{trip.name}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900">${getTotalCost()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg per Day</p>
                <p className="text-3xl font-bold text-gray-900">${getAverageDailyCost()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Days</p>
                <p className="text-3xl font-bold text-gray-900">{getTripDuration()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <PieChartIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Activities</p>
                <p className="text-3xl font-bold text-gray-900">
                  {trip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Budget by Category */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget by Activity Type</h2>
            {getBudgetByType().length > 0 ? (
              <>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getBudgetByType()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getBudgetByType().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-2">
                  {getBudgetByType().map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">${item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-12">No budget data available</p>
            )}
          </div>

          {/* Budget by City */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget by City</h2>
            {getBudgetByCity().length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getBudgetByCity()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">No city data available</p>
            )}
          </div>
        </div>

        {/* Daily Cost Breakdown */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Daily Cost Estimate</h2>
          {getDailyCosts().length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getDailyCosts()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cost" fill="#8b5cf6" name="Daily Cost ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No daily cost data available</p>
          )}
        </div>

        {/* Detailed Breakdown Table */}
        <div className="card p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Breakdown</h2>
          {trip.stops && trip.stops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">City</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Activity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Duration</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.stops.map(stop => {
                    const city = getCityById(stop.cityId);
                    return stop.activities?.map(activity => (
                      <tr key={activity.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{city?.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{activity.name}</td>
                        <td className="py-3 px-4">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {activity.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 text-right">{activity.duration}h</td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                          ${activity.cost}
                        </td>
                      </tr>
                    ));
                  })}
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan="4" className="py-3 px-4 text-right text-gray-900">Total:</td>
                    <td className="py-3 px-4 text-right text-primary-600 text-lg">
                      ${getTotalCost()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No activities to display</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TripBudget;
