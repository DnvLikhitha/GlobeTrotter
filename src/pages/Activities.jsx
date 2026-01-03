import { useState } from 'react';
import { Search, Filter, Clock, DollarSign, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';

const Activities = () => {
  const { activities, cities } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const activityTypes = [...new Set(activities.map(a => a.type))];

  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'all' || activity.cityId === parseInt(selectedCity);
      const matchesType = selectedType === 'all' || activity.type === selectedType;
      return matchesSearch && matchesCity && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'cost') return a.cost - b.cost;
      if (sortBy === 'duration') return a.duration - b.duration;
      return 0;
    });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Activity Search
          </h1>
          <p className="text-gray-600 text-lg">
            Discover activities and experiences for your trip
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Activities
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search activities..."
                  className="input-field input-with-icon"
                />
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sort By:</span>
            <div className="flex gap-2">
              {['name', 'cost', 'duration'].map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === option
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredActivities.length}</span> activities
          </p>
        </div>

        {/* Activities Grid */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => {
              const city = cities.find(c => c.id === activity.cityId);
              return (
                <div key={activity.id} className="card overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Activity Type Badge */}
                  <div className="h-32 bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center relative">
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-teal-700">
                      {activity.type}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.name}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{city?.name}, {city?.country}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{activity.duration}h</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>${activity.cost}</span>
                        </div>
                      </div>
                      <button className="btn-primary px-4 py-2 text-sm">
                        Add to Trip
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Info Section */}
        <div className="card p-6 mt-8 bg-teal-50 border-l-4 border-teal-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Options and Tips
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>• Browse activities by city, type, cost, and duration</p>
            <p>• Each activity shows detailed information including estimated time and cost</p>
            <p>• Add activities directly to your trip itinerary</p>
            <p>• Filter by activity type: Sightseeing, Food, Culture, Adventure, Entertainment</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Activities;
