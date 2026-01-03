// AI Service for intelligent trip planning features

export const generateItinerary = async (tripData) => {
  // In production, this would call OpenAI API
  // For demo purposes, we'll use intelligent mock data
  
  const { name, startDate, endDate, preferences, budget } = tripData;
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  
  // AI-generated itinerary based on trip details
  const destinations = [
    { name: 'Paris', country: 'France', activities: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'] },
    { name: 'Rome', country: 'Italy', activities: ['Colosseum', 'Vatican City', 'Trevi Fountain'] },
    { name: 'Barcelona', country: 'Spain', activities: ['Sagrada Familia', 'Park Güell', 'Las Ramblas'] },
    { name: 'Amsterdam', country: 'Netherlands', activities: ['Canal Tour', 'Anne Frank House', 'Van Gogh Museum'] },
    { name: 'London', country: 'UK', activities: ['Big Ben', 'British Museum', 'Tower Bridge'] }
  ];
  
  const selectedDestinations = destinations.slice(0, Math.min(Math.ceil(duration / 3), 4));
  
  return {
    stops: selectedDestinations.map((dest, index) => ({
      id: Date.now() + index,
      city: dest.name,
      country: dest.country,
      startDate: new Date(new Date(startDate).getTime() + (index * 3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      endDate: new Date(new Date(startDate).getTime() + ((index + 1) * 3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      activities: dest.activities.map((activity, idx) => ({
        id: Date.now() + index * 100 + idx,
        name: activity,
        type: 'sightseeing',
        duration: '2-3 hours',
        cost: Math.floor(Math.random() * 50) + 20
      }))
    })),
    estimatedBudget: Math.floor(duration * 150),
    recommendations: [
      'Book accommodations 2 months in advance for best prices',
      'Consider getting a city pass for attractions',
      'Try local cuisine at neighborhood restaurants'
    ]
  };
};

export const generateActivitySuggestions = async (city, interests) => {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const activityDatabase = {
    'Paris': [
      { name: 'Eiffel Tower Visit', type: 'sightseeing', cost: 25, duration: '2 hours' },
      { name: 'Louvre Museum Tour', type: 'culture', cost: 17, duration: '3 hours' },
      { name: 'Cooking Class', type: 'culinary', cost: 80, duration: '4 hours' },
      { name: 'Seine River Cruise', type: 'leisure', cost: 15, duration: '1 hour' }
    ],
    'default': [
      { name: 'City Walking Tour', type: 'sightseeing', cost: 20, duration: '2 hours' },
      { name: 'Local Food Market', type: 'culinary', cost: 15, duration: '1 hour' },
      { name: 'Museum Visit', type: 'culture', cost: 12, duration: '2 hours' }
    ]
  };
  
  return activityDatabase[city] || activityDatabase['default'];
};

export const predictBudget = async (destination, duration, travelStyle) => {
  // AI-powered budget prediction
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const baseRates = {
    'budget': { daily: 50, accommodation: 30, food: 20 },
    'moderate': { daily: 100, accommodation: 80, food: 40 },
    'luxury': { daily: 250, accommodation: 200, food: 100 }
  };
  
  const style = travelStyle || 'moderate';
  const rates = baseRates[style];
  
  return {
    total: duration * rates.daily,
    breakdown: {
      accommodation: duration * rates.accommodation,
      food: duration * rates.food,
      activities: duration * (rates.daily - rates.accommodation - rates.food),
      transportation: Math.floor(duration * 15)
    },
    savingTips: [
      'Book flights on Tuesday or Wednesday for best prices',
      'Use public transportation instead of taxis',
      'Eat at local restaurants away from tourist areas'
    ]
  };
};

export const getSafetyAlerts = async (destination) => {
  // Real-time safety information
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const safetyData = {
    level: 'safe',
    alerts: [],
    tips: [
      'Keep valuables in hotel safe',
      'Be aware of pickpockets in crowded areas',
      'Have emergency contacts saved'
    ],
    emergencyNumbers: {
      police: '112',
      ambulance: '112',
      embassy: '+1-xxx-xxx-xxxx'
    }
  };
  
  return safetyData;
};

export const calculateCarbonFootprint = (tripData) => {
  // Calculate environmental impact
  const { transportation, distance } = tripData;
  
  const emissionFactors = {
    flight: 0.255, // kg CO2 per km
    train: 0.041,
    car: 0.171,
    bus: 0.089
  };
  
  const emissions = (distance || 1000) * (emissionFactors[transportation] || emissionFactors.flight);
  
  return {
    totalEmissions: Math.round(emissions),
    comparison: 'Equivalent to ' + Math.round(emissions / 411) + ' trees needed for offset',
    suggestions: [
      'Consider train travel for shorter distances',
      'Choose direct flights when possible',
      'Support carbon offset programs'
    ]
  };
};
