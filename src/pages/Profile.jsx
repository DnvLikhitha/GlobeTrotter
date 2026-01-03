import { useState } from 'react';
import { Camera, Mail, User as UserIcon, Save, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Profile = () => {
  const { user, setUser, logout, getUserTrips } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const trips = getUserTrips();

  const handleSave = () => {
    setUser({ ...user, ...formData });
    setIsEditing(false);
    localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      navigate('/');
    }
  };

  const stats = [
    { label: 'Total Trips', value: trips.length },
    { label: 'Cities Visited', value: new Set(trips.flatMap(t => t.stops?.map(s => s.cityId) || [])).size },
    { label: 'Total Activities', value: trips.reduce((sum, t) => sum + (t.stops?.reduce((s, stop) => s + (stop.activities?.length || 0), 0) || 0), 0) },
    { label: 'Total Spent', value: `$${trips.reduce((sum, t) => sum + (t.stops?.reduce((s, stop) => s + (stop.activities?.reduce((a, act) => a + (act.cost || 0), 0) || 0), 0) || 0), 0)}` },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Profile Settings</h1>

        {/* Profile Card */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-32 h-32 rounded-full border-4 border-gray-200"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="input-field"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          avatar: user?.avatar || '',
                        });
                        setIsEditing(false);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{user?.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                  <button onClick={() => setIsEditing(true)} className="btn-primary">
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Preferences */}
        <div className="card p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select className="input-field">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select className="input-field">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-2 border-red-200 dark:border-red-700">
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
