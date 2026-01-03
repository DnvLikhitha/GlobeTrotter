import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, MessageSquare, Heart, Share2, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';

const Community = () => {
  const { trips, cities, user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState('all'); // all, city, activity
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, rating
  const [filterType, setFilterType] = useState('all'); // all, trips, activities

  // Mock community posts based on trips
  const getCommunityPosts = () => {
    return trips.map((trip, index) => {
      const city = trip.stops?.[0] ? cities.find(c => c.id === trip.stops[0].cityId) : null;
      return {
        id: trip.id,
        userName: user?.name || 'Anonymous User',
        userAvatar: user?.avatar || '',
        tripName: trip.name,
        cityName: city?.name || 'Multiple Cities',
        description: trip.description || 'An amazing travel experience!',
        likes: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 20) + 1,
        shares: Math.floor(Math.random() * 15),
        rating: (Math.random() * 2 + 3).toFixed(1),
        date: new Date(trip.createdAt || Date.now()).toLocaleDateString(),
        tags: ['Adventure', 'Culture', 'Food'].slice(0, Math.floor(Math.random() * 3) + 1)
      };
    });
  };

  const posts = getCommunityPosts();

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.tripName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // recent is default
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Community
          </h1>
          <p className="text-gray-600 text-lg">
            Share your travel experiences and get inspired by others
          </p>
        </div>

        {/* Info Banner */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-600">
          <p className="text-gray-700">
            <strong>Community section</strong> where all the users can share their experience about a certain trip or activity.
            Using the search, group by or filter and sort by option, the user can narrow down the result that they are looking for.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search trips, cities, or experiences..."
                  className="input-field input-with-icon"
                />
              </div>
            </div>

            {/* Group By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group By
              </label>
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="input-field input-with-icon"
                >
                  <option value="all">All Posts</option>
                  <option value="city">By City</option>
                  <option value="activity">By Activity</option>
                </select>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field input-with-icon"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="text-sm text-gray-600">Filter:</span>
            {['all', 'trips', 'activities'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterType === filter
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredPosts.length}</span> community posts
          </p>
        </div>

        {/* Community Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="card p-6 hover:shadow-xl transition-shadow">
                {/* User Header */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                    <p className="text-sm text-gray-500">{post.date}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                    <span className="text-yellow-600 font-semibold text-sm">★</span>
                    <span className="text-sm font-medium text-gray-900">{post.rating}</span>
                  </div>
                </div>

                {/* Trip Info */}
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{post.tripName}</h4>
                  <p className="text-sm text-teal-600 font-medium mb-2 flex items-center gap-1">
                    <span>📍</span> {post.cityName}
                  </p>
                  <p className="text-gray-600 line-clamp-3">{post.description}</p>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.shares}</span>
                  </button>
                  <button className="btn-primary px-4 py-2 text-sm">
                    View Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find community posts
            </p>
          </div>
        )}

        {/* Share Your Experience CTA */}
        {filteredPosts.length > 0 && (
          <div className="card p-8 mt-8 text-center bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
            <h2 className="text-2xl font-bold mb-3">Have a Travel Story to Share?</h2>
            <p className="mb-6 text-teal-50">
              Share your experiences and inspire other travelers in the community
            </p>
            <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
              Share Your Experience
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Community;
