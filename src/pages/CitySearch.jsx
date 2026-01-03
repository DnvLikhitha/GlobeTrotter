import { useState } from 'react';
import { Search, MapPin, Sparkles, DollarSign, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';

const CitySearch = () => {
  const { cities } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [sortBy, setSortBy] = useState('popularity'); // popularity, cost, name

  const countries = [...new Set(cities.map(city => city.country))].sort();

  const filteredCities = cities
    .filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          city.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = filterCountry === 'all' || city.country === filterCountry;
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'cost') return a.costIndex - b.costIndex;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Explore Cities
          </h1>
          <p className="text-gray-600 text-lg">
            Discover amazing destinations for your next adventure
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Cities
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by city or country..."
                  className="input-field input-with-icon"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Country
              </label>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="input-field"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            {['popularity', 'cost', 'name'].map(option => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  sortBy === option
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCities.length}</span> cities
          </p>
        </div>

        {/* Cities Grid */}
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCities.map((city) => (
              <div key={city.id} className="card overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="h-48 relative overflow-hidden bg-gray-200">
                  <img 
                    src={city.image} 
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <span>{city.popularity}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{city.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{city.country}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {city.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cost Level</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {'$'.repeat(city.costIndex)}
                      </p>
                    </div>
                    <button className="btn-primary px-4 py-2 text-sm">
                      Add to Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3
                className="
                  text-xl font-bold text-gray-900 mb-1
                  transition-transform duration-300 ease-out
                  group-hover:scale-110
                "
              >
                {city.name}
              </h3>

            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CitySearch;
