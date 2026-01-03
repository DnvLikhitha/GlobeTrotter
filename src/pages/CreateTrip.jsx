import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Image, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { generateItinerary, predictBudget } from '../services/aiService';

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    coverPhoto: '',
    travelStyle: 'moderate',
    preferences: []
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const { addTrip } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Trip name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newTrip = addTrip({ ...formData, aiGenerated: aiSuggestions });
    navigate(`/trips/${newTrip.id}/edit`);
  };

  const handleAIGenerate = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      setErrors({ general: 'Please fill in trip name and dates first' });
      return;
    }

    setIsGenerating(true);
    try {
      const suggestions = await generateItinerary(formData);
      const budget = await predictBudget('Europe', 
        Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)),
        formData.travelStyle
      );
      
      setAiSuggestions({ ...suggestions, budgetPrediction: budget });
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create New Trip</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start planning your next adventure by providing some basic information
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trip Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g., European Summer Adventure"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`input-field input-with-icon ${errors.startDate ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`input-field input-with-icon ${errors.endDate ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Describe your trip..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Photo URL (optional)
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="url"
                  name="coverPhoto"
                  value={formData.coverPhoto}
                  onChange={handleChange}
                  className="input-field input-with-icon"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              {formData.coverPhoto && (
                <div className="mt-4">
                  <img
                    src={formData.coverPhoto}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* AI Travel Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Travel Style
              </label>
              <select
                name="travelStyle"
                value={formData.travelStyle}
                onChange={handleChange}
                className="input-field"
              >
                <option value="budget">Budget - Save money, hostel stays</option>
                <option value="moderate">Moderate - Balanced comfort and cost</option>
                <option value="luxury">Luxury - Premium experiences</option>
              </select>
            </div>

            {/* AI Generate Button */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-700">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">✨ AI-Powered Itinerary Generator</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Let our AI create a personalized itinerary with recommended destinations, 
                    activities, and budget estimates based on your preferences!
                  </p>
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate AI Itinerary
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Suggestions Display */}
            {aiSuggestions && (
              <div className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-xl p-6 space-y-4 animate-slide-down">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold">AI-Generated Suggestions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Budget</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${aiSuggestions.budgetPrediction?.total || aiSuggestions.estimatedBudget}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destinations</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {aiSuggestions.stops?.length || 0} Cities
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended Stops:</p>
                  <div className="space-y-2">
                    {aiSuggestions.stops?.slice(0, 3).map((stop, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{stop.city}, {stop.country}</span>
                        <span className="text-gray-500 dark:text-gray-400">• {stop.activities?.length || 0} activities</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">💡 Pro Tips</p>
                  <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                    {aiSuggestions.recommendations?.slice(0, 2).map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Create Trip & Add Stops
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;
