import { useState, useEffect } from 'react';
import { Users, MapPin, TrendingUp, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const { trips, cities, activities, user } = useApp();
  const [stats, setStats] = useState({});

  useEffect(() => {
    calculateStats();
  }, [trips, cities, activities]);

  const calculateStats = () => {
    // Total users (mock - in real app would come from backend)
    const totalUsers = 1;

    // Trip statistics
    const totalTrips = trips.length;
    const avgStopsPerTrip = trips.length > 0 
      ? Math.round(trips.reduce((sum, trip) => sum + (trip.stops?.length || 0), 0) / trips.length)
      : 0;
    const totalBudget = trips.reduce((sum, trip) => {
      return sum + (trip.stops?.reduce((stopSum, stop) => {
        return stopSum + (stop.activities?.reduce((actSum, act) => actSum + (act.cost || 0), 0) || 0);
      }, 0) || 0);
    }, 0);

    setStats({
      totalUsers,
      totalTrips,
      avgStopsPerTrip,
      totalBudget,
      totalCities: cities.length,
      totalActivities: activities.length,
    });
  };

  const getTopCities = () => {
    const cityCounts = {};
    trips.forEach(trip => {
      trip.stops?.forEach(stop => {
        const city = cities.find(c => c.id === stop.cityId);
        if (city) {
          cityCounts[city.name] = (cityCounts[city.name] || 0) + 1;
        }
      });
    });

    return Object.entries(cityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  };

  const getActivityTypeBreakdown = () => {
    const typeBreakdown = {};
    trips.forEach(trip => {
      trip.stops?.forEach(stop => {
        stop.activities?.forEach(activity => {
          const type = activity.type || 'Other';
          typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
        });
      });
    });

    return Object.entries(typeBreakdown).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getTripTrends = () => {
    // Mock data for trip creation trends
    return [
      { month: 'Jan', trips: 5 },
      { month: 'Feb', trips: 8 },
      { month: 'Mar', trips: 12 },
      { month: 'Apr', trips: 15 },
      { month: 'May', trips: 20 },
      { month: 'Jun', trips: trips.length },
    ];
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Platform analytics and user insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTrips}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Stops/Trip</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgStopsPerTrip}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalBudget}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Cities */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Destinations</h2>
            {getTopCities().length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getTopCities()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Visits" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </div>

          {/* Activity Types */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Activity Types</h2>
            {getActivityTypeBreakdown().length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getActivityTypeBreakdown()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </div>
        </div>

        {/* Trip Creation Trends */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Creation Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getTripTrends()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="trips" stroke="#3b82f6" strokeWidth={2} name="Trips Created" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trips */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Trips</h2>
            <div className="space-y-3">
              {trips.slice(-5).reverse().map(trip => (
                <div key={trip.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{trip.name}</p>
                    <p className="text-sm text-gray-600">{trip.stops?.length || 0} stops</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(trip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {trips.length === 0 && (
                <p className="text-center text-gray-500 py-8">No trips yet</p>
              )}
            </div>
          </div>

          {/* System Info */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Total Cities</span>
                <span className="font-semibold text-gray-900">{stats.totalCities}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Total Activities</span>
                <span className="font-semibold text-gray-900">{stats.totalActivities}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold text-gray-900">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform Status</span>
                <span className="text-green-600 font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
